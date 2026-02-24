import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
// FONTOS: Ezeket importáld a @mui/material-ból:
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';

import MainLayout from "./MainLayout.jsx";
import Home from "./pages/Home/Home.jsx";
import BorRendeles from "./pages/BorRendeles.jsx";
import BorKostolas from "./pages/BorKostolas.jsx";
import SignInSide from "./pages/SignInSide.jsx";
import SignUpSide from "./pages/SignUpSide.jsx";
import { AuthProvider } from "./context/AuthContext"; 
import Checkout from './pages/Checkout';
import AdminDashboard from "./pages/AdminDashboard.jsx";
import TastingCheckout from "./pages/TastingCheckout.jsx"; 
import Contact  from "./pages/contact.jsx";
import Terms from "./pages/Terms.jsx";       
import Privacy from "./pages/Privacy.jsx";   
import Shipping from "./pages/Shipping.jsx";  
import WineDetails from "./pages/WineDetails.jsx";
import Profile from "./pages/Profile.jsx";

const theme = createTheme({
  typography: {
  
    fontFamily: "'Quicksand', sans-serif", 
 
    h1: { fontFamily: "'Playfair Display', serif", fontWeight: 700 },
    h2: { fontFamily: "'Playfair Display', serif", fontWeight: 600 },
    h3: { fontFamily: "'Playfair Display', serif", fontWeight: 600 },
    h4: { fontFamily: "'Playfair Display', serif", fontWeight: 600 },
    

    button: { 
      fontFamily: "'Quicksand', sans-serif", 
      fontWeight: 700, 
      textTransform: 'none' 
    }
  },
  palette: {
    primary: {
      main: '#722f37', 
    },
    secondary: {
      main: '#722f37', 
    },
    background: {
      default: '#fdfbfb',
    }
  }
});

export default function App() {
  return (
   
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      <AuthProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/borrendeles" element={<BorRendeles />} />
            <Route path="/borkostolas" element={<BorKostolas />} />
            <Route path="/login" element={<SignInSide />} />
            <Route path="/signup" element={<SignUpSide />} />
            <Route path="/checkout" element={<Checkout />} /> 
            
            <Route path="/kostolo-foglalas" element={<TastingCheckout />} />
            <Route path="/kapcsolat" element={<Contact />} />
            <Route path="/aszf" element={<Terms />} />
            <Route path="/adatvedelem" element={<Privacy />} />
            <Route path="/szallitas" element={<Shipping />} />
            <Route path="/borok/:id" element={<WineDetails />} />
            <Route path="/profilom" element={<Profile />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}