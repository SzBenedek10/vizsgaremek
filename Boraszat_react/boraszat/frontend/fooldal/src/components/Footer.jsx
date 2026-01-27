import { Box, Typography, Container, Link } from '@mui/material';

export default function Footer() {
  return (
    <Box component="footer" sx={{ 
      bgcolor: '#1a1a1a', 
      color: 'white', 
      py: 4, 
      mt: 'auto',
      borderTop: '2px solid #722f37' 
    }}>
      <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
        <Box sx={{ mb: 2 }}>
          <Link href="#" sx={{ color: '#722f37', mx: 2, fontWeight: 'bold', textDecoration: 'none' }}>Rólunk</Link>
          <Link href="#" sx={{ color: '#722f37', mx: 2, fontWeight: 'bold', textDecoration: 'none' }}>Kapcsolat</Link>
        </Box>
        <Typography variant="body2" sx={{ opacity: 0.7 }}>
          © {new Date().getFullYear()} Pince Borászat. Minden jog fenntartva.
        </Typography>
      </Container>
    </Box>
  );
}