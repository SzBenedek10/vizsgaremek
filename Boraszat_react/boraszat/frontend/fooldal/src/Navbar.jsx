import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext.jsx'; //
import { useNavigate } from 'react-router-dom';
import { 
  AppBar, Toolbar, Button, Box, IconButton, 
  Avatar, Menu, MenuItem, Tooltip 
} from '@mui/material';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext); //
  const navigate = useNavigate();
  
  // Menü állapot kezelése az Avatarhoz (kijelentkezéshez)
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleAvatarClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleClose();
    logout(); //
    navigate('/');
  };

  return (
    <AppBar position="static" sx={{ bgcolor: 'rgba(255, 255, 255, 0.9)', color: '#722f37', boxShadow: 1 }}>
      <Toolbar sx={{ justifyContent: 'center', gap: 2 }}>
        {/* Navigációs gombok */}
        <Button onClick={() => navigate('/')} color="inherit">Főoldal</Button>
        <Button onClick={() => navigate('/borrendeles')} color="inherit">Borrendelés</Button>
        <Button onClick={() => navigate('/bortura')} color="inherit">Bortúra</Button>

        {/* Jobb felső sarok: Login Gomb vagy Avatar */}
        <Box sx={{ position: 'absolute', right: 20 }}>
          {user ? (
            <>
              <Tooltip title="Profilom">
                <IconButton onClick={handleAvatarClick} sx={{ p: 0 }}>
                  <Avatar sx={{ bgcolor: '#722f37', border: '2px solid white' }}>
                    {/* A név első betűjét rakjuk bele */}
                    {user.nev ? user.nev.charAt(0).toUpperCase() : 'U'}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem disabled sx={{ fontWeight: 'bold', color: '#722f37' }}>{user.nev}</MenuItem>
                <MenuItem onClick={handleLogout}>Kijelentkezés</MenuItem>
              </Menu>
            </>
          ) : (
            <Button 
              variant="contained" 
              onClick={() => navigate('/login')}
              sx={{ 
                bgcolor: '#722f37', 
                borderRadius: '20px',
                '&:hover': { bgcolor: '#5a252c' }
              }}
            >
              Bejelentkezés
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}