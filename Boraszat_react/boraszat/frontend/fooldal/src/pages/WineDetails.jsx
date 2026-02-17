import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, Grid, Box, Typography, Button, Divider, 
  Rating, Avatar, CircularProgress, Select, MenuItem, FormControl, InputLabel, IconButton 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
// INSTAGRAM STÍLUSÚ IKONOK
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SendIcon from '@mui/icons-material/Send';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

import { useCart } from '../context/CartContext';

const HUF = new Intl.NumberFormat("hu-HU");

export default function WineDetails() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [bor, setBor] = useState(null);
  const [kiszerelesek, setKiszerelesek] = useState([]);
  const [selectedKiszerelesId, setSelectedKiszerelesId] = useState(1);
  const [db, setDb] = useState(1);
  const [loading, setLoading] = useState(true);

  // --- ADATLEKÉRÉS ---
  useEffect(() => {
    Promise.all([
      fetch("http://localhost:5000/api/borok").then(res => res.json()),
      fetch("http://localhost:5000/api/kiszerelesek").then(res => res.json())
    ])
    .then(([borData, kiszerelesData]) => {
      const kivalasztott = borData.find(b => b.id === parseInt(id));
      setBor(kivalasztott);
      setKiszerelesek(kiszerelesData);
      
      if (kivalasztott && kivalasztott.kiszereles_id) {
        setSelectedKiszerelesId(kivalasztott.kiszereles_id);
      }
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [id]);

  // --- KÉP KEZELŐ ---
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

  // --- KAMU VÉLEMÉNYEK (INSTA KOMMENTEK) ---
  const reviews = [
    { id: 1, user: "kovacs_peter", text: "Ez valami elképesztő! 😍 A legjobb vörösbor amit idén ittam.", rating: 5, date: "2 napja" },
    { id: 2, user: "anna.wine", text: "Kicsit testesebb, mint amire számítottam, de nagyon finom az utóíze.", rating: 4, date: "5 napja" },
    { id: 3, user: "gasztro_gabor", text: "Ajándékba vettem, nagy sikert aratott. 🍷", rating: 5, date: "1 hete" }
  ];

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  if (!bor) return <Container sx={{ mt: 10 }}><Typography>A keresett bor nem található.</Typography></Container>;

  // --- SZÁMÍTÁSOK ---
  const aktualisKiszereles = kiszerelesek.find(k => k.id === selectedKiszerelesId) 
                              || { id: 1, megnevezes: '0.75L Palack', szorzo: 1 };
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
    <Box sx={{ py: 8, minHeight: '80vh', bgcolor: '#fdfbfb' }}>
      <Container maxWidth="lg">
        
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/borrendeles')}
          sx={{ mb: 4, color: '#722f37' }}
        >
          Vissza a borokhoz
        </Button>

        {/* ALIGNITEMS: FLEX-START (Hogy a jobb oldal ne nyúljon meg feleslegesen, ha a bal hosszú) */}
        <Grid container spacing={6} alignItems="flex-start">
          
          {/* --- BAL OLDAL: INSTAGRAM STÍLUSÚ FEED --- */}
          <Grid item xs={12} md={4}>
            
            {/* 1. KÉP (A KORÁBBI SPOTLIGHT HATÁSSAL) */}
            <Box 
              sx={{ 
                background: 'radial-gradient(circle at center, #ffffff 30%, #f4f4f4 100%)',
                borderRadius: 4, 
                p: 3,
                border: '1px solid rgba(0,0,0,0.03)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                minHeight: '450px',
                position: 'relative'
              }}
            >
              <Box 
                component="img"
                src={`/images/${getWineImage(bor.nev)}`} 
                alt={bor.nev}
                onError={(e) => { e.currentTarget.src = "/images/placeholder.jpg"; }}
                sx={{ 
                  width: 'auto',
                  maxWidth: '100%', 
                  maxHeight: '450px', 
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.25))',
                  transition: 'transform 0.3s ease',
                  '&:hover': { transform: 'scale(1.02)' }
                }}
              />
            </Box>

            {/* 2. INSTAGRAM INTERAKCIÓK */}
            <Box sx={{ mt: 2, px: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton size="small" sx={{ color: '#333' }}><FavoriteBorderIcon /></IconButton>
                        <IconButton size="small" sx={{ color: '#333' }}><ChatBubbleOutlineIcon /></IconButton>
                        <IconButton size="small" sx={{ color: '#333' }}><SendIcon sx={{ transform: 'rotate(-45deg)', mb: 0.5 }} /></IconButton>
                    </Box>
                    <IconButton size="small" sx={{ color: '#333' }}><BookmarkBorderIcon /></IconButton>
                </Box>
                
                <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 2 }}>
                    124 kedvelés
                </Typography>

                {/* 3. KOMMENTEK (VÉLEMÉNYEK) */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {/* LEÍRÁS MINT "CAPTION" */}
                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: '#722f37', fontSize: '0.8rem' }}>Sz</Avatar>
                        <Box>
                            <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                                <span style={{ fontWeight: 'bold', marginRight: '6px' }}>szentepinceszet</span>
                                {bor.leiras ? bor.leiras.substring(0, 80) + "..." : "Kóstolja meg különleges borunkat!"}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#8e8e8e', mt: 0.5, display: 'block' }}>Most</Typography>
                        </Box>
                    </Box>

                    {/* FELHASZNÁLÓI KOMMENTEK */}
                    {reviews.map((review) => (
                        <Box key={review.id} sx={{ display: 'flex', gap: 1.5 }}>
                            <Avatar sx={{ width: 32, height: 32, bgcolor: '#eee', color: '#555', fontSize: '0.8rem' }}>
                                {review.user.charAt(0).toUpperCase()}
                            </Avatar>
                            <Box>
                                <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                                    <span style={{ fontWeight: 'bold', marginRight: '6px' }}>{review.user}</span>
                                    {review.text}
                                </Typography>
                                
                                {/* Dátum és Csillagok egy sorban, kicsiben */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
                                    <Typography variant="caption" sx={{ color: '#8e8e8e' }}>{review.date}</Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Rating value={review.rating} readOnly size="small" sx={{ fontSize: '0.8rem' }} />
                                    </Box>
                                    <Typography variant="caption" sx={{ color: '#8e8e8e', fontWeight: 'bold', cursor: 'pointer' }}>Válasz</Typography>
                                </Box>
                            </Box>
                        </Box>
                    ))}
                </Box>

                {/* KOMMENT ÍRÁSA MEZŐ */}
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 3, pt: 2, borderTop: '1px solid #efefef' }}>
                    <Typography variant="body2" sx={{ color: '#8e8e8e', flexGrow: 1 }}>Hozzászólás...</Typography>
                    <Typography variant="body2" sx={{ color: '#0095f6', fontWeight: 'bold', cursor: 'pointer', opacity: 0.5 }}>Küldés</Typography>
                </Box>
            </Box>
          </Grid>

          {/* --- JOBB OLDAL: TERMÉK ADATOK (TISZTA ÉS ÁTTEKINTHETŐ) --- */}
          <Grid item xs={12} md={8} sx={{ pl: { md: 6 } }}> {/* Kis extra padding balra mobilon nem */}
            
            <Typography variant="overline" sx={{ color: '#722f37', fontWeight: 'bold', letterSpacing: 1 }}>
              {bor.evjarat} • {bor.fajta || "Különlegesség"}
            </Typography>
            
            <Typography variant="h3" sx={{ fontFamily: 'Playfair Display', fontWeight: 'bold', mb: 2, color: '#2c0e0e' }}>
              {bor.nev}
            </Typography>

            <Typography paragraph sx={{ fontSize: '1.2rem', color: '#444', lineHeight: 1.8, mb: 5, maxWidth: '90%' }}>
              {bor.leiras || "Ehhez a borhoz jelenleg nincs részletes leírás feltöltve. Kérjük, érdeklődjön elérhetőségeinken."}
            </Typography>

            <Divider sx={{ mb: 4 }} />

            {/* VÁLASZTÓK ÉS ÁR */}
            <Box sx={{ bgcolor: 'white', p: 4, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Kiszerelés</InputLabel>
                            <Select
                                value={selectedKiszerelesId}
                                label="Kiszerelés"
                                onChange={(e) => setSelectedKiszerelesId(e.target.value)}
                            >
                                {kiszerelesek.map((k) => (
                                    <MenuItem key={k.id} value={k.id}>
                                        {k.megnevezes} {k.szorzo > 1 ? `(x${k.szorzo})` : ''}
                                    </MenuItem>
                                ))}
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
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2, flexWrap: 'wrap', gap: 2 }}>
                            <Box>
                                <Typography variant="caption" sx={{ color: '#888', textTransform: 'uppercase' }}>Fizetendő összeg</Typography>
                                <Typography variant="h3" sx={{ color: '#722f37', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                                    {HUF.format(vegsoAr)} Ft
                                </Typography>
                            </Box>
                            
                            <Button 
                                variant="contained" 
                                size="large" 
                                startIcon={<ShoppingCartIcon />} 
                                onClick={handleAddToCart}
                                sx={{ 
                                    bgcolor: '#722f37', 
                                    color: 'white', 
                                    py: 2, px: 5, 
                                    borderRadius: '50px', 
                                    fontSize: '1.1rem',
                                    boxShadow: '0 10px 20px rgba(114, 47, 55, 0.3)',
                                    '&:hover': { bgcolor: '#5a252c', transform: 'translateY(-2px)' },
                                    transition: 'all 0.3s'
                                }}
                            >
                                Kosárba teszem
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            {/* A jobb oldali "Vélemények" szekciót töröltem, mert átkerült balra */}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}