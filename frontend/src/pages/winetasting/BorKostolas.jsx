import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
// Figyelj rá, hogy a TastingCard útvonala helyes legyen a projektedben!
import TastingCard from "../../components/TastingCard";
import { 
  Container, Box, Typography, Paper, Divider, Button, CircularProgress,
  Radio, RadioGroup, FormControlLabel, FormControl, Select, MenuItem, InputLabel
} from "@mui/material";
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';

export default function BorKostolas() {
  const [csomagok, setCsomagok] = useState([]);
  const [foglaltsag, setFoglaltsag] = useState({}); 
  const [loading, setLoading] = useState(true);

  // Szűrők és rendezés állapota
  const [szuroElerhetoseg, setSzuroElerhetoseg] = useState('');
  const [szuroHonap, setSzuroHonap] = useState('');
  const [rendezes, setRendezes] = useState('alap');

  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:5000/api/szolgaltatasok").then(res => res.json()),
      fetch("http://localhost:5000/api/foglaltsag").then(res => res.json())
    ])
    .then(([szolgData, foglData]) => {
      setCsomagok(szolgData);
      const foglMap = {};
      foglData.forEach(f => { foglMap[f.szolgaltatas_id] = f.ossz_letszam; });
      setFoglaltsag(foglMap);
      setLoading(false);
    })
    .catch(err => {
      console.error("Hiba:", err);
      setLoading(false);
    });
  }, []);

  const handleBooking = (csomag) => {
    const szabad = csomag.kapacitas - (foglaltsag[csomag.id] || 0);
    navigate("/kostolo-foglalas", { 
      state: { selectedPackage: { ...csomag, letszam: 1, maxSzabad: szabad } } 
    });
  };

  // Dinamikusan kinyerjük, milyen hónapokban vannak programok
  const elerhetoHonapok = [...new Set(csomagok.map(c => {
    if (!c.datum) return "Hamarosan";
    const d = new Date(c.datum);
    return d.toLocaleDateString('hu-HU', { year: 'numeric', month: 'long' });
  }))];

  // 1. Lépés: SZŰRÉS
  let szurtCsomagok = csomagok.filter(csomag => {
    const szabadHely = csomag.kapacitas - (foglaltsag[csomag.id] || 0);
    
    // Elérhetőség szűrő
    const isAvailable = szuroElerhetoseg === 'szabad' ? szabadHely > 0 : true;

    // Hónap szűrő
    let monthStr = "Hamarosan";
    if (csomag.datum) {
      const d = new Date(csomag.datum);
      monthStr = d.toLocaleDateString('hu-HU', { year: 'numeric', month: 'long' });
    }
    const isMonthMatch = szuroHonap === '' || monthStr === szuroHonap;

    return isAvailable && isMonthMatch;
  });

  // 2. Lépés: RENDEZÉS
  szurtCsomagok.sort((a, b) => {
    if (rendezes === 'ar_no') return a.ar - b.ar;
    if (rendezes === 'ar_csokken') return b.ar - a.ar;
    
    // Alapértelmezett: Dátum szerint (legközelebbi elöl)
    const dateA = a.datum ? new Date(a.datum).getTime() : Infinity;
    const dateB = b.datum ? new Date(b.datum).getTime() : Infinity;
    return dateA - dateB;
  });

  const handleResetFilters = () => {
    setSzuroElerhetoseg('');
    setSzuroHonap('');
    setRendezes('alap');
  };

  const radioStyle = {
    color: '#ccc', 
    '&.Mui-checked': { color: '#722f37' }
  };

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
        
        {/* FEJLÉC */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="overline" sx={{ color: '#722f37', fontWeight: 'bold', fontSize: '1rem', letterSpacing: 2 }}>
            Kínálatunk
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#333', mb: 2, mt: 1, fontFamily: 'serif' }}>
            Borkóstoló programok
          </Typography>
          <Divider sx={{ width: '150px', mx: 'auto', borderBottomWidth: 3, borderColor: '#722f37', opacity: 0.8 }} />
        </Box>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          gap: 4, 
          alignItems: 'flex-start' 
        }}>
          
          {/* ========================================== */}
          {/* BAL OLDAL - SZŰRŐ PANEL */}
          {/* ========================================== */}
          <Box sx={{ 
            width: { xs: '100%', md: '280px', lg: '300px' }, 
            flexShrink: 0, 
            position: { md: 'sticky' }, 
            top: { md: '100px' },
            zIndex: 10
          }}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                border: '1px solid #eee', 
                borderRadius: 4, 
                bgcolor: 'white'
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#333', fontFamily: 'serif' }}>
                Szűrés
              </Typography>
              <Divider sx={{ mb: 3 }} />

              {/* Elérhetőség */}
              <FormControl component="fieldset" sx={{ width: '100%', mb: 3 }}>
                <Typography variant="subtitle2" sx={{ color: '#888', textTransform: 'uppercase', letterSpacing: 1, mb: 1 }}>
                  Elérhetőség
                </Typography>
                <RadioGroup 
                  value={szuroElerhetoseg} 
                  onChange={(e) => setSzuroElerhetoseg(e.target.value)}
                >
                  <FormControlLabel 
                    value="" 
                    control={<Radio sx={radioStyle} />} 
                    label={<Typography sx={{ color: szuroElerhetoseg === '' ? '#722f37' : '#555', fontWeight: szuroElerhetoseg === '' ? 'bold' : 'normal' }}>Összes program</Typography>} 
                  />
                  <FormControlLabel 
                    value="szabad" 
                    control={<Radio sx={radioStyle} />} 
                    label={<Typography sx={{ color: szuroElerhetoseg === 'szabad' ? '#722f37' : '#555', fontWeight: szuroElerhetoseg === 'szabad' ? 'bold' : 'normal' }}>Csak szabad helyek</Typography>} 
                  />
                </RadioGroup>
              </FormControl>

              <Divider sx={{ mb: 3 }} />

              {/* Dátum / Hónap */}
              <FormControl component="fieldset" sx={{ width: '100%', mb: 3 }}>
                <Typography variant="subtitle2" sx={{ color: '#888', textTransform: 'uppercase', letterSpacing: 1, mb: 1 }}>
                  Időpont
                </Typography>
                <RadioGroup 
                  value={szuroHonap} 
                  onChange={(e) => setSzuroHonap(e.target.value)}
                >
                  <FormControlLabel 
                    value="" 
                    control={<Radio sx={radioStyle} />} 
                    label={<Typography sx={{ color: szuroHonap === '' ? '#722f37' : '#555', fontWeight: szuroHonap === '' ? 'bold' : 'normal' }}>Minden időpont</Typography>} 
                  />
                  {elerhetoHonapok.map((honap) => (
                    <FormControlLabel 
                      key={honap}
                      value={honap} 
                      control={<Radio sx={radioStyle} />} 
                      label={<Typography sx={{ color: szuroHonap === honap ? '#722f37' : '#555', fontWeight: szuroHonap === honap ? 'bold' : 'normal', textTransform: 'capitalize' }}>{honap}</Typography>} 
                    />
                  ))}
                </RadioGroup>
              </FormControl>

              {/* Szűrő törlése gomb */}
              {(szuroElerhetoseg !== '' || szuroHonap !== '' || rendezes !== 'alap') && (
                <Button 
                  fullWidth 
                  variant="outlined" 
                  startIcon={<FilterAltOffIcon />}
                  onClick={handleResetFilters}
                  sx={{ 
                    borderRadius: '8px', 
                    color: '#722f37', 
                    borderColor: '#722f37',
                    mt: 2,
                    '&:hover': { bgcolor: 'rgba(114, 47, 55, 0.05)', borderColor: '#722f37' }
                  }}
                >
                  Szűrők törlése
                </Button>
              )}
            </Paper>
          </Box>

          {/* ========================================== */}
          {/* JOBB OLDAL - KÁRTYÁK ÉS RENDEZÉS */}
          {/* ========================================== */}
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            
            {/* Rendezés panel és találatok száma */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 3, 
              px: 1,
              flexWrap: 'wrap', 
              gap: 2
            }}>
              <Typography variant="body1" sx={{ color: '#555', fontWeight: 'bold' }}>
                {szurtCsomagok.length} program elérhető
              </Typography>

              {/* Rendezés Legördülő */}
              <FormControl size="small" sx={{ minWidth: 240, bgcolor: 'white' }}>
                <InputLabel sx={{ color: '#722f37' }}>Rendezés</InputLabel>
                <Select
                  value={rendezes}
                  label="Rendezés"
                  onChange={(e) => setRendezes(e.target.value)}
                  sx={{
                    borderRadius: 2,
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#722f37',
                    }
                  }}
                >
                  <MenuItem value="alap">Időpont szerint (legközelebbi)</MenuItem>
                  <MenuItem value="ar_no">Ár: Alacsonytól Magasig</MenuItem>
                  <MenuItem value="ar_csokken">Ár: Magastól Alacsonyig</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* KÁRTYÁK GRIDJE - PONTOSAN 3 EGY SORBAN! */}
            {szurtCsomagok.length > 0 ? (
              <Box 
                sx={{ 
                  display: 'grid', 
                  // Itt adjuk meg, hogy mobilon 1, tableten 2, nagy képernyőn pontosan 3 kártya legyen egy sorban
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, 
                  gap: 4 
                }}
              >
                {szurtCsomagok.map((csomag) => (
                  <TastingCard 
                    key={csomag.id} 
                    csomag={csomag} 
                    onValaszt={handleBooking} 
                    isFull={(foglaltsag[csomag.id] || 0) >= csomag.kapacitas} 
                    szabadHely={csomag.kapacitas - (foglaltsag[csomag.id] || 0)}
                  />
                ))}
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 10, bgcolor: 'white', borderRadius: 4, border: '1px dashed #ccc' }}>
                <Typography variant="h6" color="textSecondary" sx={{ mb: 2 }}>
                  Nincs a szűrésnek megfelelő borkóstoló.
                </Typography>
                <Button variant="contained" sx={{ bgcolor: '#722f37', '&:hover': { bgcolor: '#5a252c' } }} onClick={handleResetFilters}>
                  Összes program mutatása
                </Button>
              </Box>
            )}

          </Box>

        </Box>
      </Container>
    </Box>
  );
}