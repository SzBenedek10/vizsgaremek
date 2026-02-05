import React from 'react';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Button, 
  Box, 
  Chip 
} from '@mui/material';

const HUF = new Intl.NumberFormat("hu-HU");

export default function TastingCard({ csomag, onValaszt, isFull }) {
  // A kártya stílusa, ha betelt
  const cardStyle = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: !isFull ? 'scale(1.02)' : 'none',
    },
    opacity: isFull ? 0.7 : 1, // Elhalványítás, ha betelt
    position: 'relative'
  };

  return (
    <Card sx={cardStyle}>
      {/* Betelt jelzés a kép felett */}
      {isFull && (
        <Box sx={{
          position: 'absolute',
          top: 20,
          right: -30,
          bgcolor: '#d32f2f',
          color: 'white',
          px: 5,
          py: 0.5,
          transform: 'rotate(45deg)',
          zIndex: 1,
          fontWeight: 'bold',
          boxShadow: 3
        }}>
          BETELT
        </Box>
      )}

      <CardMedia
        component="img"
        height="200"
        image={csomag.kep_url || "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=2070&auto=format&fit=crop"}
        alt={csomag.nev}
      />
      
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography gutterBottom variant="h5" component="div" sx={{ color: '#722f37', fontWeight: 'bold' }}>
          {csomag.nev}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
          {csomag.leiras}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
          <Typography variant="h6" sx={{ color: '#722f37', fontWeight: 'bold' }}>
            {HUF.format(csomag.ar)} Ft / fő
          </Typography>
          <Chip label={`Max: ${csomag.kapacitas} fő`} size="small" variant="outlined" />
        </Box>

        {isFull ? (
          <Button 
            variant="contained" 
            disabled 
            fullWidth 
            sx={{ mt: 2, bgcolor: '#ccc' }}
          >
            Sajnos ez a túra betelt
          </Button>
        ) : (
          <Button 
            variant="contained" 
            fullWidth 
            sx={{ 
              mt: 2, 
              bgcolor: '#722f37', 
              '&:hover': { bgcolor: '#5a252c' } 
            }}
            onClick={() => onValaszt(csomag, 1)}
          >
            Kiválasztom
          </Button>
        )}
      </CardContent>
    </Card>
  );
}