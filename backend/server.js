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

// Új, különálló e-mail és PDF szolgáltatás beimportálása
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

const upload = multer({ storage: storage });

const db = mysql.createConnection({
    host: "szente-pince-gibszjakab900-28a1.c.aivencloud.com",
    port: 14888,
    user: "root",
    password: "", 
    database: "boraszat",
    ssl: {
        rejectUnauthorized: false
    }
});

db.connect(err => {
    if (err) {
        console.error('Hiba az adatbázis csatlakozásakor:', err);
        return;
    }
    console.log('Sikeresen csatlakozva a felhős MySQL (Aiven) adatbázishoz!');
});

const promisePool = db.promise();

// ==========================================
// KÖZÖS MIDDLEWARE-EK
// ==========================================

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: "Nincs megadva token" });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: "Érvénytelen vagy lejárt token" });
        req.user = user; 
        next();
    });
};

const isAdmin = (req, res, next) => {
    if (req.user.jogosultsag !== 'admin') {
        return res.status(403).json({ error: "Nincs admin jogosultságod ehhez a művelethez" });
    }
    next();
};

// ==========================================
// REGISZTRÁCIÓ ÉS BEJELENTKEZÉS
// ==========================================

app.post('/api/register', async (req, res) => {
    const { nev, email, jelszo } = req.body;
    try {
        const [existing] = await promisePool.query('SELECT email FROM felhasznalok WHERE email = ?', [email]);
        if (existing.length > 0) return res.status(400).json({ error: 'Ez az email cím már regisztrálva van!' });

        const hashedPassword = await bcrypt.hash(jelszo, 10);
        await promisePool.query('INSERT INTO felhasznalok (nev, email, jelszo) VALUES (?, ?, ?)', [nev, email, hashedPassword]);
        res.status(201).json({ message: 'Sikeres regisztráció!' });
    } catch (err) {
        res.status(500).json({ error: 'Hiba a regisztráció során', details: err });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, jelszo } = req.body;
    try {
        const [users] = await promisePool.query('SELECT * FROM felhasznalok WHERE email = ?', [email]);
        if (users.length === 0) return res.status(401).json({ error: 'Hibás email vagy jelszó!' });

        const user = users[0];
        const match = await bcrypt.compare(jelszo, user.jelszo);
        if (!match) return res.status(401).json({ error: 'Hibás email vagy jelszó!' });

        const token = jwt.sign(
            { id: user.id, email: user.email, jogosultsag: user.jogosultsag },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({ message: 'Sikeres bejelentkezés!', token, user: { id: user.id, nev: user.nev, email: user.email, jogosultsag: user.jogosultsag } });
    } catch (err) {
        res.status(500).json({ error: 'Szerverhiba', details: err });
    }
});

app.get('/api/verify', authenticateToken, async (req, res) => {
    try {
        const [users] = await promisePool.query('SELECT id, nev, email, jogosultsag FROM felhasznalok WHERE id = ?', [req.user.id]);
        if (users.length === 0) return res.status(404).json({ error: "Felhasználó nem található" });
        res.json({ user: users[0] });
    } catch (error) {
        res.status(500).json({ error: "Szerverhiba" });
    }
});

// ==========================================
// FELHASZNÁLÓI PROFIL KEZELÉSE
// ==========================================

app.get('/api/profil', authenticateToken, async (req, res) => {
    try {
        const [rows] = await promisePool.query(
            'SELECT nev, email, telefonszam, irsz, varos, utca, hazszam FROM felhasznalok WHERE id = ?',
            [req.user.id]
        );
        if (rows.length === 0) return res.status(404).json({ error: "Nem található" });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Szerverhiba" });
    }
});

app.put('/api/profil', authenticateToken, async (req, res) => {
    const { nev, telefonszam, irsz, varos, utca, hazszam, regiJelszo, ujJelszo } = req.body;
    try {
        if (regiJelszo && ujJelszo) {
            const [users] = await promisePool.query('SELECT jelszo FROM felhasznalok WHERE id = ?', [req.user.id]);
            const match = await bcrypt.compare(regiJelszo, users[0].jelszo);
            if (!match) return res.status(400).json({ error: "A régi jelszó hibás!" });
            
            const hashedNew = await bcrypt.hash(ujJelszo, 10);
            await promisePool.query('UPDATE felhasznalok SET jelszo = ? WHERE id = ?', [hashedNew, req.user.id]);
        }

        await promisePool.query(
            'UPDATE felhasznalok SET nev=?, telefonszam=?, irsz=?, varos=?, utca=?, hazszam=? WHERE id=?',
            [nev, telefonszam, irsz, varos, utca, hazszam, req.user.id]
        );
        res.json({ message: "Profil sikeresen frissítve!" });
    } catch (error) {
        res.status(500).json({ error: "Hiba történt" });
    }
});

app.get('/api/profil/rendelesek', authenticateToken, async (req, res) => {
    try {
        const [rendelesek] = await promisePool.query(
            `SELECT id, datum, vegosszeg, allapot 
             FROM rendelesek WHERE felhasznalo_id = ? ORDER BY datum DESC`,
            [req.user.id]
        );

        for (let r of rendelesek) {
            const [tetelek] = await promisePool.query(
                `SELECT rt.mennyiseg, rt.egysegar, b.nev AS bor_nev, bk.kiszereles_nev 
                 FROM rendeles_tetelek rt
                 JOIN borok b ON rt.bor_id = b.id
                 JOIN bor_kiszerelesek bk ON rt.kiszereles_id = bk.id
                 WHERE rt.rendeles_id = ?`,
                [r.id]
            );
            r.tetelek = tetelek;
        }

        res.json(rendelesek);
    } catch (error) {
        res.status(500).json({ error: "Szerverhiba" });
    }
});

app.get('/api/profil/foglalasok', authenticateToken, async (req, res) => {
    try {
        const [foglalasok] = await promisePool.query(
            `SELECT f.id, f.datum, f.idotartam, f.letszam, f.osszeg, f.allapot, 
                    sz.nev AS szolgaltatas_nev, sz.kep_url
             FROM foglalasok f
             JOIN szolgaltatasok sz ON f.szolgaltatas_id = sz.id
             WHERE f.felhasznalo_id = ?
             ORDER BY f.datum DESC, f.idotartam DESC`,
            [req.user.id]
        );
        res.json(foglalasok);
    } catch (error) {
        res.status(500).json({ error: "Szerverhiba" });
    }
});

// ==========================================
// BOROK ÉS KISZERELÉSEK LEKÉRDEZÉSE
// ==========================================

app.get('/api/borok', async (req, res) => {
    try {
        const [borok] = await promisePool.query('SELECT * FROM borok');
        
        for (let bor of borok) {
            const [kiszerelesek] = await promisePool.query(
                'SELECT * FROM bor_kiszerelesek WHERE bor_id = ?', 
                [bor.id]
            );
            bor.kiszerelesek = kiszerelesek;
        }

        res.json(borok);
    } catch (error) {
        res.status(500).json({ error: 'Hiba a borok lekérdezésekor' });
    }
});

app.get('/api/borok/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [borok] = await promisePool.query('SELECT * FROM borok WHERE id = ?', [id]);
        if (borok.length === 0) return res.status(404).json({ error: 'Bor nem található' });

        const bor = borok[0];
        const [kiszerelesek] = await promisePool.query('SELECT * FROM bor_kiszerelesek WHERE bor_id = ?', [id]);
        bor.kiszerelesek = kiszerelesek;

        const [ertekelesek] = await promisePool.query(
            `SELECT e.ertekeles, e.velemeny, e.datum, f.nev AS felhasznalo_nev 
             FROM ertekelesek e 
             JOIN felhasznalok f ON e.felhasznalo_id = f.id 
             WHERE e.bor_id = ? ORDER BY e.datum DESC`, 
            [id]
        );
        bor.ertekelesek = ertekelesek;

        res.json(bor);
    } catch (error) {
        res.status(500).json({ error: 'Hiba történt' });
    }
});

// ==========================================
// KOSÁR KEZELÉSE (ADATBÁZISBAN)
// ==========================================

app.get('/api/kosar', authenticateToken, async (req, res) => {
    try {
        const [rows] = await promisePool.query(
            `SELECT k.id AS kosar_tetel_id, k.mennyiseg, 
                    b.id AS bor_id, b.nev AS bor_nev, b.kep_url, 
                    bk.id AS kiszereles_id, bk.kiszereles_nev, bk.ar
             FROM kosar k
             JOIN borok b ON k.bor_id = b.id
             JOIN bor_kiszerelesek bk ON k.kiszereles_id = bk.id
             WHERE k.felhasznalo_id = ?`,
            [req.user.id]
        );
        
        const cartItems = rows.map(r => ({
            id: r.bor_id,
            kiszereles_id: r.kiszereles_id,
            nev: r.bor_nev,
            kep_url: r.kep_url,
            kiszereles_nev: r.kiszereles_nev,
            ar: r.ar,
            amount: r.mennyiseg
        }));

        res.json(cartItems);
    } catch (error) {
        res.status(500).json({ error: 'Hiba a kosár betöltésekor' });
    }
});

app.post('/api/kosar', authenticateToken, async (req, res) => {
    const { bor_id, kiszereles_id, mennyiseg } = req.body;
    try {
        const [letezo] = await promisePool.query(
            'SELECT id, mennyiseg FROM kosar WHERE felhasznalo_id = ? AND bor_id = ? AND kiszereles_id = ?',
            [req.user.id, bor_id, kiszereles_id]
        );

        if (letezo.length > 0) {
            await promisePool.query(
                'UPDATE kosar SET mennyiseg = mennyiseg + ? WHERE id = ?',
                [mennyiseg, letezo[0].id]
            );
        } else {
            await promisePool.query(
                'INSERT INTO kosar (felhasznalo_id, bor_id, kiszereles_id, mennyiseg) VALUES (?, ?, ?, ?)',
                [req.user.id, bor_id, kiszereles_id, mennyiseg]
            );
        }
        res.json({ message: 'Sikeresen hozzáadva a kosárhoz' });
    } catch (error) {
        res.status(500).json({ error: 'Hiba a kosárba tételkor' });
    }
});

app.put('/api/kosar', authenticateToken, async (req, res) => {
    const { bor_id, kiszereles_id, mennyiseg } = req.body;
    try {
        await promisePool.query(
            'UPDATE kosar SET mennyiseg = ? WHERE felhasznalo_id = ? AND bor_id = ? AND kiszereles_id = ?',
            [mennyiseg, req.user.id, bor_id, kiszereles_id]
        );
        res.json({ message: 'Mennyiség frissítve' });
    } catch (error) {
        res.status(500).json({ error: 'Hiba' });
    }
});

app.delete('/api/kosar', authenticateToken, async (req, res) => {
    const { bor_id, kiszereles_id } = req.body;
    try {
        await promisePool.query(
            'DELETE FROM kosar WHERE felhasznalo_id = ? AND bor_id = ? AND kiszereles_id = ?',
            [req.user.id, bor_id, kiszereles_id]
        );
        res.json({ message: 'Tétel törölve' });
    } catch (error) {
        res.status(500).json({ error: 'Hiba' });
    }
});

app.delete('/api/kosar/urites', authenticateToken, async (req, res) => {
    try {
        await promisePool.query('DELETE FROM kosar WHERE felhasznalo_id = ?', [req.user.id]);
        res.json({ message: 'Kosár kiürítve' });
    } catch (error) {
        res.status(500).json({ error: 'Hiba a kosár ürítésekor' });
    }
});

// ==========================================
// HÍRLEVÉL AUTOMATIZÁLÁS (CRON JOB)
// ==========================================

cron.schedule('0 11 * * *', async () => {
    console.log("⏰ Napi hírlevél generálása indítva...");
    
    try {
        const [subscribers] = await promisePool.query('SELECT nev, email FROM felhasznalok WHERE hirlevel = 1');
        
        if (subscribers.length === 0) {
            console.log("Nincs aktív feliratkozó, hírlevél küldés megszakítva.");
            return;
        }

        const [topWines] = await promisePool.query(`
            SELECT b.id, b.nev, b.rovid_leiras, b.kep_url, bk.ar 
            FROM borok b
            JOIN bor_kiszerelesek bk ON b.id = bk.bor_id
            WHERE bk.kiszereles_nev = '0.75 L'
            ORDER BY RAND() LIMIT 3
        `);

        if (topWines.length === 0) return;

        const winesHtml = topWines.map(w => `
            <div style="border-bottom: 1px solid #eee; padding-bottom: 15px; margin-bottom: 15px;">
                <h3 style="color: #722f37; margin-bottom: 5px;">${w.nev}</h3>
                <p style="color: #555; font-size: 14px; margin-top: 0;">${w.rovid_leiras}</p>
                <div style="display: inline-block; background-color: #f4f4f4; padding: 5px 10px; border-radius: 5px; font-weight: bold; color: #333;">
                    Csak ${new Intl.NumberFormat("hu-HU").format(w.ar)} Ft
                </div>
            </div>
        `).join('');

        for (const sub of subscribers) {
            try {
                // Új, tiszta emailService hívás!
                await emailService.sendNewsletterEmail(sub.email, sub.nev, winesHtml);
                console.log(`✉️ E-mail sikeresen kiküldve: ${sub.email}`);
            } catch (err) {
                console.error(`Hiba az e-mail küldésekor (${sub.email}):`, err);
            }
        }

        console.log("✅ Hírlevél küldés befejeződött.");
    } catch (error) {
        console.error("Hiba a cron job futtatásakor:", error);
    }
});

// ==========================================
// RENDELÉS LEADÁSA (WEBSHOP) ÉS PDF SZÁMLA
// ==========================================

app.post('/api/rendeles', authenticateToken, async (req, res) => {
    const { szamlazasi, szallitasi, tetelek, vegosszeg, szallitasiKoltseg, utanvetDija, kuponKod, kedvezmeny, hirlevel } = req.body;
    
    try {
        await promisePool.query('START TRANSACTION');

        const [users] = await promisePool.query('SELECT nev, email FROM felhasznalok WHERE id = ?', [req.user.id]);
        const user = users[0];

        if (hirlevel === true) {
            await promisePool.query('UPDATE felhasznalok SET hirlevel = 1 WHERE id = ?', [req.user.id]);
        }

        const [rendelesResult] = await promisePool.query(
            `INSERT INTO rendelesek 
            (felhasznalo_id, szamlazasi_nev, szamlazasi_irsz, szamlazasi_varos, szamlazasi_utca, szamlazasi_hazszam, szamlazasi_telefon, 
             szallitasi_nev, szallitasi_irsz, szallitasi_varos, szallitasi_utca, szallitasi_hazszam, 
             szallitasi_dij, utanvet_dija, kupon_kod, kedvezmeny_osszege, vegosszeg, allapot) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Feldolgozás alatt')`,
            [req.user.id, szamlazasi.nev, szamlazasi.irsz, szamlazasi.varos, szamlazasi.utca, szamlazasi.hazszam, szamlazasi.tel,
             szallitasi.nev, szallitasi.irsz, szallitasi.varos, szallitasi.utca, szallitasi.hazszam,
             szallitasiKoltseg || 0, utanvetDija || 0, kuponKod || null, kedvezmeny || 0, vegosszeg]
        );

        const insertId = rendelesResult.insertId;

        for (let t of tetelek) {
            await promisePool.query(
                `INSERT INTO rendeles_tetelek (rendeles_id, bor_id, kiszereles_id, mennyiseg, egysegar) 
                 VALUES (?, ?, ?, ?, ?)`,
                [insertId, t.id, t.kiszereles_id, t.amount, t.ar]
            );

            await promisePool.query(
                `UPDATE bor_kiszerelesek SET keszlet = keszlet - ? WHERE id = ? AND keszlet >= ?`,
                [t.amount, t.kiszereles_id, t.amount]
            );
        }

        await promisePool.query('DELETE FROM kosar WHERE felhasznalo_id = ?', [req.user.id]);
        await promisePool.query('COMMIT');

        // --- ÚJ, TISZTA EMAIL SERVICE HÍVÁS A PDF GENERÁLÁSHOZ ---
        const orderInfo = {
            rendelesId: insertId,
            szamlazasi: szamlazasi,
            vegosszeg: vegosszeg,
            szallitasiKoltseg: szallitasiKoltseg,
            utanvetDija: utanvetDija,
            kedvezmeny: kedvezmeny
        };
        
        emailService.sendOrderConfirmation(user.email, user.nev, orderInfo, tetelek)
            .then(() => console.log(`✉️ Rendelés PDF elküldve: ${user.email}`))
            .catch(err => console.error("Hiba a rendelés email küldésekor:", err));

        res.status(201).json({ msg: 'Rendelés sikeresen rögzítve!', orderId: insertId });

    } catch (error) {
        await promisePool.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ msg: 'Szerverhiba a rendelés során.' });
    }
});

// ==========================================
// ADMIN RÉSZ - RENDELÉSEK KEZELÉSE
// ==========================================

app.get('/api/admin/rendelesek', authenticateToken, isAdmin, async (req, res) => {
    try {
        const [rows] = await promisePool.query(
            `SELECT r.*, f.nev AS felhasznalo_nev, f.email 
             FROM rendelesek r 
             JOIN felhasznalok f ON r.felhasznalo_id = f.id 
             ORDER BY r.datum DESC`
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Hiba a lekérdezéskor' });
    }
});

app.put('/api/admin/rendelesek/:id/allapot', authenticateToken, isAdmin, async (req, res) => {
    const { allapot } = req.body;
    try {
        await promisePool.query('UPDATE rendelesek SET allapot = ? WHERE id = ?', [allapot, req.params.id]);
        res.json({ message: 'Állapot frissítve!' });
    } catch (error) {
        res.status(500).json({ error: 'Hiba a frissítéskor' });
    }
});

app.get('/api/admin/rendelesek/:id/tetelek', authenticateToken, isAdmin, async (req, res) => {
    try {
        const [rows] = await promisePool.query(
            `SELECT rt.*, b.nev AS bor_nev, bk.kiszereles_nev 
             FROM rendeles_tetelek rt
             JOIN borok b ON rt.bor_id = b.id
             JOIN bor_kiszerelesek bk ON rt.kiszereles_id = bk.id
             WHERE rt.rendeles_id = ?`,
            [req.params.id]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Hiba a lekérdezéskor' });
    }
});

// ==========================================
// ADMIN RÉSZ - BOROK KEZELÉSE (CRUD)
// ==========================================

app.post('/api/admin/borok', authenticateToken, isAdmin, upload.single('kep'), async (req, res) => {
    const { nev, fajta, evjarat, tipus, rovid_leiras, hosszu_leiras, jellego, alkohol, sav, cukor } = req.body;
    const kep_url = req.file ? `/images/${req.file.filename}` : null;

    try {
        const [result] = await promisePool.query(
            `INSERT INTO borok (nev, fajta, evjarat, tipus, rovid_leiras, hosszu_leiras, jellego, alkohol, sav, cukor, kep_url) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [nev, fajta, evjarat, tipus, rovid_leiras, hosszu_leiras, jellego, alkohol, sav, cukor, kep_url]
        );
        res.status(201).json({ message: "Bor sikeresen hozzáadva", id: result.insertId, kep_url });
    } catch (error) {
        res.status(500).json({ error: "Adatbázis hiba" });
    }
});

app.put('/api/admin/borok/:id', authenticateToken, isAdmin, upload.single('kep'), async (req, res) => {
    const { id } = req.params;
    const { nev, fajta, evjarat, tipus, rovid_leiras, hosszu_leiras, jellego, alkohol, sav, cukor } = req.body;
    
    let query = `UPDATE borok SET nev=?, fajta=?, evjarat=?, tipus=?, rovid_leiras=?, hosszu_leiras=?, jellego=?, alkohol=?, sav=?, cukor=?`;
    let params = [nev, fajta, evjarat, tipus, rovid_leiras, hosszu_leiras, jellego, alkohol, sav, cukor];

    if (req.file) {
        query += `, kep_url=?`;
        params.push(`/images/${req.file.filename}`);
    }
    
    query += ` WHERE id=?`;
    params.push(id);

    try {
        await promisePool.query(query, params);
        res.json({ message: "Bor sikeresen frissítve" });
    } catch (error) {
        res.status(500).json({ error: "Hiba a frissítéskor" });
    }
});

app.delete('/api/admin/borok/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const [bor] = await promisePool.query('SELECT kep_url FROM borok WHERE id = ?', [req.params.id]);
        if (bor.length > 0 && bor[0].kep_url) {
            const filepath = path.join(__dirname, 'public', bor[0].kep_url);
            if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
        }
        await promisePool.query('DELETE FROM borok WHERE id = ?', [req.params.id]);
        res.json({ message: "Bor törölve" });
    } catch (error) {
        res.status(500).json({ error: "Hiba a törléskor" });
    }
});

app.post('/api/admin/borok/:id/kiszerelesek', authenticateToken, isAdmin, async (req, res) => {
    const { kiszereles_nev, ar, keszlet } = req.body;
    try {
        await promisePool.query(
            'INSERT INTO bor_kiszerelesek (bor_id, kiszereles_nev, ar, keszlet) VALUES (?, ?, ?, ?)',
            [req.params.id, kiszereles_nev, ar, keszlet]
        );
        res.status(201).json({ message: "Kiszerelés hozzáadva!" });
    } catch (error) {
        res.status(500).json({ error: "Hiba a mentéskor" });
    }
});

app.delete('/api/admin/kiszerelesek/:kiszerelesId', authenticateToken, isAdmin, async (req, res) => {
    try {
        await promisePool.query('DELETE FROM bor_kiszerelesek WHERE id = ?', [req.params.kiszerelesId]);
        res.json({ message: "Kiszerelés törölve!" });
    } catch (error) {
        res.status(500).json({ error: "Hiba a törléskor" });
    }
});

// ==========================================
// ADMIN RÉSZ - ÉRTÉKELÉSEK KEZELÉSE
// ==========================================

app.get('/api/admin/ertekelesek', authenticateToken, isAdmin, async (req, res) => {
    try {
        const [rows] = await promisePool.query(`
            SELECT e.*, b.nev AS bor_nev, f.nev AS felhasznalo_nev 
            FROM ertekelesek e
            JOIN borok b ON e.bor_id = b.id
            JOIN felhasznalok f ON e.felhasznalo_id = f.id
            ORDER BY e.datum DESC
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Adatbázis hiba" });
    }
});

app.delete('/api/admin/ertekelesek/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        await promisePool.query('DELETE FROM ertekelesek WHERE id = ?', [req.params.id]);
        res.json({ message: "Értékelés törölve" });
    } catch (error) {
        res.status(500).json({ error: "Hiba a törléskor" });
    }
});

// ==========================================
// BORKÓSTOLÓK (SZOLGÁLTATÁSOK)
// ==========================================

app.get('/api/szolgaltatasok', async (req, res) => {
    try {
        const [rows] = await promisePool.query('SELECT * FROM szolgaltatasok ORDER BY ar ASC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Hiba a szolgáltatások lekérdezésekor" });
    }
});

app.post('/api/foglalas', authenticateToken, async (req, res) => {
    const { szolgaltatasId, datum, idotartam, letszam, osszeg, megjegyzes } = req.body;
    const felhasznaloId = req.user.id;

    if (!szolgaltatasId || !datum || !idotartam || !letszam || !osszeg) {
        return res.status(400).json({ error: "Minden mező kitöltése kötelező!" });
    }

    try {
        await promisePool.query('START TRANSACTION');

        const [szolgRows] = await promisePool.query('SELECT nev FROM szolgaltatasok WHERE id = ?', [szolgaltatasId]);
        if (szolgRows.length === 0) throw new Error("A szolgáltatás nem található");
        const szolgaltatas = szolgRows[0];

        const [kapacitasCheck] = await promisePool.query(
            `SELECT SUM(letszam) as foglalt_fo 
             FROM foglalasok 
             WHERE datum = ? AND idotartam = ? AND allapot != 'Lemondva'`,
            [datum, idotartam]
        );
        const eddigFoglalt = kapacitasCheck[0].foglalt_fo || 0;
        const maxKapacitas = 20;

        if (eddigFoglalt + letszam > maxKapacitas) {
            await promisePool.query('ROLLBACK');
            return res.status(400).json({ error: `Nincs elég szabad hely. Még ${maxKapacitas - eddigFoglalt} hely maradt.` });
        }

        const [result] = await promisePool.query(
            `INSERT INTO foglalasok (felhasznalo_id, szolgaltatas_id, datum, idotartam, letszam, osszeg, megjegyzes) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [felhasznaloId, szolgaltatasId, datum, idotartam, letszam, osszeg, megjegyzes || null]
        );

        const insertId = result.insertId;

        const [users] = await promisePool.query('SELECT nev, email FROM felhasznalok WHERE id = ?', [felhasznaloId]);
        const user = users[0];

        await promisePool.query('COMMIT');

        // --- ÚJ, TISZTA EMAIL SERVICE HÍVÁS A JEGY GENERÁLÁSHOZ ---
        const bookingInfo = {
            foglalasId: insertId,
            szolgaltatasNev: szolgaltatas.nev,
            datum: datum,
            idotartam: idotartam,
            letszam: letszam,
            osszeg: osszeg
        };

        emailService.sendBookingConfirmation(user.email, user.nev, bookingInfo)
            .then(() => console.log(`🎟️ Jegy PDF elküldve: ${user.email}`))
            .catch(err => console.error("Hiba a jegy email küldésekor:", err));

        res.status(201).json({ msg: 'Sikeres foglalás!', foglalasId: insertId });

    } catch (error) {
        await promisePool.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ error: "Szerverhiba a foglalás során" });
    }
});

// ==========================================
// ADMIN RÉSZ - FOGLALÁSOK KEZELÉSE
// ==========================================

app.get('/api/admin/foglalasok', authenticateToken, isAdmin, async (req, res) => {
    try {
        const [rows] = await promisePool.query(`
            SELECT f.*, sz.nev AS szolgaltatas_nev, u.nev AS felhasznalo_nev, u.email, u.telefonszam
            FROM foglalasok f
            JOIN szolgaltatasok sz ON f.szolgaltatas_id = sz.id
            JOIN felhasznalok u ON f.felhasznalo_id = u.id
            ORDER BY f.datum DESC, f.idotartam ASC
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Szerverhiba" });
    }
});

app.put('/api/admin/foglalasok/:id/allapot', authenticateToken, isAdmin, async (req, res) => {
    const { id } = req.params;
    const { allapot } = req.body;
    try {
        await promisePool.query('UPDATE foglalasok SET allapot = ? WHERE id = ?', [allapot, id]);
        res.json({ message: "Foglalás állapota frissítve" });
    } catch (error) {
        res.status(500).json({ error: "Szerverhiba" });
    }
});

// ==========================================
// ADMIN RÉSZ - MŰSZERFAL STATISZTIKÁK
// ==========================================

app.get('/api/admin/dashboard-stats', authenticateToken, isAdmin, async (req, res) => {
    try {
        const [salesRows] = await promisePool.query(
            `SELECT SUM(vegosszeg) AS havi_bevetel 
             FROM rendelesek 
             WHERE MONTH(datum) = MONTH(CURRENT_DATE()) AND YEAR(datum) = YEAR(CURRENT_DATE()) AND allapot != 'Törölve'`
        );
        const haviBevetel = salesRows[0].havi_bevetel || 0;

        const [orderRows] = await promisePool.query(
            `SELECT COUNT(*) AS uj_rendelesek 
             FROM rendelesek 
             WHERE allapot = 'Feldolgozás alatt'`
        );
        const ujRendelesek = orderRows[0].uj_rendelesek || 0;

        const [bookingRows] = await promisePool.query(
            `SELECT COUNT(*) AS varhato_vendegek 
             FROM foglalasok 
             WHERE datum >= CURRENT_DATE() AND allapot = 'Jóváhagyva'`
        );
        const varhatoVendegek = bookingRows[0].varhato_vendegek || 0;

        const [userRows] = await promisePool.query(`SELECT COUNT(*) AS osszes_felhasznalo FROM felhasznalok`);
        const osszesFelhasznalo = userRows[0].osszes_felhasznalo || 0;

        const [chartRows] = await promisePool.query(`
            SELECT DATE_FORMAT(datum, '%Y-%m') AS ho, SUM(vegosszeg) AS bevetel
            FROM rendelesek
            WHERE allapot != 'Törölve' AND datum >= DATE_SUB(CURRENT_DATE(), INTERVAL 6 MONTH)
            GROUP BY DATE_FORMAT(datum, '%Y-%m')
            ORDER BY ho ASC
        `);

        const chartLabels = chartRows.map(r => r.ho);
        const chartData = chartRows.map(r => r.bevetel);

        res.json({
            haviBevetel,
            ujRendelesek,
            varhatoVendegek,
            osszesFelhasznalo,
            chartData: { labels: chartLabels, data: chartData }
        });
    } catch (error) {
        res.status(500).json({ error: "Hiba a statisztikák betöltésekor" });
    }
});

// A SZERVER INDÍTÁSA
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 A backend szerver fut a http://localhost:${PORT} porton`);
});