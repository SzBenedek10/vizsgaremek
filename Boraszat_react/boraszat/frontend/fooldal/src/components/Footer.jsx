import { Box, Typography, Container, Link, Grid } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: '#1a1a1a', color: 'white', py: 6, mt: 'auto', borderTop: '4px solid #722f37' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          
          {/* 1. OSZLOP: Céginfó */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" sx={{ color: '#ffd700', mb: 2, fontWeight: 'bold' }}>
              Pince Borászat
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
              Minőségi borok egyenesen a termelőtől.
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              8318 Lesencetomaj, Római út 13.
            </Typography>
          </Grid>

          

         
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" sx={{ color: '#ffd700', mb: 2, fontWeight: 'bold' }}>
              Információk
            </Typography>
           <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
  
    <Link component={RouterLink} to="/aszf" sx={{ color: 'white', textDecoration: 'none', '&:hover': { color: '#ffd700' } }}>Általános Szerződési Feltételek</Link>
    <Link component={RouterLink} to="/adatvedelem" sx={{ color: 'white', textDecoration: 'none', '&:hover': { color: '#ffd700' } }}>Adatkezelési Tájékoztató</Link>
    <Link component={RouterLink} to="/szallitas" sx={{ color: 'white', textDecoration: 'none', '&:hover': { color: '#ffd700' } }}>Szállítás és Fizetés</Link>
    
    
    <Link component={RouterLink} to="/aszf" sx={{ color: 'white', textDecoration: 'none', '&:hover': { color: '#ffd700' } }}>Impresszum</Link>
  </Box>
          </Grid>

        </Grid>

        <Box sx={{ textAlign: 'center', mt: 5, pt: 3, borderTop: '1px solid #333' }}>
          <Typography variant="body2" sx={{ opacity: 0.6 }}>
            © {new Date().getFullYear()} Pince Borászat. Minden jog fenntartva. | Az oldalon csak 18 éven felüliek vásárolhatnak.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}