import React from 'react';
import { Container, Box, Typography, TextField, Button, Paper, Grid, IconButton } from '@mui/material';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';

export default function SignUpSide() {
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // Ellenőrzés a fejlesztői konzolon
    console.log("Küldendő adatok:", data);

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Sikeres regisztráció!');
        navigate('/login');
      } else {
        // Ha a szerver 400 vagy 500 hibát ad, kiírjuk az okát
        alert('Hiba történt: ' + (result.error || 'Ismeretlen hiba'));
      }
    } catch (error) {
      console.error('Hiba:', error);
      alert('Nem sikerült kapcsolódni a szerverhez. Ellenőrizd, hogy fut-e a Node.js!');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
      <Container component="main" maxWidth="sm">
        <Paper elevation={6} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 4 }}>
          
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start', mb: -2 }}>
            <IconButton onClick={() => navigate('/')} sx={{ color: '#722f37' }}>
              <HomeIcon />
            </IconButton>
          </Box>

          <Box sx={{ m: 1, p: 1, bgcolor: '#722f37', borderRadius: '50%', display: 'flex' }}>
            <AccountCircleOutlinedIcon sx={{ color: 'white', fontSize: 30 }} />
          </Box>

          <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold', color: '#722f37', mb: 3 }}>
            Regisztráció
          </Typography>

          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField required fullWidth label="Teljes név" name="nev" autoFocus />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField required fullWidth label="Email cím" name="email" type="email" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField required fullWidth label="Telefonszám" name="telefonszam" />
              </Grid>
              <Grid item xs={12}>
                <TextField required fullWidth label="Jelszó" name="password_hash" type="password" />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Lakcím adatok</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Ország" name="orszag" />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField fullWidth label="Irsz" name="irsz" />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField fullWidth label="Város" name="varos" />
              </Grid>
              <Grid item xs={12} sm={8}>
                <TextField fullWidth label="Utca" name="utca" />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Házszám" name="hazszam" />
              </Grid>
            </Grid>

            <Button type="submit" fullWidth variant="contained" sx={{ mt: 4, mb: 2, bgcolor: '#722f37', '&:hover': { bgcolor: '#5a252c' }, borderRadius: '20px', py: 1.5, fontWeight: 'bold' }}>
              Fiók létrehozása
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Button onClick={() => navigate('/login')} sx={{ color: '#722f37', textTransform: 'none' }}>
                Már van fiókod? Jelentkezz be!
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}