import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Footer from './components/footer';

export default function MainLayout() {
  return (

    
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh', 
      width: '100%',
      bgcolor: '#fdfbfb', 
      color: '#4b2c2c'    
    }}>
      
      <Navbar /> 
      
      <Box component="main" sx={{ 
        flex: 1, 
        width: '100%',
      }}>
        <Outlet /> 
      </Box>

      <Footer />
    </Box>
  );
}