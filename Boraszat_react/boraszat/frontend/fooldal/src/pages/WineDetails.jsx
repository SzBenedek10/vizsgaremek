import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  Container, Grid, Box, Typography, Button, Divider, 
  Rating, Avatar, CircularProgress, Select, MenuItem, FormControl, InputLabel, IconButton, Paper, Stack, InputBase
} from '@mui/material';

// --- IKONOK ---
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SendIcon from '@mui/icons-material/Send';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';

import { useCart } from '../context/CartContext';

const HUF = new Intl.NumberFormat("hu-HU");

export default function WineDetails() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();
  
  const [bor, setBor] = useState(null);
  const [kiszerelesek, setKiszerelesek] = useState([]);
  const [selectedKiszerelesId, setSelectedKiszerelesId] = useState(1);
  const [db, setDb] = useState(1);
  const [loading, setLoading] = useState(true);

  // Értékelések állapota (Adatbázisból jön!)
  const [allReviews, setAllReviews] = useState([]);
  const [newReviewText, setNewReviewText] = useState('');

  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [easterEggMusic, setEasterEggMusic] = useState(null); 

  useEffect(() => {
    // 3 lekérdezés: borok, kiszerelések ÉS az értékelések
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
      
      // Beállítjuk az adatbázisból kapott értékeléseket
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

  const getWineImage = (nev) => {
    if (!nev) return "placeholder.jpg";
    const n = nev.toLowerCase();
    if (n.includes("lesencei")) return "lacibetyar.jpg";
    if (n.includes("kéknyelvű")) return "keknyelvu.jpg";
    if (n.includes("lecsó")) return "lecsó.jpg";
    if (n.includes("olaszrizling")) return "rizling.jpg";
    if (n.includes("szürkebarát")) return "szurkebarat.jpg";
    if (n.includes("rózsakő")) return "rozsako.jpg";
    if (n.includes("rosé")) return "rose.jpg";
    if (n.includes("cabernet")) return "cabernet.jpg";
    if (n.includes("kékfrankos")) return "kekfrankos.jpg";
    if (n.includes("muskotály")) return "muskotaly.jpg";
    return "placeholder.jpg";
  };

  // ÚJ HOZZÁSZÓLÁS KÜLDÉSE (Adatbázisba, valódi névvel!)
  const handleAddReview = async () => {
    if (newReviewText.trim() === '') return;

    const storedUser = localStorage.getItem('user');
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
                ertekeles: 5,
                szoveg: newReviewText
            })
        });

        if (response.ok) {
            const newReview = {
                id: Date.now(),
                user: userData.nev, 
                text: newReviewText,
                rating: 5,
                date: "Most"
            };
            setAllReviews([newReview, ...allReviews]); 
            setNewReviewText(''); 
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
  };

  return (
    <Box sx={{ py: 8, minHeight: '80vh', bgcolor: '#fdfbfb', position: 'relative' }}>
      
      {/* EASTER EGG ZENE */}
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
        
        {/* FŐ RÁCSRENDSZER */}
        <Grid container spacing={6} alignItems="flex-start">
          
          {/* ========================================== */}
          {/* BAL OLDAL: Kép és Értékelések (md={4}) */}
          {/* ========================================== */}
          <Grid item xs={12} md={4}>
            
            {/* Kép */}
            <Box sx={{ background: 'radial-gradient(circle at center, #ffffff 30%, #f4f4f4 100%)', borderRadius: 4, p: 3, border: '1px solid rgba(0,0,0,0.03)', display: 'flex', justifyContent: 'center', width: '100%', minHeight: '450px' }}>
              <Box component="img" src={`/images/${getWineImage(bor.nev)}`} alt={bor.nev} onError={(e) => { e.currentTarget.src = "/images/placeholder.jpg"; }} sx={{ width: 'auto', maxWidth: '100%', maxHeight: '450px', objectFit: 'contain' }} />
            </Box>
            
            {/* Értékelések */}
            <Box sx={{ mt: 2, px: 1 }}>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <IconButton size="small" sx={{ color: '#333' }}><FavoriteBorderIcon /></IconButton>
                    <IconButton size="small" sx={{ color: '#333' }}><ChatBubbleOutlineIcon /></IconButton>
                </Box>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: '300px', overflowY: 'auto' }}>
                    {allReviews.length === 0 ? (
                        <Typography variant="body2" sx={{ color: '#888', fontStyle: 'italic' }}>Még nincsenek értékelések. Legyél te az első!</Typography>
                    ) : (
                        allReviews.map((review) => (
                            <Box key={review.id} sx={{ display: 'flex', gap: 1.5 }}>
                                <Avatar sx={{ width: 32, height: 32, bgcolor: '#eee', color: '#555', fontSize: '0.8rem' }}>
                                    {review.user ? review.user.charAt(0).toUpperCase() : '?'}
                                </Avatar>
                                <Box>
                                    <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                                        <span style={{ fontWeight: 'bold', marginRight: '6px' }}>{review.user}</span>
                                        {review.text}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#8e8e8e' }}>{review.date}</Typography>
                                </Box>
                            </Box>
                        ))
                    )}
                </Box>

                {/* HOZZÁSZÓLÁS MEZŐ VAGY BEJELENTKEZÉS LINK */}
                {localStorage.getItem('user') ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 3, pt: 2, borderTop: '1px solid #efefef' }}>
                        <InputBase
                            placeholder="Hozzászólás..."
                            value={newReviewText}
                            onChange={(e) => setNewReviewText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddReview()}
                            sx={{ flexGrow: 1, fontSize: '0.875rem' }}
                        />
                        <Button 
                            onClick={handleAddReview} 
                            disabled={!newReviewText.trim()}
                            sx={{ minWidth: 'auto', fontWeight: 'bold', color: '#0095f6' }}
                        >
                            Küldés
                        </Button>
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 3, pt: 2, borderTop: '1px solid #efefef' }}>
                        <Typography variant="body2" sx={{ color: '#8e8e8e', flexGrow: 1 }}>
                            A hozzászóláshoz <span style={{ color: '#0095f6', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => navigate('/login', { state: { from: location.pathname } })}>jelentkezz be</span>.
                        </Typography>
                    </Box>
                )}
            </Box>
          </Grid>

          {/* ========================================== */}
          {/* JOBB OLDAL: Cím, Jellemzők, Kosár (md={8}) */}
          {/* ========================================== */}
          <Grid item xs={12} md={8}>
            
            {/* Cím és leírás */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="overline" sx={{ color: '#722f37', fontWeight: 'bold' }}>{bor.evjarat} • {bor.fajta || "Különlegesség"}</Typography>
                <Typography variant="h3" sx={{ fontFamily: 'Playfair Display', fontWeight: 'bold', mb: 2 }}>{bor.nev}</Typography>
                <Typography paragraph sx={{ fontSize: '1.2rem', color: '#444' }}>{bor.leiras || "Nincs részletes leírás."}</Typography>
            </Box>
            
            <Divider sx={{ mb: 5 }} />

            {/* JELLEMZŐK RÉSZ (Fent a kép mellett) */}
            <Box sx={{ mb: 6 }}>
              <Typography variant="h5" sx={{ fontFamily: 'Playfair Display', fontWeight: 'bold', mb: 3, borderBottom: '2px solid #722f37', pb: 1, display: 'inline-block' }}>A bor jellemzői</Typography>
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Paper elevation={0} sx={{ p: 3, bgcolor: '#f5efef', borderRadius: 3, height: '100%' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#722f37', mb: 2 }}>Kóstolási jegyzetek</Typography>
                    <Typography variant="body1" sx={{ color: '#555' }}>
                      {bor.reszletes_leiras || "Ez a bor igazi gasztronómiai élményt nyújt. Fogyasztását 10-12°C-ra hűtve ajánljuk. Kiváló kísérője könnyed szárnyas ételeknek, halaknak."}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #ccc', pb: 1 }}>
                      <Typography variant="body1" color="text.secondary">Alkoholfok</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{bor.alkoholfok ? `${bor.alkoholfok}%` : 'N/A'}</Typography>
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
                         {bor.bor_szin_id === 1 ? 'Halak, szárnyasok' : bor.bor_szin_id === 2 ? 'Vörös húsok, sajtok' : 'Saláták, tészták'}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </Box>

            {/* KOSÁR RÉSZ (Alulra került) */}
            <Box sx={{ bgcolor: 'white', p: 4, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Kiszerelés</InputLabel>
                            <Select value={selectedKiszerelesId} label="Kiszerelés" onChange={(e) => setSelectedKiszerelesId(e.target.value)}>
                                {kiszerelesek.map((k) => <MenuItem key={k.id} value={k.id}>{k.megnevezes}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Db</InputLabel>
                            <Select value={db} label="Db" onChange={(e) => setDb(Number(e.target.value))}>
                                {[1, 2, 3, 4, 5, 6, 12].map((n) => <MenuItem key={n} value={n}>{n} db</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
                            <Box>
                                <Typography variant="caption" sx={{ color: '#888' }}>Fizetendő összeg</Typography>
                                <Typography variant="h3" sx={{ color: '#722f37', fontWeight: 'bold' }}>{HUF.format(vegsoAr)} Ft</Typography>
                            </Box>
                            <Button variant="contained" size="large" startIcon={<ShoppingCartIcon />} onClick={handleAddToCart} sx={{ bgcolor: '#722f37', color: 'white', borderRadius: '50px', px: 5, py: 2 }}>
                                Kosárba teszem
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>

          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}