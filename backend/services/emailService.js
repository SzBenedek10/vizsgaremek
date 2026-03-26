const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');

// Segédfüggvények
const HUF = (amount) => new Intl.NumberFormat("hu-HU").format(amount);
const safeText = (text) => text ? text.replace(/ő/g, 'ö').replace(/ű/g, 'ü').replace(/Ő/g, 'Ö').replace(/Ű/g, 'Ü') : '';

// Nodemailer beállítása
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'gibszjakab900@gmail.com', 
        pass: 'gfgf cowy hjkd qoqp' 
    }
});

module.exports = {
    
    // ==========================================
    // 1. HÍRLEVÉL KÜLDÉSE (Cron Jobhoz)
    // ==========================================
    sendNewsletterEmail: async (email, nev, winesHtml) => {
        const mailOptions = {
            from: '"Szente Pincészet" <gibszjakab900@gmail.com>',
            to: email,
            subject: `🍷 Üdvözlünk a Szente Pincészet közösségében! Napi Ajánló`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px;">
                  <div style="background-color: #722f37; padding: 25px; text-align: center; color: white;">
                      <h1 style="margin: 0; font-size: 22px;">Szente Pincészet - Napi Ajánló</h1>
                  </div>
                  <div style="padding: 20px; background-color: #fdfbfb;">
                      <h2>Kedves ${nev}!</h2>
                      <p>Elhoztuk neked azt a 3 különleges tételt, amit jelenleg a leginkább imádnak a vásárlóink. Ne maradj le róluk!</p>
                      
                      <div style="background-color: white; padding: 15px; border-radius: 8px; border: 1px solid #ddd; margin-top: 20px;">
                          ${winesHtml}
                      </div>
                      
                      <p style="margin-top: 30px; text-align: center;">
                          <a href="http://localhost:5173/borrendeles" style="background-color: #722f37; color: white; padding: 12px 25px; text-decoration: none; border-radius: 25px; font-weight: bold;">Irány a Webshop</a>
                      </p>
                  </div>
                  <div style="text-align: center; padding: 10px; font-size: 11px; color: #999;">
                      Ezt az emailt azért kaptad, mert feliratkoztál a Szente Pincészet hírlevelére.
                  </div>
              </div>
            `
        };
        return transporter.sendMail(mailOptions);
    },

    // ==========================================
    // 2. RENDELÉS VISSZAIGAZOLÁS + PDF SZÁMLA
    // ==========================================
    sendOrderConfirmation: async (email, nev, orderInfo, tetelek) => {
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({ margin: 50 });
            let buffers = [];
            
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers);
                const mailOptions = {
                    from: '"Szente Pincészet" <gibszjakab900@gmail.com>',
                    to: email,
                    subject: `Rendelés Visszaigazolás #${orderInfo.rendelesId} - Szente Pincészet`,
                    html: `
                        <h2 style="color: #722f37;">Kedves ${nev}!</h2>
                        <p>Köszönjük a rendelését! A mellékletben találja a rendelés részleteit tartalmazó PDF dokumentumot.</p>
                        <p><strong>Rendelés azonosító:</strong> #${orderInfo.rendelesId}</p>
                        <p><strong>Fizetendő végösszeg:</strong> ${HUF(orderInfo.vegosszeg)} Ft</p>
                        <br>
                        <p>Üdvözlettel,<br>Szente Pincészet</p>
                    `,
                    attachments: [{
                        filename: `rendeles_${orderInfo.rendelesId}.pdf`,
                        content: pdfData
                    }]
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) reject(error); else resolve(info);
                });
            });

            // --- PDF TARTALOM GENERÁLÁSA ---
            doc.fontSize(24).fillColor('#722f37').text('Szente Pinceszet', { align: 'center' });
            doc.moveDown();
            doc.fontSize(16).fillColor('#333333').text(`Rendelesi osszesito - #${orderInfo.rendelesId}`);
            doc.moveDown();
            
            doc.fontSize(12).fillColor('#555555').text(`Kiallitas datuma: ${new Date().toLocaleDateString('hu-HU')}`);
            doc.moveDown();

            doc.fontSize(14).fillColor('#333333').text('Szamlazasi Adatok:');
            doc.fontSize(12).fillColor('#555555');
            doc.text(`Nev: ${safeText(orderInfo.szamlazasi.nev)}`);
            doc.text(`Cim: ${orderInfo.szamlazasi.irsz} ${safeText(orderInfo.szamlazasi.varos)}, ${safeText(orderInfo.szamlazasi.utca)} ${orderInfo.szamlazasi.hazszam}.`);
            doc.moveDown();

            doc.fontSize(14).fillColor('#333333').text('Rendelt Tetelek:');
            doc.moveDown();

            let yPosition = doc.y;
            doc.fontSize(12).fillColor('#333333').text('Termek', 50, yPosition);
            doc.text('Mennyiseg', 250, yPosition);
            doc.text('Egysegar', 350, yPosition);
            doc.text('Osszesen', 450, yPosition);
            
            doc.moveTo(50, yPosition + 15).lineTo(550, yPosition + 15).lineWidth(1).strokeColor('#dddddd').stroke();
            yPosition += 25;

            tetelek.forEach(t => {
                doc.fontSize(10).fillColor('#555555');
                doc.text(`${safeText(t.nev)} (${safeText(t.kiszereles_nev)})`, 50, yPosition, { width: 190 });
                doc.text(`${t.amount} db`, 250, yPosition);
                doc.text(`${HUF(t.ar)} Ft`, 350, yPosition);
                doc.text(`${HUF(t.ar * t.amount)} Ft`, 450, yPosition);
                yPosition += 20;
            });

            doc.moveTo(50, yPosition + 10).lineTo(550, yPosition + 10).lineWidth(1).strokeColor('#dddddd').stroke();
            yPosition += 25;

            doc.fontSize(10).fillColor('#555555');
            doc.text(`Szallitasi koltseg:`, 350, yPosition);
            doc.text(`${HUF(orderInfo.szallitasiKoltseg)} Ft`, 450, yPosition);
            yPosition += 15;

            doc.text(`Utanvet dija:`, 350, yPosition);
            doc.text(`${HUF(orderInfo.utanvetDija)} Ft`, 450, yPosition);
            yPosition += 15;

            if (orderInfo.kedvezmeny > 0) {
                doc.text(`Kedvezmeny:`, 350, yPosition);
                doc.text(`-${HUF(orderInfo.kedvezmeny)} Ft`, 450, yPosition);
                yPosition += 15;
            }

            doc.fontSize(14).fillColor('#722f37').font('Helvetica-Bold');
            doc.text(`Vegosszeg:`, 350, yPosition + 10);
            doc.text(`${HUF(orderInfo.vegosszeg)} Ft`, 450, yPosition + 10);

            doc.end();
        });
    },

    // ==========================================
    // 3. FOGLALÁS VISSZAIGAZOLÁS + PDF JEGY
    // ==========================================
    sendBookingConfirmation: async (email, nev, bookingInfo) => {
        return new Promise(async (resolve, reject) => {
            const doc = new PDFDocument({ margin: 0, size: 'A4' });
            let buffers = [];

            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers);
                const mailOptions = {
                    from: '"Szente Pincészet" <gibszjakab900@gmail.com>',
                    to: email,
                    subject: `Borkóstoló Foglalás Visszaigazolás #${bookingInfo.foglalasId} - Szente Pincészet`,
                    html: `
                        <h2 style="color: #722f37;">Kedves ${nev}!</h2>
                        <p>Örömmel értesítjük, hogy foglalása sikeresen rögzítésre került.</p>
                        <p>A mellékelt PDF dokumentum a hivatalos belépőjegye. Kérjük, hozza magával (akár telefonon bemutatva) a helyszínre!</p>
                        <ul>
                            <li><strong>Program:</strong> ${bookingInfo.szolgaltatasNev}</li>
                            <li><strong>Időpont:</strong> ${new Date(bookingInfo.datum).toLocaleDateString('hu-HU')} ${bookingInfo.idotartam}</li>
                            <li><strong>Résztvevők:</strong> ${bookingInfo.letszam} fő</li>
                        </ul>
                        <p>Várjuk szeretettel!</p>
                    `,
                    attachments: [{
                        filename: `foglalas_jegy_${bookingInfo.foglalasId}.pdf`,
                        content: pdfData
                    }]
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) reject(error); else resolve(info);
                });
            });

            // --- JEGY PDF TARTALOM ---
            doc.rect(0, 0, doc.page.width, 180).fill('#722f37');
            doc.fontSize(32).fillColor('#ffffff').font('Helvetica-Bold');
            doc.text('SZENTE PINCÉSZET', 0, 60, { align: 'center', characterSpacing: 2 });
            doc.fontSize(14).font('Helvetica');
            doc.text('HIVATALOS BELÉPÖJEGY', 0, 105, { align: 'center', characterSpacing: 5 });

            const y = 250;
            doc.roundedRect(50, y, 495, 180, 10).fillAndStroke('#ffffff', '#eeeeee');

            doc.fontSize(22).fillColor('#333333').font('Helvetica-Bold');
            doc.text(safeText(bookingInfo.szolgaltatasNev).toUpperCase(), 70, y + 30);
            
            doc.moveTo(70, y + 65).lineTo(525, y + 65).lineWidth(1).strokeColor('#eeeeee').stroke();
            
            doc.fontSize(10).fillColor('#888888').font('Helvetica');
            doc.text('NÉV', 70, y + 85);
            doc.text('DÁTUM', 250, y + 85);
            doc.text('IDÖPONT', 380, y + 85);
            doc.text('LÉTSZÁM', 470, y + 85);
            
            doc.fontSize(14).fillColor('#333333').font('Helvetica-Bold');
            doc.text(safeText(nev), 70, y + 100);
            doc.text(new Date(bookingInfo.datum).toLocaleDateString('hu-HU'), 250, y + 100);
            doc.text(bookingInfo.idotartam, 380, y + 100);
            doc.text(`${bookingInfo.letszam} fö`, 470, y + 100);

            doc.moveTo(50, y + 140).lineTo(545, y + 140).dash(5, { space: 5 }).strokeColor('#dddddd').stroke();
            doc.undash();
            
            doc.fontSize(10).fillColor('#888888').font('Helvetica');
            doc.text('FOGLALÁSI AZONOSÍTÓ', 70, y + 155);
            doc.fontSize(12).fillColor('#722f37').font('Helvetica-Bold');
            doc.text(`#${String(bookingInfo.foglalasId).padStart(6, '0')}`, 210, y + 154);

            doc.fontSize(10).fillColor('#888888').font('Helvetica');
            doc.text('FIZETENDÖ:', 380, y + 155);
            doc.fontSize(14).fillColor('#333333').font('Helvetica-Bold');
            doc.text(`${HUF(bookingInfo.osszeg)} Ft`, 450, y + 153);

            // QR KÓD Generálása
            try {
                const qrUrl = `http://localhost:5173/admin/ticket/${bookingInfo.foglalasId}`;
                const qrCodeBuffer = await QRCode.toBuffer(qrUrl, {
                    color: { dark: '#722f37', light: '#ffffff' },
                    width: 90, 
                    margin: 0
                });
                doc.image(qrCodeBuffer, 50, y + 50);
                doc.moveTo(155, y + 55).lineTo(155, y + 130).lineWidth(1).strokeColor('#eeeeee').stroke();
                
                doc.fontSize(9).fillColor('#722f37').font('Helvetica-Bold');
                doc.text('Belépöjegy & Ellenörzés', 170, y + 65);
                doc.fontSize(8).fillColor('#888888').font('Helvetica');
                doc.text('Kérjük, mutassa be ezt a', 170, y + 80);
                doc.text('QR kódot a helyszínen', 170, y + 92);
                doc.text('a gyorsabb bejutáshoz.', 170, y + 104);
            } catch (err) {
                console.error("Hiba a QR kód generálásakor:", err);
            }

            doc.moveTo(50, 750).lineTo(550, 750).lineWidth(1).strokeColor('#e0e0e0').stroke();
            doc.fontSize(10).fillColor('#888888').font('Helvetica').text('8318 Lesencetomaj, Szőlőhegy hegy 128. | +36 30 321 6644 | info@szentepince.hu', 0, 770, { align: 'center' });

            doc.end();
        });
    }
};