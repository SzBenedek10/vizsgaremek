import React from 'react';
import { Routes, Route, Navigate,} from "react-router-dom";
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';

import MainLayout from "./MainLayout.jsx";
import Home from "./pages/Home/Home.jsx";
import BorRendeles from "./pages/wineshop/BorRendeles.jsx";
import BorKostolas from "./pages/winetasting/BorKostolas.jsx";
import SignInSide from "./pages/signin_up/SignInSide.jsx";
import SignUpSide from "./pages/signin_up/SignUpSide.jsx";
import { AuthProvider } from "./context/AuthContext"; 
import Checkout from './pages/wineshop/Checkout.jsx';
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import TastingCheckout from "./pages/winetasting/TastingCheckout.jsx"; 
import Contact  from "./pages/Contact.jsx";
import WineDetails from "./pages/wineshop/WineDetails.jsx";
import Profile from "./pages/Profile.jsx";
import About from './pages/About';


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
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<SignInSide />} />
            <Route path="/signup" element={<SignUpSide />} />
            <Route path="/checkout" element={<Checkout />} /> 
            
            <Route path="/kostolo-foglalas" element={<TastingCheckout />} />
            <Route path="/kapcsolat" element={<Contact />} />
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