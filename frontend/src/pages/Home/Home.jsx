import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  // --- ÁLLAPOTOK ÉS SZÖVEGEK A PÖRGŐ ANIMÁCIÓHOZ ---
  const [wordIndex, setWordIndex] = useState(0);
  
  const offerings = [
    { title: "Online rendelés lehetősége" },
    { title: "Borkóstolás élményének átadása" },
    { title: "Több generációs tapasztalat és szenvedély" }, 
    { title: "Prémium minőség saját birtokról, gondos odafigyeléssel." } 
  ];

  // --- GYORSÍTOTT IDŐZÍTŐ A HULLÁM ANIMÁCIÓHOZ ---
  useEffect(() => {
    const wordInterval = setInterval(() => {
      setWordIndex(prev => (prev + 1) % offerings.length);
    }, 3200); 
    return () => clearInterval(wordInterval);
  }, [offerings.length]);

  return (
    <Box> 
      {/* 🌊 HULLÁM ANIMÁCIÓ DEFINIÁLÁSA 🌊 */}
      <style>
        {`
          @keyframes waveTextAnim {
            0% {
              opacity: 0;
              transform: translateY(50px);
            }
            15% {
              opacity: 1;
              transform: translateY(0);
            }
            80% { 
              opacity: 1;
              transform: translateY(0);
            }
            100% {
              opacity: 0;
              transform: translateY(-50px);
            }
          }
        `}
      </style>

      {/* ========================================== */}
      {/* 1. HERO SZEKCIÓ (Videó) */}
      {/* ========================================== */}
      <Box 
        sx={{
          minHeight: '85vh', 
          display: 'flex', 
          alignItems: 'center',
          overflow: 'hidden', 
          position: 'relative',
          py: { xs: 10, md: 0 },
          bgcolor: '#111',
          mx: { xs: 2, md: 4, lg: 6 }, 
          mt: { xs: 2, md: 4 },        
          mb: 0,             
          borderRadius: 6,             
          boxShadow: '0 15px 40px rgba(0,0,0,0.2)' 
        }}
      >
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
          <source src="/videos/Bunyós Pityu - A Kocsma ördöge (2019 klip).mp4" type="video/mp4" />
        </video>

        <Box 
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            bgcolor: 'rgba(0, 0, 0, 0.7)', 
            zIndex: 1
          }}
        />

        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>  
          <Box sx={{ textAlign: 'left', pl: { xs: 0, md: 4, lg: 8 } }}> 
              <Typography 
                variant="h1" 
                component="h1" 
                sx={{ 
                  color: '#ffffff', 
                  fontWeight: 'bold', 
                  mb: 2, 
                  fontFamily: '"Garamond", serif', 
                  letterSpacing: 1, 
                  lineHeight: 1.05, 
                  fontSize: {xs: '3.5rem', md: '5.5rem'} 
                }}
              >
                Családi Hagyomány. <br/> Modern Borkészítés.
              </Typography>
              <Typography 
                variant="h4" 
                sx={{ 
                  color: '#ffffff', 
                  mb: 6, 
                  fontWeight: 300, 
                  opacity: 0.9, 
                  maxWidth: '800px', 
                  fontFamily: '"Garamond", serif',
                  fontSize: {xs: '1.5rem', md: '2rem'}
                }}
              >
                Fedezze fel a Balaton-felvidék vulkanikus tanúhegyeinek legszebb tételeit a Szente Pincészet kínálatában.
              </Typography>
              
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
                      fontFamily: '"Garamond", serif' 
                    }}
                >
                    Vásárlás
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
                      fontFamily: '"Garamond", serif' 
                    }}
                >
                    Foglalás
                </Button>
              </Box>
          </Box>
        </Container>
      </Box>

      {/* ========================================== */}
      {/* 2. TELJES KÉPERNYŐS, HULLÁMZÓ SZÖVEG SZEKCIÓ */}
      {/* ========================================== */}
      <Box 
        sx={{ 
          bgcolor: '#ffffff',
          minHeight: '900px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center',
          textAlign: 'center', 
          px: 2
        }}
      >
        <Container maxWidth="xl">
          <Typography 
            variant="overline" 
            component="h2" 
            sx={{ 
              color: '#666666', 
              fontWeight: 'bold', 
              letterSpacing: 4, 
              fontSize: '0.9rem',
              textTransform: 'uppercase',
              mb: 1, 
              display: 'block'
            }}
          >
            Mit kínálunk
          </Typography>
          
          <Box 
            key={wordIndex} 
            sx={{ 
              display: 'flex',
              justifyContent: 'center', 
              alignItems: 'center',
              alignContent: 'center',
              flexWrap: 'wrap', 
              width: '100%',
              maxWidth: '1500px',
              minHeight: { xs: '200px', md: '250px' } 
            }}
          >
            {offerings[wordIndex].title.split(' ').map((word, wordIdx, wordsArray) => {
              const prevCharsCount = wordsArray.slice(0, wordIdx).join(' ').length;
              const actualWordIndex = prevCharsCount > 0 ? prevCharsCount + 1 : 0; 

              return (
                <Box 
                  key={wordIdx} 
                  sx={{ 
                    display: 'inline-block', 
                    whiteSpace: 'nowrap', 
                    mr: { xs: '0.5em', md: '0.6em' }, 
                    mb: {xs: 1, md: 0} 
                  }}
                >
                  {word.split('').map((char, charIdx) => (
                    <Typography 
                      key={charIdx}
                      component="span"
                      sx={{ 
                        color: '#111111', 
                        fontFamily: '"Garamond", serif', 
                        fontWeight: 900, 
                        lineHeight: 1.1,
                        fontSize: { xs: '2.5rem', sm: '3.5rem', md: '5rem', lg: '6rem' }, 
                        
                        animation: 'waveTextAnim 2.5s cubic-bezier(0.25, 1, 0.5, 1) both',
                        animationDelay: `${(actualWordIndex + charIdx) * 0.015}s`, 
                        
                        display: 'inline-block',
                        willChange: 'transform, opacity'
                      }}
                    >
                      {char}
                    </Typography>
                  ))}
                </Box>
              );
            })}
          </Box>
        </Container>
      </Box>

      {/* ========================================== */}
      {/* 3. CÉLUNK / RÓLUNK SZEKCIÓ (Jobbra igazítva) */}
      {/* ========================================== */}
      <Box sx={{ bgcolor: '#fbfbfb', py: {xs: 12, md: 15}, borderTop: '1px solid #efefef' }}>
        <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          
          <Box sx={{ maxWidth: '800px', textAlign: 'right' }}>
            <Typography variant="overline" sx={{ color: '#722f37', fontWeight: 'bold', letterSpacing: 2 }}>
              Pincészetünkről
            </Typography>
            
            <Typography variant="h2" sx={{ color: '#333', fontWeight: 'bold', mb: 3, mt: 1, fontFamily: 'serif' }}>
              A célunk
            </Typography>
            
            <Typography paragraph sx={{ fontSize: '1.25rem', color: '#555', lineHeight: 1.8, mb: 5 }}>
              Hiszünk abban, hogy a jó borhoz idő, alázat és szenvedély kell. Célunk, hogy a Balaton-felvidék vulkanikus dűlőinek páratlan természeti örökségét minden palackban átadjuk, és egy életre szóló élményt nyújtsunk azoknak, akik megtisztelnek minket a bizalmukkal.
            </Typography>
            
            <Button 
              variant="outlined" 
              onClick={() => navigate('/about')}
              sx={{ 
                color: '#722f37', 
                borderColor: '#722f37', 
                borderRadius: '30px', 
                px: 6, 
                py: 1.5, 
                fontWeight: 'bold', 
                textTransform: 'none', 
                fontSize: '1.1rem',
                transition: 'all 0.3s',
                '&:hover': { bgcolor: '#722f37', color: 'white', borderColor: '#722f37' }
              }}
            >
              Ismerj meg minket
            </Button>
          </Box>

        </Container>
      </Box>
    </Box>
  );
}