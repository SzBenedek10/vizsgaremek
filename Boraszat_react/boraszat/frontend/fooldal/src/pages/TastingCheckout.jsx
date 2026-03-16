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
    // Ha nincs bejelentkezve, azonnal menjen a loginra
    if (!user) { 
      navigate('/login'); 
      return; 
    }
    // Ha nincs csomag (pl. oldalfrissítés miatt elveszett), menjen vissza a válogatáshoz
    if (!selectedPackage) { 
      navigate("/borkostolas"); 
      return; 
    }

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

    return `${ev}. ${honapNev} ${nap}.`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPackage || !user) return; 

    // ========================================================
    // BIZTONSÁGI DÁTUM FORMÁZÁS A MYSQL SZÁMÁRA
    // Ha a csomagnak nincs dátuma, berakja a mai napot.
    // Formátum: YYYY-MM-DD HH:mm:ss (Ezt a MySQL imádja)
    // ========================================================
    const nyersDatum = selectedPackage?.idopont || selectedPackage?.datum || new Date().toISOString();
    let mysqlDatum;
    try {
      // Megpróbáljuk szabványosítani a dátumot
      mysqlDatum = new Date(nyersDatum).toISOString().slice(0, 19).replace('T', ' ');
    } catch (error) {
      // Ha nagyon rossz formátum jönne az adatbázisból, adunk egy vész-dátumot
      mysqlDatum = new Date().toISOString().slice(0, 19).replace('T', ' ');
    }

    const foglalasAdatok = {
      userId: user.id,
      szolgaltatasId: selectedPackage.id,
      letszam: selectedPackage.letszam,
      datum: mysqlDatum, 
      idotartam: 120, 
      osszeg: selectedPackage.ar * selectedPackage.letszam,
      megjegyzes: formData.megjegyzes,
      ugyfelNev: formData.nev,
      ugyfelEmail: formData.email,
      ugyfelTel: formData.tel
    };

    
    console.log("Szervernek küldött BIZTOSAN JÓ adatok:", foglalasAdatok);

    try {
      const response = await fetch("http://localhost:5000/api/foglalas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(foglalasAdatok)
      });

      if (response.ok) {
        await Swal.fire({
          title: "Siker!",
          text: "A foglalásodat rögzítettük! Várunk szeretettel.",
          icon: "success",
          confirmButtonColor: "#722f37"
        });
        navigate("/profilom"); 
      } else {
        const errorData = await response.json();
        Swal.fire({
          title: "Hiba",
          text: errorData.error || "Hiba történt",
          icon: "error",
          confirmButtonColor: "#722f37"
        });
      }
    } catch (error) {
      Swal.fire("Hiba", "Hálózati hiba történt", "error");
    }
  };


  if (!selectedPackage || !user) {
    return null; 
  }

  return (
    <Box sx={{ bgcolor: '#fdfbfb', minHeight: '100vh', pb: 10 }}>
      <Container maxWidth="lg" sx={{ pt: { xs: 8, md: 10 } }}>
        
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="overline" sx={{ color: '#722f37', fontWeight: 'bold', fontSize: '1rem', letterSpacing: 2 }}>
            Prémium Élmény
          </Typography>
          <Typography variant="h3" sx={{ fontFamily: 'Playfair Display, serif', fontWeight: 'bold', color: '#333', mb: 2, mt: 1 }}>
            Foglalás Véglegesítése
          </Typography>
          <Divider sx={{ width: '80px', mx: 'auto', borderBottomWidth: 3, borderColor: '#722f37', opacity: 0.8 }} />
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            
            {/* BAL OLDAL */}
            <Grid item xs={12} md={7}>
              <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 3, boxShadow: '0 10px 40px rgba(0,0,0,0.04)', borderTop: '4px solid #722f37' }}>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1.5 }}>
                  <Box sx={{ bgcolor: '#fdfaeb', p: 1, borderRadius: '50%', display: 'flex' }}>
                    <PersonIcon sx={{ color: '#722f37' }} />
                  </Box>
                  <Typography variant="h5" sx={{ fontFamily: 'Playfair Display', color: '#333', fontWeight: 'bold' }}>
                    Foglaló adatai
                  </Typography>
                </Box>

                <FormControlLabel
                  control={<Checkbox checked={sameAsProfile} onChange={(e) => setSameAsProfile(e.target.checked)} sx={{ color: '#722f37', '&.Mui-checked': { color: '#722f37' } }} />}
                  label="Profiladataim használata"
                  sx={{ mb: 3, color: '#555' }}
                />

                <Stack spacing={3} sx={{ mb: 5 }}>
                  <TextField label="Név" name="nev" fullWidth required value={formData.nev} onChange={handleChange} disabled={sameAsProfile} />
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField label="Email" name="email" fullWidth required value={formData.email} onChange={handleChange} disabled={sameAsProfile} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField label="Telefon" name="tel" fullWidth required value={formData.tel} onChange={handleChange} disabled={sameAsProfile} />
                    </Grid>
                  </Grid>
                </Stack>

                <Divider sx={{ mb: 4, borderColor: 'rgba(0,0,0,0.05)' }} />

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1.5 }}>
                  <Box sx={{ bgcolor: '#fdfaeb', p: 1, borderRadius: '50%', display: 'flex' }}>
                    <CalendarMonthIcon sx={{ color: '#722f37' }} />
                  </Box>
                  <Typography variant="h5" sx={{ fontFamily: 'Playfair Display', color: '#333', fontWeight: 'bold' }}>
                    Részletek
                  </Typography>
                </Box>

                <Grid container spacing={2} sx={{ mb: 5 }}>
                  <Grid item xs={12} sm={7}>
                    <Box sx={{ p: 2.5, bgcolor: '#fafafa', borderRadius: 2, border: '1px solid #eee', height: '100%' }}>
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                        Választott dátum
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#722f37' }}>
                        {getOnlyDate()}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <Box sx={{ p: 2.5, bgcolor: '#fafafa', borderRadius: 2, border: '1px solid #eee', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <AccessTimeIcon sx={{ fontSize: '1rem', color: '#555' }} />
                        <Typography variant="caption" color="text.secondary">Program hossza</Typography>
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>2 óra</Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1.5 }}>
                  <Box sx={{ bgcolor: '#fdfaeb', p: 1, borderRadius: '50%', display: 'flex' }}>
                    <CommentIcon sx={{ color: '#722f37' }} />
                  </Box>
                  <Typography variant="h5" sx={{ fontFamily: 'Playfair Display', color: '#333', fontWeight: 'bold' }}>
                    Megjegyzés
                  </Typography>
                </Box>
                <TextField 
                  label="Van-e bármilyen egyéb kérése? (pl. ételallergia)" 
                  name="megjegyzes" 
                  multiline 
                  rows={3} 
                  fullWidth 
                  value={formData.megjegyzes} 
                  onChange={handleChange} 
                />
              </Paper>
            </Grid>

            {/* JOBB OLDAL */}
            <Grid item xs={12} md={5}>
              <Paper elevation={0} sx={{ 
                p: { xs: 3, md: 4 }, 
                borderRadius: 3, 
                border: '1px solid rgba(114, 47, 55, 0.2)', 
                bgcolor: '#fdfaeb', 
                position: 'sticky', 
                top: 100 
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1.5 }}>
                  <ReceiptIcon sx={{ color: '#722f37' }} />
                  <Typography variant="h5" sx={{ fontFamily: 'Playfair Display', color: '#333', fontWeight: 'bold' }}>
                    Összegzés
                  </Typography>
                </Box>

                <Stack spacing={2} sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#722f37' }}>
                    {selectedPackage?.nev}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ color: '#555' }}>Létszám:</Typography>
                    <Typography fontWeight="bold" sx={{ color: '#333' }}>{selectedPackage?.letszam} fő</Typography>
                  </Box>
                  <Divider sx={{ borderColor: 'rgba(0,0,0,0.1)' }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1 }}>
                    <Typography variant="h6" sx={{ color: '#333' }}>Végösszeg:</Typography>
                    <Typography variant="h5" sx={{ color: '#722f37', fontWeight: 'bold' }}>
                      {selectedPackage ? HUF.format(selectedPackage.ar * selectedPackage.letszam) : 0} Ft
                    </Typography>
                  </Box>
                </Stack>

                <Button 
                  type="submit" 
                  fullWidth 
                  variant="contained" 
                  startIcon={<CheckCircleIcon />} 
                  sx={{ 
                    bgcolor: '#722f37', 
                    color: 'white',
                    '&:hover': { bgcolor: '#5a252c', transform: 'translateY(-2px)', boxShadow: '0 8px 20px rgba(114,47,55,0.3)' }, 
                    py: 1.8, 
                    fontWeight: 'bold', 
                    letterSpacing: 1,
                    borderRadius: 50,
                    transition: 'all 0.3s'
                  }}
                >
                  Foglalás véglegesítése
                </Button>
                
                <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 2, color: '#888' }}>
                  A fizetés a helyszínen történik a kóstoló után.
                </Typography>
              </Paper>
            </Grid>

          </Grid>
        </form>
      </Container>
    </Box>
  );
}