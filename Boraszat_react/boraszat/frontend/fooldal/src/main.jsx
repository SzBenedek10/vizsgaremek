import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { CssBaseline } from '@mui/material';
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider } from './context/AuthContext.jsx'; 
import { CartProvider } from './context/CartContext.jsx'; 

ReactDOM.createRoot(document.getElementById('root')).render(

    <AuthProvider> 
      <BrowserRouter> 
       <ScrollToTop />
        <CartProvider> 
          <CssBaseline />
          <App />
        </CartProvider>
      </BrowserRouter>
    </AuthProvider>
  
);