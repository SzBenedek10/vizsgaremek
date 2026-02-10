import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext"; 
import { useNavigate } from "react-router-dom";   
import { Container, Grid, Typography, Box, TextField, Button, Paper, Stack, Alert, Skeleton, InputAdornment } from "@mui/material";
import Swal from 'sweetalert2';

// Ikonok
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SendIcon from '@mui/icons-material/Send';
import WineBarIcon from '@mui/icons-material/WineBar';
import PersonIcon from '@mui/icons-material/Person';
import LoginIcon from '@mui/icons-material/Login';
import SubjectIcon from '@mui/icons-material/Subject'; // Új ikon
import MessageIcon from '@mui/icons-material/Message'; // Új ikon

export default function Contact() {
  const { user } = useAuth(); 
  const navigate = useNavigate();

  const [companyInfo, setCompanyInfo] = useState(null);
  
  const [formData, setFormData] = useState({
    targy: "",
    uzenet: ""
  });

  // Cégadatok betöltése
  useEffect(() => {
    fetch("http://localhost:5000/api/cegadatok")
      .then(res => res.json())
      .then(data => setCompanyInfo(data))
      .catch(err => console.error("Hiba a cégadatok betöltésekor:", err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    const payload = {
        userId: user.id,
        nev: user.nev,
        email: user.email,
        targy: formData.targy,
        uzenet: formData.uzenet
    };

    try {
      const response = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          title: 'Sikeres küldés!',
          text: 'Munkatársaink hamarosan válaszolnak.',
          icon: 'success',
          confirmButtonColor: '#722f37'
        });
        setFormData({ targy: "", uzenet: "" }); 
      } else {
        Swal.fire('Hiba', data.error || 'Hiba történt', 'error');
      }
    } catch (error) {
      Swal.fire('Hiba', 'Nem sikerült elérni a szervert.', 'error');
    }
  };

  // --- STÍLUS AZ INPUT MEZŐKHÖZ ---
  const modernInputStyle = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px', // Kerekítés
      backgroundColor: '#f8f9fa', // Halvány háttér
      transition: '0.3s',
      '& fieldset': { borderColor: '#e0e0e0' }, // Halvány keret alapból
      '&:hover fieldset': { borderColor: '#722f37' }, // Hoverre színváltás
      '&.Mui-focused fieldset': { borderColor: '#722f37', borderWidth: '2px' }, // Fókuszban vastagabb keret
      '&:hover': { backgroundColor: '#fff' } // Hoverre kifehéredik
    },
    '& .MuiInputLabel-root': { color: '#777' }, // Címke színe
    '& .MuiInputLabel-root.Mui-focused': { color: '#722f37', fontWeight: 'bold' } // Fókuszált címke
  };

  return (
    <Box sx={{ bgcolor: '#fdfbfb', minHeight: '100vh', py: 8 }}>
      <Container maxWidth="xl">
        
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#722f37', fontFamily: 'serif', mb: 2 }}>
            Lépj velünk kapcsolatba
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto', fontSize: '1.1rem' }}>
            Keress minket bizalommal kérdéseiddel kapcsolatban!
          </Typography>
        </Box>

        <Grid container spacing={4} alignItems="stretch" justifyContent="center">
          
          {/* --- BAL OLDAL --- */}
          <Grid item xs={12} md={6} lg={5}>
            <Paper 
              elevation={4} 
              sx={{ 
                p: 5, borderRadius: 4, height: '100%', 
                bgcolor: '#722f37', color: 'white',
                display: 'flex', flexDirection: 'column', justifyContent: 'center',
                position: 'relative', overflow: 'hidden'
              }}
            >
              <WineBarIcon sx={{ position: 'absolute', right: -20, bottom: -20, fontSize: 180, opacity: 0.1, color: '#fff' }} />

              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 5, borderBottom: '2px solid rgba(255,255,255,0.2)', pb: 2, display: 'inline-block' }}>
                Elérhetőségeink
              </Typography>

              <Stack spacing={4}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationOnIcon sx={{ mr: 2, fontSize: 32, color: '#ffd700' }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Címünk</Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                        {companyInfo ? companyInfo.cim : <Skeleton width={200} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PhoneIcon sx={{ mr: 2, fontSize: 32, color: '#ffd700' }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Telefonszám</Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                        {companyInfo ? companyInfo.telefon : <Skeleton width={150} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <EmailIcon sx={{ mr: 2, fontSize: 32, color: '#ffd700' }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Email</Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                        {companyInfo ? companyInfo.email : <Skeleton width={180} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />}
                    </Typography>
                  </Box>
                </Box>
                 <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AccessTimeIcon sx={{ mr: 2, fontSize: 32, color: '#ffd700' }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Nyitvatartás</Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                        {companyInfo ? companyInfo.nyitvatartas : <Skeleton width={220} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />}
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Paper>
          </Grid>

          {/* --- JOBB OLDAL (Modernizált Űrlap) --- */}
          <Grid item xs={12} md={6} lg={5}>
            <Paper 
              elevation={4} 
              sx={{ 
                p: 5, borderRadius: 4, height: '100%', 
                bgcolor: '#fff', display: 'flex', flexDirection: 'column',
                justifyContent: user ? 'flex-start' : 'center' 
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333', mb: 3 }}>
                Írj nekünk üzenetet
              </Typography>
              
              {user ? (
                <>
                  <Alert severity="info" icon={<PersonIcon />} sx={{ mb: 4, bgcolor: '#f8f9fa', color: '#555', border: '1px solid #eee', borderRadius: 2 }}>
                    Bejelentkezve mint: <strong>{user.nev}</strong> <br/>
                    <span style={{fontSize: '0.85rem'}}>Válaszunkat a(z) {user.email} címre küldjük.</span>
                  </Alert>

                  <form onSubmit={handleSubmit} style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Grid container spacing={3}>
                      
                      {/* TÁRGY MEZŐ - Modern stílus + Ikon */}
                      <Grid item xs={12}>
                        <TextField 
                          fullWidth 
                          label="Tárgy (pl. Foglalás, Rendelés)" 
                          name="targy" 
                          variant="outlined" 
                          value={formData.targy} 
                          onChange={handleChange} 
                          required 
                          sx={modernInputStyle} // Itt használjuk a stílust
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <SubjectIcon sx={{ color: '#722f37' }} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>

                      {/* ÜZENET MEZŐ - Modern stílus + Ikon */}
                      <Grid item xs={12}>
                        <TextField 
                          fullWidth 
                          label="Miben segíthetünk?" 
                          name="uzenet" 
                          variant="outlined" 
                          multiline 
                          rows={6} 
                          value={formData.uzenet} 
                          onChange={handleChange} 
                          required 
                          sx={modernInputStyle} // Itt is
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start" sx={{ mt: -11 }}> {/* Ikon felülre igazítva */}
                                <MessageIcon sx={{ color: '#722f37' }} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sx={{ mt: 'auto' }}> 
                        <Button 
                          type="submit" variant="contained" size="large" endIcon={<SendIcon />} fullWidth
                          sx={{ 
                            bgcolor: '#722f37', py: 1.8, borderRadius: 30, fontWeight: 'bold', fontSize: '1.1rem',
                            boxShadow: '0 4px 14px 0 rgba(114, 47, 55, 0.39)', // Szép árnyék
                            '&:hover': { bgcolor: '#5a252c', transform: 'translateY(-2px)', boxShadow: '0 6px 20px 0 rgba(114, 47, 55, 0.23)' }, 
                            transition: '0.3s'
                          }}
                        >
                          Üzenet elküldése
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3, fontSize: '1.1rem' }}>
                        Az üzenetküldéshez kérjük, lépj be a fiókodba.
                    </Typography>
                    
                    <Button 
                        variant="contained" 
                        size="large"
                        startIcon={<LoginIcon />}
                        onClick={() => navigate('/login')}
                        sx={{ 
                            bgcolor: '#722f37', px: 5, py: 1.5, borderRadius: 30, fontSize: '1rem',
                            '&:hover': { bgcolor: '#5a252c' } 
                        }}
                    >
                        Bejelentkezés
                    </Button>
                    
                    <Typography variant="body2" sx={{ mt: 3, color: '#777' }}>
                        Nincs még fiókod? <span style={{color: '#722f37', cursor: 'pointer', fontWeight: 'bold'}} onClick={() => navigate('/signup')}>Regisztrálj itt!</span>
                    </Typography>
                </Box>
              )}
            </Paper>
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
}