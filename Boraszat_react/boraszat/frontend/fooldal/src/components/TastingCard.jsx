import { useState } from "react";
import { Card, CardContent, CardMedia, Typography, Button, Box, Select, MenuItem, FormControl, InputLabel, Chip } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StarIcon from '@mui/icons-material/Star';

const HUF = new Intl.NumberFormat("hu-HU");

export default function TastingCard({ csomag, onValaszt }) {
  const [letszam, setLetszam] = useState(2);

  const getWineImage = (nev) => {
    const n = nev.toLowerCase();
    if (n.includes("pince")) return "pince3.jpg";
    if (n.includes("szállás")) return "hegykozseg.jpg"; 
    return "borvidek.jpg"; 
  };

  // Dátum formázása (pl. 2026-03-15)
  const formatDatum = (datumStr) => {
    if (!datumStr) return "Időpont egyeztetéssel";
    return new Date(datumStr).toLocaleDateString('hu-HU', { 
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3, transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } }}>
      <CardMedia
        component="img"
        height="200"
        image={`/images/${getWineImage(csomag.nev)}`}
        alt={csomag.nev}
        sx={{ objectFit: 'cover' }}
        onError={(e) => { e.currentTarget.src = "/images/placeholder.jpg"; }}
      />
      
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* NÉV ÉS LEÍRÁS */}
        <Typography variant="h6" sx={{ color: '#722f37', fontWeight: 'bold', mb: 0.5 }}>
          {csomag.nev}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
          {csomag.leiras || "Különleges élmény a Szente Pincében."}
        </Typography>

        {/* ÚJ MEZŐK: Dátum, Időtartam, Extra */}
        <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {/* Dátum */}
            {csomag.datum ? (
                 <Chip icon={<EventIcon />} label={formatDatum(csomag.datum)} color="primary" size="small" sx={{ bgcolor: '#722f37' }} />
            ) : (
                 <Chip label="Szabad időpont" variant="outlined" size="small" sx={{ borderColor: '#722f37', color: '#722f37' }} />
            )}
            
            {/* Időtartam */}
            {csomag.idotartam && (
                <Chip icon={<AccessTimeIcon />} label={csomag.idotartam.substring(0, 5)} size="small" variant="outlined" />
            )}

            {/* Extra infó */}
            {csomag.extra && (
                <Chip icon={<StarIcon />} label={csomag.extra} size="small" color="warning" variant="outlined" />
            )}
        </Box>
        
        <Box sx={{ mb: 2 }}>
            <Typography variant="caption" display="block" color="text.secondary">
                Max létszám: {csomag.kapacitas} fő
            </Typography>
        </Box>

        {/* ÁR */}
        <Typography variant="h6" sx={{ color: '#722f37', fontWeight: 'bold', mb: 2 }}>
          {HUF.format(csomag.ar)} Ft <span style={{fontSize:'0.7em', color: '#666'}}>/ fő</span>
        </Typography>

        {/* VÁLASZTÓ GOMBOK */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <FormControl size="small" sx={{ minWidth: 80 }}>
            <InputLabel>Fő</InputLabel>
            <Select value={letszam} label="Fő" onChange={(e) => setLetszam(Number(e.target.value))}>
              {[1, 2, 3, 4, 5, 6, 8, 10, 15, 20].map((n) => (
                <MenuItem key={n} value={n} disabled={n > csomag.kapacitas}>{n} fő</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button 
            variant="contained" fullWidth 
            onClick={() => onValaszt(csomag, letszam)}
            sx={{ bgcolor: '#722f37', fontWeight: 'bold', '&:hover': { bgcolor: '#5a252c' } }}
          >
            Kiválasztom
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}