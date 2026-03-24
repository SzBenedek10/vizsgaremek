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

// EZ A KÉT SOR NAGYON FONTOS A SZÁMLÁHOZ!
const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');

// BEIMPORTÁLJUK AZ ÚJ EMAIL SZOLGÁLTATÁST!
const emailService = require('./services/emailService');

const app = express();
// ... innen folytatódik a kódod ...
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
cron.schedule('0 11 * * *', () => {
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

app.delete('/api/borok/:id', (req, res) => {
    const id = req.params.id;
    db.query("DELETE FROM bor WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).json({ error: "Hiba törléskor" });
        res.json({ message: "Törölve" });
    });
});

app.get('/api/borok/top', (req, res) => {
    const sql = `
        SELECT b.*, SUM(rt.mennyiseg) as eladott_db 
        FROM bor b
        LEFT JOIN rendeles_tetel rt ON b.id = rt.bor_id
        GROUP BY b.id
        ORDER BY eladott_db DESC
        LIMIT 3
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: "Adatbázis hiba" });
        res.json(results);
    });
});

app.get('/api/admin/szolgaltatasok', (req, res) => {
    const sql = "SELECT * FROM szolgaltatas ORDER BY datum DESC"; 
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: "Adatbázis hiba" });
        res.json(results);
    });
});

app.post('/api/szolgaltatasok', (req, res) => {
    const { nev, leiras, ar, kapacitas, datum, idotartam, extra, aktiv } = req.body;
    const sql = "INSERT INTO szolgaltatas (nev, leiras, ar, kapacitas, datum, idotartam, extra, aktiv) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [nev, leiras, ar, kapacitas, datum, idotartam, extra, aktiv !== undefined ? aktiv : 1];
    
    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Hiba:", err);
            return res.status(500).json({ error: "Hiba létrehozáskor" });
        }
        res.json({ message: "Szolgáltatás létrehozva", id: result.insertId });
    });
});

app.put('/api/szolgaltatasok/:id', (req, res) => {
    const id = req.params.id;
    const { nev, leiras, ar, kapacitas, datum, idotartam, extra, aktiv } = req.body;
    const sql = "UPDATE szolgaltatas SET nev=?, leiras=?, ar=?, kapacitas=?, datum=?, idotartam=?, extra=?, aktiv=? WHERE id=?";
    const values = [nev, leiras, ar, kapacitas, datum, idotartam, extra, aktiv, id];

    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json({ error: "Hiba módosításkor" });
        res.json({ message: "Szolgáltatás frissítve" });
    });
});

app.delete('/api/szolgaltatasok/:id', (req, res) => {
    const id = req.params.id;
    db.query("DELETE FROM szolgaltatas WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).json({ error: "Hiba törléskor" });
        res.json({ message: "Törölve" });
    });
});

app.get('/api/borok/new', (req, res) => {
    const sql = `SELECT * FROM bor ORDER BY created_at DESC LIMIT 3`;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: "Adatbázis hiba" });
        res.json(results);
    });
});

app.get('/api/szolgaltatasok', (req, res) => {
  const sql = "SELECT * FROM szolgaltatas WHERE aktiv = 1";
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error("SQL hiba a szolgáltatásoknál:", err.message);
      return res.status(500).json({ error: "Adatbázis hiba" });
    }
    res.json(results);
  });
});

app.get('/api/foglaltsag', (req, res) => {
    const sql = `
        SELECT szolgaltatas_id, SUM(letszam) as ossz_letszam 
        FROM foglalas 
        WHERE statusz != 'CANCELLED'
        GROUP BY szolgaltatas_id
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: "Hiba a foglaltság lekérésekor" });
        res.json(results);
    });
});

app.post('/api/contact', (req, res) => {
    const { userId, nev, email, targy, uzenet } = req.body;

    if (!userId || !targy || !uzenet) {
        return res.status(400).json({ error: "Hiányzó adatok!" });
    }

    const sql = "INSERT INTO uzenetek (user_id, nev, email, targy, uzenet) VALUES (?, ?, ?, ?, ?)";
    
    db.query(sql, [userId, nev, email, targy, uzenet], (err, result) => {
        if (err) {
            console.error("Hiba az üzenet mentésekor:", err);
            return res.status(500).json({ error: "Szerver hiba történt." });
        }
        res.json({ message: "Köszönjük! Üzenetét megkaptuk." });
    });
});

app.get('/api/cegadatok', (req, res) => {
    const sql = "SELECT * FROM ceg_adatok LIMIT 1";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Hiba a cégadatok lekérésekor:", err);
            return res.status(500).json({ error: "Adatbázis hiba" });
        }
        
        if (results.length === 0) {
             return res.json({ 
                 cim: "Nincs megadva", 
                 telefon: "-", 
                 email: "-", 
                 nyitvatartas: "-" 
             });
        }
        res.json(results[0]);
    });
});

app.get('/api/rendeles/user/:userId', (req, res) => {
    const userId = req.params.userId;
    const sql = "SELECT * FROM rendeles WHERE user_id = ? ORDER BY datum DESC";
    
    db.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).json({ error: "Adatbazis hiba a rendeleseknel" });
        res.json(results);
    });
});

app.get('/api/foglalas/user/:userId', (req, res) => {
    const userId = req.params.userId;
    const sql = "SELECT f.*, sz.nev as szolgaltatas_nev FROM foglalas f LEFT JOIN szolgaltatas sz ON f.szolgaltatas_id = sz.id WHERE f.user_id = ? ORDER BY f.datum DESC";
    
    db.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).json({ error: "Adatbazis hiba a foglalasoknal" });
        res.json(results);
    });
});

app.get('/api/admin/uzenetek', (req, res) => {
    const sql = "SELECT * FROM uzenetek ORDER BY datum DESC";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: "Adatbázis hiba az üzenetek lekérésekor" });
        res.json(results);
    });
});

app.delete('/api/admin/uzenetek/:id', (req, res) => {
    const id = req.params.id;
    db.query("DELETE FROM uzenetek WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).json({ error: "Hiba törléskor" });
        res.json({ message: "Üzenet törölve" });
    });
});

app.get('/api/admin/rendelesek', (req, res) => {
    const sql = "SELECT * FROM rendeles ORDER BY datum DESC";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: "Adatbázis hiba" });
        res.json(results);
    });
});

app.put('/api/admin/rendelesek/:id/statusz', (req, res) => {
    const { statusz } = req.body;
    db.query("UPDATE rendeles SET statusz = ? WHERE id = ?", [statusz, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: "Hiba a frissítéskor" });
        res.json({ message: "Sikeres frissítés" });
    });
});

app.get('/api/admin/foglalasok', (req, res) => {
    const sql = `
        SELECT f.*, sz.nev as szolgaltatas_nev, u.nev as user_nev, u.email as user_email 
        FROM foglalas f 
        LEFT JOIN szolgaltatas sz ON f.szolgaltatas_id = sz.id 
        LEFT JOIN users u ON f.user_id = u.id 
        ORDER BY f.foglalas_datuma DESC
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: "Adatbázis hiba" });
        res.json(results);
    });
});

app.put('/api/admin/foglalasok/:id/statusz', (req, res) => {
    const { statusz } = req.body;
    db.query("UPDATE foglalas SET statusz = ? WHERE id = ?", [statusz, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: "Hiba a frissítéskor" });
        res.json({ message: "Sikeres frissítés" });
    });
})

app.get('/api/borok/:id/ertekelesek', (req, res) => {
    const borId = req.params.id;
    const sql = `
        SELECT e.id, e.ertekeles as rating, e.szoveg as text, 
               DATE_FORMAT(e.datum, '%Y-%m-%d %H:%i') as date, 
               u.nev as user
        FROM ertekelesek e
        JOIN users u ON e.user_id = u.id
        WHERE e.bor_id = ?
        ORDER BY e.datum DESC
    `;
    
    db.query(sql, [borId], (err, results) => {
        if (err) return res.status(500).json({ error: "Hiba az értékelések lekérésekor" });
        res.json(results);
    });
});

app.post('/api/ertekelesek', (req, res) => {
    const { bor_id, user_id, ertekeles, szoveg } = req.body;

    if (!user_id) return res.status(401).json({ error: "Be kell jelentkezned a hozzászóláshoz!" });
    if (!szoveg) return res.status(400).json({ error: "A hozzászólás nem lehet üres!" });

    const sql = "INSERT INTO ertekelesek (bor_id, user_id, ertekeles, szoveg) VALUES (?, ?, ?, ?)";
    
    db.query(sql, [bor_id, user_id, ertekeles || 5, szoveg], (err, result) => {
        if (err) return res.status(500).json({ error: "Adatbázis hiba a mentéskor" });
        res.json({ message: "Sikeres hozzászólás!" });
    });
});

app.post('/api/foglalas', (req, res) => {
    const { userId, szolgaltatasId, letszam, datum, idotartam, osszeg, megjegyzes } = req.body;

    if (!userId || !szolgaltatasId || !datum || !letszam) {
        return res.status(400).json({ error: "Hiányzó adatok! Kérjük töltsön ki minden mezőt." });
    }

    const sql = `
        INSERT INTO foglalas 
        (user_id, szolgaltatas_id, letszam, datum, idotartam, osszeg, statusz, megjegyzes, foglalas_datuma) 
        VALUES (?, ?, ?, ?, ?, ?, 'PENDING', ?, NOW())
    `;

    const values = [userId, szolgaltatasId, letszam, datum, idotartam, osszeg, megjegyzes];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Hiba a foglalás mentésekor:", err);
            return res.status(500).json({ error: "Adatbázis hiba történt a mentés során." });
        }
        res.json({ message: "Sikeres foglalás!", foglalasId: result.insertId });
    });
});

app.put('/api/admin/uzenetek/:id', (req, res) => {
    const id = req.params.id;
    const { nev, email, targy, uzenet } = req.body;
    
    const sql = "UPDATE uzenetek SET nev=?, email=?, targy=?, uzenet=? WHERE id=?";
    db.query(sql, [nev, email, targy, uzenet, id], (err, result) => {
        if (err) return res.status(500).json({ error: "Hiba módosításkor" });
        res.json({ message: "Üzenet sikeresen frissítve!" });
    });
});
// --- FOGLALÁS SZÁMLA LETÖLTÉSE (ELEGÁNS PDF DESIGN QR KÓDDAL) ---
app.get('/api/foglalas/:id/szamla', (req, res) => {
    const foglalasId = req.params.id;

    const sql = `
        SELECT f.*, sz.nev as szolgaltatas_nev, u.nev as user_nev, u.email as user_email, u.irsz, u.varos, u.utca, u.hazszam 
        FROM foglalas f 
        JOIN szolgaltatas sz ON f.szolgaltatas_id = sz.id 
        JOIN users u ON f.user_id = u.id 
        WHERE f.id = ?
    `;

    db.query(sql, [foglalasId], async (err, results) => {
        if (err) return res.status(500).json({ error: "Adatbázis hiba" });
        if (results.length === 0) return res.status(404).json({ error: "A foglalás nem található" });

        const booking = results[0];

        if (booking.statusz !== 'CONFIRMED') {
            return res.status(403).json({ error: "A számla még nem tölthető le ehhez a foglaláshoz." });
        }

        const doc = new PDFDocument({ margin: 50, size: 'A4' });

        res.setHeader('Content-disposition', `attachment; filename=Szente_Pinceszet_Foglalas_${foglalasId}.pdf`);
        res.setHeader('Content-type', 'application/pdf');
        doc.pipe(res);

        const safeText = (text) => {
            if(!text) return '';
            return text.toString().replace(/ő/g, 'ö').replace(/ű/g, 'ü').replace(/Ő/g, 'Ö').replace(/Ű/g, 'Ü');
        };

        // =========================================================
        // 1. FEJLÉC
        // =========================================================
        doc.fontSize(24).fillColor('#722f37').font('Helvetica-Bold').text('VISSZAIGAZOLÁS', 50, 50);
        
        doc.fontSize(10).fillColor('#888888').font('Helvetica');
        doc.text('Borkóstoló / Program foglalás', 50, 78);
        
        doc.fontSize(10).fillColor('#555555').font('Helvetica-Bold');
        doc.text(`Azonosító: #FOGL-${foglalasId}`, 50, 95);
        doc.font('Helvetica').text(`Kiállítás dátuma: ${new Date().toLocaleDateString('hu-HU')}`, 50, 110);

        // Szente Pincészet adatok (Jobb oldal)
        doc.fontSize(14).fillColor('#333333').font('Helvetica-Bold').text('Szente Pincészet', 300, 50, { width: 245, align: 'right' });
        doc.fontSize(10).fillColor('#666666').font('Helvetica');
        doc.text('8318 Lesencetomaj, Római út 12.', 300, 70, { width: 245, align: 'right' });
        doc.text('info@szentepinceszet.hu', 300, 85, { width: 245, align: 'right' });
        doc.text('+36 30 123 4567', 300, 100, { width: 245, align: 'right' });

        // Vastagabb, elegáns díszítő vonal
        doc.moveTo(50, 135).lineTo(550, 135).lineWidth(2).strokeColor('#722f37').stroke();

        // =========================================================
        // 2. VÁSÁRLÓ ADATAI (Finom, színezett dobozban)
        // =========================================================
        doc.rect(50, 155, 500, 75).fillAndStroke('#fcf9f9', '#eedddf');
        
        doc.fontSize(12).fillColor('#722f37').font('Helvetica-Bold').text('Vásárló adatai:', 65, 165);
        doc.fontSize(10).fillColor('#333333').font('Helvetica-Bold');
        doc.text(safeText(booking.user_nev), 65, 185);
        
        doc.font('Helvetica').fillColor('#555555');
        if (booking.irsz && booking.varos) {
            doc.text(`${safeText(booking.irsz)} ${safeText(booking.varos)}, ${safeText(booking.utca)} ${safeText(booking.hazszam)}`, 65, 200);
        } else {
            doc.text(`Email: ${safeText(booking.user_email)}`, 65, 200);
        }

        // =========================================================
        // 3. TÁBLÁZAT FEJLÉC (Teli bordó háttér, fehér betűk)
        // =========================================================
        doc.rect(50, 260, 500, 25).fill('#722f37');
        
        doc.fontSize(10).fillColor('#ffffff').font('Helvetica-Bold');
        doc.text('Szolgáltatás', 60, 268);
        doc.text('Dátum', 220, 268);
        doc.text('Időpont', 320, 268);
        doc.text('Létszám', 400, 268, { width: 40, align: 'right' });
        doc.text('Összesen', 460, 268, { width: 80, align: 'right' });

        // =========================================================
        // 4. TÁBLÁZAT ADATSOR
        // =========================================================
        const y = 295;
        doc.font('Helvetica').fillColor('#333333');
        
        const d = new Date(booking.datum || booking.idopont);
        const dateStr = d.toLocaleDateString('hu-HU', { year: 'numeric', month: '2-digit', day: '2-digit' }) + '.';
        
        let timeStr = booking.idotartam ? booking.idotartam.toString() : "14:00";
        if (timeStr.length >= 5) {
            timeStr = timeStr.substring(0, 5);
        }

        doc.text(safeText(booking.szolgaltatas_nev), 60, y, { width: 150 });
        doc.text(dateStr, 220, y);
        doc.text(timeStr, 320, y);
        doc.text(`${booking.letszam} fő`, 400, y, { width: 40, align: 'right' });
        doc.font('Helvetica-Bold').text(`${new Intl.NumberFormat("hu-HU").format(booking.osszeg)} Ft`, 460, y, { width: 80, align: 'right' });

        doc.moveTo(50, y + 25).lineTo(550, y + 25).lineWidth(1).strokeColor('#e0e0e0').stroke();

        // =========================================================
        // 5. VÉGÖSSZEG (Kiemelt, halvány dobozban)
        // =========================================================
        doc.rect(330, y + 45, 220, 35).fill('#f9f5f5');
        doc.fontSize(12).fillColor('#555555').font('Helvetica-Bold');
        doc.text('Fizetendő:', 345, y + 57, { width: 80, align: 'left' });
        doc.fontSize(16).fillColor('#722f37').font('Helvetica-Bold');
        doc.text(`${new Intl.NumberFormat("hu-HU").format(booking.osszeg)} Ft`, 410, y + 55, { width: 125, align: 'right' });

        // =========================================================
        // 6. QR KÓD 
        // =========================================================
        try {
            const qrUrl = "http://localhost:3000/admin"; 
            const qrCodeBuffer = await QRCode.toBuffer(qrUrl, {
                color: {
                    dark: '#722f37', 
                    light: '#ffffff'
                },
                width: 80, // Kicsit nagyobb lett, hogy jobban olvasható legyen
                margin: 0
            });

            doc.image(qrCodeBuffer, 50, y + 45);
            
            doc.fontSize(8).fillColor('#888888').font('Helvetica-Bold');
            doc.text('Adminisztrátori', 140, y + 65);
            doc.text('ellenőrzéshez', 140, y + 75);
            doc.font('Helvetica').text('olvassa be a kódot!', 140, y + 85);
        } catch (err) {
            console.error("Hiba a QR kód generálásakor:", err);
        }

        // =========================================================
        // 7. LÁBLÉC
        // =========================================================
        doc.moveTo(50, 750).lineTo(550, 750).lineWidth(1).strokeColor('#e0e0e0').stroke();
        doc.fontSize(10).fillColor('#999999').font('Helvetica');
        doc.text('Köszönjük a foglalást! Várjuk szeretettel a Szente Pincészetben.', 50, 765, { align: 'center' });
        doc.fillColor('#722f37').text('www.szentepinceszet.hu', 50, 780, { align: 'center' });

        doc.end();
    });
});

if (process.env.NODE_ENV !== 'test') {
    app.listen(5000, () => console.log('A szerver fut a 5000-es porton! Napi hírlevél cron elindítva.'));
}
module.exports = app;