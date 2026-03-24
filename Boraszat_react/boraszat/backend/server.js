const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "nagyon_titkos_kulcs_123"; 
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cron = require('node-cron'); 

// BEIMPORTÁLJUK AZ ÚJ EMAIL SZOLGÁLTATÁST!
const emailService = require('./services/emailService');

const app = express();
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
app.use('/images', express.static(path.join(__dirname, 'public/borok'))); 

const uploadDir = path.join(__dirname, 'public/borok');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); 
  }
});

const upload = multer({ storage: storage })
const db = mysql.createPool({
  host: 'szente-pince-gibszjakab900-28a1.c.aivencloud.com',
  port: 14888,
  user: 'avnadmin',
  password: 'AVNS_vZV7YDKwkZ4YM_eXDER', 
  database: 'defaultdb',
  ssl: { rejectUnauthorized: false }
});

db.getConnection((err, connection) => {
    if (err) console.error('Adatbázis csatlakozási hiba (Pool):', err.message);
    else { console.log('Sikeresen csatlakozva a MySQL-hez (Pool)!'); connection.release(); }
});

// ==========================================
// RENDELÉS FELADÁSA
// ==========================================
app.post("/api/rendeles", (req, res) => {
  const { userId, szamlazasi, szallitasi, tetelek, vegosszeg, szallitasiKoltseg, utanvetDija, kuponKod, kedvezmeny, hirlevel } = req.body;

  if (!tetelek || tetelek.length === 0) return res.status(400).json({ msg: "Üres a kosár!" });

  const finalUserId = userId || 1; 

  const sqlRendeles = `
    INSERT INTO rendeles 
    (user_id, szaml_nev, szaml_orszag, szaml_irsz, szaml_varos, szaml_utca, szaml_hazszam,
     szall_nev, szall_orszag, szall_irsz, szall_varos, szall_utca, szall_hazszam, vegosszeg, statusz) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'FELDOLGOZAS')
  `;

  const valuesRendeles = [
    finalUserId, szamlazasi.nev, szamlazasi.orszag || 'Magyarország', szamlazasi.irsz, szamlazasi.varos, szamlazasi.utca, szamlazasi.hazszam,
    szallitasi.nev, szallitasi.orszag || 'Magyarország', szallitasi.irsz, szallitasi.varos, szallitasi.utca, szallitasi.hazszam, vegosszeg
  ];

  db.query(sqlRendeles, valuesRendeles, (err, result) => {
    if (err) return res.status(500).json({ msg: "Adatbázis hiba a rendelés mentésekor." });

    const rendelesId = result.insertId;
    const tetelValues = tetelek.map(item => [rendelesId, item.id, item.amount, item.ar]);
    const sqlTetel = `INSERT INTO rendeles_tetel (rendeles_id, bor_id, mennyiseg, egysegar) VALUES ?`;

    db.query(sqlTetel, [tetelValues], (err, resultItems) => {
      if (err) return res.status(500).json({ msg: "Hiba a tételek mentésekor." });

      tetelek.forEach(item => {
        db.query("UPDATE bor SET keszlet = keszlet - ? WHERE id = ?", [item.amount, item.id]);
      });

      const vasarloEmail = szamlazasi.email;
      
      // Hírlevél feliratkozás mentése & Email
      if (hirlevel && vasarloEmail) {
          db.query(`INSERT IGNORE INTO hirlevel_feliratkozok (nev, email) VALUES (?, ?)`, [szamlazasi.nev, vasarloEmail], (hErr) => {
              if (!hErr) emailService.sendWelcomeEmail(szamlazasi.nev, vasarloEmail);
          });
      }

      // Rendelés visszaigazoló email & PDF küldése
      const orderData = {
          rendelesId, szamlazasi, szallitasi, tetelek, vegosszeg,
          termekekAra: tetelek.reduce((acc, item) => acc + (item.ar * item.amount), 0),
          kedvezmeny, kuponKod, szallitasiKoltseg, utanvetDija,
          afa: Math.round(vegosszeg * 0.212598),
          vasarloEmail
      };
      
      emailService.sendOrderConfirmation(orderData);

      res.json({ msg: "Rendelés sikeresen rögzítve!", orderId: rendelesId });
    });
  });
});

// ==========================================
// IDŐZÍTETT NAPI HÍRLEVÉL (Budapesti idő szerint)
// ==========================================
cron.schedule('* * * * *', () => {
    console.log("⏰ Napi hírlevél generálása indítva...");

    const topWinesSql = `
        SELECT b.nev, b.ar, b.leiras, SUM(rt.mennyiseg) as eladott_db 
        FROM bor b LEFT JOIN rendeles_tetel rt ON b.id = rt.bor_id
        GROUP BY b.id ORDER BY eladott_db DESC LIMIT 3
    `;

    db.query(topWinesSql, (err, wines) => {
        if (err || wines.length === 0) return console.error("Hiba a borok lekérésekor a hírlevélhez.");

        db.query("SELECT nev, email FROM hirlevel_feliratkozok", (errSub, subscribers) => {
            if (errSub || subscribers.length === 0) return console.log("Nincsenek feliratkozók.");
            
            emailService.sendDailyNewsletter(wines, subscribers);
            console.log(`Hírlevél kiküldve ${subscribers.length} feliratkozónak!`);
        });
    });
}, {
    scheduled: true,
    timezone: "Europe/Budapest" // <-- EZ A KULCS! Így a magyar időt figyeli, nem a Docker belső idejét.
});


// Többi API végpont
app.post('/api/register', async (req, res) => {
    const { email, password_hash, nev, telefonszam, orszag, irsz, varos, utca, hazszam } = req.body;
    if (!email || !password_hash || !nev) return res.status(400).json({ error: 'Hiányzó adatok: email, név és jelszó kötelező!' });
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password_hash, salt);
        const sql = `INSERT INTO users (email, password_hash, nev, telefonszam, orszag, irsz, varos, utca, hazszam) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        db.query(sql, [email, hashedPassword, nev, telefonszam, orszag, irsz, varos, utca, hazszam], (err, result) => {
            if (err) return res.status(500).json({ error: "Adatbázis hiba" });
            res.status(201).json({ message: 'Sikeres regisztráció!' });
        });
    } catch (error) { res.status(500).json({ error: 'Belső szerverhiba történt.' }); }
});

app.post('/api/login', (req, res) => {
    const { email, password_hash } = req.body; 
    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
        if (err) return res.status(500).json({ error: 'Adatbázis hiba' });
        if (results.length === 0) return res.status(401).json({ error: 'Hibás adatok!' });
        const user = results[0];
        if (!(await bcrypt.compare(password_hash, user.password_hash))) return res.status(401).json({ error: 'Hibás adatok!' });
        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' }); 
        res.json({ message: 'Sikeres bejelentkezés!', token, user: { id: user.id, nev: user.nev, email: user.email, role: user.role, telefonszam: user.telefonszam, irsz: user.irsz, varos: user.varos, utca: user.utca, hazszam: user.hazszam } });
    });
});

app.get('/api/bor-szinek', (req, res) => { db.query('SELECT id, nev FROM bor_szin', (err, results) => { res.json(results); }); });

app.get('/api/borok', (req, res) => {
  db.query(`SELECT b.id, b.nev, b.evjarat, b.ar, b.leiras, b.keszlet, b.kep, b.bor_szin_id, b.alkoholfok, k.megnevezes AS kiszereles_nev, k.szorzo FROM bor b JOIN kiszereles k ON b.kiszereles_id = k.id WHERE b.keszlet IS NOT NULL`, (err, results) => { res.json(results); });
});

app.get('/api/kiszerelesek', (req, res) => { db.query("SELECT * FROM kiszereles ORDER BY id ASC", (err, results) => { res.json(results); }); });
app.get('/api/users', (req, res) => { db.query("SELECT id, nev, email, role, telefonszam, is_active FROM users", (err, results) => { res.json(results); }); });
app.delete('/api/users/:id', (req, res) => { if(req.params.id == 1) return res.status(403).json({ error: "Fő admint nem lehet törölni" }); db.query("DELETE FROM users WHERE id = ?", [req.params.id], () => res.json({ message: "Felhasználó törölve!" })); });

app.post('/api/borok', upload.single('kep'), (req, res) => {
    const { nev, evjarat, ar, keszlet, leiras, bor_szin_id, kiszereles_id, alkoholfok } = req.body;
    db.query(`INSERT INTO bor (nev, evjarat, ar, keszlet, leiras, bor_szin_id, kiszereles_id, alkoholfok, kep) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
    [nev, evjarat, ar, keszlet || 0, leiras, bor_szin_id || 1, kiszereles_id || 1, alkoholfok || 0, req.file ? `/images/${req.file.filename}` : null], 
    (err, result) => res.json({ message: "Bor sikeresen hozzáadva!", id: result.insertId }));
});

app.put('/api/borok/:id', upload.single('kep'), (req, res) => {
    const { nev, evjarat, ar, keszlet, leiras, bor_szin_id, kiszereles_id, alkoholfok } = req.body;
    let sql = `UPDATE bor SET nev=?, evjarat=?, ar=?, keszlet=?, leiras=?, bor_szin_id=?, kiszereles_id=?, alkoholfok=?`;
    let values = [nev, evjarat, ar, keszlet || 0, leiras, bor_szin_id || 1, kiszereles_id || 1, alkoholfok || 0];
    if (req.file) { sql += `, kep=?`; values.push(`/images/${req.file.filename}`); }
    sql += ` WHERE id=?`; values.push(req.params.id);
    db.query(sql, values, () => res.json({ message: "Bor frissítve!" }));
});

app.delete('/api/borok/:id', (req, res) => { db.query("DELETE FROM bor WHERE id = ?", [req.params.id], () => res.json({ message: "Törölve" })); });
app.get('/api/borok/top', (req, res) => { db.query(`SELECT b.*, SUM(rt.mennyiseg) as eladott_db FROM bor b LEFT JOIN rendeles_tetel rt ON b.id = rt.bor_id GROUP BY b.id ORDER BY eladott_db DESC LIMIT 3`, (err, results) => res.json(results)); });
app.get('/api/admin/szolgaltatasok', (req, res) => { db.query("SELECT * FROM szolgaltatas ORDER BY datum DESC", (err, results) => res.json(results)); });
app.post('/api/szolgaltatasok', (req, res) => { db.query("INSERT INTO szolgaltatas (nev, leiras, ar, kapacitas, datum, idotartam, extra, aktiv) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [req.body.nev, req.body.leiras, req.body.ar, req.body.kapacitas, req.body.datum, req.body.idotartam, req.body.extra, req.body.aktiv !== undefined ? req.body.aktiv : 1], (err, result) => res.json({ id: result.insertId })); });
app.put('/api/szolgaltatasok/:id', (req, res) => { db.query("UPDATE szolgaltatas SET nev=?, leiras=?, ar=?, kapacitas=?, datum=?, idotartam=?, extra=?, aktiv=? WHERE id=?", [req.body.nev, req.body.leiras, req.body.ar, req.body.kapacitas, req.body.datum, req.body.idotartam, req.body.extra, req.body.aktiv, req.params.id], () => res.json({ message: "Frissítve" })); });
app.delete('/api/szolgaltatasok/:id', (req, res) => { db.query("DELETE FROM szolgaltatas WHERE id = ?", [req.params.id], () => res.json({ message: "Törölve" })); });
app.get('/api/borok/new', (req, res) => { db.query(`SELECT * FROM bor ORDER BY created_at DESC LIMIT 3`, (err, results) => res.json(results)); });
app.get('/api/szolgaltatasok', (req, res) => { db.query("SELECT * FROM szolgaltatas WHERE aktiv = 1", (err, results) => res.json(results)); });
app.get('/api/foglaltsag', (req, res) => { db.query(`SELECT szolgaltatas_id, SUM(letszam) as ossz_letszam FROM foglalas WHERE statusz != 'CANCELLED' GROUP BY szolgaltatas_id`, (err, results) => res.json(results)); });
app.post('/api/contact', (req, res) => { db.query("INSERT INTO uzenetek (user_id, nev, email, targy, uzenet) VALUES (?, ?, ?, ?, ?)", [req.body.userId, req.body.nev, req.body.email, req.body.targy, req.body.uzenet], () => res.json({ message: "Üzenetét megkaptuk." })); });
app.get('/api/cegadatok', (req, res) => { db.query("SELECT * FROM ceg_adatok LIMIT 1", (err, results) => res.json(results.length === 0 ? { cim: "-", telefon: "-", email: "-", nyitvatartas: "-" } : results[0])); });
app.get('/api/rendeles/user/:userId', (req, res) => { db.query("SELECT * FROM rendeles WHERE user_id = ? ORDER BY datum DESC", [req.params.userId], (err, results) => res.json(results)); });
app.get('/api/foglalas/user/:userId', (req, res) => { db.query("SELECT f.*, sz.nev as szolgaltatas_nev FROM foglalas f LEFT JOIN szolgaltatas sz ON f.szolgaltatas_id = sz.id WHERE f.user_id = ? ORDER BY f.datum DESC", [req.params.userId], (err, results) => res.json(results)); });
app.get('/api/admin/uzenetek', (req, res) => { db.query("SELECT * FROM uzenetek ORDER BY datum DESC", (err, results) => res.json(results)); });
app.delete('/api/admin/uzenetek/:id', (req, res) => { db.query("DELETE FROM uzenetek WHERE id = ?", [req.params.id], () => res.json({ message: "Törölve" })); });
app.get('/api/admin/rendelesek', (req, res) => { db.query("SELECT * FROM rendeles ORDER BY datum DESC", (err, results) => res.json(results)); });
app.put('/api/admin/rendelesek/:id/statusz', (req, res) => { db.query("UPDATE rendeles SET statusz = ? WHERE id = ?", [req.body.statusz, req.params.id], () => res.json({ message: "Frissítve" })); });
app.get('/api/admin/foglalasok', (req, res) => { db.query(`SELECT f.*, sz.nev as szolgaltatas_nev, u.nev as user_nev, u.email as user_email FROM foglalas f LEFT JOIN szolgaltatas sz ON f.szolgaltatas_id = sz.id LEFT JOIN users u ON f.user_id = u.id ORDER BY f.foglalas_datuma DESC`, (err, results) => res.json(results)); });
app.put('/api/admin/foglalasok/:id/statusz', (req, res) => { db.query("UPDATE foglalas SET statusz = ? WHERE id = ?", [req.body.statusz, req.params.id], () => res.json({ message: "Frissítve" })); })
app.get('/api/borok/:id/ertekelesek', (req, res) => { db.query(`SELECT e.id, e.ertekeles as rating, e.szoveg as text, DATE_FORMAT(e.datum, '%Y-%m-%d %H:%i') as date, u.nev as user FROM ertekelesek e JOIN users u ON e.user_id = u.id WHERE e.bor_id = ? ORDER BY e.datum DESC`, [req.params.id], (err, results) => res.json(results)); });
app.post('/api/ertekelesek', (req, res) => { db.query("INSERT INTO ertekelesek (bor_id, user_id, ertekeles, szoveg) VALUES (?, ?, ?, ?)", [req.body.bor_id, req.body.user_id, req.body.ertekeles || 5, req.body.szoveg], () => res.json({ message: "Sikeres hozzászólás!" })); });
app.post('/api/foglalas', (req, res) => { db.query(`INSERT INTO foglalas (user_id, szolgaltatas_id, letszam, datum, idotartam, osszeg, statusz, megjegyzes, foglalas_datuma) VALUES (?, ?, ?, ?, ?, ?, 'PENDING', ?, NOW())`, [req.body.userId, req.body.szolgaltatasId, req.body.letszam, req.body.datum, req.body.idotartam, req.body.osszeg, req.body.megjegyzes], (err, result) => res.json({ message: "Sikeres foglalás!", foglalasId: result.insertId })); });
app.put('/api/admin/uzenetek/:id', (req, res) => { db.query("UPDATE uzenetek SET nev=?, email=?, targy=?, uzenet=? WHERE id=?", [req.body.nev, req.body.email, req.body.targy, req.body.uzenet, req.params.id], () => res.json({ message: "Frissítve!" })); });

if (process.env.NODE_ENV !== 'test') {
    app.listen(5000, () => console.log('A szerver fut a 5000-es porton! Napi hírlevél cron elindítva.'));
}
module.exports = app;