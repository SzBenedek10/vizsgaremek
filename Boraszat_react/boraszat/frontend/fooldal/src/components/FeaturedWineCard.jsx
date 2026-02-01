import React from 'react';
import { Card, CardContent, CardMedia, CardActionArea, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const FeaturedWineCard = ({ bor }) => {
  const navigate = useNavigate();

  // Kép kiválasztó logika (Név alapján, a WineCard.jsx mintájára)
  const getWineImage = (nev) => {
    if (!nev) return "placeholder.jpg"; // Biztonsági ellenőrzés
    
    const n = nev.toLowerCase();
    
    if (n.includes("kéknyelvű")) return "keknyelvu.jpg";
    if (n.includes("olaszrizling")) return "rizling.jpg";
    if (n.includes("szürkebarát")) return "szurkebarat.jpg";
    if (n.includes("rózsakő")) return "rozsako.jpg";
    if (n.includes("rosé")) return "rose.jpg";
    if (n.includes("cabernet")) return "cabernet.jpg";
    if (n.includes("kékfrankos")) return "kekfrankos.jpg";
    if (n.includes("muskotály")) return "muskotaly.jpg";
    if (n.includes("lesencei")) return "lacibetyar.jpg";
    if (n.includes("lecsó")) return "lecsó.jpg";
    
    return "placeholder.jpg"; // Ha nincs találat
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
        onClick={() => navigate('/borrendeles')} 
        sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
      >
        <CardMedia
          component="img"
          height="300"
          // Itt hívjuk meg az új függvényt + a mappa elérési útját
          image={`/images/${getWineImage(bor.nev)}`} 
          alt={bor.nev}
          sx={{ objectFit: 'cover' }}
          // Ha véletlenül nem létezik a kép, betölti a placeholdert
          onError={(e) => { e.currentTarget.src = "/images/placeholder.jpg"; }} 
        />
        
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
            {bor.nev}
          </Typography>
          
          <Box sx={{ width: '40px', height: '2px', bgcolor: '#722f37', mx: 'auto', my: 2 }}></Box>

          <Typography variant="subtitle1" color="text.secondary" sx={{ fontWeight: 500 }}>
            Évjárat: {bor.evjarat}
          </Typography>
          
          <Typography variant="caption" sx={{ mt: 2, color: '#999', textTransform: 'uppercase', letterSpacing: 1 }}>
            Rendeléshez kattints ide
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default FeaturedWineCard;