import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, CardMedia, Typography, Button, Box, 
  Select, MenuItem, FormControl, InputLabel, Chip 
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from '../context/CartContext';

const HUF = new Intl.NumberFormat("hu-HU");

export default function WineCard({ bor, kiszerelesek = [] }) {
  const [db, setDb] = useState(1);
  const [selectedKiszerelesId, setSelectedKiszerelesId] = useState(1); 
  const { addToCart } = useCart();

  // Alapértelmezés beállítása, amikor betölt a bor
  useEffect(() => {
    if (bor.kiszereles_id) {
        setSelectedKiszerelesId(bor.kiszereles_id);
    }
  }, [bor.kiszereles_id]);

  // Megkeressük a kiválasztott kiszerelés objektumot a listából
  // Ha még nincs betöltve a lista, használunk egy alapértelmezettet
  const aktualisKiszereles = kiszerelesek.find(k => k.id === selectedKiszerelesId) 
                              || { id: 1, megnevezes: '0.75L Palack', szorzo: 1 };

  // --- ÁR KALKULÁCIÓ ---
  // A bor.ar az ALAPÁR (1-es szorzóhoz). Ezt szorozzuk fel.
  const vegsoAr = Math.round(bor.ar * aktualisKiszereles.szorzo);

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

  const handleAddToCart = () => {
    const tetel = {
        ...bor,
        id: bor.id, // A bor ID marad
        ar: vegsoAr, // A felszorzott ár megy a kosárba
        kiszereles_nev: aktualisKiszereles.megnevezes, // Hogy lássuk a kosárban, mit vett
        kiszereles_id: selectedKiszerelesId // Fontos: ezt is elmentjük, hogy a rendelésnél tudjuk
    };
    addToCart(tetel, db);
  };

  return (
    <Card 
      sx={{ 
        height: '100%', display: 'flex', flexDirection: 'column', 
        borderRadius: 3, transition: '0.3s',
        '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 8px 20px rgba(114, 47, 55, 0.2)' },
        position: 'relative'
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="250"
          image={`/images/${getWineImage(bor.nev)}`}
          alt={bor.nev}
          onError={(e) => { e.currentTarget.src = "/images/placeholder.jpg"; }}
          sx={{ objectFit: 'cover' }}
        />
        {/* Csak akkor mutatunk címkét, ha nagyobb kiszerelést választott */}
        {aktualisKiszereles.szorzo > 1 && (
          <Chip 
            label={aktualisKiszereles.megnevezes} 
            color="secondary" size="small"
            sx={{ position: 'absolute', top: 10, right: 10, bgcolor: '#722f37', fontWeight: 'bold' }} 
          />
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" sx={{ color: '#722f37', fontWeight: 'bold', lineHeight: 1.2, mb: 0.5 }}>
          {bor.nev}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 'bold' }}>
           Évjárat: {bor.evjarat}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
          {bor.leiras}
        </Typography>

        {/* --- KISZERELÉS VÁLASZTÓ --- */}
        <FormControl fullWidth size="small" sx={{ mb: 2, mt: 'auto' }}>
            <InputLabel>Kiszerelés</InputLabel>
            <Select
                value={selectedKiszerelesId}
                label="Kiszerelés"
                onChange={(e) => setSelectedKiszerelesId(e.target.value)}
            >
                {kiszerelesek.map((k) => (
                    <MenuItem key={k.id} value={k.id}>
                        {k.megnevezes} {k.szorzo > 1 ? `(x${k.szorzo})` : ''}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>

        {/* ÁR MEGJELENÍTÉS */}
        <Typography variant="h5" sx={{ color: '#722f37', fontWeight: 'bold', mb: 2 }}>
          {HUF.format(vegsoAr)} Ft
        </Typography>

        {/* KOSÁR VEZÉRLŐK */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <FormControl size="small" sx={{ minWidth: 80 }}>
            <InputLabel>Db</InputLabel>
            <Select value={db} label="Db" onChange={(e) => setDb(Number(e.target.value))}>
              {[1, 2, 3, 4, 5, 6, 12].map((n) => <MenuItem key={n} value={n}>{n} db</MenuItem>)}
            </Select>
          </FormControl>

          <Button 
            variant="contained" fullWidth startIcon={<ShoppingCartIcon />} onClick={handleAddToCart}
            sx={{ bgcolor: '#722f37', '&:hover': { bgcolor: '#5a252c' }, fontWeight: 'bold' }}
          >
            Kosárba
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}