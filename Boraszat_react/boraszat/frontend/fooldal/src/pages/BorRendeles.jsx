import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import WineCard from "../components/WineCard"; 
import { useCart } from "../context/CartContext"; 

import { 
  Container, Box, Typography, Paper, 
  Divider, Button, CircularProgress, Radio, RadioGroup, FormControlLabel, FormControl,
  Select, MenuItem, InputLabel
} from "@mui/material";

import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';

const HUF = new Intl.NumberFormat("hu-HU");

export default function BorRendeles() {
  const [borok, setBorok] = useState([]); 
  const [kiszerelesek, setKiszerelesek] = useState([]); 
  const [borSzinek, setBorSzinek] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  // Szűrők állapota
  const [szuroSzin, setSzuroSzin] = useState('');
  const [szuroEvjarat, setSzuroEvjarat] = useState('');
  
  // ÚJ: Rendezés állapota
  const [rendezes, setRendezes] = useState('alap');

  const navigate = useNavigate(); 
  const { cartItems, removeFromCart, totalAmount } = useCart();

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:5000/api/borok").then(res => {
        if (!res.ok) throw new Error("Hiba a borok lekérésekor");
        return res.json();
      }),
      fetch("http://localhost:5000/api/kiszerelesek").then(res => {
        if (!res.ok) throw new Error("Hiba a kiszerelések lekérésekor");
        return res.json();
      }),
      fetch("http://localhost:5000/api/bor-szinek").then(res => {
        if (!res.ok) throw new Error("Hiba a színek lekérésekor");
        return res.json();
      })
    ])
    .then(([borData, kiszerelesData, szinData]) => {
      if (Array.isArray(borData)) setBorok(borData);
      if (Array.isArray(kiszerelesData)) setKiszerelesek(kiszerelesData);
      if (Array.isArray(szinData)) setBorSzinek(szinData);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const elerhetoEvjaratok = [...new Set(borok.map(b => b.evjarat))].filter(Boolean).sort((a, b) => b - a);

  // 1. Lépés: SZŰRÉS
  let szurtBorok = borok.filter(bor => {
    const szinEgyezik = szuroSzin === '' || String(bor.bor_szin_id) === String(szuroSzin);
    const evjaratEgyezik = szuroEvjarat === '' || String(bor.evjarat) === String(szuroEvjarat);
    return szinEgyezik && evjaratEgyezik;
  });

  // 2. Lépés: RENDEZÉS (Ár és Népszerűség szerint)
  szurtBorok.sort((a, b) => {
    if (rendezes === 'ar_no') return a.ar - b.ar; // Ár: Alacsonytól a magasig
    if (rendezes === 'ar_csokken') return b.ar - a.ar; // Ár: Magastól az alacsonyig
    if (rendezes === 'nepszeru') {
      // Ha van 'nepszeruseg' mező az adatbázisban, aszerint csökkenőbe teszi, ha nincs, nem omlik össze
      return (b.nepszeruseg || 0) - (a.nepszeruseg || 0);
    }
    return 0; // 'alap' rendezés (Ahogy az adatbázisból jön)
  });

  const handleResetFilters = () => {
    setSzuroSzin('');
    setSzuroEvjarat('');
    setRendezes('alap'); // Ezt is visszaállítjuk
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
            Borválogatásunk
          </Typography>
          <Divider sx={{ width: '100px', mx: 'auto', borderBottomWidth: 3, borderColor: '#722f37', opacity: 0.8 }} />
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

              {/* Bor Színe */}
              <FormControl component="fieldset" sx={{ width: '100%', mb: 3 }}>
                <Typography variant="subtitle2" sx={{ color: '#888', textTransform: 'uppercase', letterSpacing: 1, mb: 1 }}>
                  Bor Színe
                </Typography>
                <RadioGroup 
                  value={szuroSzin} 
                  onChange={(e) => setSzuroSzin(e.target.value)}
                >
                  <FormControlLabel 
                    value="" 
                    control={<Radio sx={radioStyle} />} 
                    label={<Typography sx={{ color: szuroSzin === '' ? '#722f37' : '#555', fontWeight: szuroSzin === '' ? 'bold' : 'normal' }}>Összes szín</Typography>} 
                  />
                  {borSzinek.map((szin) => (
                    <FormControlLabel 
                      key={szin.id}
                      value={String(szin.id)} 
                      control={<Radio sx={radioStyle} />} 
                      label={<Typography sx={{ color: szuroSzin === String(szin.id) ? '#722f37' : '#555', fontWeight: szuroSzin === String(szin.id) ? 'bold' : 'normal' }}>{szin.nev}</Typography>} 
                    />
                  ))}
                </RadioGroup>
              </FormControl>

              <Divider sx={{ mb: 3 }} />

              {/* Évjárat */}
              <FormControl component="fieldset" sx={{ width: '100%', mb: 3 }}>
                <Typography variant="subtitle2" sx={{ color: '#888', textTransform: 'uppercase', letterSpacing: 1, mb: 1 }}>
                  Évjárat
                </Typography>
                <RadioGroup 
                  value={szuroEvjarat} 
                  onChange={(e) => setSzuroEvjarat(e.target.value)}
                >
                  <FormControlLabel 
                    value="" 
                    control={<Radio sx={radioStyle} />} 
                    label={<Typography sx={{ color: szuroEvjarat === '' ? '#722f37' : '#555', fontWeight: szuroEvjarat === '' ? 'bold' : 'normal' }}>Minden évjárat</Typography>} 
                  />
                  {elerhetoEvjaratok.map((ev) => (
                    <FormControlLabel 
                      key={ev}
                      value={String(ev)} 
                      control={<Radio sx={radioStyle} />} 
                      label={<Typography sx={{ color: szuroEvjarat === String(ev) ? '#722f37' : '#555', fontWeight: szuroEvjarat === String(ev) ? 'bold' : 'normal' }}>{ev}</Typography>} 
                    />
                  ))}
                </RadioGroup>
              </FormControl>

              {/* Szűrő törlése gomb */}
              {(szuroSzin !== '' || szuroEvjarat !== '' || rendezes !== 'alap') && (
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
          {/* JOBB OLDAL - BOR KÁRTYÁK ÉS RENDEZÉS */}
          {/* ========================================== */}
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            
            {/* ÚJ: Rendezés panel és találatok száma */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 3, 
              px: 1,
              flexWrap: 'wrap', // Mobilon szépen egymás alá csússzon
              gap: 2
            }}>
              <Typography variant="body1" sx={{ color: '#555', fontWeight: 'bold' }}>
                {szurtBorok.length} bort találtunk
              </Typography>

              {/* Rendezés Legördülő */}
              <FormControl size="small" sx={{ minWidth: 220, bgcolor: 'white' }}>
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
                  <MenuItem value="alap">Ajánlott</MenuItem>
                  <MenuItem value="nepszeru">Legnépszerűbb</MenuItem>
                  <MenuItem value="ar_no">Ár: Alacsonytól Magasig</MenuItem>
                  <MenuItem value="ar_csokken">Ár: Magastól Alacsonyig</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {szurtBorok.length > 0 ? (
              <div className="wine-grid">
                {szurtBorok.map((bor) => (
                  <WineCard key={bor.id} bor={bor} kiszerelesek={kiszerelesek} />
                ))}
              </div>
            ) : (
              <Box sx={{ textAlign: 'center', py: 10, bgcolor: 'white', borderRadius: 4, border: '1px dashed #ccc' }}>
                <Typography variant="h6" color="textSecondary" sx={{ mb: 2 }}>
                  Nem találtunk a szűrésnek megfelelő bort.
                </Typography>
                <Button variant="contained" sx={{ bgcolor: '#722f37', '&:hover': { bgcolor: '#5a252c' } }} onClick={handleResetFilters}>
                  Összes bor mutatása
                </Button>
              </Box>
            )}

          </Box>

        </Box>
      </Container>
    </Box>
  );
}