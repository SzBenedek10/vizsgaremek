import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Grid, Button, Fade } from '@mui/material';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

// Saját komponensek
import FeaturedWineCard from '../../components/FeaturedWineCard'; 
import ReviewCard from '../../components/ReviewCard'; 

export default function Home() {
  const navigate = useNavigate();
  
  // Állapotok
  const [topBorok, setTopBorok] = useState([]);
  const [newBorok, setNewBorok] = useState([]);
  const [showBestSellers, setShowBestSellers] = useState(true); 
  const [visible, setVisible] = useState(true); 

  // Adatok betöltése
  useEffect(() => {
    axios.get('http://localhost:5000/api/borok/top')
      .then(res => setTopBorok(res.data))
      .catch(err => console.error(err));

    axios.get('http://localhost:5000/api/borok/new')
      .then(res => setNewBorok(res.data))
      .catch(err => console.error(err));
  }, []);

  // Váltakozó logika
  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setShowBestSellers(prev => !prev);
        setVisible(true);
      }, 500);
    }, 6000); 
    return () => clearInterval(interval);
  }, []);

  const currentWines = showBestSellers ? topBorok : newBorok;
  const currentTitle = showBestSellers ? "Legnépszerűbb Boraink" : "Legújabb Tételeink";
  const currentSubtitle = showBestSellers ? "A vásárlók kedvencei – nem véletlenül." : "Friss palackozás, egyenesen a pincéből.";

  // Vélemények adatai
  const reviews = [
    { nev: "Kovács Péter", szoveg: "A Kéknyelvű egyszerűen fantasztikus! Gyors szállítás, biztosan rendelek még.", csillag: 5 },
    { nev: "Nagy Anna", szoveg: "Nagyon finom borok, igazi balatoni ízvilág. A rozé a kedvencem nyári estékre.", csillag: 5 },
    { nev: "Szabó Gábor", szoveg: "Ajándékba vettem egy válogatást, nagy sikert aratott. Profi csomagolás, kedves kiszolgálás!", csillag: 4 }
  ];

  return (
    <Box>
      {/* 1. HERO SECTION (Fejléc) */}
      <Box 
        sx={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.65)), url("/images/hegykozseg.jpg")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '70vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Container>
          <Typography variant="h2" component="h1" sx={{ fontWeight: 'bold', mb: 2, fontFamily: 'serif', letterSpacing: 1 }}>
            Üdvözlünk Szente Pincéjében!
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, fontWeight: 300, maxWidth: '800px', mx: 'auto' }}>
            Ahol a családi hagyomány találkozik a modern borkészítéssel. 
            Fedezd fel a Balaton-felvidék ízeit minden pohárban.
          </Typography>
          <Button 
            variant="contained" 
            size="large" 
            onClick={() => navigate('/borrendeles')}
            sx={{ 
              bgcolor: '#722f37', 
              '&:hover': { bgcolor: '#903b45' }, 
              px: 6, py: 1.8, 
              fontSize: '1.1rem',
              borderRadius: '50px',
              fontWeight: 'bold',
              textTransform: 'none'
            }}
          >
            Irány a webshop
          </Button>
        </Container>
      </Box>

      {/* 2. DINAMIKUS BOROK (Váltakozó kártyák) */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
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

        <Fade in={visible} timeout={800}>
            <Grid container spacing={4} justifyContent="center">
                {currentWines.length > 0 ? (
                    currentWines.map((bor) => (
                        <Grid item key={bor.id} xs={12} sm={6} md={4}>
                            <FeaturedWineCard bor={bor} />
                        </Grid>
                    ))
                ) : (
                    <Typography sx={{ mt: 4, color: '#aaa' }}>Adatok betöltése...</Typography>
                )}
            </Grid>
        </Fade>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, gap: 1.5 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: showBestSellers ? '#722f37' : '#e0e0e0', transition: '0.5s' }} />
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: !showBestSellers ? '#722f37' : '#e0e0e0', transition: '0.5s' }} />
        </Box>
      </Container>

      {/* --- 3. BEMUTATKOZÁS (KÉP + SZÖVEG) - EZT KÉRTED MÓDOSÍTANI --- */}
      <Box sx={{ bgcolor: '#fdfbfb', py: 10 }}>
        <Container maxWidth="lg">
          <Grid container spacing={8} alignItems="center">
            
            {/* BAL OLDAL: KÉP */}
            <Grid item xs={12} md={6}>
              <Box 
                component="img"
                src="/images/pince3.jpg" // Biztosítsd, hogy ez a kép létezik a public/images mappában!
                alt="Pince hangulat"
                sx={{ 
                  width: '100%', 
                  borderRadius: 4, 
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)', // Elegáns árnyék
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'scale(1.02)' } // Kicsit ráközelít ha ráviszed az egeret
                }}
              />
            </Grid>

            {/* JOBB OLDAL: SZÖVEG */}
            <Grid item xs={12} md={6}>
              <Typography variant="overline" sx={{ color: '#722f37', fontWeight: 'bold', letterSpacing: 2 }}>
                Rólunk
              </Typography>
              <Typography variant="h4" sx={{ color: '#333', fontWeight: 'bold', mb: 3, mt: 1, fontFamily: 'serif' }}>
                Hagyomány és Szenvedély a Balaton-felvidéken
              </Typography>
              
              <Typography paragraph sx={{ fontSize: '1.1rem', color: '#555', lineHeight: 1.8, mb: 3 }}>
                Pincészetünk a Balaton-felvidék szívében, vulkanikus tanúhegyek ölelésében található. 
                Hiszünk abban, hogy a bor nem csupán ital, hanem a táj és az ember közös alkotása.
              </Typography>
              
              <Typography paragraph sx={{ fontSize: '1rem', color: '#666', mb: 4 }}>
                Minden palackban a napfény ízét és a bazalt erejét zárjuk, hogy Ön otthonában is átélhesse 
                a balatoni nyarak hangulatát. Kóstolja meg díjnyertes Olaszrizlingünket vagy különleges Kéknyelvűnket, 
                melyek generációk tudását őrzik.
              </Typography>
              
              <Button 
                variant="outlined" 
                onClick={() => navigate('/bortura')}
                sx={{ 
                  color: '#722f37', 
                  borderColor: '#722f37', 
                  borderRadius: '30px', 
                  px: 4, py: 1,
                  fontWeight: 'bold',
                  textTransform: 'none',
                  fontSize: '1rem',
                  '&:hover': { bgcolor: '#722f37', color: 'white', borderColor: '#722f37' }
                }}
              >
                Ismerj meg minket
              </Button>
            </Grid>

          </Grid>
        </Container>
      </Box>

      {/* 4. HAMAROSAN: BORKÓSTOLÓ (Teaser) */}
      <Box sx={{ bgcolor: '#722f37', color: 'white', py: 8, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, fontFamily: 'serif' }}>
            Hamarosan: Pincelátogatás és Borkóstoló 🍷
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, fontWeight: 300 }}>
            Szeretnél részt venni egy hangulatos borkóstolón? 
            Iratkozz fel, és értesítünk az első szabad időpontokról!
          </Typography>
          
          <Box component="form" sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'center', gap: 2 }}>
            <input 
              type="email" 
              placeholder="Email címed..." 
              style={{ 
                padding: '12px 25px', fontSize: '16px', borderRadius: '30px', border: 'none', width: '100%', maxWidth: '350px', outline: 'none'
              }} 
            />
            <Button 
              variant="contained" 
              sx={{ 
                bgcolor: 'white', color: '#722f37', fontWeight: 'bold', borderRadius: '30px', px: 4,
                '&:hover': { bgcolor: '#f0f0f0' }
              }}
              onClick={() => alert("Feliratkozva!")}
            >
              Értesítést kérek
            </Button>
          </Box>
        </Container>
      </Box>

      {/* 5. VÁSÁRLÓI VÉLEMÉNYEK */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Typography variant="h4" align="center" sx={{ color: '#722f37', fontWeight: 'bold', mb: 6, fontFamily: 'serif' }}>
          Akik már minket választottak
        </Typography>
        
        <Grid container spacing={4}>
          {reviews.map((review, index) => (
            <Grid item xs={12} md={4} key={index}>
              <ReviewCard 
                nev={review.nev} 
                szoveg={review.szoveg} 
                csillag={review.csillag} 
              />
            </Grid>
          ))}
        </Grid>
      </Container>

    </Box>
  );
}