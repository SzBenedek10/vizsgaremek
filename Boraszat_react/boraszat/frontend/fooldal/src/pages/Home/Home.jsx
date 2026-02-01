import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Grid, Button, Paper, Fade } from '@mui/material';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
// Fontos: Itt már az új nevű komponenst importáljuk!
import FeaturedWineCard from '../../components/FeaturedWineCard'; 

export default function Home() {
  const navigate = useNavigate();
  
  // Állapotok
  const [topBorok, setTopBorok] = useState([]);
  const [newBorok, setNewBorok] = useState([]);
  const [showBestSellers, setShowBestSellers] = useState(true); // true = Népszerű, false = Új
  const [visible, setVisible] = useState(true); // Az animációhoz

  // Adatok betöltése
  useEffect(() => {
    // 1. Legnépszerűbbek
    axios.get('http://localhost:5000/api/borok/top')
      .then(res => setTopBorok(res.data))
      .catch(err => console.error("Hiba a top borok betöltésekor:", err));

    // 2. Legújabbak
    axios.get('http://localhost:5000/api/borok/new')
      .then(res => setNewBorok(res.data))
      .catch(err => console.error("Hiba az új borok betöltésekor:", err));
  }, []);

  // Váltakozó logika (Carousel effect)
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Eltüntetjük (fade out)
      setVisible(false);
      
      // 2. Fél másodperc múlva váltunk adatot és visszahozzuk (fade in)
      setTimeout(() => {
        setShowBestSellers(prev => !prev);
        setVisible(true);
      }, 500); // Ez az időtartam egyezzen meg a Fade timeout-tal
      
    }, 6000); // 6 másodpercenként vált

    return () => clearInterval(interval);
  }, []);

  // Éppen aktuálisan megjelenítendő lista és cím kiválasztása
  const currentWines = showBestSellers ? topBorok : newBorok;
  const currentTitle = showBestSellers ? "Legnépszerűbb Boraink" : "Legújabb Tételeink";
  const currentSubtitle = showBestSellers ? "A vásárlók kedvencei – nem véletlenül." : "Friss palackozás, egyenesen a pincéből.";

  return (
    <Box>
      {/* --- 1. HERO SECTION (Fejléc) --- */}
      <Box 
        sx={{
          backgroundImage: `linear-gradient(rgba(255, 254, 254, 0.55), rgba(255, 254, 254, 0.55)),url("/images/hegykozseg.jpg")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '65vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
          boxShadow: 'inset 0 0 0 2000px rgba(0, 0, 0, 0.4)' // Sötétítés a szöveg olvashatóságáért
        }}
      >
        <Container>
          <Typography variant="h2" component="h1" sx={{ fontWeight: 'bold', mb: 2, textShadow: '2px 2px 4px black', fontFamily: 'serif' }}>
            Üdvözlünk Szente Pincéjében!
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, textShadow: '1px 1px 2px black', fontWeight: 300 }}>
            Családi hagyomány, kiváló minőség és a bor szeretete 2015 óta
          </Typography>
          <Button 
            variant="contained" 
            size="large" 
            onClick={() => navigate('/borrendeles')}
            sx={{ 
              bgcolor: '#722f37', 
              '&:hover': { bgcolor: '#903b45' }, 
              px: 5, py: 1.5, 
              fontSize: '1.2rem',
              borderRadius: '30px',
              fontWeight: 'bold'
            }}
          >
            Irány a webshop
          </Button>
        </Container>
      </Box>

      {/* --- 2. DINAMIKUS VÁLTAKOZÓ SZEKCIÓ --- */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        
        {/* Cím és alcím animációval */}
        <Fade in={visible} timeout={500}>
            <Box sx={{ mb: 6, textAlign: 'center' }}>
                <Typography variant="h4" sx={{ color: '#722f37', fontWeight: 'bold', mb: 1, textTransform: 'uppercase', letterSpacing: 2 }}>
                    {currentTitle}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem', fontStyle: 'italic' }}>
                    {currentSubtitle}
                </Typography>
            </Box>
        </Fade>

        {/* Kártyák animációval */}
        <Fade in={visible} timeout={800}>
            <Grid container spacing={4} justifyContent="center">
                {currentWines.length > 0 ? (
                    currentWines.map((bor) => (
                        <Grid item key={bor.id} xs={12} sm={4} md={4}>
                            {/* Itt használjuk az új kártyát */}
                            <FeaturedWineCard bor={bor} />
                        </Grid>
                    ))
                ) : (
                    <Typography sx={{ mt: 4, color: '#aaa' }}>
                        Adatok betöltése... (vagy nincs elég bor az adatbázisban)
                    </Typography>
                )}
            </Grid>
        </Fade>

        {/* Kis pöttyök jelzőnek */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5, gap: 1.5 }}>
            <Box 
              sx={{ 
                width: 12, height: 12, borderRadius: '50%', 
                bgcolor: showBestSellers ? '#722f37' : '#e0e0e0', 
                transition: 'background-color 0.5s' 
              }} 
            />
            <Box 
              sx={{ 
                width: 12, height: 12, borderRadius: '50%', 
                bgcolor: !showBestSellers ? '#722f37' : '#e0e0e0', 
                transition: 'background-color 0.5s' 
              }} 
            />
        </Box>

      </Container>

      {/* --- 3. FIX BEMUTATKOZÓ SZEKCIÓ --- */}
      <Box sx={{ bgcolor: '#f9f9f9', py: 8 }}>
        <Container maxWidth="lg">
            <Paper elevation={0} sx={{ p: 0, bgcolor: 'transparent' }}>
            <Grid container spacing={6} alignItems="center">
                
                {/* Bal oldali kép */}
                <Grid item xs={12} md={6}>
                  <Box 
                      component="img" 
                      src="/images/pince3.jpg" 
                      alt="Pince hangulat"
                      sx={{ width: '100%', borderRadius: 4, boxShadow: 6 }} 
                  />
                </Grid>

                {/* Jobb oldali szöveg */}
                <Grid item xs={12} md={6}>
                  <Typography variant="h4" gutterBottom sx={{ color: '#722f37', fontWeight: 'bold', fontFamily: 'serif' }}>
                      Miért válassz minket?
                  </Typography>
                  <Typography paragraph sx={{ fontSize: '1.05rem', color: '#555', lineHeight: 1.8 }}>
                      Pincészetünk a Balaton-felvidék szívében található. Hiszünk abban, hogy a jó bor nem csak egy ital, hanem élmény, mely összehozza az embereket és megőrzi a táj ízeit.
                  </Typography>
                  
                  <Grid container spacing={2} sx={{ mt: 2 }}>
                      <Grid item xs={12}>
                          <Paper sx={{ p: 2.5, borderLeft: '5px solid #722f37', bgcolor: '#fff' }}>
                              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#722f37' }}>🍷 Kézműves Gondosság</Typography>
                              <Typography variant="body2" color="text.secondary">
                                Minden tételünk hagyományos eljárással, de modern technológiával készül, hogy a legjobb minőséget nyújtsuk.
                              </Typography>
                          </Paper>
                      </Grid>
                      <Grid item xs={12}>
                          <Paper sx={{ p: 2.5, borderLeft: '5px solid #722f37', bgcolor: '#fff' }}>
                              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#722f37' }}>🚚 Biztonságos Szállítás</Typography>
                              <Typography variant="body2" color="text.secondary">
                                Speciális törésbiztos csomagolásban küldjük borainkat, akár 48 órán belül az otthonodba.
                              </Typography>
                          </Paper>
                      </Grid>
                  </Grid>
                </Grid>
            </Grid>
            </Paper>
        </Container>
      </Box>
    </Box>
  );
}