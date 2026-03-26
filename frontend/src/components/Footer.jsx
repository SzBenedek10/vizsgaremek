import React, { useState } from 'react';
import { Box, Typography, Container, Grid } from '@mui/material';
// Ellenőrizd az elérési utat! Ha a LegalDialogs a components/legal mappában van, írd át az utat.
import LegalDialogs from '../pages/legal/LegalDialogs';

export default function Footer() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('aszf');

  // Ablaknyitó függvény
  const handleOpenLegal = (type) => {
    console.log("Kattintás érzékelve! Ezt akarom megnyitni:", type);
    setModalType(type);
    setModalOpen(true);
  };

  return (
    <Box component="footer" sx={{ bgcolor: '#1a1a1a', color: 'white', py: 6, mt: 'auto', borderTop: '4px solid #722f37' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          
          {/* 1. Oszlop: Cégadatok */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" sx={{ color: '#ffd700', mb: 2, fontWeight: 'bold' }}>
              Szente Pincészet
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
              Minőségi borok egyenesen a termelőtől.
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              8318 Lesencetomaj, Szőlőhegy hegy 128.
            </Typography>
          </Grid>

          {/* 2. Oszlop: Információk (Felugró ablakokat nyitó linkek) */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" sx={{ color: '#ffd700', mb: 2, fontWeight: 'bold' }}>
              Információk
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, alignItems: 'flex-start' }}>
              
              <Typography 
                onClick={() => handleOpenLegal('aszf')} 
                sx={{ color: 'white', cursor: 'pointer', '&:hover': { color: '#ffd700' }, transition: '0.2s' }}
              >
                Általános Szerződési Feltételek
              </Typography>
              
              <Typography 
                onClick={() => handleOpenLegal('adatkezeles')} 
                sx={{ color: 'white', cursor: 'pointer', '&:hover': { color: '#ffd700' }, transition: '0.2s' }}
              >
                Adatkezelési Tájékoztató
              </Typography>
              
              <Typography 
                onClick={() => handleOpenLegal('szallitas')} 
                sx={{ color: 'white', cursor: 'pointer', '&:hover': { color: '#ffd700' }, transition: '0.2s' }}
              >
                Szállítás és Fizetés
              </Typography>
              
              <Typography 
                onClick={() => handleOpenLegal('impresszum')} 
                sx={{ color: 'white', cursor: 'pointer', '&:hover': { color: '#ffd700' }, transition: '0.2s' }}
              >
                Impresszum
              </Typography>

            </Box>
          </Grid>

        </Grid>

        {/* Lábjegyzet */}
        <Box sx={{ textAlign: 'center', mt: 5, pt: 3, borderTop: '1px solid #333' }}>
          <Typography variant="body2" sx={{ opacity: 0.6 }}>
            © {new Date().getFullYear()} Szente Pincészet E.V. Minden jog fenntartva. | Az oldalon csak 18 éven felüliek vásárolhatnak.
          </Typography>
        </Box>
      </Container>

      {/* A láthatatlan felugró ablakunk, ami csak kattintásra jelenik meg */}
      <LegalDialogs 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        type={modalType} 
      />
    </Box>
  );
} 