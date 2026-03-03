import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from 'sweetalert2';

// UI Komponensek - Szóról szóra a Checkout.jsx-ből
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

// Ikonok
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonIcon from '@mui/icons-material/Person';
import EventIcon from '@mui/icons-material/Event';

const HUF = new Intl.NumberFormat("hu-HU");

export default function TastingCheckout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // A borkóstoló oldalról átadott adatok
  const cart = location.state?.cart || [];

  const [useProfileData, setUseProfileData] = useState(false);
  const [formData, setFormData] = useState({
    nev: "",
    email: "",
    tel: "",
    megjegyzes: ""
  });

  // Ellenőrzés: ha nincs bejelentkezve vagy üres a kosár, takarodjon vissza
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (cart.length === 0) {
      navigate("/borkostolas");
    }
  }, [user, cart, navigate]);

  // Profil adatok betöltése - Pontosan a Checkout.jsx logikája
  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    setUseProfileData(isChecked);
    if (isChecked && user) {
      setFormData({
        nev: user.nev || "",
        email: user.email || "",
        tel: user.telefonszam || "",
        megjegyzes: formData.megjegyzes
      });
    } else {
      setFormData({ nev: "", email: "", tel: "", megjegyzes: "" });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.ar * item.selectedLetszam), 0);

  // Beküldés
  const handleSubmit = async (e) => {
    e.preventDefault();

    const bookingData = {
      user_id: user.id,
      nev: formData.nev,
      email: formData.email,
      telefon: formData.tel,
      megjegyzes: formData.megjegyzes,
      tetelek: cart.map(item => ({
        id: item.id,
        letszam: item.selectedLetszam,
        ar: item.ar
      })),
      total: totalAmount
    };

    try {
      const response = await fetch("http://localhost:5000/api/foglalas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        Swal.fire({
          title: 'Sikeres foglalás!',
          text: 'Várjuk szeretettel!',
          icon: 'success',
          confirmButtonColor: '#722f37'
        });
        navigate("/profil");
      } else {
        throw new Error("Szerver hiba történt.");
      }
    } catch (err) {
      Swal.fire('Hiba!', 'Nem sikerült elküldeni a foglalást.', 'error');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#722f37', fontWeight: 'bold', mb: 4 }}>
        Foglalás adatai
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={4}>
          
          {/* BAL OLDAL - ADATOK */}
          <Grid item xs={12} md={7}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3, mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <PersonIcon sx={{ color: '#722f37', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Személyes adatok</Typography>
              </Box>

              <FormControlLabel
                control={<Checkbox checked={useProfileData} onChange={handleCheckboxChange} />}
                label="Profil adatok használata"
                sx={{ mb: 2 }}
              />

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField fullWidth label="Név" name="nev" value={formData.nev} onChange={handleInputChange} required variant="outlined" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Email" name="email" value={formData.email} onChange={handleInputChange} required type="email" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Telefon" name="tel" value={formData.tel} onChange={handleInputChange} required />
                </Grid>
              </Grid>
            </Paper>

            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <EventIcon sx={{ color: '#722f37', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Választott program</Typography>
              </Box>

              {cart.map((item) => (
                <Box key={item.id} sx={{ mb: 2, p: 2, border: '1px solid #eee', borderRadius: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold">{item.nev}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Létszám: {item.selectedLetszam} fő | Ár: {HUF.format(item.ar)} Ft / fő
                  </Typography>
                </Box>
              ))}

              <TextField
                fullWidth label="Megjegyzés" name="megjegyzes" multiline rows={2}
                value={formData.megjegyzes} onChange={handleInputChange} sx={{ mt: 2 }}
              />
            </Paper>
          </Grid>

          {/* JOBB OLDAL - ÖSSZEGZÉS (Checkout.jsx stílus) */}
          <Grid item xs={12} md={5}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3, position: 'sticky', top: 20 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Fizetendő</Typography>
              <Divider sx={{ mb: 3 }} />

              <Stack spacing={2} sx={{ mb: 4 }}>
                {cart.map(item => (
                  <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">{item.nev}</Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {HUF.format(item.ar * item.selectedLetszam)} Ft
                    </Typography>
                  </Box>
                ))}
              </Stack>

              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Összesen:</Typography>
                <Typography variant="h5" sx={{ color: '#722f37', fontWeight: 'bold' }}>
                  {HUF.format(totalAmount)} Ft
                </Typography>
              </Box>

              <Stack spacing={2}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  startIcon={<CheckCircleIcon />}
                  sx={{ bgcolor: '#722f37', py: 1.5, fontWeight: 'bold', borderRadius: 2 }}
                >
                  Foglalás véglegesítése
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate("/borkostolas")}
                  sx={{ color: '#555', borderColor: '#ddd' }}
                >
                  Módosítás
                </Button>
              </Stack>
            </Paper>
          </Grid>

        </Grid>
      </form>
    </Container>
  );
}