import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { 
  Container, Grid, Paper, Typography, Box, Tabs, Tab, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, Divider, Avatar, Card, CardContent, CircularProgress
} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import EventIcon from '@mui/icons-material/Event';

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
      console.log("Rendelések lekérése indul...");
      const orderRes = await fetch(`http://localhost:5000/api/rendeles/user/${user.id}`);
      if (!orderRes.ok) throw new Error(`Rendelés backend hiba: ${orderRes.status}`);
      const orderData = await orderRes.json();
      setOrders(Array.isArray(orderData) ? orderData : []);
      
      console.log("Foglalások lekérése indul...");
      const bookingRes = await fetch(`http://localhost:5000/api/foglalas/user/${user.id}`);
      if (!bookingRes.ok) throw new Error(`Foglalás backend hiba: ${bookingRes.status}`);
      const bookingData = await bookingRes.json();
      setBookings(Array.isArray(bookingData) ? bookingData : []);
      
    } catch (err) {
      console.error("Hiba történt az adatok lekérésekor:", err.message);
    } finally {
      // Ez tünteti el a forgó karikát minden esetben!
      setLoading(false);
    }
  };

  if (!user) return <Typography sx={{ mt: 5, textAlign: 'center' }}>Kérjük, jelentkezz be a profilod megtekintéséhez.</Typography>;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Grid container spacing={4}>
        
        {/* BAL OLDAL: Kapcsolati Adatok */}
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

        {/* JOBB OLDAL: Tevékenységek fülek */}
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
                  {/* RENDELÉSEK FÜL */}
                  {tabValue === 0 && (
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Rendelésszám</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Dátum</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Összeg</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Állapot</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {orders.length > 0 ? orders.map((order) => (
                            <TableRow key={order.id} hover>
                              <TableCell>#{order.id}</TableCell>
                              <TableCell>{new Date(order.datum).toLocaleDateString('hu-HU')}</TableCell>
                              <TableCell sx={{ fontWeight: 'bold' }}>{HUF.format(order.vegosszeg)} Ft</TableCell>
                              <TableCell>
                                <Chip 
                                  label={order.statusz || "Feldolgozás alatt"} 
                                  size="small" 
                                  sx={{ bgcolor: '#722f37', color: 'white' }} 
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

                  {/* FOGLALÁSOK FÜL */}
                  {tabValue === 1 && (
                    <Grid container spacing={2}>
                      {bookings.length > 0 ? bookings.map((booking) => (
                        <Grid item xs={12} key={booking.id}>
                          <Card variant="outlined" sx={{ borderRadius: 2 }}>
                            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Box>
                                <Typography variant="h6" sx={{ color: '#722f37' }}>
                                  {booking.szolgaltatas_nev || "Borkóstoló"}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Időpont: {new Date(booking.idopont || booking.datum).toLocaleString('hu-HU')}
                                </Typography>
                                <Typography variant="body2">Létszám: {booking.letszam} fő</Typography>
                              </Box>
                              <Chip label={booking.statusz === 'PENDING' ? 'Feldolgozás alatt' : 'Visszaigazolva'} color={booking.statusz === 'PENDING' ? 'warning' : 'success'} variant="outlined" />
                            </CardContent>
                          </Card>
                        </Grid>
                      )) : (
                        <Typography sx={{ p: 2, textAlign: 'center', width: '100%' }}>
                          Még nincs foglalásod.
                        </Typography>
                      )}
                    </Grid>
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