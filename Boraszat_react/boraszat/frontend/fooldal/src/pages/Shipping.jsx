import React from 'react';
import { Container, Typography, Box, Paper, Grid } from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CreditCardIcon from '@mui/icons-material/CreditCard';

export default function Shipping() {
  return (
    <Box sx={{ py: 8, bgcolor: '#fdfbfb', minHeight: '100vh' }}>
      <Container maxWidth="md">
        <Typography variant="h3" align="center" sx={{ color: '#722f37', fontWeight: 'bold', mb: 5 }}>
          Szállítás és Fizetés
        </Typography>

        <Grid container spacing={4}>
          {/* SZÁLLÍTÁS */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 4, height: '100%', borderRadius: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocalShippingIcon sx={{ fontSize: 40, color: '#722f37', mr: 2 }} />
                <Typography variant="h5" fontWeight="bold">Szállítás</Typography>
              </Box>
              <Typography paragraph>
                Termékeinket speciális, törésbiztos csomagolásban szállítjuk házhoz.
              </Typography>
              <ul style={{ lineHeight: '1.8' }}>
                <li><strong>Házhozszállítás:</strong> 1 990 Ft</li>
                <li><strong>Csomagpont:</strong> 1 490 Ft</li>
                <li><strong>20 000 Ft felett:</strong> INGYENES</li>
              </ul>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Szállítási idő: 2-3 munkanap.
              </Typography>
            </Paper>
          </Grid>

          {/* FIZETÉS */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 4, height: '100%', borderRadius: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CreditCardIcon sx={{ fontSize: 40, color: '#722f37', mr: 2 }} />
                <Typography variant="h5" fontWeight="bold">Fizetés</Typography>
              </Box>
              <Typography paragraph>
                Webáruházunkban többféle fizetési mód közül választhat:
              </Typography>
              <ul style={{ lineHeight: '1.8' }}>
                <li><strong>Bankkártya:</strong> SimplePay rendszeren keresztül (Biztonságos).</li>
                <li><strong>Utánvét:</strong> Fizetés a futárnál készpénzzel vagy kártyával (+300 Ft kezelési költség).</li>
                <li><strong>Előre utalás:</strong> A rendelés visszaigazolása után küldjük a díjbekérőt.</li>
              </ul>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}