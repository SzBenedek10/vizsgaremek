import React from 'react';
import { Container, Typography, Box, Paper, Divider, List, ListItem, ListItemText } from '@mui/material';

export default function Terms() {
  return (
    <Box sx={{ py: 8, bgcolor: '#fdfbfb', minHeight: '100vh' }}>
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 5, borderRadius: 3 }}>
          <Typography variant="h4" gutterBottom sx={{ color: '#722f37', fontWeight: 'bold' }}>
            Általános Szerződési Feltételek (ÁSZF)
          </Typography>
          <Typography variant="caption" display="block" sx={{ mb: 4, color: '#666' }}>
            Utolsó frissítés: {new Date().toLocaleDateString('hu-HU')}
          </Typography>

          <section>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 3 }}>1. A Szolgáltató adatai</Typography>
            <Typography paragraph>
              A webáruház üzemeltetője a Pince Borászat.
              <br />Székhely: 8261 Badacsony, Római út 123.
              <br />Adószám: 12345678-1-19
              <br />Cégjegyzékszám: 19-09-123456
              <br />Email: info@szentepince.hu
            </Typography>
          </section>
          <Divider />

          <section>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 3 }}>2. A megrendelés menete</Typography>
            <Typography paragraph>
              A vásárló a webáruházban regisztráció után tud vásárolni. A kiválasztott termékeket a kosárba helyezve, majd a pénztárban a szállítási és számlázási adatok megadásával véglegesítheti a rendelést. A szerződés a rendelés visszaigazolásával jön létre.
            </Typography>
          </section>
          <Divider />

          <section>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 3 }}>3. Árak és fizetés</Typography>
            <Typography paragraph>
              A webáruházban feltüntetett árak bruttó árak, az ÁFA-t tartalmazzák. A fizetés történhet online bankkártyával vagy utánvéttel a futárnál.
            </Typography>
          </section>
          <Divider />

          <section>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 3 }}>4. Szállítási feltételek</Typography>
            <Typography paragraph>
              A termékeket szerződött futárszolgálatunk szállítja ki 2-3 munkanapon belül. A szállítási költség a pénztár oldalon kerül kiszámításra.
            </Typography>
          </section>
          <Divider />

          <section>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 3 }}>5. Elállási jog</Typography>
            <Typography paragraph>
              A fogyasztó a termék átvételétől számított 14 napon belül indoklás nélkül elállhat a vásárlástól, amennyiben a palack bontatlan és sérülésmentes. Az elállási szándékot írásban kell jelezni az info@szentepince.hu címen.
            </Typography>
          </section>
          
          <Box sx={{ mt: 4, p: 2, bgcolor: '#f8d7da', borderRadius: 2, color: '#721c24' }}>
            <strong>Figyelem:</strong> A webáruházban csak 18. életévüket betöltött személyek vásárolhatnak!
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}