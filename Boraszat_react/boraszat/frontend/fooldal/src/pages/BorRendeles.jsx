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
        
        {/* FEJLÉC (Ez marad ugyanaz) */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="overline" sx={{ color: '#722f37', fontWeight: 'bold', fontSize: '1rem', letterSpacing: 2 }}>
            Kínálatunk
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#333', mb: 2, mt: 1 }}>
            Borválogatásunk
          </Typography>
          <Divider sx={{ width: '580px', mx: 'auto', borderBottomWidth: 3, borderColor: '#722f37', opacity: 0.8 }} />
        </Box>

        {/* JAVÍTOTT RÉSZ: Kivettük a Grid-et, és egy középre rendező Box-ba raktuk */}
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <div className="wine-grid">
            {borok.map((bor) => (
              <WineCard key={bor.id} bor={bor} kiszerelesek={kiszerelesek} />
            ))}
          </div>
        </Box>

      </Container>
    </Box>
  );
}