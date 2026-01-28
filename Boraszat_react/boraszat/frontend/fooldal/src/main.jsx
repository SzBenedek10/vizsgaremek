import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { CssBaseline } from '@mui/material';
import { AuthProvider } from './context/AuthContext.jsx'; // 1. IMPORTÁLD BE

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider> {/* 2. TEDD EZT AZ APP KÖRÉ */}
      <BrowserRouter>
        <CssBaseline />
        <App />
      </BrowserRouter>
    </AuthProvider> {/* 3. EZT IS A VÉGÉRE */}
  </React.StrictMode>
);