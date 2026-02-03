import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from 'sweetalert2';
import { Container, Paper, Typography, TextField, Button, Grid, Box, Divider, Stack } from "@mui/material";
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const HUF = new Intl.NumberFormat("hu-HU");

export default function TastingCheckout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const selectedPackage = location.state?.selectedPackage;

  const [formData, setFormData] = useState({
    nev: "", email: "", tel: "",
    datum: "", // Ezt küldjük majd az adatbázisba
    megjegyzes: ""
  });

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (!selectedPackage) { navigate("/borkostolas"); return; }

    setFormData(prev => ({
      ...prev,
      nev: user.nev || "",
      email: user.email || "",
      tel: user.telefonszam || "",
      // Ha a csomagnak van fix dátuma, azt beállítjuk alapból
      datum: selectedPackage.datum ? selectedPackage.datum.split('T')[0] : ""
    }));
  }, [user, selectedPackage, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    // Ha nincs fix dátum, kötelező választani
    if (!selectedPackage.datum && !formData.datum) {
      Swal.fire('Hiányzó adat', 'Kérlek válassz időpontot!', 'warning');
      return;
    }

    const foglalasAdat = {
      userId: user.id,
      szolgaltatasId: selectedPackage.id,
      letszam: selectedPackage.letszam,
      // FONTOS: Itt a 'datum' mezőt használjuk, hogy egyezzen a tábláddal!
      datum: selectedPackage.datum ? selectedPackage.datum.split('T')[0] : formData.datum,
      idotartam: selectedPackage.idotartam, // Ezt is elmentjük
      osszeg: selectedPackage.ar * selectedPackage.letszam,
      megjegyzes: formData.megjegyzes
    };

    try {
      const response = await fetch("http://localhost:5000/api/foglalas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(foglalasAdat)
      });

      const data = await response.json();
      if (response.ok) {
        Swal.fire('Sikeres foglalás!', `Várunk sok szeretettel!`, 'success').then(() => navigate("/"));
      } else {
        Swal.fire('Hiba', data.error || 'Hiba történt', 'error');
      }
    } catch (error) {
      Swal.fire('Hiba', 'Szerver hiba', 'error');
    }
  };

  if (!selectedPackage || !user) return null;

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: '#722f37', textAlign: 'center' }}>
        Foglalás véglegesítése
      </Typography>

      <form onSubmit={handleBooking}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={7}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <PersonIcon sx={{ color: '#722f37', mr: 1 }} />
                <Typography variant="h6">Kapcsolattartó adatai</Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12}><TextField fullWidth required label="Név" name="nev" value={formData.nev} onChange={handleChange} /></Grid>
                <Grid item xs={12} sm={6}><TextField fullWidth required label="Email" name="email" value={formData.email} onChange={handleChange} /></Grid>
                <Grid item xs={12} sm={6}><TextField fullWidth required label="Tel" name="tel" value={formData.tel} onChange={handleChange} /></Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <EventIcon sx={{ color: '#722f37', mr: 1 }} />
                <Typography variant="h6">Időpont</Typography>
              </Box>
              
              {selectedPackage.datum ? (
                 <Typography variant="body1" sx={{ color: '#722f37', fontWeight: 'bold', bgcolor: '#f0f0f0', p: 2, borderRadius: 1 }}>
                    Fix időpont: {new Date(selectedPackage.datum).toLocaleDateString('hu-HU')} ({selectedPackage.idotartam})
                 </Typography>
              ) : (
                  <TextField 
                    fullWidth required type="date" label="Dátum kiválasztása" name="datum" 
                    value={formData.datum} onChange={handleChange} InputLabelProps={{ shrink: true }}
                  />
              )}
              
              <TextField 
                fullWidth multiline rows={3} label="Megjegyzés" name="megjegyzes" 
                value={formData.megjegyzes} onChange={handleChange} sx={{ mt: 2 }} 
              />
            </Paper>
          </Grid>

          <Grid item xs={12} md={5}>
            <Paper elevation={4} sx={{ p: 4, borderRadius: 3, bgcolor: '#fdfbfb' }}>
              <Typography variant="h6" sx={{ color: '#722f37', fontWeight: 'bold', mb: 2 }}>Kiválasztott program</Typography>
              <Divider sx={{ mb: 2 }} />
              <Stack spacing={2} sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold">{selectedPackage.nev}</Typography>
                <Typography variant="body2">{selectedPackage.leiras}</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>Létszám:</Typography>
                    <Typography fontWeight="bold">{selectedPackage.letszam} fő</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>Végösszeg:</Typography>
                    <Typography fontWeight="bold" color="primary">{HUF.format(selectedPackage.ar * selectedPackage.letszam)} Ft</Typography>
                </Box>
              </Stack>
              <Button type="submit" fullWidth variant="contained" startIcon={<CheckCircleIcon />} sx={{ bgcolor: '#722f37', mb: 2 }}>
                Foglalás
              </Button>
              <Button fullWidth variant="text" startIcon={<ArrowBackIcon />} onClick={() => navigate("/borkostolas")}>
                Mégsem
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}