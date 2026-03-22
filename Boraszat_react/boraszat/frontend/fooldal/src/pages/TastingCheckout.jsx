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
  Stack,
  IconButton
} from "@mui/material";

// Ikonok
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const HUF = new Intl.NumberFormat("hu-HU");

export default function TastingCheckout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const selectedPackage = location.state?.selectedPackage;

  // Állapotok
  const [sameAsProfile, setSameAsProfile] = useState(true);
  const [letszam, setLetszam] = useState(selectedPackage?.letszam || 1);
  const [formData, setFormData] = useState({
    nev: "", email: "", tel: "",
    irsz: "", varos: "", utca: "", hazszam: "",
    megjegyzes: ""
  });

  // A maximálisan foglalható helyek száma
  const maxSzabad = selectedPackage?.maxSzabad || selectedPackage?.kapacitas || 10;
  // A még szabadon maradó helyek száma a választott létszám után
  const maradekHely = maxSzabad - letszam;

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

  // Létszám növelése és csökkentése (védelemmel)
  const handleIncrement = () => {
    if (letszam < maxSzabad) {
      setLetszam(prev => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (letszam > 1) {
      setLetszam(prev => prev - 1);
    }
  };

  // Dátum formázása
  const getOnlyDate = () => {
    const rawDate = selectedPackage?.idopont || selectedPackage?.datum;
    if (!rawDate) return "Nincs megadva";
    const d = new Date(rawDate);
    return d.toLocaleDateString('hu-HU', { year: 'numeric', month: 'long', day: 'numeric' }) + ".";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPackage || !user) return; 

    const nyersDatum = selectedPackage?.idopont || selectedPackage?.datum || new Date().toISOString();
    const mysqlDatum = new Date(nyersDatum).toISOString().split('T')[0];

    const foglalasAdatok = {
      userId: user.id,
      szolgaltatasId: selectedPackage.id,
      letszam: letszam, 
      datum: mysqlDatum, 
      idotartam: selectedPackage.idotartam || "02:00:00", 
      osszeg: selectedPackage.ar * letszam,
      megjegyzes: formData.megjegyzes
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
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          gap: 3, 
          alignItems: 'flex-start' 
        }}>
          
          {/* BAL OLDAL: ADATOK */}
          <Box sx={{ flex: '0 1 65%', width: '100%' }}>
            <Stack spacing={3}>
              
              <Paper elevation={1} sx={{ p: 3, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
                  <ReceiptIcon sx={{ color: '#722f37' }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Kapcsolattartási adatok
                  </Typography>
                </Box>

                <FormControlLabel
                  control={<Checkbox checked={sameAsProfile} onChange={(e) => setSameAsProfile(e.target.checked)} sx={{ color: '#722f37', '&.Mui-checked': { color: '#722f37' } }} />}
                  label={<Typography variant="body2" color="text.secondary">Profil adatainak betöltése</Typography>}
                  sx={{ mb: 2 }}
                />

                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 1.5 }}>
                  <Box sx={{ gridColumn: 'span 4' }}>
                    <TextField fullWidth label="Teljes név" name="nev" value={formData.nev} onChange={handleChange} size="small" disabled={sameAsProfile} required />
                  </Box>
                  <Box sx={{ gridColumn: 'span 4' }}>
                    <TextField fullWidth label="Email cím" name="email" value={formData.email} onChange={handleChange} size="small" disabled={sameAsProfile} required />
                  </Box>
                  <Box sx={{ gridColumn: 'span 4' }}>
                    <TextField fullWidth label="Telefonszám" name="tel" value={formData.tel} onChange={handleChange} size="small" disabled={sameAsProfile} required />
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

              <Paper elevation={1} sx={{ p: 3, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
                  <PersonIcon sx={{ color: '#722f37' }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Megjegyzés
                  </Typography>
                </Box>
                <TextField 
                  fullWidth multiline rows={2} 
                  placeholder="Van-e bármilyen egyéb kérése? (pl. ételallergia, egyedi igények)" 
                  name="megjegyzes" value={formData.megjegyzes} onChange={handleChange} 
                  size="small"
                />
              </Paper>
            </Stack>
          </Box>

          {/* JOBB OLDAL: ÖSSZESÍTŐ */}
          <Box sx={{ flex: '0 1 35%', width: '100%', position: { md: 'sticky' }, top: 20 }}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3, borderTop: '4px solid #722f37' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Foglalás összesítése
              </Typography>
              
              <Divider sx={{ mb: 2 }} />

              <Stack spacing={1} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedPackage?.nev}</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#722f37' }}>{HUF.format(selectedPackage?.ar)} Ft / fő</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', mt: 1 }}>
                   <CalendarMonthIcon sx={{ fontSize: 18 }} />
                   <Typography variant="body2">{getOnlyDate()}</Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                  <AccessTimeIcon sx={{ fontSize: 18 }} />
                  <Typography variant="body2">Kezdés: {selectedPackage?.idotartam || "14:00:00"}</Typography>
                </Box>
              </Stack>

              {/* LÉTSZÁMVÁLASZTÓ ÉS MARADÉK HELYEK */}
              <Box sx={{ mb: 3 }}>
                {/* Fehér doboz a kiválasztónak */}
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  p: 1.5, 
                  bgcolor: '#fdfbfb', 
                  borderRadius: 2, 
                  border: '1px solid',
                  borderColor: maradekHely === 0 ? '#ffcdd2' : '#e0e0e0', // Pirosas keret, ha megtelt
                  transition: '0.3s'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <GroupsIcon sx={{ fontSize: 22, color: '#722f37' }} />
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#333' }}>
                      Résztvevők száma:
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <IconButton 
                      size="small" 
                      onClick={handleDecrement} 
                      disabled={letszam <= 1}
                      sx={{ 
                        bgcolor: '#fff', 
                        border: '1px solid #ddd', 
                        '&:hover': { bgcolor: '#f0f0f0' },
                        '&.Mui-disabled': { bgcolor: '#fafafa', color: '#ccc' }
                      }}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    
                    <Typography variant="body1" sx={{ fontWeight: 'bold', minWidth: '24px', textAlign: 'center' }}>
                      {letszam}
                    </Typography>
                    
                    <IconButton 
                      size="small" 
                      onClick={handleIncrement} 
                      disabled={letszam >= maxSzabad} // Gomb letiltása, ha betelt
                      sx={{ 
                        bgcolor: '#fff', 
                        border: '1px solid #ddd', 
                        '&:hover': { bgcolor: '#f0f0f0' },
                        '&.Mui-disabled': { bgcolor: '#fafafa', color: '#ccc' } 
                      }}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
                
                {/* Dinamikus, elegáns maradék hely kiírása */}
                <Typography 
                  variant="caption" 
                  sx={{ 
                    display: 'block', 
                    textAlign: 'right', 
                    color: maradekHely === 0 ? '#d32f2f' : '#722f37', // Ha 0, akkor élénkebb piros
                    fontWeight: maradekHely === 0 ? 'bold' : '500', 
                    fontStyle: maradekHely === 0 ? 'normal' : 'italic',
                    mt: 0.5,
                    pr: 1,
                    transition: '0.3s'
                  }}
                >
                  {maradekHely === 0 
                    ? "Nincsen több szabad hely" 
                    : `Még ${maradekHely} szabad hely maradt`}
                </Typography>
              </Box>

              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Végösszeg:</Typography>
                <Typography variant="h5" sx={{ color: '#722f37', fontWeight: 'bold' }}>
                   {HUF.format(selectedPackage?.ar * letszam)} Ft
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
                    textTransform: 'none',
                    fontSize: '1.05rem'
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