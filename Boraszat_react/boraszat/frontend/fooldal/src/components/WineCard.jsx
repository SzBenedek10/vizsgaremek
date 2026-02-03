import React, { useState } from 'react';
import { 
  Card, CardContent, CardMedia, Typography, Button, Box, 
  Select, MenuItem, FormControl, InputLabel, Chip 
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from '../context/CartContext';

const HUF = new Intl.NumberFormat("hu-HU");

export default function WineCard({ bor }) {
  const [db, setDb] = useState(1);
  const { addToCart } = useCart();

  // 1. Ár kalkuláció: Alap ár * Szorzó (ha nincs szorzó, akkor 1)
  const szorzo = bor.szorzo || 1;
  const vegsoAr = bor.ar * szorzo;

  const getWineImage = (nev) => {
    const n = nev.toLowerCase();
    if (n.includes("lesencei")) return "lacibetyar.jpg";
    if (n.includes("kéknyelvű")) return "keknyelvu.jpg";
    if (n.includes("lecsó")) return "lecsó.jpg";
    if (n.includes("olaszrizling")) return "rizling.jpg";
    if (n.includes("szürkebarát")) return "szurkebarat.jpg";
    if (n.includes("rózsakő")) return "rozsako.jpg";
    if (n.includes("rosé")) return "rose.jpg";
    if (n.includes("cabernet")) return "cabernet.jpg";
    if (n.includes("kékfrankos")) return "kekfrankos.jpg";
    if (n.includes("muskotály")) return "muskotaly.jpg";
    return "placeholder.jpg";
  };

  // Kosárba tételkor módosítjuk a bor objektumot, hogy a felszorzott ár kerüljön bele!
  const handleAddToCart = () => {
    const borKosarba = {
        ...bor, 
        ar: vegsoAr // Felülírjuk az alap árat a felszorzottal
    };
    addToCart(borKosarba, db);
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: 3,
        transition: '0.3s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 8px 20px rgba(114, 47, 55, 0.2)'
        },
        position: 'relative' // A címke pozicionálásához
      }}
    >
      {/* Kép szekció */}
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="250"
          image={`/images/${getWineImage(bor.nev)}`}
          alt={bor.nev}
          onError={(e) => { e.currentTarget.src = "/images/placeholder.jpg"; }}
          sx={{ objectFit: 'cover' }}
        />
        {/* Kiszerelés címke a sarokban (csak ha extra méret) */}
        {szorzo > 1 && (
          <Chip 
            label={bor.kiszereles_nev || 'Extra méret'} 
            color="secondary" 
            size="small"
            sx={{ 
              position: 'absolute', 
              top: 10, 
              right: 10, 
              bgcolor: '#722f37',
              fontWeight: 'bold'
            }} 
          />
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Név és Évjárat */}
        <Typography variant="h6" component="div" sx={{ color: '#722f37', fontWeight: 'bold', lineHeight: 1.2, mb: 0.5 }}>
          {bor.nev}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 'bold' }}>
           Évjárat: {bor.evjarat}
        </Typography>

        {/* Kiszerelés kiírása szövegesen is */}
        <Typography variant="caption" sx={{ color: '#555', fontStyle: 'italic', mb: 2, display: 'block' }}>
            Kiszerelés: {bor.kiszereles_nev || 'Normál palack'}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
          {bor.leiras}
        </Typography>

        {/* Ár */}
        <Typography variant="h5" sx={{ color: '#722f37', fontWeight: 'bold', mt: 'auto', mb: 2 }}>
          {HUF.format(vegsoAr)} Ft
        </Typography>

        {/* Kosárba tétel vezérlők */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <FormControl size="small" sx={{ minWidth: 80 }}>
            <InputLabel>Db</InputLabel>
            <Select
              value={db}
              label="Db"
              onChange={(e) => setDb(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5, 6, 12].map((n) => (
                <MenuItem key={n} value={n}>{n} db</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button 
            variant="contained" 
            fullWidth 
            startIcon={<ShoppingCartIcon />}
            onClick={handleAddToCart}
            sx={{ 
              bgcolor: '#722f37', 
              '&:hover': { bgcolor: '#5a252c' },
              fontWeight: 'bold'
            }}
          >
            Kosárba
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}