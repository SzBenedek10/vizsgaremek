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

    if (!email || !password_hash) {
        return res.status(400).json({ error: 'Email és jelszó megadása kötelező!' });
    }

    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], async (err, results) => {
        if (err) return res.status(500).json({ error: 'Adatbázis hiba' });
        
        if (results.length === 0) {
            return res.status(401).json({ error: 'Hibás email vagy jelszó!' });
        }

        const user = results[0];

      
        const isMatch = await bcrypt.compare(password_hash, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ error: 'Hibás email vagy jelszó!' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, nev: user.nev },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Sikeres bejelentkezés!',
            token: token,
            user: { id: user.id, nev: user.nev, email: user.email }
        });
    });
});
app.get('/api/borok', (req, res) => {
  const sql = "SELECT id, nev, ar, leiras, keszlet FROM bor WHERE keszlet IS NOT NULL";
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error("SQL hiba:", err.message);
      return res.status(500).json([]); 
    }
    res.json(results); 
  });

});
app.listen(5000, () => console.log('A szerver fut a 5000-es porton!'));