import { useContext, useState } from 'react';
import { AuthContext } from './context/AuthContext';
import { useNavigate, Outlet } from 'react-router-dom';
import { AppBar, Toolbar, Button, Box, IconButton, Avatar, Menu, MenuItem, Tooltip } from '@mui/material';
import Footer from './components/footer';

export default function MainLayout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  return (
  <Box sx={{ 
    display: 'flex', 
    flexDirection: 'column', 
    minHeight: '100vh', 
    width: '100%',
    bgcolor: '#fdfbfb', // Nagyon halvány háttér az egész oldalnak
    color: '#4b2c2c'    // Sötétbarna alapértelmezett szövegszín (az index.css-edből)
  }}>
    <AppBar position="sticky" sx={{ bgcolor: 'rgba(255, 255, 255, 0.95)', color: '#722f37', boxShadow: 1 }}>
      <Toolbar sx={{ justifyContent: 'center', gap: 2 }}>
        <Button onClick={() => navigate('/')} color="inherit" sx={{ fontWeight: 'bold' }}>Főoldal</Button>
        <Button onClick={() => navigate('/borrendeles')} color="inherit" sx={{ fontWeight: 'bold' }}>Borrendelés</Button>
        <Button onClick={() => navigate('/bortura')} color="inherit" sx={{ fontWeight: 'bold' }}>Bortúra</Button>
        
        
          <Box sx={{ position: 'absolute', right: 20 }}>
            {user ? (
               <Avatar sx={{ bgcolor: '#722f37' }}>{user.nev?.charAt(0)}</Avatar>
            ) : (
              <Button onClick={() => navigate('/login')} sx={{ color: '#722f37' }}>Bejelentkezés</Button>
            )}
          
        </Box>
      </Toolbar>
    </AppBar>
    
    <Box component="main" sx={{ 
      flex: 1, 
      width: '100%',
      // Itt nem kényszerítünk fehér színt, így az index.css h1, h2, p stílusai érvényesülnek!
    }}>
      <Outlet /> 
    </Box>

    <Footer />
  </Box>
);
}