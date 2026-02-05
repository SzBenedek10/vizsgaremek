import React from 'react';
import { Card, CardContent, CardMedia, CardActionArea, Typography, Box, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EventIcon from '@mui/icons-material/Event';

const HUF = new Intl.NumberFormat("hu-HU");

const FeaturedTastingCard = ({ csomag }) => {
  const navigate = useNavigate();

  // Kép kiválasztó logika (ugyanaz, mint a TastingCard-ban)
  const getWineImage = (nev) => {
    const n = nev.toLowerCase();
    if (n.includes("pince")) return "pince3.jpg";
    if (n.includes("szállás")) return "hegykozseg.jpg"; 
    return "borvidek.jpg"; 
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': { 
            transform: 'translateY(-8px)',
            boxShadow: '0 12px 24px rgba(114, 47, 55, 0.4)'
        },
        borderRadius: 3,
        overflow: 'hidden'
      }}
    >
      <CardActionArea 
        // Kattintásra átvisz a részletes oldalra
        onClick={() => navigate('/borkostolas')} 
        sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
      >
        <Box sx={{ position: 'relative' }}>
            <CardMedia
            component="img"
            height="300"
            image={`/images/${getWineImage(csomag.nev)}`} 
            alt={csomag.nev}
            sx={{ objectFit: 'cover' }}
            onError={(e) => { e.currentTarget.src = "/images/placeholder.jpg"; }} 
            />
            {/* Egy kis címke, hogy látszódjon: ez egy PROGRAM */}
            <Chip 
                label="Élményprogram" 
                size="small" 
                sx={{ 
                    position: 'absolute', 
                    top: 10, 
                    right: 10, 
                    bgcolor: 'rgba(255,255,255,0.9)', 
                    color: '#722f37',
                    fontWeight: 'bold'
                }} 
            />
        </Box>
        
        <CardContent sx={{ 
            textAlign: 'center', 
            flexGrow: 1, 
            bgcolor: '#fff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            p: 3
        }}>
          <Typography gutterBottom variant="h5" component="div" sx={{ color: '#722f37', fontWeight: 'bold', fontFamily: 'serif' }}>
            {csomag.nev}
          </Typography>
          
          <Box sx={{ width: '40px', height: '2px', bgcolor: '#722f37', mx: 'auto', my: 2 }}></Box>

          <Typography variant="subtitle1" color="text.secondary" sx={{ fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <EventIcon fontSize="small" /> 
            {csomag.idotartam ? `${csomag.idotartam.substring(0, 5)} órás program` : "Egész estés program"}
          </Typography>

          <Typography variant="h6" sx={{ mt: 2, color: '#333', fontWeight: 'bold' }}>
             {HUF.format(csomag.ar)} Ft <span style={{fontSize:'0.7em', fontWeight:'normal'}}>/ fő</span>
          </Typography>
          
          <Typography variant="caption" sx={{ mt: 2, color: '#999', textTransform: 'uppercase', letterSpacing: 1 }}>
            Részletek és Foglalás
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default FeaturedTastingCard;