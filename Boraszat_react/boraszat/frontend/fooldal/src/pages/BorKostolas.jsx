import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import TastingCard from "../components/TastingCard";
import { Container, Typography, Grid, Box, Paper, Button, CircularProgress } from '@mui/material';

const HUF = new Intl.NumberFormat("hu-HU");

export default function BorKostolas() {
  const [csomagok, setCsomagok] = useState([]);
  const [valasztott, setValasztott] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/szolgaltatasok")
      .then((res) => res.json())
      .then((data) => {
        // Mivel nincs már 'tipus' oszlop, betöltünk mindent, amit a szerver küld (ott van aktiv=1 szűrés)
        setCsomagok(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Hiba:", err);
        setLoading(false);
      });
  }, []);

  const handleValasztas = (csomag, letszam) => {
    setValasztott({ ...csomag, letszam });
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress sx={{ color: '#722f37' }} />
    </Box>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4, bgcolor: '#fdfbfb', minHeight: '100vh' }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" sx={{ color: '#722f37', fontWeight: 'bold', fontFamily: 'serif' }}>
           Élmények a Pincében
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
           Válasszon aktuális programjaink közül!
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* BAL OLDAL: VÁLASZTOTT CSOMAG */}
        <Grid item xs={12} md={3} order={{ xs: 1, md: 2 }}>
            <Paper elevation={3} sx={{ p: 3, position: 'sticky', top: 100 }}>
                <Typography variant="h6" sx={{ borderBottom: '2px solid #722f37', pb: 1, mb: 2 }}>
                    Választott program
                </Typography>
                
                {!valasztott ? (
                  <Typography variant="body2" color="text.secondary">Kérjük, válasszon a listából.</Typography>
                ) : (
                  <Box>
                     <Typography variant="subtitle1" fontWeight="bold">{valasztott.nev}</Typography>
                     {valasztott.datum && (
                        <Typography variant="caption" display="block" color="primary">
                            Dátum: {new Date(valasztott.datum).toLocaleDateString('hu-HU')}
                        </Typography>
                     )}
                     <Typography variant="body2" sx={{ mt: 1 }}>{valasztott.letszam} fő részére</Typography>
                     <Typography variant="h6" sx={{ mt: 2, color: '#722f37', fontWeight: 'bold' }}>
                        {HUF.format(valasztott.ar * valasztott.letszam)} Ft
                     </Typography>
                     
                     <Button 
                        variant="contained" fullWidth sx={{ mt: 2, bgcolor: '#722f37', '&:hover': { bgcolor: '#5a252c' } }}
                        onClick={() => navigate("/kostolo-foglalas", { state: { selectedPackage: valasztott } })}
                     >
                        Tovább a foglaláshoz
                     </Button>
                  </Box>
                )}
            </Paper>
        </Grid>

        {/* JOBB OLDAL: KÍNÁLAT */}
        <Grid item xs={12} md={9} order={{ xs: 2, md: 1 }}>
            <Grid container spacing={3}>
                {csomagok.map((csomag) => (
                    <Grid item key={csomag.id} xs={12} sm={6} lg={4}>
                        <TastingCard csomag={csomag} onValaszt={handleValasztas} />
                    </Grid>
                ))}
            </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}