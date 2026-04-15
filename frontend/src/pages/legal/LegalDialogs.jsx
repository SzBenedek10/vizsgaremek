import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Divider, Box } from '@mui/material';

export default function LegalDialogs({ open, onClose, type }) {
  
  const cégadatok = {
    nev: "Szente Pincészet E.V.",
    szekhely: "8318 Lesencetomaj, Szőlőhegy hegy 128., Magyarország",
    adoszam: "45678912-1-19",
    nyilvantartasi_szam: "50012345",
    email: "gibszjakab900@gmail.com",
    telefon: "+36 30 321 6644",
    tarhely: "Aiven Ltd. / Helyi Fejlesztői Környezet"
  };

  const renderContent = () => {
    switch (type) {
      case 'aszf':
        return (
          <>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2 }}>1. Általános rendelkezések</Typography>
            <Typography paragraph>
              Jelen Általános Szerződési Feltételek (ÁSZF) tartalmazza a <strong>{cégadatok.nev}</strong> (továbbiakban: Szolgáltató) által üzemeltetett webáruház és borkóstoló foglalási rendszer használatára vonatkozó jogokat és kötelezettségeket.
            </Typography>
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>2. Webshop megrendelés és Szerződéskötés</Typography>
            <Typography paragraph>
              A webáruházban történő borrendelés elektronikus úton megkötött szerződésnek minősül. A megrendelések feldolgozása munkanapokon történik. A Szolgáltató a megrendelés beérkezését e-mailben igazolja vissza.
            </Typography>
            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#722f37' }}>3. Borkóstoló időpontfoglalás és lemondás</Typography>
            <Typography paragraph>
              A weboldalon lehetőség van borkóstoló programokra időpontot foglalni. A foglalás a Szolgáltató e-mailes vagy telefonos visszaigazolásával válik véglegessé. <br /><br />
              <strong>Lemondási feltételek:</strong> A lefoglalt időpontot a Felhasználó legkésőbb a kóstoló kezdete előtt <strong>48 órával</strong> díjmentesen lemondhatja vagy módosíthatja az ügyfélszolgálati e-mail címen ({cégadatok.email}). 48 órán belüli lemondás vagy meg nem jelenés esetén a Szolgáltató jogosult a foglalás értékének kiszámlázására, vagy a későbbi foglalások elutasítására.
            </Typography>
            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>4. Korhatár</Typography>
            <Typography paragraph sx={{ color: '#721c24', fontWeight: 'bold' }}>
              Az alkoholtartalmú italok értékesítése és a borkóstolókon való részvétel kizárólag a 18. életévüket betöltött személyek részére engedélyezett! A megrendelés és foglalás leadásával a Vásárló büntetőjogi felelőssége tudatában nyilatkozik arról, hogy elmúlt 18 éves.
            </Typography>
            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>5. Elállási jog (Csak termékrendelés esetén)</Typography>
            <Typography paragraph>
              A fogyasztót a 45/2014. (II. 26.) Korm. rendelet alapján 14 napos indokolás nélküli elállási jog illeti meg a <strong>fizikai termékek</strong> (palackozott borok) vásárlása esetén. Az elállási jog kizárólag a felbontatlan, sértetlen állapotú palackokra érvényesíthető. <strong>A borkóstoló szolgáltatásokra (mint szabadidős tevékenységre irányuló szerződés) az elállási jog nem vonatkozik.</strong>
            </Typography>
          </>
        );

      case 'adatkezeles':
        return (
          <>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2 }}>1. Az Adatkezelő adatai</Typography>
            <Typography paragraph>
              Adatkezelő neve: {cégadatok.nev}<br/>
              E-mail címe: {cégadatok.email}
            </Typography>
            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>2. A kezelt adatok köre és célja</Typography>
            <Typography paragraph>
              A weboldal az alábbi célokból kezel személyes adatokat: <br />
              - <strong>Webshop megrendelések teljesítése, számlázás, kiszállítás:</strong> Név, Szállítási/Számlázási cím, E-mail cím, Telefonszám.<br />
              - <strong>Borkóstoló időpontfoglalások kezelése:</strong> Név, E-mail cím, Telefonszám, Résztvevők száma, Egyedi kérések.<br />
              Az adatokat harmadik félnek (kivéve a futárszolgálatot és a könyvelést) nem adjuk ki.
            </Typography>
            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>3. Adatmegőrzési idő</Typography>
            <Typography paragraph>
              A számlázási adatokat a Számviteli törvény értelmében 8 évig kötelesek vagyunk megőrizni. A foglalási adatokat a program lezajlását követően a szükséges ideig (pl. esetleges panaszkezelés céljából 30 napig) tároljuk, majd töröljük.
            </Typography>
          </>
        );

      case 'szallitas':
        return (
          <>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2, color: '#722f37' }}>1. Borkóstoló - Részvételi díj fizetése</Typography>
            <Typography paragraph>
              A lefoglalt borkóstoló programok árának kiegyenlítése jellemzően a <strong>helyszínen történik</strong> (készpénzben vagy bankkártyával) a kóstoló végén.
            </Typography>
            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>2. Webshop - Kiszállítás futárszolgálattal</Typography>
            <Typography paragraph>
              A megrendelt palackokat a szerződött logisztikai partnerünk szállítja házhoz. A szállítási idő a készleten lévő termékek esetén jellemzően 2-3 munkanap.
            </Typography>
            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>3. Webshop - Fizetési módok</Typography>
            <Typography paragraph>
              <strong>Utánvét:</strong> A csomag átvételekor a futárnál fizethet készpénzzel vagy bankkártyával. Ennek extra költsége lehet, mely a rendelés leadásánál feltüntetésre kerül.<br/>
              <strong>Online bankkártya (Hamarosan):</strong> Biztonságos online fizetési felületen keresztül.
            </Typography>
            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>4. Töréskár (Kiszállítás esetén)</Typography>
            <Typography paragraph>
              A palackokat speciális, ütésálló csomagolásban küldjük. Amennyiben a csomag átvételekor sérülést vagy folyást tapasztal, kérjük, azonnal vegyen fel jegyzőkönyvet a futárral, és jelezze felénk az ügyfélszolgálati e-mail címen ({cégadatok.email}) a cseréhez!
            </Typography>
          </>
        );

      case 'impresszum':
        return (
          <>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2 }}>Szolgáltató (Tulajdonos) adatai</Typography>
            <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 2, mb: 3 }}>
              <Typography><strong>Cégnév:</strong> {cégadatok.nev}</Typography>
              <Typography><strong>Székhely:</strong> {cégadatok.szekhely}</Typography>
              <Typography><strong>Adószám:</strong> {cégadatok.adoszam}</Typography>
              <Typography><strong>EV Nyilvántartási szám:</strong> {cégadatok.nyilvantartasi_szam}</Typography>
              <Typography><strong>E-mail:</strong> {cégadatok.email}</Typography>
              <Typography><strong>Telefon:</strong> {cégadatok.telefon}</Typography>
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Tárhelyszolgáltató adatai</Typography>
            <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 2 }}>
              <Typography><strong>Név:</strong> {cégadatok.tarhely}</Typography>
              <Typography><strong>Weboldal:</strong> (Vizsgamunka teszt környezet)</Typography>
            </Box>
          </>
        );

      default:
        return <Typography>A kért tartalom nem található.</Typography>;
    }
  };

  const getTitle = () => {
    switch(type) {
      case 'aszf': return 'Általános Szerződési Feltételek (ÁSZF)';
      case 'adatkezeles': return 'Adatkezelési Tájékoztató';
      case 'szallitas': return 'Szállítás, Fizetés és Foglalás'; 
      case 'impresszum': return 'Impresszum';
      default: return 'Dokumentum';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth scroll="paper" sx={{ zIndex: 9999 }}>
      <DialogTitle sx={{ color: '#722f37', fontWeight: 'bold', borderBottom: '1px solid #eee' }}>
        {getTitle()}
      </DialogTitle>
      <DialogContent dividers sx={{ bgcolor: '#fdfbfb' }}>
        {renderContent()}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" sx={{ bgcolor: '#722f37', '&:hover': { bgcolor: '#5a252c' } }}>
          Elolvastam és elfogadom
        </Button>
      </DialogActions>
    </Dialog>
  );
}