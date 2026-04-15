import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { 
  Container, Grid, Paper, Typography, Box, Tabs, Tab, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, Divider, Avatar, CircularProgress, IconButton, Tooltip
} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import EventIcon from '@mui/icons-material/Event';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import Swal from 'sweetalert2';

const HUF = new Intl.NumberFormat("hu-HU");

export default function Profilom() {
  const { user } = useContext(AuthContext);
  const [tabValue, setTabValue] = useState(0);
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const orderRes = await fetch(`http://localhost:5000/api/rendeles/user/${user.id}`);
      if (!orderRes.ok) throw new Error(`Rendelés backend hiba: ${orderRes.status}`);
      const orderData = await orderRes.json();
      setOrders(Array.isArray(orderData) ? orderData : []);
      
      const bookingRes = await fetch(`http://localhost:5000/api/foglalas/user/${user.id}`);
      if (!bookingRes.ok) throw new Error(`Foglalás backend hiba: ${bookingRes.status}`);
      const bookingData = await bookingRes.json();
      setBookings(Array.isArray(bookingData) ? bookingData : []);
      
    } catch (err) {
      console.error("Hiba történt az adatok lekérésekor:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = async (bookingId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/foglalas/${bookingId}/szamla`);
      
      if (!response.ok) {
        throw new Error("Hiba történt a számla generálásakor.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Szamla_Foglalas_${bookingId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();

    } catch (error) {
      console.error("Letöltési hiba:", error);
      Swal.fire({
        icon: 'error',
        title: 'Hiba',
        text: 'Nem sikerült letölteni a számlát!',
        confirmButtonColor: '#722f37'
      });
    }
  };

  if (!user) return <Typography sx={{ mt: 5, textAlign: 'center' }}>Kérjük, jelentkezz be a profilod megtekintéséhez.</Typography>;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Grid container spacing={4}>

        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center', borderRadius: 4, borderTop: '5px solid #722f37' }}>
            <Avatar 
              sx={{ width: 100, height: 100, bgcolor: '#722f37', mx: 'auto', mb: 2, fontSize: '2rem' }}
            >
              {user.nev ? user.nev.charAt(0).toUpperCase() : 'U'}
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{user.nev}</Typography>
            <Typography color="text.secondary" gutterBottom>{user.email}</Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="subtitle2" sx={{ color: '#722f37', fontWeight: 'bold' }}>
                Kapcsolati adatok
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Telefon:</strong> {user.telefonszam || 'Nincs megadva'}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Alapértelmezett cím:</strong><br />
                {user.irsz} {user.varos}<br />
                {user.utca} {user.hazszam}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ borderRadius: 4, overflow: 'hidden', minHeight: '300px' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#f8f9fa' }}>
              <Tabs 
                value={tabValue} 
                onChange={(e, newVal) => setTabValue(newVal)} 
                sx={{ 
                  '& .MuiTabs-indicator': { bgcolor: '#722f37' },
                  '& .Mui-selected': { color: '#722f37 !important' }
                }}
              >
                <Tab icon={<ShoppingBagIcon />} label="Rendeléseim" iconPosition="start" />
                <Tab icon={<EventIcon />} label="Foglalásaim" iconPosition="start" />
              </Tabs>
            </Box>

            <Box sx={{ p: 3 }}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress sx={{ color: '#722f37' }} /></Box>
              ) : (
                <>
                  {tabValue === 0 && (
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Rendelésszám</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Dátum</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Összeg</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Állapot</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {orders.length > 0 ? orders.map((order) => (
                            <TableRow key={order.id} hover>
                              <TableCell sx={{ color: '#555' }}>#{order.id}</TableCell>
                              <TableCell sx={{ color: '#555' }}>
                                {new Date(order.datum).toLocaleDateString('hu-HU', { year: 'numeric', month: '2-digit', day: '2-digit' })}.
                              </TableCell>
                              <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>{HUF.format(order.vegosszeg)} Ft</TableCell>
                              <TableCell>
                                <Chip 
                                  label={(order.statusz || "FELDOLGOZAS").toUpperCase()} 
                                  size="small" 
                                  sx={{ 
                                    bgcolor: '#722f37', 
                                    color: 'white', 
                                    fontWeight: 'bold', 
                                    letterSpacing: 0.5 
                                  }} 
                                />
                              </TableCell>
                            </TableRow>
                          )) : (
                            <TableRow>
                              <TableCell colSpan={4} align="center">Még nincs rendelésed.</TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}

                  {tabValue === 1 && (
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Szolgáltatás</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Időpont</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Létszám</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Állapot</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {bookings.length > 0 ? bookings.map((booking) => {
                            const isConfirmed = booking.statusz === 'CONFIRMED';

                            return (
                              <TableRow key={booking.id} hover>
                                <TableCell sx={{ color: '#555', fontWeight: 'bold' }}>
                                  {(booking.szolgaltatas_nev || "Borkóstoló").toUpperCase()}
                                </TableCell>
                                <TableCell sx={{ color: '#555' }}>
                                  {new Date(booking.idopont || booking.datum).toLocaleString('hu-HU', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>{booking.letszam} fő</TableCell>
                                
                                <TableCell>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Chip 
                                      label={
                                        booking.statusz === 'PENDING' ? 'FELDOLGOZÁS' : 
                                        isConfirmed ? 'VISSZAIGAZOLVA' : 'TÖRÖLVE'
                                      } 
                                      size="small" 
                                      sx={{ 
                                        bgcolor: booking.statusz === 'PENDING' ? '#722f37' : 
                                                 isConfirmed ? '#2e7d32' : '#d32f2f', 
                                        color: 'white', 
                                        fontWeight: 'bold', 
                                        letterSpacing: 0.5 
                                      }} 
                                    />
                                    
                                    <Tooltip title={isConfirmed ? "Számla letöltése (PDF)" : "Csak visszaigazolás után letölthető"}>
                                      <span>
                                        <IconButton 
                                          size="small"
                                          disabled={!isConfirmed}
                                          onClick={() => handleDownloadInvoice(booking.id)}
                                          sx={{ 
                                            color: isConfirmed ? '#d32f2f' : '#e0e0e0',
                                            '&:hover': {
                                              bgcolor: isConfirmed ? 'rgba(211, 47, 47, 0.1)' : 'transparent'
                                            }
                                          }}
                                        >
                                          <PictureAsPdfIcon />
                                        </IconButton>
                                      </span>
                                    </Tooltip>

                                  </Box>
                                </TableCell>
                              </TableRow>
                            );
                          }) : (
                            <TableRow>
                              <TableCell colSpan={4} align="center">Még nincs foglalásod.</TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}