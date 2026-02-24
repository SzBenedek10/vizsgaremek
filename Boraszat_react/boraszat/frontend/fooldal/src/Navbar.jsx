import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from './context/AuthContext.jsx'; 
import { useCart } from './context/CartContext.jsx';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  AppBar, Toolbar, Button, Box, IconButton, 
  Avatar, Menu, MenuItem, Tooltip, Badge, Typography, Drawer, List, ListItem, ListItemText
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

  // Kosár badge számítása
  const cartItemCount = cartItems ? cartItems.reduce((total, item) => total + item.amount, 0) : 0;

  const [anchorEl, setAnchorEl] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Görgetés figyelése
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAvatarClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleClose();
    logout();
    navigate('/');
  };

  const navItems = [
    { label: 'Főoldal', path: '/' },
    { label: 'Borrendelés', path: '/borrendeles' },
    { label: 'Borkóstolás', path: '/borkostolas' },
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
          
          {/* LOGÓ RÉSZ */}
          <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/')}>
            <WineBarIcon sx={{ color: '#722f37', fontSize: 32, mr: 1 }} />
            <Typography variant="h6" sx={{ fontFamily: 'Playfair Display, serif', fontWeight: 'bold', color: '#333', display: { xs: 'none', sm: 'block' } }}>
              SZENTE <span style={{ color: '#722f37' }}>PINCÉSZET</span>
            </Typography>
          </Box>

          {/* ASZTALI MENÜ KÖZÉPEN */}
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

          {/* JOBB OLDALI IKONOK (Kosár + Profil) */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            
            {/* Kosár Ikon */}
            <IconButton onClick={() => setCartOpen(true)} sx={{ color: '#722f37', mr: 1 }}>
            <Badge badgeContent={cartItemCount} sx={{ '& .MuiBadge-badge': { backgroundColor: '#722f37', color: 'white' } }}>
            <ShoppingCartIcon />
            </Badge>
            </IconButton>

            {/* Profil / Bejelentkezés */}
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

            {/* Hamburger Menü Mobilon */}
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
      {/* --- KOSÁR OLDALSÓ PANEL --- */}
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

      {/* Távtartó, hogy a rögzített menü ne takarja ki a tartalmat */}
      <Toolbar />
    </>
  );
}