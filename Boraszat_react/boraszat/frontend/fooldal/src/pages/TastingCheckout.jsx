import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from 'sweetalert2';
import { Container, Paper, Typography, TextField, Button, Grid, Box, Divider, Stack, FormControlLabel, Checkbox } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const HUF = new Intl.NumberFormat("hu-HU");

export default function TastingCheckout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const cart = location.state?.cart || [];

  const [useProfileData, setUseProfileData] = useState(false);
  const [formData, setFormData] = useState({ nev: "", email: "", tel: "", megjegyzes: "" });

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (cart.length === 0) { navigate("/borkostolas"); return; }
  }, [user, cart, navigate]);

  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    setUseProfileData(isChecked);
    if (isChecked) {
      setFormData(prev => ({ ...prev, nev: user.nev || "", email: user.email || "", tel: user.telefonszam || "" }));
    } else {
      setFormData({ nev: "", email: "", tel: "", megjegyzes: formData.megjegyzes });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const promises = cart.map(item => fetch("http://localhost:5000/api/foglalas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          szolgaltatas_id: item.id,
          datum: item.datum?.split('T')[0],
          letszam: item.selectedLetszam,
          megjegyzes: formData.megjegyzes,
          vendegh_nev: formData.nev,
          vendegh_email: formData.email,
          vendegh_tel: formData.tel
        })
      }));

      const results = await Promise.all(promises);
      if (results.every(r => r.ok)) {
        Swal.fire({ icon: 'success', title: 'Sikeres foglalások!', confirmButtonColor: '#722f37' });
        navigate("/profil");
      }
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Hiba történt a mentéskor.' });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 4, mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5" fontWeight="bold">Személyes adatok</Typography>
                <FormControlLabel control={<Checkbox checked={useProfileData} onChange={handleCheckboxChange} />} label="Profil adatok" />
              </Box>
              <Stack spacing={2}>
                <TextField label="Név" fullWidth value={formData.nev} onChange={e => setFormData({...formData, nev: e.target.value})} required InputProps={{ readOnly: useProfileData }} />
                <TextField label="Email" fullWidth value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required InputProps={{ readOnly: useProfileData }} />
                <TextField label="Telefon" fullWidth value={formData.tel} onChange={e => setFormData({...formData, tel: e.target.value})} required InputProps={{ readOnly: useProfileData }} />
                <TextField label="Megjegyzés" multiline rows={3} fullWidth value={formData.megjegyzes} onChange={e => setFormData({...formData, megjegyzes: e.target.value})} />
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 4, bgcolor: '#fdfbfb' }}>
              <Typography variant="h6" gutterBottom>Összegzés ({cart.length} tétel)</Typography>
              <Divider sx={{ mb: 2 }} />
              {cart.map(item => (
                <Box key={item.id} sx={{ mb: 2 }}>
                  <Typography fontWeight="bold">{item.nev}</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">{item.selectedLetszam} fő</Typography>
                    <Typography variant="body2">{HUF.format(item.ar * item.selectedLetszam)} Ft</Typography>
                  </Box>
                </Box>
              ))}
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5" fontWeight="bold">Végösszeg:</Typography>
                <Typography variant="h5" color="#722f37" fontWeight="bold">
                  {HUF.format(cart.reduce((s, i) => s + (i.ar * i.selectedLetszam), 0))} Ft
                </Typography>
              </Box>
              <Button type="submit" fullWidth variant="contained" sx={{ bgcolor: '#722f37', mb: 2, py: 1.5 }}>Foglalás véglegesítése</Button>
              <Button fullWidth variant="outlined" onClick={() => navigate("/borkostolas")} startIcon={<ArrowBackIcon />}>Vissza</Button>
            </Paper>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}