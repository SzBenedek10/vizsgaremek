import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Grid, Button, Fade, Paper } from '@mui/material';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

// Ikonok a "Miért válassz minket" részhez
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import Diversity1Icon from '@mui/icons-material/Diversity1';

import FeaturedWineCard from '../../components/FeaturedWineCard'; 
import FeaturedTastingCard from '../../components/FeaturedTastingCard'; 

export default function Home() {
  const navigate = useNavigate();
 
  const [topBorok, setTopBorok] = useState([]);
  const [newBorok, setNewBorok] = useState([]);
  const [szolgaltatasok, setSzolgaltatasok] = useState([]); 

  const [activeTab, setActiveTab] = useState(0); 
  const [visible, setVisible] = useState(true); 

  useEffect(() => {
    axios.get('http://localhost:5000/api/borok/top')
      .then(res => setTopBorok(res.data.slice(0, 2)))
      .catch(err => console.error(err));

    axios.get('http://localhost:5000/api/borok/new')
      .then(res => setNewBorok(res.data.slice(0, 2)))
      .catch(err => console.error(err));
   
    axios.get('http://localhost:5000/api/szolgaltatasok')
      .then(res => setSzolgaltatasok(res.data.slice(0, 2))) 
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setActiveTab(prev => (prev + 1) % 3);
        setVisible(true);
      }, 500);
    }, 6000); 
    return () => clearInterval(interval);
  }, []);

  let currentItems = [];
  let currentTitle = "";
  let currentSubtitle = "";

  if (activeTab === 0) {
    currentItems = topBorok;
    currentTitle = "Legnépszerűbb Boraink";
    currentSubtitle = "A vásárlók kedvencei – nem véletlenül.";
  } else if (activeTab === 1) {
    currentItems = newBorok;
    currentTitle = "Legújabb Tételeink";
    currentSubtitle = "Friss palackozás, egyenesen a pincéből.";
  } else {
    currentItems = szolgaltatasok;
    currentTitle = "Élménycsomagjaink";
    currentSubtitle = "Kóstolók, pincelátogatás és gasztronómiai kalandok.";
  }

  const features = [
    { icon: <LocalShippingIcon sx={{ fontSize: 45 }} />, title: 'Gyors szállítás', desc: 'Akár 2 munkanapon belül nálad a bor.' },
    { icon: <WorkspacePremiumIcon sx={{ fontSize: 45 }} />, title: 'Prémium minőség', desc: 'Saját birtokról, gondos odafigyeléssel.' },
    { icon: <Diversity1Icon sx={{ fontSize: 45 }} />, title: 'Családi pincészet', desc: 'Több generációs tapasztalat és szenvedély.' }
  ];

  return (
    <Box>
      {/* ========================================== */}
      {/* 1. FEJLÉC (HERO) SZEKCIÓ - Balra igazítva, Garamond betűtípussal */}
      {/* ========================================== */}
      <Box 
        sx={{
          minHeight: '80vh', 
          display: 'flex', 
          alignItems: 'center',
          overflow: 'hidden', 
          position: 'relative',
          py: { xs: 8, md: 0 },
          bgcolor: '#111',
          
          mx: { xs: 2, md: 4, lg: 6 }, 
          mt: { xs: 2, md: 4 },        
          mb: 4,                       
          borderRadius: 6,             
          boxShadow: '0 15px 40px rgba(0,0,0,0.2)' 
        }}
      >
        {/* HÁTTÉR VIDEÓ */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover', 
            zIndex: 0,
            transform: 'scale(1.1)' 
          }}
        >
          <source src="/videos/bg.mp4" type="video/mp4" />
        </video>

        {/* TISZTA SÖTÉTÍTŐ RÉTEG */}
        <Box 
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            bgcolor: 'rgba(0, 0, 0, 0.65)', 
            zIndex: 1
          }}
        />

        {/* TARTALOM (Z-index: 2) - Balra igazítva! */}
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
          {/* Adtam neki egy kis bal oldali behúzást (pl), hogy asztali gépen ne tapadjon rá a legszélére */}
          <Box sx={{ textAlign: 'left', pl: { xs: 0, md: 4, lg: 8 } }}> 
              <Typography 
                variant="h1" 
                component="h1" 
                sx={{ 
                  color: '#ffffff', 
                  fontWeight: 'bold', 
                  mb: 2, 
                  fontFamily: '"Garamond", serif', // Garamond beállítása
                  letterSpacing: 1, 
                  lineHeight: 1.1, 
                  fontSize: {xs: '3rem', md: '5rem'} 
                }}
              >
                Üdvözlünk <br/> A Szente Pincészetben!
              </Typography>
              <Typography 
                variant="h4" 
                sx={{ 
                  color: '#ffffff', 
                  mb: 6, 
                  fontWeight: 300, 
                  opacity: 0.9, 
                  maxWidth: '800px', 
                  fontFamily: '"Garamond", serif' // Alcím is Garamond lett
                }}
              >
                Ahol a családi hagyomány találkozik a modern borkészítéssel.
              </Typography>
              
              {/* Gombok balra igazítása (justifyContent: 'flex-start') */}
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-start', flexWrap: 'wrap' }}>
                <Button 
                    variant="contained" 
                    size="large" 
                    onClick={() => navigate('/borrendeles')}
                    sx={{ 
                      bgcolor: '#722f37', 
                      color: '#ffffff',
                      '&:hover': { bgcolor: '#903b45' }, 
                      px: 5, py: 2, 
                      fontSize: '1.2rem',
                      borderRadius: '50px',
                      fontWeight: 'bold',
                      textTransform: 'none',
                      boxShadow: '0 4px 20px rgba(114, 47, 55, 0.5)',
                      fontFamily: '"Garamond", serif' // Gomb betűtípusa is Garamond
                    }}
                >
                    Irány a webshop
                </Button>
                <Button 
                    variant="outlined" 
                    size="large" 
                    onClick={() => navigate('/borkostolas')}
                    sx={{ 
                      color: '#ffffff',
                      borderColor: 'rgba(255,255,255,0.7)',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.15)', borderColor: '#ffffff' }, 
                      px: 5, py: 2, 
                      fontSize: '1.2rem',
                      borderRadius: '50px',
                      fontWeight: 'bold',
                      textTransform: 'none',
                      fontFamily: '"Garamond", serif' // Gomb betűtípusa is Garamond
                    }}
                >
                    Kóstoló foglalás
                </Button>
              </Box>
          </Box>
        </Container>
      </Box>

      {/* ========================================== */}
      {/* 1.5 KIEMELT AJÁNLATOK KARUSSZEL (Fehér háttérrel) */}
      {/* ========================================== */}
      <Box sx={{ bgcolor: '#ffffff', py: {xs: 8, md: 12} }}>
        <Container maxWidth="lg">
          <Fade in={visible} timeout={1000}>
              <Box sx={{ mb: 8, textAlign: 'center' }}>
                  <Typography variant="overline" sx={{ color: '#722f37', fontWeight: 'bold', fontSize: '1.1rem', letterSpacing: 2 }}>
                      Ajánlataink
                  </Typography>
                  <Typography variant="h3" sx={{ color: '#1a1a1a', fontWeight: 'bold', mb: 2, mt: 1, fontFamily: 'serif' }}>
                      {currentTitle}
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#555', fontWeight: 300, fontStyle: 'italic', maxWidth: '700px', mx: 'auto' }}>
                      {currentSubtitle}
                  </Typography>
              </Box>
          </Fade>

          <Fade in={visible} timeout={1500}>
              <Grid container spacing={4} justifyContent="center" alignItems="stretch">
                  {currentItems.length > 0 ? (
                      currentItems.map((item) => (
                          <Grid item key={item.id} xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                              <Box sx={{ width: '100%', maxWidth: '380px', height: '100%' }}>
                                  {activeTab === 2 ? (
                                      <FeaturedTastingCard csomag={item} />
                                  ) : (
                                      <FeaturedWineCard bor={item} />
                                  )}
                              </Box>
                          </Grid>
                      ))
                  ) : (
                      <Typography sx={{ mt: 4, color: '#999', width: '100%', textAlign: 'center' }}>
                          Adatok betöltése...
                      </Typography>
                  )}
              </Grid>
          </Fade>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, gap: 1.5 }}>
              {[0, 1, 2].map((index) => (
                  <Box 
                      key={index}
                      onClick={() => { 
                          if (activeTab !== index) {
                              setVisible(false); 
                              setTimeout(() => { setActiveTab(index); setVisible(true); }, 200);
                          }
                      }} 
                      sx={{ 
                          width: 14, 
                          height: 14, 
                          borderRadius: '50%', 
                          bgcolor: activeTab === index ? '#722f37' : '#e0e0e0', 
                          transition: '0.3s',
                          cursor: 'pointer',
                          '&:hover': { bgcolor: '#722f37' }
                      }} 
                  />
              ))}
          </Box>
        </Container>
      </Box>

      {/* ========================================== */}
      {/* 2. MIÉRT VÁLASSZ MINKET? */}
      {/* ========================================== */}
      <Box sx={{ bgcolor: '#fbfbfb', py: 8, borderTop: '1px solid #efefef', borderBottom: '1px solid #efefef' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center">
            {features.map((feat, index) => (
              <Grid item xs={12} sm={4} md={4} key={index}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    textAlign: 'center', 
                    p: 3, 
                    height: '100%',
                    bgcolor: 'transparent',
                    transition: 'transform 0.3s',
                    '&:hover': { transform: 'translateY(-5px)' }
                  }}
                >
                  <Box sx={{ color: '#722f37', mb: 2, display: 'flex', justifyContent: 'center' }}>
                    {feat.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: '#333', fontFamily: 'serif' }}>
                    {feat.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666', lineHeight: 1.6 }}>
                    {feat.desc}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ========================================== */}
      {/* 3. RÓLUNK SZEKCIÓ */}
      {/* ========================================== */}
      <Box sx={{ bgcolor: '#ffffff', py: 10 }}>
        <Container maxWidth="lg">
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box 
                component="img"
                src="/images/pince3.jpg"
                alt="Pince hangulat"
                sx={{ 
                  width: '100%', 
                  borderRadius: 4, 
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'scale(1.02)' }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="overline" sx={{ color: '#722f37', fontWeight: 'bold', letterSpacing: 2 }}>
                Rólunk
              </Typography>
              <Typography variant="h3" sx={{ color: '#333', fontWeight: 'bold', mb: 3, mt: 1, fontFamily: 'serif' }}>
                Hagyomány és Szenvedély
              </Typography>
              <Typography paragraph sx={{ fontSize: '1.1rem', color: '#555', lineHeight: 1.8, mb: 4 }}>
                Pincészetünk a Balaton-felvidék szívében, vulkanikus tanúhegyek ölelésében található. 
                Hiszünk abban, hogy a bor nem csupán ital, hanem a táj és az ember közös alkotása. Célunk, hogy minden palackban átadjuk ezt a páratlan természeti örökséget.
              </Typography>
              <Button 
                variant="outlined" 
                onClick={() => navigate('/about')}
                sx={{ 
                  color: '#722f37', borderColor: '#722f37', borderRadius: '30px', px: 4, py: 1.2, fontWeight: 'bold', textTransform: 'none', fontSize: '1rem',
                  '&:hover': { bgcolor: '#722f37', color: 'white', borderColor: '#722f37' }
                }}
              >
                Ismerj meg minket
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}