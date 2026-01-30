import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { CssBaseline } from '@mui/material';

// IMPORTÁLD BE MINDKÉT CONTEXTET:
import { AuthProvider } from './context/AuthContext.jsx'; 
import { CartProvider } from './context/CartContext.jsx'; // <--- EZ HIÁNYZOTT

ReactDOM.createRoot(document.getElementById('root')).render(

    <AuthProvider> {/* 1. Bejelentkezés kezelése (legyen a legkülső) */}
      <BrowserRouter> {/* 2. Router */}
        <CartProvider> {/* 3. Kosár kezelése (belül, hogy elérje a routert ha kell) */}
          <CssBaseline />
          <App />
        </CartProvider>
      </BrowserRouter>
    </AuthProvider>
  
);