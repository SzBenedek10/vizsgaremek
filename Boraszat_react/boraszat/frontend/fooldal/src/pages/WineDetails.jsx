import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  Container, Grid, Box, Typography, Button, Divider, 
  Avatar, CircularProgress, Select, MenuItem, FormControl, InputLabel, IconButton, Stack, InputBase
} from '@mui/material';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import LiquorIcon from '@mui/icons-material/Liquor';

import { useCart } from '../context/CartContext';

const HUF = new Intl.NumberFormat("hu-HU");

export default function WineDetails() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart, setIsCartOpen } = useCart();
  
  const [bor, setBor] = useState(null);
  const [kiszerelesek, setKiszerelesek] = useState([]);
  const [selectedKiszerelesId, setSelectedKiszerelesId] = useState(1);
  const [db, setDb] = useState(1);
  const [loading, setLoading] = useState(true);

  // Értékelések állapota
  const [allReviews, setAllReviews] = useState([]);
  const [newReviewText, setNewReviewText] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);

  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [easterEggMusic, setEasterEggMusic] = useState(null); 

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:5000/api/borok").then(res => res.json()),
      fetch("http://localhost:5000/api/kiszerelesek").then(res => res.json()),
      fetch(`http://localhost:5000/api/borok/${id}/ertekelesek`)
        .then(res => res.ok ? res.json() : []) 
        .catch(() => [])
    ])
    .then(([borData, kiszerelesData, ertekelesData]) => {
      const kivalasztott = borData.find(b => b.id === parseInt(id));
      setBor(kivalasztott);
      setKiszerelesek(kiszerelesData);
      
      if (Array.isArray(ertekelesData)) {
          setAllReviews(ertekelesData);
      }
      
      if (kivalasztott) {
        if (kivalasztott.kiszereles_id) {
          setSelectedKiszerelesId(kivalasztott.kiszereles_id);
        }

        const nevLower = kivalasztott.nev.toLowerCase();
        
        if (nevLower.includes("lecsó")) {
          setEasterEggMusic("/lecso.mp3");
        } 
        else if (nevLower.includes("lesencei")) {
          setEasterEggMusic("/lacibetyar.mp3"); 
        } 
        else {
          setEasterEggMusic(null); 
        }
      }
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    if (easterEggMusic && audioRef.current) {
      audioRef.current.volume = 0.3; 
      audioRef.current.play().then(() => setIsPlaying(true)).catch(err => console.log(err));
    }
  }, [easterEggMusic]);

  const toggleMusic = () => {
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  // Okos ételpárosítás generátor
  const getFoodPairing = (borInfo) => {
    if (!borInfo) return "";
    if (borInfo.etelparositas) return borInfo.etelparositas; 
    
    const n = borInfo.nev.toLowerCase();
    if (n.includes("kéknyelvű") || n.includes("szürkebarát")) return "Halak, szárnyasok, érlelt sajtok";
    if (n.includes("olaszrizling")) return "Könnyed sültek, magyaros ételek";
    if (n.includes("rosé") || n.includes("rózsakő")) return "Saláták, tészták, nyári esték";
    if (n.includes("cabernet") || n.includes("kékfrankos")) return "Vörös húsok, pörköltek, vadhúsok";
    if (n.includes("muskotály")) return "Desszertek, gyümölcsök, kéksajtok";
    return "Sültek, sajtok, könnyed ételek";
  };

  // Okos kóstolási jegyzet generátor
  const getTastingNotes = (borInfo) => {
    if (!borInfo) return "";
    if (borInfo.reszletes_leiras) return borInfo.reszletes_leiras; 
    
    const n = borInfo.nev.toLowerCase();
    if (n.includes("kéknyelvű")) return "Jellegzetes, testes fehérbor, finom ásványossággal és elegáns savakkal. 10-12°C-on az igazi.";
    if (n.includes("olaszrizling")) return "Kellemes mandulás kesernyével a lecsengésben, frissítő, mindennapi bor. 10°C-ra hűtve ajánljuk.";
    if (n.includes("szürkebarát")) return "Testes, tüzes bor, gazdag ízvilággal és lágy savakkal. 11-13°C-on mutatja meg igazi arcát.";
    if (n.includes("rosé")) return "Ropogós, epres-málnás jegyekkel rendelkező, üde bor. 8-10°C-ra behűtve a legjobb választás.";
    if (n.includes("cabernet") || n.includes("kékfrankos")) return "Bogyós gyümölcsök, fűszeres jegyek és bársonyos tanninok jellemzik. 16-18°C-on fogyasztva tökéletes.";
    if (n.includes("muskotály")) return "Intenzív, parfümös, szőlővirágra emlékeztető illatú, édeskés harmóniájú bor. 10-12°C-ra hűtve kiváló.";
    return "Kiváló kísérője a mindennapi étkezéseknek és az ünnepi pillanatoknak is. Fogyasztását enyhén hűtve ajánljuk.";
  };

  // ÚJ: Okos alkoholfok generátor
  const getAlcoholContent = (borInfo) => {
    if (!borInfo) return "N/A";
    if (borInfo.alkoholfok) return `${borInfo.alkoholfok}%`; 
    
    const n = borInfo.nev.toLowerCase();
    if (n.includes("cabernet")) return "14.0%";
    if (n.includes("szürkebarát") || n.includes("kékfrankos")) return "13.5%";
    if (n.includes("kéknyelvű")) return "13.0%";
    if (n.includes("olaszrizling")) return "12.5%";
    if (n.includes("rosé") || n.includes("rózsakő")) return "12.0%";
    if (n.includes("muskotály")) return "11.5%";
    return "12.5%"; 
  };

  const handleAddReview = async () => {
    if (newReviewText.trim() === '') return;

    const storedUser = sessionStorage.getItem('user');
    if (!storedUser) {
        alert("Kérjük, jelentkezz be a hozzászóláshoz!");
        return;
    }

    const userData = JSON.parse(storedUser);
    
    try {
        const response = await fetch('http://localhost:5000/api/ertekelesek', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                bor_id: id,
                user_id: userData.id, 
                ertekeles: newRating, 
                szoveg: newReviewText
            })
        });

        if (response.ok) {
            const newReview = {
                id: Date.now(),
                user: userData.nev, 
                text: newReviewText,
                rating: newRating, 
                date: "Most"
            };
            setAllReviews([newReview, ...allReviews]); 
            setNewReviewText(''); 
            setNewRating(5); 
        } else {
            const errorData = await response.json();
            alert(errorData.error || "Hiba történt a hozzászólás küldésekor.");
        }
    } catch (error) {
        console.error("Hálózati hiba:", error);
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  if (!bor) return <Container sx={{ mt: 10 }}><Typography>A keresett bor nem található.</Typography></Container>;

  const aktualisKiszereles = kiszerelesek.find(k => k.id === selectedKiszerelesId) || { id: 1, megnevezes: '0.75L Palack', szorzo: 1 };
  const vegsoAr = Math.round(bor.ar * aktualisKiszereles.szorzo);

  const handleAddToCart = () => {
    const tetel = {
        ...bor,
        id: bor.id,
        ar: vegsoAr,
        kiszereles_nev: aktualisKiszereles.megnevezes,
        kiszereles_id: selectedKiszerelesId
    };
    addToCart(tetel, db);

    setIsCartOpen(true);
  };

  return (
    <Box sx={{ py: 8, minHeight: '80vh', bgcolor: '#fdfbfb', position: 'relative' }}>
      
      {easterEggMusic && (
        <Box sx={{ position: 'fixed', bottom: 30, right: 30, zIndex: 9999 }}>
          <audio ref={audioRef} src={easterEggMusic} loop />
          <IconButton onClick={toggleMusic} sx={{ bgcolor: '#722f37', color: 'white', width: 56, height: 56, '&:hover': { bgcolor: '#5a252c' } }}>
            {isPlaying ? <VolumeUpIcon fontSize="large" /> : <VolumeOffIcon fontSize="large" />}
          </IconButton>
        </Box>
      )}

      <Container maxWidth="lg">
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/borrendeles')} sx={{ mb: 4, color: '#722f37' }}>
          Vissza a borokhoz
        </Button>
        
        {/* ========================================== */}
        {/* 1. CÍM RÉSZ */}
        {/* ========================================== */}
        <Box sx={{ mb: 2, textAlign: 'center' }}>
            <Typography variant="overline" sx={{ color: '#722f37', fontWeight: 'bold', fontSize: '1.2rem' }}>
              {bor.evjarat} • {bor.fajta || "Különlegesség"}
            </Typography>
            <Typography variant="h2" sx={{ fontFamily: 'Playfair Display', fontWeight: 'bold', mb: 2, color: '#333' }}>
              {bor.nev}
            </Typography>
            <Typography paragraph sx={{ fontSize: '1.1rem', color: '#666', maxWidth: '800px', mx: 'auto' }}>
              {bor.leiras || "Nincs részletes leírás."}
            </Typography>
        </Box>

        <Divider sx={{ my: 4, borderColor: '#ddd' }} />

        {/* ========================================== */}
        {/* 2. KÉP ÉS JELLEMZŐK */}
        {/* ========================================== */}
        <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            gap: { xs: 4, md: 6 }, 
            alignItems: 'center',
            mb: 5 
        }}>
          
          <Box sx={{ flex: '1 1 0', width: '100%', display: 'flex', justifyContent: 'center' }}>
              {/* ITT TÖRTÉNT A VÁLTOZÁS: */}
              <Box 
                component="img" 
                src={bor.kep ? `http://localhost:5000${bor.kep}` : "/images/placeholder.jpg"}
                alt={bor.nev} 
                onError={(e) => { e.currentTarget.src = "/images/placeholder.jpg"; }} 
                sx={{ width: 'auto', maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }} 
              />
          </Box>

          <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' }, borderColor: '#ddd', borderWidth: '1px' }} />

          <Box sx={{ flex: '1 1 0', width: '100%' }}>
             <Typography variant="h5" sx={{ fontFamily: 'Playfair Display', fontWeight: 'bold', mb: 3, color: '#722f37', textAlign: { xs: 'center', md: 'left' } }}>
                A bor jellemzői
             </Typography>
             
             <Stack spacing={2.5}>
                {/* ITT HASZNÁLJUK AZ ALKOHOLFOK GENERÁTORT */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #ccc', pb: 1 }}>
                    <Typography variant="body1" color="text.secondary">Alkoholfok</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{getAlcoholContent(bor)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #ccc', pb: 1 }}>
                    <Typography variant="body1" color="text.secondary">Évjárat</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{bor.evjarat}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #ccc', pb: 1 }}>
                    <Typography variant="body1" color="text.secondary">Készleten</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: bor.keszlet > 10 ? 'success.main' : 'error.main' }}>{bor.keszlet} db</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #ccc', pb: 1 }}>
                    <Typography variant="body1" color="text.secondary">Ajánlott ételpárosítás</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', textAlign: 'right' }}>
                        {getFoodPairing(bor)} 
                    </Typography>
                </Box>
                
                <Box sx={{ mt: 2, p: 2.5, bgcolor: '#fdfaeb', borderRadius: 2, borderLeft: '4px solid #722f37' }}>
                    <Typography variant="body2" sx={{ color: '#555', fontStyle: 'italic', lineHeight: 1.6 }}>
                        "{getTastingNotes(bor)}" 
                    </Typography>
                </Box>
             </Stack>
          </Box>
        </Box>

        <Divider sx={{ my: 5, borderColor: '#ddd' }} />

        {/* ========================================== */}
        {/* 3. VÁSÁRLÁSI OPCIÓ */}
        {/* ========================================== */}
        <Box sx={{ 
            maxWidth: '900px', 
            mx: 'auto',        
            bgcolor: 'white', 
            px: { xs: 2, md: 4 }, 
            py: 3.5, 
            borderRadius: 4, 
            boxShadow: '0 10px 30px rgba(114, 47, 55, 0.1)', 
            border: '2px solid #722f37', 
            mb: 6 
        }}>
            <Grid container spacing={3} alignItems="center" justifyContent="center">
                <Grid item xs={12} sm={4} md={3}>
                    <FormControl fullWidth size="medium">
                        <InputLabel>Kiszerelés</InputLabel>
                        <Select value={selectedKiszerelesId} label="Kiszerelés" onChange={(e) => setSelectedKiszerelesId(e.target.value)}>
                            {kiszerelesek.map((k) => <MenuItem key={k.id} value={k.id}>{k.megnevezes}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={4} md={2}>
                    <FormControl fullWidth size="medium">
                        <InputLabel>Darabszám</InputLabel>
                        <Select value={db} label="Darabszám" onChange={(e) => setDb(Number(e.target.value))}>
                            {[1, 2, 3, 4, 5, 6, 12].map((n) => <MenuItem key={n} value={n}>{n} db</MenuItem>)}
                        </Select>
                    </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={4} md={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, height: '100%' }}>
                        <Typography variant="body1" sx={{ color: '#888', textTransform: 'uppercase', letterSpacing: 1 }}>Fizetendő:</Typography>
                        <Typography variant="h4" sx={{ color: '#722f37', fontWeight: 'bold', lineHeight: 1 }}>{HUF.format(vegsoAr)} Ft</Typography>
                    </Box>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Button 
                        fullWidth
                        variant="contained" 
                        onClick={handleAddToCart} 
                        sx={{ 
                            bgcolor: '#722f37', 
                            color: 'white', 
                            borderRadius: '8px', 
                            py: 1.2, 
                            fontSize: '1rem', 
                            fontWeight: 'bold',
                            boxShadow: 'none', 
                            '&:hover': { bgcolor: '#5a252c', boxShadow: '0 4px 8px rgba(114, 47, 55, 0.2)' }, 
                            transition: 'all 0.2s' 
                        }}
                    >
                        Kosárba
                    </Button>
                </Grid>
            </Grid>
        </Box>

        {/* ========================================== */}
        {/* 4. ÉRTÉKELÉSEK ÉS KOMMENTEK */}
        {/* ========================================== */}
        <Box sx={{ maxWidth: '800px', mx: 'auto', mt: 4, bgcolor: 'transparent', p: { xs: 2, md: 4 } }}>
            <Typography variant="h4" sx={{ fontFamily: 'Playfair Display', fontWeight: 'bold', mb: 3, textAlign: 'center', color: '#333' }}>Értékelések</Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxHeight: '400px', overflowY: 'auto', pr: 2 }}>
                {allReviews.length === 0 ? (
                    <Typography variant="body1" sx={{ color: '#888', fontStyle: 'italic', textAlign: 'center', py: 4 }}>
                        Még nincsenek értékelések. Legyél te az első!
                    </Typography>
                ) : (
                    allReviews.map((review) => (
                        <Box key={review.id} sx={{ display: 'flex', gap: 2 }}>
                            <Avatar sx={{ width: 40, height: 40, bgcolor: '#722f37', color: 'white', fontWeight: 'bold' }}>
                                {review.user ? review.user.charAt(0).toUpperCase() : '?'}
                            </Avatar>
                            <Box sx={{ bgcolor: 'white', p: 2, borderRadius: 2, flexGrow: 1, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{review.user}</Typography>
                                    <Typography variant="caption" sx={{ color: '#8e8e8e' }}>{review.date}</Typography>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    {[...Array(5)].map((_, index) => (
                                        <LiquorIcon 
                                            key={index}
                                            sx={{ 
                                                color: index < (review.rating || review.ertekeles || 5) ? '#722f37' : '#e0e0e0', 
                                                fontSize: '1rem',
                                                mr: 0.3
                                            }}
                                        />
                                    ))}
                                </Box>

                                <Typography variant="body1" sx={{ color: '#444', lineHeight: 1.5 }}>
                                    {review.text}
                                </Typography>
                            </Box>
                        </Box>
                    ))
                )}
            </Box>

            
            {sessionStorage.getItem('user') ? (
                <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #efefef' }}>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, ml: 1 }}>
                        <Typography variant="body2" sx={{ mr: 2, fontWeight: 'bold', color: '#555' }}>
                            Értékeld a bort:
                        </Typography>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <IconButton 
                                key={star} 
                                size="small" 
                                onClick={() => setNewRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                sx={{ p: 0.5 }}
                            >
                                <LiquorIcon 
                                    sx={{ 
                                        color: star <= (hoverRating || newRating) ? '#722f37' : '#e0e0e0',
                                        fontSize: '1.8rem',
                                        transition: 'all 0.2s ease',
                                        transform: star <= (hoverRating || newRating) ? 'scale(1.15)' : 'scale(1)'
                                    }} 
                                />
                            </IconButton>
                        ))}
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <InputBase
                            placeholder="Írd meg a véleményed..."
                            value={newReviewText}
                            onChange={(e) => setNewReviewText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddReview()}
                            sx={{ flexGrow: 1, fontSize: '1rem', bgcolor: 'white', px: 2, py: 1.5, borderRadius: 8, mr: 2, boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)' }}
                        />
                        <Button 
                            variant="contained"
                            onClick={handleAddReview} 
                            disabled={!newReviewText.trim()}
                            sx={{ bgcolor: '#722f37', color: 'white', borderRadius: '50px', px: 4, py: 1.5, '&:hover': { bgcolor: '#5a252c' } }}
                        >
                            Küldés
                        </Button>
                    </Box>
                </Box>
            ) : (
                <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #efefef', textAlign: 'center' }}>
                    <Typography variant="body1" sx={{ color: '#666' }}>
                        A hozzászóláshoz kérjük, <Button variant="text" sx={{ color: '#722f37', fontWeight: 'bold', fontSize: '1rem', textDecoration: 'underline' }} onClick={() => navigate('/login', { state: { from: location.pathname } })}>jelentkezz be</Button>.
                    </Typography>
                </Box>
            )}
        </Box>

      </Container>
    </Box>
  );
}