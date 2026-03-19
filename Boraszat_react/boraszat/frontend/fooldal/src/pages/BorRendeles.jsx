import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import WineCard from "../components/WineCard"; 
import { useCart } from "../context/CartContext"; 

import { 
  Container, Grid, Box, Typography, Paper, 
  Divider, Button, IconButton, Stack, CircularProgress, Badge
} from "@mui/material";

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

const HUF = new Intl.NumberFormat("hu-HU");

export default function BorRendeles() {
  const [borok, setBorok] = useState([]); 
  const [kiszerelesek, setKiszerelesek] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate(); 
  const { cartItems, removeFromCart, totalAmount } = useCart();

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:5000/api/borok").then(res => {
        if (!res.ok) throw new Error("Hiba a borok lekérésekor");
        return res.json();
      }),
      fetch("http://localhost:5000/api/kiszerelesek").then(res => {
        if (!res.ok) throw new Error("Hiba a kiszerelések lekérésekor");
        return res.json();
      })
    ])
    .then(([borData, kiszerelesData]) => {
      if (Array.isArray(borData)) setBorok(borData);
      if (Array.isArray(kiszerelesData)) setKiszerelesek(kiszerelesData);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: '#fdfbfb' }}>
        <CircularProgress sx={{ color: '#722f37' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#fdfbfb', minHeight: '100vh', pb: 10 }}>
      <Container maxWidth="xl" sx={{ pt: { xs: 8, md: 10 } }}>
        
        {/* FEJLÉC */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="overline" sx={{ color: '#722f37', fontWeight: 'bold', fontSize: '1rem', letterSpacing: 2 }}>
            Kínálatunk
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#333', mb: 2, mt: 1 }}>
            Prémium Borválogatás
          </Typography>
          <Divider sx={{ width: '80px', mx: 'auto', borderBottomWidth: 3, borderColor: '#722f37', opacity: 0.8 }} />
        </Box>

        <Grid container spacing={4}>
          
          {/* BAL OLDAL: Borok listája */}
          <Grid item xs={12} md={8} lg={9}>
            {/* A TÖKÉLETES RÁCS: Balra igazít, azonos magasságra húz */}
            <Grid container spacing={3} alignItems="stretch" justifyContent="flex-start">
              {borok.map((bor) => (
                <Grid 
                  item 
                  xs={12}   // Mobilon 1 kártya
                  sm={6}    // Tableten 2 kártya
                  md={4}    // Laptopon FIX 3 kártya (12 / 4 = 3)
                  lg={4}    // Nagyképernyőn FIX 3 kártya
                  key={bor.id} 
                  sx={{ display: 'flex' }} // Kényszeríti a gyereket (WineCard) a 100% magasságra
                >
                  <WineCard bor={bor} kiszerelesek={kiszerelesek} />
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* JOBB OLDAL: Kosár (Ragadós) */}
          <Grid item xs={12} md={4} lg={3}>
            <Paper elevation={0} sx={{ 
              p: 3, borderRadius: 3, border: '1px solid rgba(114, 47, 55, 0.2)', 
              bgcolor: '#fdfaeb', position: 'sticky', top: 100 
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1.5 }}>
                <Badge badgeContent={cartItems.length} sx={{ '& .MuiBadge-badge': { bgcolor: '#722f37', color: 'white' } }}>
                  <ShoppingCartIcon sx={{ color: '#722f37', fontSize: 28 }} />
                </Badge>
                <Typography variant="h5" sx={{ color: '#333', fontWeight: 'bold' }}>Kosaram</Typography>
              </Box>

              {cartItems.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 5, color: '#888' }}>
                  <LocalOfferIcon sx={{ fontSize: 40, opacity: 0.2, mb: 1 }} />
                  <Typography variant="body1">A kosarad jelenleg üres.</Typography>
                </Box>
              ) : (
                <Stack spacing={2} sx={{ mb: 3, maxHeight: '400px', overflowY: 'auto', pr: 1 }}>
                  {cartItems.map((item, index) => (
                    <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'white', p: 1.5, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#333', lineHeight: 1.2, mb: 0.5 }}>{item.nev}</Typography>
                        <Typography variant="caption" sx={{ color: '#722f37', fontWeight: 'bold' }}>{item.amount} db x {HUF.format(item.ar)} Ft</Typography>
                      </Box>
                      <IconButton onClick={() => removeFromCart(item.id)} size="small" sx={{ color: '#d32f2f' }}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Stack>
              )}

              <Divider sx={{ mb: 2, borderColor: 'rgba(0,0,0,0.1)' }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 3 }}>
                <Typography variant="subtitle1" sx={{ color: '#555' }}>Összesen:</Typography>
                <Typography variant="h5" sx={{ color: '#722f37', fontWeight: 'bold' }}>{HUF.format(totalAmount)} Ft</Typography>
              </Box>

              <Button 
                fullWidth variant="contained" disabled={cartItems.length === 0}
                endIcon={<ArrowForwardIcon />} onClick={() => navigate("/Checkout")}
                sx={{ 
                  bgcolor: '#722f37', color: 'white', fontWeight: 'bold', borderRadius: 50, py: 1.5,
                  '&:hover': { bgcolor: '#5a252c' }, '&.Mui-disabled': { bgcolor: '#ccc', color: '#888' }
                }}
              >
                Tovább a Pénztárhoz
              </Button>
            </Paper>
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
}