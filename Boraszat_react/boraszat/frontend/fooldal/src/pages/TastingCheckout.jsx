import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from 'sweetalert2';

// UI Komponensek
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  FormControlLabel,
  Checkbox,
  Divider,
  Stack
} from "@mui/material";

// Ikonok
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonIcon from '@mui/icons-material/Person';

const HUF = new Intl.NumberFormat("hu-HU");

export default function TastingCheckout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const selectedPackage = location.state?.selectedPackage;

  const [sameAsProfile, setSameAsProfile] = useState(true);
  const [formData, setFormData] = useState({
    nev: "", email: "", tel: "",
    irsz: "", varos: "", utca: "", hazszam: "",
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
        tel: user.telefonszam || user.tel || "",
        irsz: user.irsz || "",
        varos: user.varos || "",
        utca: user.utca || "",
        hazszam: user.hazszam || ""
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
    const honapok = ["január", "február", "március", "április", "május", "június", "július", "augusztus", "szeptember", "október", "november", "december"];
    return `${d.getFullYear()}. ${honapok[d.getMonth()]} ${d.getDate()}.`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPackage || !user) return; 

    const nyersDatum = selectedPackage?.idopont || selectedPackage?.datum || new Date().toISOString();
    const mysqlDatum = new Date(nyersDatum).toISOString().slice(0, 19).replace('T', ' ');

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
      ugyfelTel: formData.tel,
      ugyfelIrsz: formData.irsz,
      ugyfelVaros: formData.varos,
      ugyfelUtca: formData.utca,
      ugyfelHazszam: formData.hazszam
    };

    try {
      const response = await fetch("http://localhost:5000/api/foglalas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(foglalasAdatok)
      });

      if (response.ok) {
        await Swal.fire({
          title: 'Sikeres foglalás!',
          text: 'Várjuk szeretettel!',
          icon: 'success',
          confirmButtonColor: '#722f37'
        });
        navigate("/profilom"); 
      } else {
        const errorData = await response.json();
        Swal.fire('Hiba', errorData.error || 'Hiba történt', 'error');
      }
    } catch (error) {
      Swal.fire('Hiba', 'Szerver hiba történt', 'error');
    }
  };

  if (!selectedPackage || !user) return null;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <form onSubmit={handleSubmit}>
        {/* FŐ ELRENDEZÉS: FLEXBOX */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          gap: 3, 
          alignItems: 'flex-start' 
        }}>
          
          {/* BAL OLDAL: ADATOK (Szélesség: 65%) */}
          <Box sx={{ flex: '0 1 65%', width: '100%' }}>
            <Stack spacing={3}>
              
              {/* Számlázási adatok doboz */}
              <Paper elevation={1} sx={{ p: 3, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
                  <ReceiptIcon sx={{ color: '#722f37' }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Számlázási adatok
                  </Typography>
                </Box>

                <FormControlLabel
                  control={<Checkbox checked={sameAsProfile} onChange={(e) => setSameAsProfile(e.target.checked)} sx={{ color: '#722f37', '&.Mui-checked': { color: '#722f37' } }} />}
                  label={<Typography variant="body2" color="text.secondary">Profil adatainak betöltése</Typography>}
                  sx={{ mb: 2 }}
                />

                {/* Inputok 3 oszlopos rácsban */}
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 1.5 }}>
                  <Box sx={{ gridColumn: 'span 4' }}>
                    <TextField fullWidth label="Teljes név" name="nev" value={formData.nev} onChange={handleChange} size="small" disabled={sameAsProfile} />
                  </Box>
                  <Box sx={{ gridColumn: 'span 4' }}>
                    <TextField fullWidth label="Email cím" name="email" value={formData.email} onChange={handleChange} size="small" disabled={sameAsProfile} />
                  </Box>
                  <Box sx={{ gridColumn: 'span 4' }}>
                    <TextField fullWidth label="Telefonszám" name="tel" value={formData.tel} onChange={handleChange} size="small" disabled={sameAsProfile} />
                  </Box>
                  
                  <Box sx={{ gridColumn: 'span 3' }}>
                    <TextField fullWidth label="Irsz." name="irsz" value={formData.irsz} onChange={handleChange} size="small" disabled={sameAsProfile} />
                  </Box>
                  <Box sx={{ gridColumn: 'span 4' }}>
                    <TextField fullWidth label="Város" name="varos" value={formData.varos} onChange={handleChange} size="small" disabled={sameAsProfile} />
                  </Box>
                  <Box sx={{ gridColumn: 'span 3' }}>
                    <TextField fullWidth label="Utca" name="utca" value={formData.utca} onChange={handleChange} size="small" disabled={sameAsProfile} />
                  </Box>
                  <Box sx={{ gridColumn: 'span 2' }}>
                    <TextField fullWidth label="Hsz." name="hazszam" value={formData.hazszam} onChange={handleChange} size="small" disabled={sameAsProfile} />
                  </Box>
                </Box>
              </Paper>

              {/* Megjegyzés doboz */}
              <Paper elevation={1} sx={{ p: 3, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
                  <PersonIcon sx={{ color: '#722f37' }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Megjegyzés
                  </Typography>
                </Box>
                <TextField 
                  fullWidth multiline rows={2} 
                  placeholder="Van-e bármilyen egyéb kérése?" 
                  name="megjegyzes" value={formData.megjegyzes} onChange={handleChange} 
                  size="small"
                />
              </Paper>
            </Stack>
          </Box>

          {/* JOBB OLDAL: ÖSSZESÍTŐ (Szélesség: 35%) */}
          <Box sx={{ flex: '0 1 35%', width: '100%', position: { md: 'sticky' }, top: 20 }}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3, borderTop: '4px solid #722f37' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Foglalás összesítése
              </Typography>
              
              <Divider sx={{ mb: 2 }} />

              <Stack spacing={1} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedPackage?.nev}</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{HUF.format(selectedPackage?.ar)} Ft / fő</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', mt: 1 }}>
                   <CalendarMonthIcon sx={{ fontSize: 18 }} />
                   <Typography variant="body2">{getOnlyDate()}</Typography>
                   <Typography variant="body2" sx={{ ml: 'auto' }}>{selectedPackage?.letszam} fő</Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                  <AccessTimeIcon sx={{ fontSize: 18 }} />
                  <Typography variant="body2">Program hossza: 2 óra</Typography>
                </Box>
              </Stack>

              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Végösszeg:</Typography>
                <Typography variant="h5" sx={{ color: '#722f37', fontWeight: 'bold' }}>
                   {HUF.format(selectedPackage?.ar * selectedPackage?.letszam)} Ft
                </Typography>
              </Box>

              <Stack spacing={1.5}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  startIcon={<CheckCircleIcon />}
                  sx={{
                    bgcolor: '#722f37',
                    '&:hover': { bgcolor: '#5a252c' },
                    py: 1.5,
                    fontWeight: 'bold',
                    borderRadius: 2,
                    textTransform: 'none'
                  }}
                >
                  Foglalás véglegesítése
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<ArrowBackIcon />}
                  onClick={() => navigate("/borkostolas")}
                  sx={{ 
                    color: '#555', 
                    borderColor: '#ddd', 
                    borderRadius: 2,
                    textTransform: 'none',
                    '&:hover': { borderColor: '#999', bgcolor: '#fafafa' }
                  }}
                >
                  Vissza a válogatáshoz
                </Button>
              </Stack>
            </Paper>
          </Box>

        </Box>
      </form>
    </Container>
  );
}