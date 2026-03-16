import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from './context/AuthContext.jsx'; 
import { useCart } from './context/CartContext.jsx';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  AppBar, Toolbar, Button, Box, IconButton, 
  Avatar, Menu, MenuItem, Tooltip, Badge, Typography, Drawer, List, ListItem, ListItemText,
  Dialog, DialogTitle, DialogContent, DialogActions // <-- ÚJ IMPORTOK AZ ELEGÁNS ABLAKHOZ
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import WineBarIcon from '@mui/icons-material/WineBar';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useCart(); 
  const navigate = useNavigate();
  const location = useLocation();
  const [cartOpen, setCartOpen] = useState(false);

  // ÚJ: Állapot az elegáns kijelentkezés ablakhoz
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const cartItemCount = cartItems ? cartItems.reduce((total, item) => total + item.amount, 0) : 0;

  const [anchorEl, setAnchorEl] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // BIZTONSÁGI ŐR
  useEffect(() => {
    const checkSession = () => {
      const storedUser = sessionStorage.getItem('user');
      const loginTime = sessionStorage.getItem('loginTime');

      if (storedUser && loginTime) {
        const currentTime = new Date().getTime();
        
        const idokorlat = 60 * 60 * 1000; 

        if (currentTime - parseInt(loginTime) > idokorlat) {
          sessionStorage.removeItem('user');
          sessionStorage.removeItem('loginTime');
          sessionStorage.removeItem('token');
          setLogoutDialogOpen(true); 
        }
      }
    };
    checkSession(); 
    const interval = setInterval(checkSession, 2000); 
    return () => clearInterval(interval);
  }, []);

  const handleAvatarClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleClose();
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('loginTime');
    sessionStorage.removeItem('token');
    logout();
    navigate('/');
  };

  // Amikor rákattint a felugró ablak "Újra bejelentkezem" gombjára
  const handleDialogClose = () => {
    setLogoutDialogOpen(false);
    logout(); // Biztonság kedvéért a Context-ből is kiléptetjük
    navigate('/login');
  };

  const navItems = [
    { label: 'Főoldal', path: '/' },
    { label: 'Borrendelés', path: '/borrendeles' },
    { label: 'Borkóstolás', path: '/borkostolas' },
    { label: 'Rólunk', path: '/about' },
    { label: 'Kapcsolat', path: '/kapcsolat' }
  ];

  return (
    <>
      <AppBar 
        position="fixed" 
        sx={{
          background: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(10px)',
          boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.05)' : 'none',
          padding: '5px 0',
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          
          <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/')}>
            <WineBarIcon sx={{ color: '#722f37', fontSize: 32, mr: 1 }} />
            <Typography variant="h6" sx={{ fontFamily: 'Playfair Display, serif', fontWeight: 'bold', color: '#333', display: { xs: 'none', sm: 'block' } }}>
              SZENTE <span style={{ color: '#722f37' }}>PINCÉSZET</span>
            </Typography>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            {navItems.map((item) => (
              <Button 
                key={item.label} 
                onClick={() => navigate(item.path)}
                sx={{ 
                  color: location.pathname === item.path ? '#722f37' : '#555',
                  fontWeight: location.pathname === item.path ? 'bold' : 500,
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  '&:hover': { color: '#722f37', backgroundColor: 'transparent' }
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton onClick={() => setCartOpen(true)} sx={{ color: '#722f37', mr: 1 }}>
              <Badge badgeContent={cartItemCount} sx={{ '& .MuiBadge-badge': { backgroundColor: '#722f37', color: 'white' } }}>
                <ShoppingCartIcon />
              </Badge>
            </IconButton>

            {user ? (
              <>
                <Tooltip title="Profilom">
                  <IconButton onClick={handleAvatarClick} sx={{ p: 0 }}>
                    <Avatar sx={{ bgcolor: '#722f37', color: 'white', width: 35, height: 35 }}>
                      {user.nev ? user.nev.charAt(0).toUpperCase() : 'U'}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                  <MenuItem onClick={() => { handleClose(); navigate('/profilom'); }}>Profilom</MenuItem>
                  {user.role === 'ADMIN' && <MenuItem onClick={() => { handleClose(); navigate('/admin'); }}>Admin Vezérlőpult</MenuItem>}
                  <MenuItem onClick={handleLogout}>Kijelentkezés</MenuItem>
                </Menu>
              </>
            ) : (
              <Button variant="contained" onClick={() => navigate('/login')} sx={{ bgcolor: '#722f37', borderRadius: '20px', display: { xs: 'none', sm: 'block' }, '&:hover': { bgcolor: '#5a252c' } }}>
                Bejelentkezés
              </Button>
            )}

            <IconButton onClick={() => setMobileOpen(true)} sx={{ display: { md: 'none' }, color: '#722f37' }}>
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* MOBIL MENÜ DRAWER */}
      <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)} PaperProps={{ sx: { width: 250, bgcolor: '#fdfbfb', pt: 2 } }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
           <WineBarIcon sx={{ color: '#722f37', fontSize: 40 }} />
        </Box>
        <List>
          {navItems.map((item) => (
            <ListItem button key={item.label} onClick={() => { navigate(item.path); setMobileOpen(false); }}>
              <ListItemText primary={item.label} primaryTypographyProps={{ color: '#722f37', fontWeight: 'bold', textAlign: 'center' }} />
            </ListItem>
          ))}
          {!user && (
            <ListItem button onClick={() => { navigate('/login'); setMobileOpen(false); }}>
              <ListItemText primary="BEJELENTKEZÉS" primaryTypographyProps={{ color: '#722f37', fontWeight: 'bold', textAlign: 'center' }} />
            </ListItem>
          )}
        </List>
      </Drawer>

      {/* KOSÁR OLDALSÓ PANEL */}
      <Drawer 
        anchor="right" 
        open={cartOpen} 
        onClose={() => setCartOpen(false)}
        PaperProps={{ sx: { width: { xs: '100%', sm: 400 }, p: 3, bgcolor: '#fdfbfb' } }}
      >
        <Typography variant="h5" sx={{ color: '#722f37', fontWeight: 'bold', mb: 3, fontFamily: 'serif', borderBottom: '1px solid #ddd', pb: 2 }}>
          Kosár tartalma
        </Typography>

        {cartItems.length === 0 ? (
          <Box sx={{ textAlign: 'center', mt: 10 }}>
            <Typography color="text.secondary">A kosarad jelenleg üres.</Typography>
            <Button onClick={() => {setCartOpen(false); navigate('/borrendeles');}} sx={{ mt: 2, color: '#722f37' }}>
              Irány a webshop
            </Button>
          </Box>
        ) : (
          <>
            <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
              {cartItems.map((item) => (
                  <Box key={`${item.id}-${item.kiszereles_id}`} sx={{ display: 'flex', mb: 3, pb: 2, borderBottom: '1px dotted #ccc', alignItems: 'center' }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography sx={{ fontWeight: 'bold', color: '#333' }}>{item.nev}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.amount} x {item.ar} Ft
                    </Typography>
                  </Box>
                  <Typography sx={{ fontWeight: 'bold', color: '#722f37' }}>
                    {item.amount * item.ar} Ft
                  </Typography>
                </Box>
              ))}
            </Box>

            <Box sx={{ pt: 3, borderTop: '2px solid #722f37' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">Összesen:</Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#722f37' }}>
                  {cartItems.reduce((sum, item) => sum + (item.ar * item.amount), 0)} Ft
                </Typography>
              </Box>
              <Button 
                fullWidth 
                variant="contained" 
                onClick={() => {setCartOpen(false); navigate('/Checkout');}}
                sx={{ bgcolor: '#722f37', py: 1.5, borderRadius: '30px', fontWeight: 'bold', '&:hover': { bgcolor: '#5a252c' } }}
              >
                Tovább a pénztárhoz
              </Button>
            </Box>
          </>
        )}
      </Drawer>

      {/* ======================================================== */}
      {/* ELEGÁNS KIJELENTKEZÉS FIGYELMEZTETŐ ABLAK (MODAL) */}
      {/* ======================================================== */}
      <Dialog 
        open={logoutDialogOpen} 
        PaperProps={{ 
          sx: { 
            borderRadius: 4, 
            p: 3, 
            textAlign: 'center',
            minWidth: '320px',
            boxShadow: '0 10px 40px rgba(114, 47, 55, 0.2)'
          } 
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <WineBarIcon sx={{ color: '#722f37', fontSize: 50 }} />
        </Box>
        <DialogTitle sx={{ fontFamily: 'Playfair Display', color: '#333', fontWeight: 'bold', fontSize: '1.6rem', p: 0, mb: 1 }}>
          Munkamenet lejárt
        </DialogTitle>
        <DialogContent sx={{ p: 0, mb: 3 }}>
          <Typography variant="body1" sx={{ color: '#666' }}>
            Biztonsági okokból automatikusan kijelentkeztettünk az inaktivitás miatt.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 1 }}>
          <Button 
            variant="contained" 
            onClick={handleDialogClose} 
            sx={{ 
              bgcolor: '#722f37', 
              color: 'white', 
              borderRadius: '50px', 
              px: 4, 
              py: 1.2,
              fontWeight: 'bold',
              '&:hover': { bgcolor: '#5a252c', transform: 'scale(1.02)' },
              transition: 'all 0.2s'
            }}
          >
            Újra bejelentkezem
          </Button>
        </DialogActions>
      </Dialog>

      <Toolbar />
    </>
  );
}