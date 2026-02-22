import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

// UI Komponensek
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  FormControlLabel,
  Checkbox,
  Divider,
  Stack
} from "@mui/material";

// Ikonok (opcionális, de szebb tőle)
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const HUF = new Intl.NumberFormat("hu-HU");

export default function Checkout() {
  const { cartItems, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // --- ÁLLAPOTOK ---
  const [billing, setBilling] = useState({
    nev: "", email: "", tel: "",
    irsz: "", varos: "", utca: "", hazszam: ""
  });

  const [shipping, setShipping] = useState({
    nev: "", irsz: "", varos: "", utca: "", hazszam: ""
  });

  const [useProfileForBilling, setUseProfileForBilling] = useState(false);
  const [shippingSameAsBilling, setShippingSameAsBilling] = useState(true);

  // VÉDELEM
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!user) {
        Swal.fire({
          title: 'Jelentkezz be!',
          text: 'A vásárláshoz be kell jelentkezned.',
          icon: 'warning',
          confirmButtonColor: '#722f37',
          confirmButtonText: 'OK'
        }).then(() => navigate('/login'));
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [user, navigate]);

  // LOGIKA
  const handleProfileCheckbox = (e) => {
    const isChecked = e.target.checked;
    setUseProfileForBilling(isChecked);

    if (isChecked && user) {
      setBilling({
        nev: user.nev || "",
        email: user.email || "",
        tel: user.telefonszam || user.tel || "",
        irsz: user.irsz || "",
        varos: user.varos || "",
        utca: user.utca || "",
        hazszam: user.hazszam || ""
      });
    } else {
      setBilling({ nev: "", email: "", tel: "", irsz: "", varos: "", utca: "", hazszam: "" });
    }
  };

  const handleBillingChange = (e) => {
    setBilling({ ...billing, [e.target.name]: e.target.value });
    if (useProfileForBilling) setUseProfileForBilling(false);
  };

  const handleShippingChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const handleOrder = async (e) => {
    e.preventDefault();
    if (!user) return;

    const finalShipping = shippingSameAsBilling ? {
      nev: billing.nev,
      irsz: billing.irsz,
      varos: billing.varos,
      utca: billing.utca,
      hazszam: billing.hazszam
    } : shipping;

    const rendelesAdat = {
      userId: user.id,
      szamlazasi: billing,
      szallitasi: finalShipping,
      tetelek: cartItems,
      vegosszeg: totalAmount
    };

    try {
      const response = await fetch("http://localhost:5000/api/rendeles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rendelesAdat)
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          title: 'Sikeres rendelés!',
          text: `Azonosító: ${data.orderId}`,
          icon: 'success',
          confirmButtonColor: '#722f37'
        }).then(() => {
          clearCart();
          navigate("/");
        });
      } else {
        Swal.fire('Hiba', data.msg, 'error');
      }
    } catch (error) {
      Swal.fire('Hiba', 'Szerver hiba', 'error');
    }
  };

  if (cartItems.length === 0) return (
    <Container maxWidth="sm" sx={{ mt: 10, textAlign: 'center' }}>
      <Paper sx={{ p: 5, borderRadius: 4 }}>
        <ShoppingBagIcon sx={{ fontSize: 60, color: '#ccc', mb: 2 }} />
        <Typography variant="h5" gutterBottom>Üres a kosarad!</Typography>
        <Button variant="contained" sx={{ mt: 2, bgcolor: '#722f37' }} onClick={() => navigate("/borrendeles")}>
          Vissza a vásárláshoz
        </Button>
      </Paper>
    </Container>
  );

  if (!user) return <Container sx={{ mt: 8, textAlign: 'center' }}><Typography>Ellenőrzés...</Typography></Container>;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <form onSubmit={handleOrder}>
        <Grid container spacing={3}>
          
          {/* BAL OLDAL: CÍMEK */}
          <Grid item xs={12} md={8}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 3, mb: 3 }}>
              
              {/* SZÁMLÁZÁSI ADATOK FEJLÉC */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ReceiptIcon sx={{ color: '#722f37', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                  Számlázási adatok
                </Typography>
              </Box>
              
              <FormControlLabel
                control={<Checkbox checked={useProfileForBilling} onChange={handleProfileCheckbox} sx={{ color: '#722f37', '&.Mui-checked': { color: '#722f37' } }} />}
                label={<Typography variant="body2" color="text.secondary">Profil adatainak betöltése</Typography>}
                sx={{ mb: 2 }}
              />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth required label="Teljes név" name="nev" value={billing.nev} onChange={handleBillingChange} variant="outlined" size="small" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth required label="Email cím" name="email" value={billing.email} onChange={handleBillingChange} variant="outlined" size="small" />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Telefonszám" name="tel" value={billing.tel} onChange={handleBillingChange} variant="outlined" size="small" />
                </Grid>
                <Grid item xs={6} sm={4}>
                  <TextField fullWidth required label="Irsz." name="irsz" value={billing.irsz} onChange={handleBillingChange} variant="outlined" size="small" />
                </Grid>
                <Grid item xs={6} sm={8}>
                  <TextField fullWidth required label="Város" name="varos" value={billing.varos} onChange={handleBillingChange} variant="outlined" size="small" />
                </Grid>
                <Grid item xs={8}>
                  <TextField fullWidth required label="Utca" name="utca" value={billing.utca} onChange={handleBillingChange} variant="outlined" size="small" />
                </Grid>
                <Grid item xs={4}>
                  <TextField fullWidth required label="Hsz." name="hazszam" value={billing.hazszam} onChange={handleBillingChange} variant="outlined" size="small" />
                </Grid>
              </Grid>
            </Paper>

            {/* SZÁLLÍTÁSI ADATOK */}
            <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocalShippingIcon sx={{ color: '#722f37', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                  Szállítási cím
                </Typography>
              </Box>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={shippingSameAsBilling}
                    onChange={(e) => setShippingSameAsBilling(e.target.checked)}
                    sx={{ color: '#722f37', '&.Mui-checked': { color: '#722f37' } }}
                  />
                }
                label={<Typography variant="body2" color="text.secondary">Megegyezik a számlázási címmel</Typography>}
                sx={{ mb: 2 }}
              />

              {!shippingSameAsBilling && (
                <Grid container spacing={2}>
                   <Grid item xs={12}>
                    <TextField fullWidth required label="Címzett neve" name="nev" value={shipping.nev} onChange={handleShippingChange} variant="outlined" size="small" />
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <TextField fullWidth required label="Irsz." name="irsz" value={shipping.irsz} onChange={handleShippingChange} variant="outlined" size="small" />
                  </Grid>
                  <Grid item xs={6} sm={8}>
                    <TextField fullWidth required label="Város" name="varos" value={shipping.varos} onChange={handleShippingChange} variant="outlined" size="small" />
                  </Grid>
                  <Grid item xs={8}>
                    <TextField fullWidth required label="Utca" name="utca" value={shipping.utca} onChange={handleShippingChange} variant="outlined" size="small" />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField fullWidth required label="Hsz." name="hazszam" value={shipping.hazszam} onChange={handleShippingChange} variant="outlined" size="small" />
                  </Grid>
                </Grid>
              )}
            </Paper>
          </Grid>

          {/* JOBB OLDAL: ÖSSZESÍTŐ */}
          <Grid item xs={12}> 
            <Paper elevation={2} sx={{ p: 3, borderRadius: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{color: '#722f37', fontWeight: 'bold'}}>
                Rendelés összesítése
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Stack spacing={2} sx={{ mb: 2 }}>
                {cartItems.map((item) => (
                  <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                    <span style={{color: '#555'}}>{item.nev} <small>x{item.amount}</small></span>
                    <span style={{fontWeight: 'bold'}}>{HUF.format(item.ar * item.amount)} Ft</span>
                  </Box>
                ))}
              </Stack>
              
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">Végösszeg:</Typography>
                <Typography variant="h6" sx={{ color: '#722f37', fontWeight: 'bold' }}>
                  {HUF.format(totalAmount)} Ft
                </Typography>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                startIcon={<CheckCircleIcon />}
                sx={{
                  bgcolor: '#722f37',
                  '&:hover': { bgcolor: '#5a252c' },
                  py: 1.5,
                  mb: 2,
                  fontWeight: 'bold',
                  borderRadius: 2
                }}
              >
                Megrendelés elküldése
              </Button>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate("/borrendeles")}
                sx={{ color: '#555', borderColor: '#ddd', borderRadius: 2 }}
              >
                Vissza a vásárláshoz
              </Button>
            </Paper>
          </Grid>

        </Grid>
      </form>
    </Container>
  );
}