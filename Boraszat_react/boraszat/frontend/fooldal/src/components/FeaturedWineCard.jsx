import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const FeaturedWineCard = ({ bor }) => {
  const navigate = useNavigate();

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
      <CardMedia
        component="img"
        image={bor.kep ? `http://localhost:5000${bor.kep}` : "/images/placeholder.jpg"} 
        alt={bor.nev}
        sx={{ 
            width: '100%', 
            aspectRatio: '4/3',
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