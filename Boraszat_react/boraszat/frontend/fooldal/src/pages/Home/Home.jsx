import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Grid, Button, Fade } from '@mui/material';
import { useNavigate } from "react-router-dom";
import axios from 'axios';


import FeaturedWineCard from '../../components/FeaturedWineCard'; 
import FeaturedTastingCard from '../../components/FeaturedTastingCard'; 
import ReviewCard from '../../components/ReviewCard'; 

//import Wine3D from '../../components/Wine3D'; 

export default function Home() {
  const navigate = useNavigate();
 
  const [topBorok, setTopBorok] = useState([]);
  const [newBorok, setNewBorok] = useState([]);
  const [szolgaltatasok, setSzolgaltatasok] = useState([]); 


  const [activeTab, setActiveTab] = useState(0); 
  const [visible, setVisible] = useState(true); 

  useEffect(() => {
  
    axios.get('http://localhost:5000/api/borok/top')
      .then(res => setTopBorok(res.data.slice(0, 3)))
      .catch(err => console.error(err));

    axios.get('http://localhost:5000/api/borok/new')
      .then(res => setNewBorok(res.data.slice(0, 3)))
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

  const reviews = [
    { nev: "Kovács Péter", szoveg: "A Kéknyelvű egyszerűen fantasztikus! Gyors szállítás.", csillag: 5 },
    { nev: "Nagy Anna", szoveg: "Nagyon finom borok, igazi balatoni ízvilág.", csillag: 5 },
    { nev: "Szabó Gábor", szoveg: "Ajándékba vettem egy válogatást, nagy sikert aratott.", csillag: 4 }
  ];

  return (
    <Box>
      
      <Box 
        sx={{
         background: 'linear-gradient(135deg, #1a1a1a 0%, #2c0e0e 100%)',
          
          color: 'white',
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center',
          overflow: 'hidden', 
          position: 'relative'
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={4} alignItems="center">
            
            {/* BAL OLDAL: SZÖVEG */}
            <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'center', md: 'left' }, zIndex: 2 }}>
              <Typography variant="h2" component="h1" sx={{ fontWeight: 'bold', mb: 2, fontFamily: 'serif', letterSpacing: 1, lineHeight: 1.2 }}>
                Üdvözlünk <br/> <span>Szente Pincéjében!</span>
              </Typography>
              <Typography variant="h5" sx={{ mb: 4, fontWeight: 300, opacity: 0.9, maxWidth: '600px', mx: { xs: 'auto', md: 0 } }}>
                Ahol a családi hagyomány találkozik a modern borkészítéssel.
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                <Button 
                    variant="contained" 
                    size="large" 
                    onClick={() => navigate('/borrendeles')}
                    sx={{ 
                    bgcolor: '#722f37', 
                    '&:hover': { bgcolor: '#903b45' }, 
                    px: 4, py: 1.5, 
                    fontSize: '1.1rem',
                    borderRadius: '50px',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    boxShadow: '0 4px 15px rgba(114, 47, 55, 0.4)'
                    }}
                >
                    Irány a webshop
                </Button>
                <Button 
                    variant="contained" 
                    size="large" 
                    onClick={() => navigate('/borkostolas')}
                    sx={{ 
                   bgcolor: '#722f37', 
                    '&:hover': { bgcolor: '#903b45' }, 
                    px: 4, py: 1.5, 
                    fontSize: '1.1rem',
                    borderRadius: '50px',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    boxShadow: '0 4px 15px rgba(114, 47, 55, 0.4)'
                    }}
                >
                    Kóstoló foglalás
                </Button>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6} sx={{ height: { xs: '400px', md: '600px' }, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
               
            </Grid>

          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 10, minHeight: '650px' }}>
        
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
            <Grid container spacing={3} justifyContent="center" alignItems="stretch">
                {currentItems.length > 0 ? (
                    currentItems.map((item) => (
                        <Grid item key={item.id} xs={12} md={4} sx={{ display: 'flex' }}>
                            <Box sx={{ width: '100%' }}>
                                {activeTab === 2 ? (
                                    <FeaturedTastingCard csomag={item} />
                                ) : (
                                    <FeaturedWineCard bor={item} />
                                )}
                            </Box>
                        </Grid>
                    ))
                ) : (
                    <Typography sx={{ mt: 4, color: '#aaa', width: '100%', textAlign: 'center' }}>
                        Adatok betöltése...
                    </Typography>
                )}
            </Grid>
        </Fade>

        {/* Pöttyök */}
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
                        width: 12, 
                        height: 12, 
                        borderRadius: '50%', 
                        bgcolor: activeTab === index ? '#722f37' : '#e0e0e0', 
                        transition: '0.5s',
                        cursor: 'pointer',
                        '&:hover': { bgcolor: '#903b45' }
                    }} 
                />
            ))}
        </Box>
      </Container>

      {/* 3. BEMUTATKOZÁS */}
      <Box sx={{ bgcolor: '#fdfbfb', py: 10 }}>
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
              <Typography variant="h4" sx={{ color: '#333', fontWeight: 'bold', mb: 3, mt: 1, fontFamily: 'serif' }}>
                Hagyomány és Szenvedély
              </Typography>
              <Typography paragraph sx={{ fontSize: '1.1rem', color: '#555', lineHeight: 1.8, mb: 3 }}>
                Pincészetünk a Balaton-felvidék szívében, vulkanikus tanúhegyek ölelésében található. 
                Hiszünk abban, hogy a bor nem csupán ital, hanem a táj és az ember közös alkotása.
              </Typography>
              <Button 
                variant="outlined" 
                onClick={() => navigate('/bortura')}
                sx={{ 
                  color: '#722f37', borderColor: '#722f37', borderRadius: '30px', px: 4, py: 1, fontWeight: 'bold', textTransform: 'none',
                  '&:hover': { bgcolor: '#722f37', color: 'white', borderColor: '#722f37' }
                }}
              >
                Ismerj meg minket
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 4. VÉLEMÉNYEK */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Typography variant="h4" align="center" sx={{ color: '#722f37', fontWeight: 'bold', mb: 6, fontFamily: 'serif' }}>
          Akik már minket választottak
        </Typography>
        <Grid container spacing={4}>
          {reviews.map((review, index) => (
            <Grid item xs={12} md={4} key={index}>
              <ReviewCard {...review} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}CDATASection