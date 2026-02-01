const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "nagyon_titkos_kulcs_123"; 

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createPool({
    host: 'mysqldb',
    user: 'root',
    password: '',
    database: 'boraszat',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

db.getConnection((err, connection) => {
    if (err) {
        console.error('Adatbázis csatlakozási hiba (Pool):', err.message);
    } else {
        console.log('Sikeresen csatlakozva a MySQL-hez (Pool)!');
        connection.release(); // Fontos: engedjük vissza a kapcsolatot!
    }
});

app.post('/api/register', async (req, res) => {
    
    console.log("Beérkező adatok:", req.body);

    const { email, password_hash, nev, telefonszam, orszag, irsz, varos, utca, hazszam } = req.body;

    if (!email || !password_hash || !nev) {
        return res.status(400).json({ error: 'Hiányzó adatok: email, név és jelszó kötelező!' });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password_hash, salt);

        const sql = `INSERT INTO users 
            (email, password_hash, nev, telefonszam, orszag, irsz, varos, utca, hazszam) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [email, hashedPassword, nev, telefonszam, orszag, irsz, varos, utca, hazszam];

        db.query(sql, values, (err, result) => {
            if (err) {
                console.error("MYSQL HIBA:", err.sqlMessage);
               
                return res.status(500).json({ error: "Adatbázis hiba: " + err.sqlMessage });
            }
            res.status(201).json({ message: 'Sikeres regisztráció!' });
        });
    } catch (error) {
        console.error("SZERVER HIBA:", error);
        res.status(500).json({ error: 'Belső szerverhiba történt.' });
    }
});


app.post('/api/login', (req, res) => {
    const { email, password_hash } = req.body; 

    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], async (err, results) => {
        if (err) return res.status(500).json({ error: 'Adatbázis hiba' });
        if (results.length === 0) return res.status(401).json({ error: 'Hibás adatok!' });

        const user = results[0];
        const isMatch = await bcrypt.compare(password_hash, user.password_hash);

        if (!isMatch) return res.status(401).json({ error: 'Hibás adatok!' });

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' }); // Tokenbe is rakjuk bele a role-t!
    
        res.json({
            message: 'Sikeres bejelentkezés!',
            token: token,
            user: { 
                id: user.id, 
                nev: user.nev, 
                email: user.email,
                role: user.role, 
                telefonszam: user.telefonszam, 
                irsz: user.irsz,
                varos: user.varos,
                utca: user.utca,
                hazszam: user.hazszam
            }
        });
    });
});


app.get('/api/borok', (req, res) => {
  const sql = `
    SELECT 
      b.id, 
      b.nev, 
      b.evjarat,
      b.ar, 
      b.leiras, 
      b.keszlet, 
      k.megnevezes AS kiszereles 
    FROM bor b
    JOIN kiszereles k ON b.kiszereles_id = k.id
    WHERE b.keszlet IS NOT NULL
  `;
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error("SQL hiba:", err.message); // <--- EZT KERESD A TERMINÁLBAN!
      return res.status(500).json({ error: "Adatbázis hiba" }); 
    }
    res.json(results); 
  });
});

// POST /api/rendeles - Rendelés mentése (Javított)
app.post("/api/rendeles", (req, res) => {
  const { userId, szamlazasi, szallitasi, tetelek, vegosszeg } = req.body;

  console.log("Beérkező rendelés:", { userId, tetelek });

  if (!tetelek || tetelek.length === 0) {
    return res.status(400).json({ msg: "Üres a kosár!" });
  }

  const finalUserId = userId || 1; 

  // 1. Rendelés beszúrása (Minden címadattal együtt)
  const sqlRendeles = `
    INSERT INTO rendeles 
    (user_id, 
     szaml_nev, szaml_orszag, szaml_irsz, szaml_varos, szaml_utca, szaml_hazszam,
     szall_nev, szall_orszag, szall_irsz, szall_varos, szall_utca, szall_hazszam, 
     vegosszeg, statusz) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'FELDOLGOZAS')
  `;

  const valuesRendeles = [
    finalUserId,
    // Számlázási
    szamlazasi.nev, szamlazasi.orszag || 'Magyarország', szamlazasi.irsz, szamlazasi.varos, szamlazasi.utca, szamlazasi.hazszam,
    // Szállítási
    szallitasi.nev, szallitasi.orszag || 'Magyarország', szallitasi.irsz, szallitasi.varos, szallitasi.utca, szallitasi.hazszam,
    vegosszeg
  ];

  db.query(sqlRendeles, valuesRendeles, (err, result) => {
    if (err) {
      console.error("SQL Hiba (Rendelés):", err);
      return res.status(500).json({ msg: "Adatbázis hiba a rendelés mentésekor." });
    }

    const rendelesId = result.insertId;

    // 2. Tételek beszúrása
    const tetelValues = tetelek.map(item => [rendelesId, item.id, item.amount, item.ar]);
    const sqlTetel = `INSERT INTO rendeles_tetel (rendeles_id, bor_id, mennyiseg, egysegar) VALUES ?`;

    db.query(sqlTetel, [tetelValues], (err, resultItems) => {
      if (err) {
        console.error("SQL Hiba (Tételek):", err);
        return res.status(500).json({ msg: "Hiba a tételek mentésekor." });
      }

      // --- 3. ITT A LÉNYEG: KÉSZLET CSÖKKENTÉSE ---
      // Minden megvásárolt tételnél levonjuk a mennyiséget a 'bor' táblából
      tetelek.forEach(item => {
        // "Csökkentsd a készletet X darabbal annál a bornál, aminek ez az ID-ja"
        const sqlUpdateStock = "UPDATE bor SET keszlet = keszlet - ? WHERE id = ?";
        
        db.query(sqlUpdateStock, [item.amount, item.id], (updateErr) => {
            if (updateErr) {
                console.error(`HIBA: Nem sikerült levonni a készletet (Bor ID: ${item.id})`, updateErr);
            } else {
                console.log(`Készlet frissítve: Bor ID ${item.id}, mínusz ${item.amount} db`);
            }
        });
      });
      

      res.json({ msg: "Rendelés sikeresen rögzítve!", orderId: rendelesId });
    });
  });
});


app.get('/api/users', (req, res) => {
    const sql = "SELECT id, nev, email, role, telefonszam, is_active FROM users";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: "Adatbázis hiba" });
        res.json(results);
    });
});

// 2. Felhasználó törlése
app.delete('/api/users/:id', (req, res) => {
    const id = req.params.id;
    // Admin védelme: az 1-es ID-jű vagy 'admin@gmail.com'-t ne engedjük törölni!
    if(id == 1) return res.status(403).json({ error: "A fő admint nem lehet törölni!" });

    const sql = "DELETE FROM users WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: "Hiba a törléskor" });
        res.json({ message: "Felhasználó törölve!" });
    });
});

// --- BOROK KEZELÉSE (Bővített) ---

// 3. Új bor hozzáadása
app.post('/api/borok', (req, res) => {
    const { nev, evjarat, ar, keszlet, leiras, bor_szin_id, kiszereles_id, alkoholfok } = req.body;
    
    const sql = `INSERT INTO bor (nev, evjarat, ar, keszlet, leiras, bor_szin_id, kiszereles_id, alkoholfok) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    
    // Alapértelmezett értékek kezelése (pl. ha nincs megadva szín, legyen 1-es)
    const values = [nev, evjarat, ar, keszlet, leiras, bor_szin_id || 1, kiszereles_id || 1, alkoholfok || 0];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Hiba bor hozzáadásakor:", err);
            return res.status(500).json({ error: "Adatbázis hiba" });
        }
        res.json({ message: "Bor sikeresen hozzáadva!", id: result.insertId });
    });
});

// 4. Bor módosítása
app.put('/api/borok/:id', (req, res) => {
    const id = req.params.id;
    const { nev, evjarat, ar, keszlet, leiras, bor_szin_id, alkoholfok } = req.body;

    const sql = `UPDATE bor SET 
                 nev = ?, evjarat = ?, ar = ?, keszlet = ?, leiras = ?, bor_szin_id = ?, alkoholfok = ?
                 WHERE id = ?`;

    const values = [nev, evjarat, ar, keszlet, leiras, bor_szin_id, alkoholfok, id];

    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json({ error: "Hiba a módosításkor" });
        res.json({ message: "Bor sikeresen frissítve!" });
    });
});

// 5. Bor törlése (Ez már lehet, hogy megvan, de biztos ami biztos)
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

// TOP 3 legújabb bor (létrehozás dátuma alapján)
app.get('/api/borok/new', (req, res) => {
    const sql = `SELECT * FROM bor ORDER BY created_at DESC LIMIT 3`;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: "Adatbázis hiba" });
        res.json(results);
    });
});
app.listen(5000, () => console.log('A szerver fut a 5000-es porton!'));