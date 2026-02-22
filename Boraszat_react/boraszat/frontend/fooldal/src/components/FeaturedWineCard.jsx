import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const FeaturedWineCard = ({ bor }) => {
  const navigate = useNavigate();

  const getWineImage = (nev) => {
    if (!nev) return "placeholder.jpg"; 
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
    return "placeholder.jpg"; 
  };

  return (
    <Card 
      onClick={() => navigate('/borrendeles')} 
      sx={{ 
        width: '100%',
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': { 
            transform: 'translateY(-8px)',
            boxShadow: '0 12px 24px rgba(114, 47, 55, 0.4)'
        },
        borderRadius: 3,
        overflow: 'hidden'
      }}
    >
      {/* 1. JAVÍTÁS: aspect-ratio (képarány) használata fix magasság helyett */}
      <CardMedia
        component="img"
        image={`/images/${getWineImage(bor.nev)}`} 
        alt={bor.nev}
        sx={{ 
            width: '100%', 
            aspectRatio: '4/3', // Ettől lesz minden kép hajszálpontosan egyforma arányú
            objectFit: 'cover' 
        }}
        onError={(e) => { e.currentTarget.src = "/images/placeholder.jpg"; }} 
      />
        
      <CardContent sx={{ 
          textAlign: 'center', 
          flexGrow: 1, 
          bgcolor: '#fff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: 3
      }}>
        <Box>
            <Typography 
              variant="h5" 
              component="div" 
              sx={{ 
                  color: '#722f37', 
                  fontWeight: 'bold', 
                  fontFamily: 'serif', 
                  lineHeight: 1.2,
                  minHeight: '60px', 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  // 2. JAVÍTÁS: Ha egy szó nagyon hosszú, törje el, ne nyomja szét a kártya szélességét
                  wordBreak: 'break-word'
              }}
            >
              {bor.nev}
            </Typography>
            
            <Box sx={{ width: '40px', height: '2px', bgcolor: '#722f37', mx: 'auto', my: 2 }}></Box>

            <Typography variant="subtitle1" color="text.secondary" sx={{ fontWeight: 500 }}>
              Évjárat: {bor.evjarat}
            </Typography>
        </Box>
        
        <Typography variant="caption" sx={{ mt: 2, color: '#999', textTransform: 'uppercase', letterSpacing: 1, display: 'block' }}>
          Rendeléshez kattints ide
        </Typography>
      </CardContent>
    </Card>
  );
};

export default FeaturedWineCard;