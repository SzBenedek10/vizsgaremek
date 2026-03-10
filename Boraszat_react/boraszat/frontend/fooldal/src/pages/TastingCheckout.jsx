import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from 'sweetalert2';

// MUI Komponensek
import {
  Container, Paper, Typography, TextField, Button, Grid,
  Box, Divider, Stack, FormControlLabel, Checkbox
} from "@mui/material";

// Ikonok
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CommentIcon from '@mui/icons-material/Comment';

const HUF = new Intl.NumberFormat("hu-HU");

export default function TastingCheckout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const selectedPackage = location.state?.selectedPackage;

  const [sameAsProfile, setSameAsProfile] = useState(true);
  const [formData, setFormData] = useState({
    nev: "",
    email: "",
    tel: "",
    megjegyzes: ""
  });

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (!selectedPackage) { navigate("/borkostolas"); return; }

    if (sameAsProfile) {
      setFormData(prev => ({
        ...prev,
        nev: user.nev || "",
        email: user.email || "",
        tel: user.telefonszam || ""
      }));
    }
  }, [user, selectedPackage, navigate, sameAsProfile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- CSAK A DÁTUM MEGJELENÍTÉSE (ÓRA NÉLKÜL) ---
  const getOnlyDate = () => {
    const rawDate = selectedPackage?.idopont || selectedPackage?.datum;
    if (!rawDate) return "Nincs megadva";
    
    const d = new Date(rawDate);
    const ev = d.getFullYear();
    const honapok = [
      "január", "február", "március", "április", "május", "június",
      "július", "augusztus", "szeptember", "október", "november", "december"
    ];
    const honapNev = honapok[d.getMonth()];
    const nap = d.getDate();

    // Csak az évet, hónapot és napot adjuk vissza
    return `${ev}. ${honapNev} ${nap}.`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const foglalasAdatok = {
      userId: user.id,
      szolgaltatasId: selectedPackage.id,
      letszam: selectedPackage.letszam,
      datum: selectedPackage?.idopont || selectedPackage?.datum,
      idotartam: 120, 
      osszeg: selectedPackage.ar * selectedPackage.letszam,
      megjegyzes: formData.megjegyzes,
      ugyfelNev: formData.nev,
      ugyfelEmail: formData.email,
      ugyfelTel: formData.tel
    };

    try {
      const response = await fetch("http://localhost:5000/api/foglalas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(foglalasAdatok)
      });

      if (response.ok) {
        await Swal.fire("Siker!", "Foglalásod rögzítettük!", "success");
        navigate("/profil");
      } else {
        const errorData = await response.json();
        Swal.fire("Hiba", errorData.error || "Hiba történt", "error");
      }
    } catch (error) {
      Swal.fire("Hiba", "Hálózati hiba történt", "error");
    }
  };

  if (!selectedPackage || !user) return null;

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={7}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1.5 }}>
                <PersonIcon sx={{ color: '#722f37' }} />
                <Typography variant="h5" sx={{ color: '#722f37', fontWeight: 'bold' }}>Foglaló adatai</Typography>
              </Box>

              <FormControlLabel
                control={<Checkbox checked={sameAsProfile} onChange={(e) => setSameAsProfile(e.target.checked)} sx={{ color: '#722f37', '&.Mui-checked': { color: '#722f37' } }} />}
                label="Profiladatok használata"
                sx={{ mb: 3 }}
              />

              <Stack spacing={3} sx={{ mb: 5 }}>
                <TextField label="Név" name="nev" fullWidth required value={formData.nev} onChange={handleChange} disabled={sameAsProfile} />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}><TextField label="Email" name="email" fullWidth required value={formData.email} onChange={handleChange} disabled={sameAsProfile} /></Grid>
                  <Grid item xs={12} sm={6}><TextField label="Telefon" name="tel" fullWidth required value={formData.tel} onChange={handleChange} disabled={sameAsProfile} /></Grid>
                </Grid>
              </Stack>

              <Divider sx={{ mb: 4 }} />

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1.5 }}>
                <CalendarMonthIcon sx={{ color: '#722f37' }} />
                <Typography variant="h5" sx={{ color: '#722f37', fontWeight: 'bold' }}>Részletek</Typography>
              </Box>

              <Grid container spacing={2} sx={{ mb: 5 }}>
                <Grid item xs={12} sm={7}>
                  <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2, border: '1px solid #eee', height: '100%' }}>
                    <Typography variant="caption" color="text.secondary" display="block">Választott dátum</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{getOnlyDate()}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={5}>
                  <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2, border: '1px solid #eee', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccessTimeIcon sx={{ fontSize: '1rem', color: '#722f37' }} />
                      <Typography variant="caption" color="text.secondary">Program hossza</Typography>
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>2 óra</Typography>
                  </Box>
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1.5 }}>
                <CommentIcon sx={{ color: '#722f37' }} />
                <Typography variant="h5" sx={{ color: '#722f37', fontWeight: 'bold' }}>Megjegyzés</Typography>
              </Box>
              <TextField label="Van-e bármilyen egyéb kérése?" name="megjegyzes" multiline rows={3} fullWidth value={formData.megjegyzes} onChange={handleChange} />
            </Paper>
          </Grid>

          <Grid item xs={12} md={5}>
            <Paper elevation={4} sx={{ p: 4, borderRadius: 3, border: '1px solid #722f37', position: 'sticky', top: 20 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1.5 }}>
                <ReceiptIcon sx={{ color: '#722f37' }} />
                <Typography variant="h6" sx={{ color: '#722f37', fontWeight: 'bold' }}>Összegzés</Typography>
              </Box>
              <Stack spacing={2} sx={{ mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">{selectedPackage.nev}</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>Létszám:</Typography>
                  <Typography fontWeight="bold">{selectedPackage.letszam} fő</Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1 }}>
                  <Typography variant="h6">Végösszeg:</Typography>
                  <Typography variant="h5" sx={{ color: '#722f37', fontWeight: 'bold' }}>{HUF.format(selectedPackage.ar * selectedPackage.letszam)} Ft</Typography>
                </Box>
              </Stack>
              <Button type="submit" fullWidth variant="contained" startIcon={<CheckCircleIcon />} sx={{ bgcolor: '#722f37', '&:hover': { bgcolor: '#5a252c' }, py: 1.8, fontWeight: 'bold', borderRadius: 2 }}>Foglalás véglegesítése</Button>
            </Paper>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}