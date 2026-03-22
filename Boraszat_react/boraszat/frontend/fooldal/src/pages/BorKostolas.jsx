import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import TastingCard from "../components/TastingCard";
import { 
  Container, Box, Typography, Divider, CircularProgress
} from "@mui/material";

export default function BorKostolas() {
  const [csomagok, setCsomagok] = useState([]);
  const [foglaltsag, setFoglaltsag] = useState({}); 
  const [loading, setLoading] = useState(true);
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
    // Kiszámoljuk a pontos szabad helyet a backend adatai alapján
    const szabad = csomag.kapacitas - (foglaltsag[csomag.id] || 0);
    
    navigate("/kostolo-foglalas", { 
      // Átadjuk a maxSzabad értéket is a checkoutnak!
      state: { selectedPackage: { ...csomag, letszam: 1, maxSzabad: szabad } } 
    });
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
        
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="overline" sx={{ color: '#722f37', fontWeight: 'bold', fontSize: '1rem', letterSpacing: 2 }}>
            Kínálatunk
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#333', mb: 2, mt: 1 }}>
            Borkóstoló programok
          </Typography>
          <Divider sx={{ width: '580px', mx: 'auto', borderBottomWidth: 3, borderColor: '#722f37', opacity: 0.8 }} />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <div className="wine-grid">
            {csomagok.map((csomag) => (
              <TastingCard 
                key={csomag.id} 
                csomag={csomag} 
                onValaszt={handleBooking} 
                isFull={(foglaltsag[csomag.id] || 0) >= csomag.kapacitas} 
                szabadHely={csomag.kapacitas - (foglaltsag[csomag.id] || 0)}
              />
            ))}
          </div>
        </Box>

      </Container>
    </Box>
  );
}