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
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const HUF = new Intl.NumberFormat("hu-HU");

export default function TastingCard({ csomag, onValaszt, isFull }) {
  const cardStyle = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: !isFull ? 'scale(1.02)' : 'none',
    },
    opacity: isFull ? 0.8 : 1, 
    position: 'relative',
    boxShadow: 3,
    borderRadius: 2,
    overflow: 'hidden'
  };

  // Dátum formázása magyarosra
  const formatDatum = (dateString) => {
    if (!dateString) return "Nincs megadva";
    return new Date(dateString).toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Időtartam formázása (pl. 02:00:00 -> 2 óra)
  const formatIdotartam = (timeString) => {
    if (!timeString) return "";
    const parts = timeString.split(':');
    const hours = parseInt(parts[0], 10);
    return `${hours} óra`;
  };

  return (
    <Card sx={cardStyle}>
      {/* Betelt jelzés a kártya sarkában */}
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
      
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
        <Typography gutterBottom variant="h5" component="div" sx={{ color: '#722f37', fontWeight: 'bold' }}>
          {csomag.nev}
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          {/* Időpont sor */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, color: 'text.secondary' }}>
            <CalendarMonthIcon fontSize="small" />
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              {formatDatum(csomag.datum)}
            </Typography>
          </Box>
          
          {/* Időtartam sor */}
          {csomag.idotartam && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
              <AccessTimeIcon fontSize="small" />
              <Typography variant="caption" sx={{ fontWeight: 'medium' }}>
                Időtartam: {formatIdotartam(csomag.idotartam)}
              </Typography>
            </Box>
          )}
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, flexGrow: 1, lineHeight: 1.6 }}>
          {csomag.leiras}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto', pt: 2, borderTop: '1px solid #eee' }}>
          <Typography variant="h6" sx={{ color: '#722f37', fontWeight: 'bold' }}>
            {HUF.format(csomag.ar)} Ft / fő
          </Typography>
          <Chip 
            label={`Max: ${csomag.kapacitas} fő`} 
            size="small" 
            variant="outlined" 
            sx={{ fontWeight: 'bold' }}
          />
        </Box>

        {isFull ? (
          <Button 
            variant="contained" 
            disabled 
            fullWidth 
            sx={{ 
              mt: 2, 
              bgcolor: '#ccc !important',
              color: 'white !important',
              py: 1.2
            }}
          >
            Sajnos ez a túra betelt
          </Button>
        ) : (
          <Button 
            variant="contained" 
            fullWidth 
            onClick={() => onValaszt(csomag)}
            sx={{ 
              mt: 2, 
              bgcolor: '#722f37', 
              '&:hover': { bgcolor: '#5a252c' },
              py: 1.2,
              fontWeight: 'bold',
              borderRadius: 1.5
            }}
          >
            Kosárba teszem
          </Button>
        )}
      </CardContent>
    </Card>
  );
}