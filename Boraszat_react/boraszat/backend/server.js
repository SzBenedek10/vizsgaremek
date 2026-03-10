const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "nagyon_titkos_kulcs_123"; 
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createPool({
    host: process.env.NODE_ENV === 'test' ? 'localhost' : 'mysqldb',
    //host: 'localhost',
    user: 'root',
    password: '',
    database: 'boraszat',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'gibszjakab900@gmail.com', 
        pass: 'gfgf cowy hjkd qoqp' 
    }
});

db.getConnection((err, connection) => {
    if (err) {
        console.error('Adatbázis csatlakozási hiba (Pool):', err.message);
    } else {
        console.log('Sikeresen csatlakozva a MySQL-hez (Pool)!');
        connection.release(); 
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

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' }); 
    
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
      k.megnevezes AS kiszereles_nev, 
      k.szorzo 
    FROM bor b
    JOIN kiszereles k ON b.kiszereles_id = k.id
    WHERE b.keszlet IS NOT NULL
  `;
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error("SQL hiba:", err.message);
      return res.status(500).json({ error: "Adatbázis hiba" }); 
    }
    res.json(results); 
  });
});

app.get('/api/kiszerelesek', (req, res) => {
    const sql = "SELECT * FROM kiszereles ORDER BY id ASC";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Hiba a kiszerelések lekérésekor:", err);
            return res.status(500).json({ error: "Adatbázis hiba" });
        }
        res.json(results);
    });
});


app.post("/api/rendeles", (req, res) => {
  const { userId, szamlazasi, szallitasi, tetelek, vegosszeg } = req.body;

  if (!tetelek || tetelek.length === 0) {
    return res.status(400).json({ msg: "Üres a kosár!" });
  }

  const finalUserId = userId || 1; 

  const sqlRendeles = `
    INSERT INTO rendeles 
    (user_id, szaml_nev, szaml_orszag, szaml_irsz, szaml_varos, szaml_utca, szaml_hazszam,
     szall_nev, szall_orszag, szall_irsz, szall_varos, szall_utca, szall_hazszam, 
     vegosszeg, statusz) 
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
        const sqlUpdateStock = "UPDATE bor SET keszlet = keszlet - ? WHERE id = ?";
        db.query(sqlUpdateStock, [item.amount, item.id]);
      });
      
    
      
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      let buffers = [];
      
      doc.on('data', buffers.push.bind(buffers));
      
      doc.on('end', () => {
          let pdfData = Buffer.concat(buffers);
          let tetelekHtml = tetelek.map(t => `<li style="margin-bottom: 5px;"><strong>${t.nev}</strong> - ${t.amount} db (${t.ar} Ft/db)</li>`).join('');
          const vasarloEmail = szamlazasi.email || 'teszt@teszt.hu'; 

          const mailOptions = {
              from: '"Szente Pincészet" <gibszjakab900@gmail.com>', 
              to: vasarloEmail, 
              subject: `Sikeres rendelés! (Azonosító: #${rendelesId})`,
              html: `
                <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                    <div style="background-color: #722f37; padding: 25px; text-align: center; color: white;">
                        <h1 style="margin: 0; font-size: 24px;">Köszönjük a rendelésed! 🍷</h1>
                    </div>
                    <div style="padding: 30px; background-color: #fdfbfb;">
                        <h2>Kedves ${szamlazasi.nev}!</h2>
                        <p>Sikeresen megkaptuk a rendelésedet. <b>A mellékletben találod a hivatalos számlát PDF formátumban.</b></p>
                        <h3 style="border-bottom: 2px solid #722f37; padding-bottom: 8px; color: #2c0e0e;">Rendelés részletei (#${rendelesId})</h3>
                        <ul>${tetelekHtml}</ul>
                        <h2 style="color: #722f37;">Fizetendő végösszeg: ${new Intl.NumberFormat("hu-HU").format(vegosszeg)} Ft</h2>
                        <p><strong>Fizetési mód:</strong> Utánvét (Fizetés a futárnál készpénzzel vagy bankkártyával)</p>
                        <p>Egészségedre,<br><strong style="color: #722f37;">A Szente Pincészet Csapata</strong></p>
                    </div>
                </div>
              `,
              attachments: [
                  {
                      filename: `Szente_Pinceszet_Szamla_${rendelesId}.pdf`,
                      content: pdfData
                  }
              ]
          };

          transporter.sendMail(mailOptions, (error, info) => {
              if (error) console.error("Hiba az email küldésekor:", error);
              else console.log("PDF-es email elküldve: " + info.response);
          });
      });

   
      const safeText = (text) => {
          if(!text) return '';
          return text.replace(/ő/g, 'ö').replace(/ű/g, 'ü').replace(/Ő/g, 'Ö').replace(/Ű/g, 'Ü');
      };

      doc.fontSize(22).fillColor('#722f37').font('Helvetica-Bold').text('Számla', 50, 50);
      doc.fontSize(10).fillColor('#555555').font('Helvetica');
      doc.text(`Azonosító: #${rendelesId}`, 50, 75);
      doc.text(`Dátúm: ${new Date().toLocaleDateString('hu-HU')}`, 50, 90);

      doc.fontSize(12).fillColor('#333333').font('Helvetica-Bold').text('Szente Pincészet', 400, 50, { align: 'right' });
      doc.fontSize(10).font('Helvetica').text('8318 Lesencetomaj, Római ut 13.', 400, 65, { align: 'right' });
      doc.text('info@szentepinceszet.hu', 400, 80, { align: 'right' });
      doc.text('+36 30 123 4567', 400, 95, { align: 'right' });

 
      doc.moveTo(50, 120).lineTo(550, 120).lineWidth(1).strokeColor('#cccccc').stroke();

      doc.fontSize(12).fillColor('#722f37').font('Helvetica-Bold').text('Vásárló adatai:', 50, 140);
      doc.fontSize(10).fillColor('#333333').font('Helvetica');
      doc.text(`Név: ${safeText(szamlazasi.nev)}`, 50, 160);
      doc.text(`Cím: ${safeText(szallitasi.irsz)} ${safeText(szallitasi.varos)}`, 50, 175);
      doc.text(`${safeText(szallitasi.utca)} ${safeText(szallitasi.hazszam)}`, 50, 190);

    
      doc.moveTo(50, 220).lineTo(550, 220).strokeColor('#cccccc').stroke();

      doc.fontSize(10).fillColor('#722f37').font('Helvetica-Bold');
      doc.text('Termék megnevezése', 50, 240);
      doc.text('Mennyiség', 300, 240, { width: 60, align: 'right' });
      doc.text('Egységár', 380, 240, { width: 80, align: 'right' });
      doc.text('Összesen', 470, 240, { width: 80, align: 'right' });

   
      doc.moveTo(50, 255).lineTo(550, 255).strokeColor('#722f37').stroke();

      
      doc.font('Helvetica').fillColor('#333333');
      let y = 270;
      
      tetelek.forEach(t => {
          doc.text(safeText(t.nev), 50, y);
          doc.text(`${t.amount} db`, 300, y, { width: 60, align: 'right' });
          doc.text(`${new Intl.NumberFormat("hu-HU").format(t.ar)} Ft`, 380, y, { width: 80, align: 'right' });
          doc.text(`${new Intl.NumberFormat("hu-HU").format(t.amount * t.ar)} Ft`, 470, y, { width: 80, align: 'right' });
          
          y += 20;
          doc.moveTo(50, y - 5).lineTo(550, y - 5).lineWidth(0.5).strokeColor('#eeeeee').stroke();
      });

    
      y += 10;
      doc.fontSize(14).fillColor('#722f37').font('Helvetica-Bold');
      doc.text('Fizetendő végösszeg:', 250, y, { width: 150, align: 'right' });
      doc.text(`${new Intl.NumberFormat("hu-HU").format(vegosszeg)} Ft`, 410, y, { width: 140, align: 'right' });

     
      y += 60;
      doc.fontSize(10).fillColor('#888888').font('Helvetica');
      doc.text('Fizetési mód: Utánvét (készpénz vagy bankkártya a futárnál)', 50, y, { align: 'center' });
      doc.text('Köszönyjük, hogy a mi borainkat választottad!', 50, y + 15, { align: 'center' });

      doc.end();
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


app.delete('/api/users/:id', (req, res) => {
    const id = req.params.id;
    if(id == 1) return res.status(403).json({ error: "A fő admint nem lehet törölni!" });

    const sql = "DELETE FROM users WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: "Hiba a törléskor" });
        res.json({ message: "Felhasználó törölve!" });
    });
});



app.post('/api/borok', (req, res) => {
    const { nev, evjarat, ar, keszlet, leiras, bor_szin_id, kiszereles_id, alkoholfok } = req.body;
    
    const sql = `INSERT INTO bor (nev, evjarat, ar, keszlet, leiras, bor_szin_id, kiszereles_id, alkoholfok) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [nev, evjarat, ar, keszlet, leiras, bor_szin_id || 1, kiszereles_id || 1, alkoholfok || 0];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Hiba bor hozzáadásakor:", err);
            return res.status(500).json({ error: "Adatbázis hiba" });
        }
        res.json({ message: "Bor sikeresen hozzáadva!", id: result.insertId });
    });
});

app.put('/api/borok/:id', (req, res) => {
    const id = req.params.id;
    const { nev, evjarat, ar, keszlet, leiras } = req.body;
    const sql = `UPDATE bor SET nev = ?, evjarat = ?, ar = ?, keszlet = ?, leiras = ? WHERE id = ?`;
    const values = [nev, evjarat, ar, keszlet, leiras, id];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("SQL Hiba bor módosításakor:", err);
            return res.status(500).json({ error: "Hiba a módosításkor" });
        }
        res.json({ message: "Bor sikeresen frissítve!" });
    });
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

/*app.post('/api/foglalas', (req, res) => {
    const { userId, szolgaltatasId, letszam, datum, idotartam, osszeg, megjegyzes } = req.body;

    if (!userId || !szolgaltatasId || !datum) {
        return res.status(400).json({ error: "Hiányzó adatok!" });
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
            return res.status(500).json({ error: "Adatbázis hiba" });
        }
        res.json({ message: "Sikeres foglalás!", foglalasId: result.insertId });
    });
});*/

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

    // Alapvető validáció
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
if (process.env.NODE_ENV !== 'test') {
    app.listen(5000, () => console.log('A szerver fut a 5000-es porton!'));
}
module.exports = app;