import React, { useContext } from 'react';
import { Container, Box, Typography, TextField, Button, Paper } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext'; 
import Swal from 'sweetalert2'; 
import { Axios } from 'axios';

export default function SignInSide() {
  const navigate = useNavigate();
  const location = useLocation(); 
  const from = location.state?.from || '/'; 
  const { login } = useContext(AuthContext); 

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
  const res = await axios.post('http://localhost:5000/api/login', { 
    email, 
    password_hash: password 
  });
  
  login(res.data.token, res.data.user); 
  
  Swal.fire({
    title: 'Üdvözlünk bent!',
    text: `Sikeresen bejelentkeztél, ${res.data.user.nev}!`,
    icon: 'success',
    confirmButtonColor: '#722f37',
    timer: 1000,
    timerProgressBar: true,
    showConfirmButton: false
  }).then(() => {
    if (res.data.user.role === 'ADMIN') {
        navigate('/admin');
    } else {
        navigate(from);
    }
  });

    } catch (err) {
      console.error("Belépési hiba:", err);
      
      Swal.fire({
        title: 'Hiba történt!',
        text: err.response?.data?.error || "Hibás email vagy jelszó!",
        icon: 'error',
        confirmButtonColor: '#722f37'
      });
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Container component="main" maxWidth="xs">
        <Paper elevation={6} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 4 }}>
          
          <Box sx={{ m: 1, p: 1, bgcolor: '#722f37', borderRadius: '50%', display: 'flex' }}>
            <LockOutlinedIcon sx={{ color: 'white' }} />
          </Box>

          <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold', color: '#722f37', mb: 2 }}>
            Bejelentkezés
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
            <TextField margin="normal" required fullWidth label="Email cím" name="email" autoFocus />
            <TextField margin="normal" required fullWidth name="password" label="Jelszó" type="password" />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 3, mb: 2, 
                backgroundColor: '#722f37',
                '&:hover': { backgroundColor: '#5a252c' },
                borderRadius: '20px',
                py: 1.5,
                fontWeight: 'bold'
              }}
            >
              Belépés
            </Button>

            <Box sx={{ textAlign: 'center', mt: 1 }}>
              <Button onClick={() => navigate('/signup')} sx={{ color: '#722f37', textTransform: 'none' }}>
                Nincs még fiókod? Regisztrálj!
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}