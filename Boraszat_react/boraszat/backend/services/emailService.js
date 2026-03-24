const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');

// Pénz formázó
const HUF = (amount) => new Intl.NumberFormat("hu-HU").format(amount);
// Szöveg ékezet-javító a PDF-hez
const safeText = (text) => text ? text.replace(/ő/g, 'ö').replace(/ű/g, 'ü').replace(/Ő/g, 'Ö').replace(/Ű/g, 'Ü') : '';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'gibszjakab900@gmail.com', 
        pass: 'gfgf cowy hjkd qoqp' 
    }
});

module.exports = {
    // 1. ÜDVÖZLŐ EMAIL (HÍRLEVÉL)
    sendWelcomeEmail: (nev, email) => {
        const mailOptions = {
            from: '"Szente Pincészet" <gibszjakab900@gmail.com>',
            to: email,
            subject: `🍷 Üdvözlünk a Szente Pincészet közösségében!`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px;">
                  <div style="background-color: #722f37; padding: 25px; text-align: center; color: white;">
                      <h1 style="margin: 0; font-size: 24px;">Köszönjük a feliratkozást!</h1>
                  </div>
                  <div style="padding: 30px; background-color: #fdfbfb; color: #333;">
                      <h2>Kedves ${nev}!</h2>
                      <p>Nagyon örülünk, hogy csatlakoztál a hírlevelünkhöz. Mostantól elsőként értesülsz az exkluzív borválogatásokról, a limitált kiadásokról és a titkos kuponokról!</p>
                      <p>Várunk szeretettel a pincészetben is!</p>
                      <p>Egészségedre,<br><strong style="color: #722f37;">A Szente Pincészet Csapata</strong></p>
                  </div>
              </div>
            `
        };
        transporter.sendMail(mailOptions).catch(console.error);
    },

    // 2. RENDELÉS VISSZAIGAZOLÓ + PDF SZÁMLA
    sendOrderConfirmation: (orderData) => {
        const { rendelesId, szamlazasi, szallitasi, tetelek, vegosszeg, termekekAra, kedvezmeny, kuponKod, szallitasiKoltseg, utanvetDija, afa, vasarloEmail } = orderData;

        const doc = new PDFDocument({ margin: 50, size: 'A4' });
        let buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        
        doc.on('end', () => {
            let pdfData = Buffer.concat(buffers);
            let tetelekHtml = tetelek.map(t => `
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">${t.nev} (${t.amount} db)</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${HUF(t.amount * t.ar)} Ft</td>
              </tr>
            `).join('');

            let kedvezmenyHtml = kedvezmeny > 0 ? `
              <tr>
                <td style="padding: 8px; color: #2e7d32; font-weight: bold;">Kupon kedvezmény (${kuponKod}):</td>
                <td style="padding: 8px; text-align: right; color: #2e7d32; font-weight: bold;">-${HUF(kedvezmeny)} Ft</td>
              </tr>
            ` : '';

            const orderMailOptions = {
                from: '"Szente Pincészet" <gibszjakab900@gmail.com>', 
                to: vasarloEmail, 
                subject: `Sikeres rendelés! (Azonosító: #${rendelesId})`,
                html: `
                  <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                      <div style="background-color: #722f37; padding: 25px; text-align: center; color: white;">
                          <h1 style="margin: 0; font-size: 24px;">Rendelés visszaigazolás 🍷</h1>
                      </div>
                      <div style="padding: 30px; background-color: #fdfbfb;">
                          <h2>Kedves ${szamlazasi.nev}!</h2>
                          <p>Sikeresen megkaptuk a rendelésedet (#${rendelesId}). A mellékletben találod a hivatalos számlát PDF formátumban.</p>
                          
                          <h3 style="border-bottom: 2px solid #722f37; padding-bottom: 8px; color: #2c0e0e; margin-top: 25px;">Rendelés összesítése</h3>
                          <table style="width: 100%; border-collapse: collapse;">
                              ${tetelekHtml}
                              <tr>
                                <td style="padding: 8px;"><strong>Termékek ára:</strong></td>
                                <td style="padding: 8px; text-align: right;"><strong>${HUF(termekekAra)} Ft</strong></td>
                              </tr>
                              ${kedvezmenyHtml}
                              <tr>
                                <td style="padding: 8px;">Házhozszállítás díja:</td>
                                <td style="padding: 8px; text-align: right;">${szallitasiKoltseg === 0 ? '0' : '+'+HUF(szallitasiKoltseg)} Ft</td>
                              </tr>
                              <tr>
                                <td style="padding: 8px; border-bottom: 2px solid #333;">Utánvét díja:</td>
                                <td style="padding: 8px; text-align: right; border-bottom: 2px solid #333;">+${HUF(utanvetDija)} Ft</td>
                              </tr>
                              <tr>
                                <td style="padding: 12px 8px;"><strong style="font-size: 18px; color: #722f37;">Fizetendő végösszeg:</strong></td>
                                <td style="padding: 12px 8px; text-align: right;"><strong style="font-size: 18px; color: #722f37;">${HUF(vegosszeg)} Ft</strong></td>
                              </tr>
                          </table>
                          <p style="text-align: right; font-size: 12px; color: #888;">A végösszeg tartalmazza a 27% ÁFÁ-t (${HUF(afa)} Ft).</p>
  
                          <p><strong>Fizetési mód:</strong> Utánvét (Fizetés a futárnál)</p>
                          <p>Egészségedre,<br><strong style="color: #722f37;">A Szente Pincészet Csapata</strong></p>
                      </div>
                  </div>
                `,
                attachments: [{ filename: `Szamla_${rendelesId}.pdf`, content: pdfData }]
            };

            transporter.sendMail(orderMailOptions).catch(console.error);
        });

        // PDF GENERÁLÁS (RAJZOLÁS)
        doc.fontSize(22).fillColor('#722f37').font('Helvetica-Bold').text('Számla', 50, 50);
        doc.fontSize(10).fillColor('#555555').font('Helvetica');
        doc.text(`Azonosító: #${rendelesId}`, 50, 75);
        doc.text(`Dátúm: ${new Date().toLocaleDateString('hu-HU')}`, 50, 90);
  
        doc.fontSize(12).fillColor('#333333').font('Helvetica-Bold').text('Szente Pincészet', 400, 50, { align: 'right' });
        doc.fontSize(10).font('Helvetica').text('8318 Lesencetomaj, Római ut 13.', 400, 65, { align: 'right' });
        doc.text('info@szentepinceszet.hu', 400, 80, { align: 'right' });
  
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
            doc.text(`${HUF(t.ar)} Ft`, 380, y, { width: 80, align: 'right' });
            doc.text(`${HUF(t.amount * t.ar)} Ft`, 470, y, { width: 80, align: 'right' });
            y += 20;
            doc.moveTo(50, y - 5).lineTo(550, y - 5).lineWidth(0.5).strokeColor('#eeeeee').stroke();
        });
  
        y += 10;
        doc.fontSize(10).font('Helvetica-Bold');
        doc.text('Termékek ára (bruttó):', 250, y, { width: 150, align: 'right' });
        doc.text(`${HUF(termekekAra)} Ft`, 410, y, { width: 140, align: 'right' });
        
        if (kedvezmeny > 0) {
            y += 15;
            doc.fillColor('#2e7d32').text(`Kupon kedvezmeny (${safeText(kuponKod)}):`, 250, y, { width: 150, align: 'right' });
            doc.text(`-${HUF(kedvezmeny)} Ft`, 410, y, { width: 140, align: 'right' });
        }
  
        y += 15;
        doc.fillColor('#333333').font('Helvetica');
        doc.text('Hazhozszallitas dija:', 250, y, { width: 150, align: 'right' });
        doc.text(`${szallitasiKoltseg === 0 ? '0' : '+' + HUF(szallitasiKoltseg)} Ft`, 410, y, { width: 140, align: 'right' });
  
        y += 15;
        doc.text('Utanvet dija:', 250, y, { width: 150, align: 'right' });
        doc.text(`+${HUF(utanvetDija)} Ft`, 410, y, { width: 140, align: 'right' });
  
        y += 20;
        doc.moveTo(250, y - 5).lineTo(550, y - 5).lineWidth(1).strokeColor('#333333').stroke();
        doc.fontSize(14).fillColor('#722f37').font('Helvetica-Bold');
        doc.text('Fizetendo vegosszeg:', 250, y, { width: 150, align: 'right' });
        doc.text(`${HUF(vegosszeg)} Ft`, 410, y, { width: 140, align: 'right' });
  
        y += 20;
        doc.fontSize(9).fillColor('#888888').font('Helvetica');
        doc.text(`A vegosszeg tartalmazza a 27% AFA-t (${HUF(afa)} Ft).`, 250, y, { width: 290, align: 'right' });
  
        y += 40;
        doc.text('Fizetesi mod: Utanvet (keszpenz vagy bankkartya a futarnal)', 50, y, { align: 'center' });
        doc.text('Koszonyjuk, hogy a mi borainkat valasztottad!', 50, y + 15, { align: 'center' });
  
        doc.end();
    },

    // 3. NAPI HÍRLEVÉL (NÉPSZERŰ BOROK)
    sendDailyNewsletter: (wines, subscribers) => {
        let winesHtml = wines.map(w => `
            <div style="border-bottom: 1px solid #ddd; padding-bottom: 15px; margin-bottom: 15px;">
                <h3 style="color: #722f37; margin-bottom: 5px;">🍷 ${w.nev}</h3>
                <p style="color: #666; font-size: 14px; margin-top: 0;">${w.leiras}</p>
                <p style="color: #333; font-weight: bold;">Ár: ${HUF(w.ar)} Ft</p>
            </div>
        `).join('');

        subscribers.forEach(sub => {
            const mailOptions = {
                from: '"Szente Pincészet" <gibszjakab900@gmail.com>',
                to: sub.email,
                subject: `🍷 Napi ajánlónk: A vásárlók 3 kedvenc bora!`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px;">
                        <div style="background-color: #722f37; padding: 20px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 22px;">Szente Pincészet - Napi Ajánló</h1>
                        </div>
                        <div style="padding: 20px; background-color: #fdfbfb;">
                            <h2>Kedves ${sub.nev}!</h2>
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
            transporter.sendMail(mailOptions).catch(console.error);
        });
    }
};