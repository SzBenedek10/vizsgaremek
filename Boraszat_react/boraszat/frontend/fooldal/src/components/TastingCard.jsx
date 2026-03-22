import React from 'react';
import { Box, Typography, Button, Paper, Divider } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const HUF = new Intl.NumberFormat("hu-HU");

export default function TastingCard({ csomag, onValaszt, isFull, szabadHely }) {
  
  // Dátum formázása: 2026-03-20 -> 2026. március 20.
  const formatDatum = (dateString) => {
    if (!dateString) return "Hamarosan";
    const d = new Date(dateString);
    return d.toLocaleDateString('hu-HU', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }) + ".";
  };

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        borderRadius: 3, 
        overflow: 'hidden', 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.3s',
        '&:hover': { transform: 'translateY(-5px)' }
      }}
    >
      {/* KÉP BETÖLTÉSE A SZERVERRŐL */}
      <Box sx={{ height: 200, bgcolor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img 
          // Ha van kép az adatbázisban, azt tölti be, különben egy alapértelmezett képet
          src={csomag.kep ? `http://localhost:5000${csomag.kep}` : "/images/tasting-placeholder.jpg"} 
          alt={csomag.nev}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => { 
            // Hibakezelés, ha a kép egyáltalán nem töltődik be
            e.target.src = "https://via.placeholder.com/400x250?text=Borkostolo"; 
          }}
        />
      </Box>

      <Box sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: '#333' }}>
          {csomag.nev}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#666', mb: 0.5 }}>
          <CalendarMonthIcon sx={{ fontSize: 18, color: '#722f37' }} />
          {/* Itt hívjuk meg a formázó függvényt */}
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            {formatDatum(csomag.datum)}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#666', mb: 2 }}>
          <AccessTimeIcon sx={{ fontSize: 18, color: '#722f37' }} />
          <Typography variant="body2">{csomag.idotartam || "2:00:00"}</Typography>
        </Box>

        <Typography variant="body2" sx={{ color: '#777', mb: 3, flexGrow: 1 }}>
          {csomag.leiras}
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#722f37' }}>
            {HUF.format(csomag.ar)} Ft
          </Typography>
          <Typography variant="caption" sx={{ color: isFull ? 'error.main' : 'success.main', fontWeight: 'bold' }}>
            {isFull ? "BETELT" : `SZABAD (${szabadHely} hely)`}
          </Typography>
        </Box>

        <Button 
          fullWidth 
          variant="contained" 
          disabled={isFull}
          onClick={() => onValaszt(csomag)}
          sx={{ 
            bgcolor: '#722f37', 
            '&:hover': { bgcolor: '#5a252c' },
            fontWeight: 'bold',
            borderRadius: 2,
            textTransform: 'none',
            py: 1
          }}
        >
          {isFull ? "Megtelt" : "Foglalás"}
        </Button>
      </Box>
    </Paper>
  );
}