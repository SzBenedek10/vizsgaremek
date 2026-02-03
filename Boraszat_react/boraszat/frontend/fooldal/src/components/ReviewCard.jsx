import React from 'react';
import { Paper, Typography, Avatar, Rating } from '@mui/material';

export default function ReviewCard({ nev, szoveg, csillag }) {
  // A név első betűjét használjuk monogramként (pl. Nagy Anna -> N)
  const monogram = nev ? nev.charAt(0).toUpperCase() : "V";

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 3, 
        borderRadius: 4, 
        height: '100%', 
        bgcolor: '#fff', 
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': { 
          transform: 'translateY(-5px)',
          boxShadow: '0 10px 20px rgba(0,0,0,0.1)' 
        },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
      }}
    >
      {/* Profilkép / Monogram */}
      <Avatar sx={{ bgcolor: '#722f37', width: 56, height: 56, mb: 2, fontSize: '1.5rem' }}>
        {monogram}
      </Avatar>

      {/* Csillagok (readonly - csak olvasható) */}
      <Rating name="read-only" value={csillag} readOnly sx={{ mb: 2, color: '#ffd700' }} />

      {/* Vélemény szövege */}
      <Typography variant="body1" sx={{ fontStyle: 'italic', color: '#555', mb: 3, flexGrow: 1 }}>
        "{szoveg}"
      </Typography>

      {/* Név és alatta a szöveg */}
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#333' }}>
        {nev}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        Ellenőrzött vásárló
      </Typography>
    </Paper>
  );
}