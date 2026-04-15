import { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import LegalDialogs from "../legal/LegalDialogs";

import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  FormControlLabel,
  Checkbox,
  Divider,
  Stack,
  InputAdornment
} from "@mui/material";

import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PaymentsIcon from '@mui/icons-material/Payments';
import DiscountIcon from '@mui/icons-material/Discount';

const HUF = new Intl.NumberFormat("hu-HU");

export default function Checkout() {
  const { cartItems, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [billing, setBilling] = useState({
    nev: "", email: "", tel: "",
    irsz: "", varos: "", utca: "", hazszam: ""
  });

  const [shipping, setShipping] = useState({
    nev: "", irsz: "", varos: "", utca: "", hazszam: ""
  });

  const [useProfileForBilling, setUseProfileForBilling] = useState(false);
  const [shippingSameAsBilling, setShippingSameAsBilling] = useState(true);
  
  const [isOver18, setIsOver18] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [newsletter, setNewsletter] = useState(true);

  const [termsOpen, setTermsOpen] = useState(false);

  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0); 

  const handleApplyCoupon = () => {
    if (!couponCode) return;
    
    const code = couponCode.trim().toLowerCase();
    
    if (code === "isti10") {
      setAppliedDiscount(10);
      Swal.fire({ title: 'Kupon beváltva!', text: '10% kedvezményt adtunk a termékek árából.', icon: 'success', confirmButtonColor: '#722f37', timer: 2000 });
    } else if (code === "refi20") {
      setAppliedDiscount(20);
      Swal.fire({ title: 'Kupon beváltva!', text: '20% kedvezményt adtunk a termékek árából.', icon: 'success', confirmButtonColor: '#722f37', timer: 2000 });
    } else {
      setAppliedDiscount(0);
      Swal.fire({ title: 'Érvénytelen kupon!', text: 'A megadott kuponkód nem létezik vagy lejárt.', icon: 'error', confirmButtonColor: '#722f37' });
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedDiscount(0);
    setCouponCode("");
  };

  const productTotal = totalAmount; 
  const discountAmount = Math.round(productTotal * (appliedDiscount / 100));
  const discountedProductTotal = productTotal - discountAmount;
  const freeShippingThreshold = 20000; 
  const shippingFee = discountedProductTotal >= freeShippingThreshold ? 0 : 2500; 
  const paymentFee = 300; 
  const finalTotal = discountedProductTotal + shippingFee + paymentFee;
  const vatContent = Math.round(finalTotal * 0.212598);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!user) {
        Swal.fire({ title: 'Jelentkezz be!', text: 'A vásárláshoz be kell jelentkezned.', icon: 'warning', confirmButtonColor: '#722f37', confirmButtonText: 'OK' }).then(() => navigate('/login'));
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [user, navigate]);

  const handleProfileCheckbox = (e) => {
    const isChecked = e.target.checked;
    setUseProfileForBilling(isChecked);

    if (isChecked && user) {
      setBilling({
        nev: user.nev || "", email: user.email || "", tel: user.telefonszam || user.tel || "",
        irsz: user.irsz || "", varos: user.varos || "", utca: user.utca || "", hazszam: user.hazszam || ""
      });
    } else {
      setBilling({ nev: "", email: "", tel: "", irsz: "", varos: "", utca: "", hazszam: "" });
    }
  };

  const handleBillingChange = (e) => {
    setBilling({ ...billing, [e.target.name]: e.target.value });
    if (useProfileForBilling) setUseProfileForBilling(false);
  };

  const handleShippingChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const handleOrder = async (e) => {
    e.preventDefault();
    if (!user) return;
    
    if (!isOver18 || !acceptedTerms) {
      Swal.fire('Figyelem!', 'A rendeléshez igazolnod kell, hogy elmúltál 18 éves és el kell fogadnod az ÁSZF-et!', 'warning');
      return;
    }

    const finalShipping = shippingSameAsBilling ? {
      nev: billing.nev, irsz: billing.irsz, varos: billing.varos, utca: billing.utca, hazszam: billing.hazszam
    } : shipping;

    const rendelesAdat = {
      userId: user.id,
      szamlazasi: billing,
      szallitasi: finalShipping,
      tetelek: cartItems,
      vegosszeg: finalTotal, 
      szallitasiKoltseg: shippingFee,
      utanvetDija: paymentFee,
      kuponKod: appliedDiscount > 0 ? couponCode.toUpperCase() : null,
      kedvezmeny: discountAmount,
      hirlevel: newsletter 
    };

    try {
      const response = await fetch("http://localhost:5000/api/rendeles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rendelesAdat)
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          title: 'Sikeres rendelés!',
          text: `Azonosító: ${data.orderId}`,
          icon: 'success',
          confirmButtonColor: '#722f37'
        }).then(() => {
          clearCart();
          navigate("/");
        });
      } else {
        Swal.fire('Hiba', data.msg, 'error');
      }
    } catch (error) {
      Swal.fire('Hiba', 'Szerver hiba', 'error');
    }
  };

  if (cartItems.length === 0) return (
    <Container maxWidth="sm" sx={{ mt: 10, textAlign: 'center' }}>
      <Paper sx={{ p: 5, borderRadius: 4 }}>
        <ShoppingBagIcon sx={{ fontSize: 60, color: '#ccc', mb: 2 }} />
        <Typography variant="h5" gutterBottom>Üres a kosarad!</Typography>
        <Button variant="contained" sx={{ mt: 2, bgcolor: '#722f37', '&:hover': { bgcolor: '#5a252c' } }} onClick={() => navigate("/borrendeles")}>
          Vissza a vásárláshoz
        </Button>
      </Paper>
    </Container>
  );

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
      <form onSubmit={handleOrder}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, alignItems: 'flex-start' }}>

          <Box sx={{ flex: { xs: '1 1 100%', md: '1.7 1 0%' }, width: '100%' }}>
            <Stack spacing={4}>
              <Paper elevation={2} sx={{ p: { xs: 3, md: 4 }, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ReceiptIcon sx={{ color: '#722f37', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>1. Számlázási adatok</Typography>
                </Box>
                
                <FormControlLabel
                  control={<Checkbox checked={useProfileForBilling} onChange={handleProfileCheckbox} sx={{ color: '#722f37', '&.Mui-checked': { color: '#722f37' } }} />}
                  label={<Typography variant="body2" color="text.secondary">Profil adatainak betöltése</Typography>}
                  sx={{ mb: 3 }}
                />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2.5 }}>
                    <TextField fullWidth required label="Teljes név" name="nev" value={billing.nev} onChange={handleBillingChange} size="small" />
                    <TextField fullWidth required label="Email cím" name="email" value={billing.email} onChange={handleBillingChange} size="small" />
                  </Box>
                  <TextField fullWidth label="Telefonszám" name="tel" value={billing.tel} onChange={handleBillingChange} size="small" />
                  <Box sx={{ display: 'flex', gap: 2.5 }}>
                    <TextField required label="Irsz." name="irsz" value={billing.irsz} onChange={handleBillingChange} size="small" sx={{ width: '100px', flexShrink: 0 }} />
                    <TextField fullWidth required label="Város" name="varos" value={billing.varos} onChange={handleBillingChange} size="small" />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2.5 }}>
                    <TextField fullWidth required label="Utca" name="utca" value={billing.utca} onChange={handleBillingChange} size="small" />
                    <TextField required label="Hsz." name="hazszam" value={billing.hazszam} onChange={handleBillingChange} size="small" sx={{ width: '100px', flexShrink: 0 }} />
                  </Box>
                </Box>
              </Paper>

              <Paper elevation={2} sx={{ p: { xs: 3, md: 4 }, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocalShippingIcon sx={{ color: '#722f37', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>2. Szállítási cím</Typography>
                </Box>

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={shippingSameAsBilling}
                      onChange={(e) => setShippingSameAsBilling(e.target.checked)}
                      sx={{ color: '#722f37', '&.Mui-checked': { color: '#722f37' } }}
                    />
                  }
                  label={<Typography variant="body2" color="text.secondary">Megegyezik a számlázási címmel</Typography>}
                  sx={{ mb: shippingSameAsBilling ? 0 : 3 }}
                />

                {!shippingSameAsBilling && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <TextField fullWidth required label="Címzett neve" name="nev" value={shipping.nev} onChange={handleShippingChange} size="small" />
                    <Box sx={{ display: 'flex', gap: 2.5 }}>
                      <TextField required label="Irsz." name="irsz" value={shipping.irsz} onChange={handleShippingChange} size="small" sx={{ width: '100px', flexShrink: 0 }} />
                      <TextField fullWidth required label="Város" name="varos" value={shipping.varos} onChange={handleShippingChange} size="small" />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2.5 }}>
                      <TextField fullWidth required label="Utca" name="utca" value={shipping.utca} onChange={handleShippingChange} size="small" />
                      <TextField required label="Hsz." name="hazszam" value={shipping.hazszam} onChange={handleShippingChange} size="small" sx={{ width: '100px', flexShrink: 0 }} />
                    </Box>
                  </Box>
                )}
              </Paper>

              <Paper elevation={2} sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, border: '2px solid #722f37' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PaymentsIcon sx={{ color: '#722f37', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>3. Fizetési mód</Typography>
                </Box>
                <Box sx={{ p: 2, bgcolor: '#fdfaeb', borderRadius: 2, border: '1px solid #f2e3a8' }}>
                  <FormControlLabel
                    control={<Checkbox checked={true} disabled sx={{ '&.Mui-checked': { color: '#722f37' } }} />}
                    label={<Typography variant="body1" sx={{ fontWeight: 'bold', color: '#333' }}>Utánvét (Fizetés a futárnál)</Typography>}
                  />
                  <Typography variant="body2" sx={{ ml: 4, mt: -1, color: '#666', lineHeight: 1.6 }}>
                    Jelenleg kizárólag utánvétes fizetésre van lehetőség. A rendelés végösszegét a csomag átvételekor a futárnak tudod kifizetni (készpénzzel vagy bankkártyával). A szolgáltatás díja +300 Ft.
                  </Typography>
                </Box>
              </Paper>
            </Stack>
          </Box>

          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 0%' }, width: '100%', position: 'sticky', top: 100 }}>
            <Paper elevation={4} sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, bgcolor: '#fdfbfb' }}>
              <Typography variant="h5" gutterBottom sx={{color: '#722f37', fontWeight: 'bold', fontFamily: 'Playfair Display, serif'}}>
                Rendelés összesítése
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Stack spacing={2} sx={{ mb: 3, maxHeight: '250px', overflowY: 'auto', pr: 1 }}>
                {cartItems.map((item) => (
                  <Box key={`${item.id}-${item.kiszereles_id}`} sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                    <Box sx={{ width: '65%' }}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#333' }}>{item.nev}</Typography>
                      <Typography variant="caption" sx={{ color: '#777', display: 'block' }}>
                        {item.kiszereles_nev} x {item.amount} db
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#999' }}>
                        Egységár: {HUF.format(item.ar)} Ft
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#722f37' }}>
                      {HUF.format(item.ar * item.amount)} Ft
                    </Typography>
                  </Box>
                ))}
              </Stack>
              
              <Divider sx={{ mb: 3 }} />

              <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                <TextField 
                  size="small" label="Kuponkód megadása" variant="outlined" fullWidth value={couponCode} onChange={(e) => setCouponCode(e.target.value)} disabled={appliedDiscount > 0} 
                  InputProps={{ startAdornment: (<InputAdornment position="start"><DiscountIcon fontSize="small" sx={{ color: appliedDiscount > 0 ? '#2e7d32' : '#777' }} /></InputAdornment>) }}
                  sx={{ bgcolor: 'white', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: appliedDiscount > 0 ? '#2e7d32' : '#ccc' } } }}
                />
                <Button 
                  variant="contained" onClick={appliedDiscount > 0 ? handleRemoveCoupon : handleApplyCoupon}
                  sx={{ bgcolor: appliedDiscount > 0 ? '#d32f2f' : '#722f37', color: 'white', fontWeight: 'bold', '&:hover': { bgcolor: appliedDiscount > 0 ? '#b71c1c' : '#5a252c'} }}
                >
                  {appliedDiscount > 0 ? 'Törlés' : 'Beváltás'}
                </Button>
              </Box>
              
              <Stack spacing={1.5} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Termékek ára (bruttó):</Typography>
                  <Typography variant="body2" fontWeight="bold" color="#333">{HUF.format(productTotal)} Ft</Typography>
                </Box>

                {appliedDiscount > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', bgcolor: '#e8f5e9', p: 1, borderRadius: 1 }}>
                    <Typography variant="body2" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>Kupon kedvezmény (-{appliedDiscount}%):</Typography>
                    <Typography variant="body2" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>-{HUF.format(discountAmount)} Ft</Typography>
                  </Box>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Házhozszállítás díja:</Typography>
                    <Typography variant="caption" display="block" color={shippingFee === 0 ? "success.main" : "text.secondary"}>
                      {shippingFee === 0 ? "Ingyenes szállítás!" : `(Ingyenes ${HUF.format(freeShippingThreshold)} Ft felett)`}
                    </Typography>
                  </Box>
                  <Typography variant="body2" fontWeight="bold" color="#333">{shippingFee === 0 ? "0 Ft" : `+${HUF.format(shippingFee)} Ft`}</Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Utánvét díja:</Typography>
                  <Typography variant="body2" fontWeight="bold" color="#333">+{HUF.format(paymentFee)} Ft</Typography>
                </Box>
              </Stack>

              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>Fizetendő végösszeg:</Typography>
                <Typography variant="h5" sx={{ color: '#722f37', fontWeight: '900' }}>{HUF.format(finalTotal)} Ft</Typography>
              </Box>

              <Typography variant="caption" sx={{ color: '#888', display: 'block', textAlign: 'right', mb: 3 }}>
                A végösszeg tartalmazza a 27% ÁFÁ-t ({HUF.format(vatContent)} Ft).
              </Typography>

              <Box sx={{ mb: 2, p: 1.5, bgcolor: '#f4f4f4', borderRadius: 2, display: 'flex', alignItems: 'flex-start' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={newsletter}
                      onChange={(e) => setNewsletter(e.target.checked)}
                      sx={{ color: '#722f37', p: 0.5, '&.Mui-checked': { color: '#722f37' } }}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#333' }}>
                        Feliratkozom a hírlevélre
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#666', lineHeight: 1.2, display: 'block' }}>
                        Szeretnék értesülni az exkluzív borválogatásokról és egyedi akciókról.
                      </Typography>
                    </Box>
                  }
                  sx={{ m: 0, alignItems: 'flex-start' }}
                />
              </Box>

              <Box sx={{ mb: 3, p: 2, bgcolor: (isOver18 && acceptedTerms) ? '#e8f5e9' : '#ffebee', borderRadius: 2, border: '1px solid', borderColor: (isOver18 && acceptedTerms) ? '#c8e6c9' : '#ffcdd2', transition: '0.3s' }}>
                <Stack spacing={1}>
                  <FormControlLabel
                    control={<Checkbox checked={isOver18} onChange={(e) => setIsOver18(e.target.checked)} sx={{ color: '#d32f2f', p: 0.5, '&.Mui-checked': { color: '#2e7d32' } }} />}
                    label={<Typography variant="body2" sx={{ fontWeight: 'bold', color: isOver18 ? '#2e7d32' : '#d32f2f', ml: 1 }}>Igen, elmúltam 18 éves. *</Typography>}
                  />
                  <FormControlLabel
                    control={<Checkbox checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} sx={{ color: '#d32f2f', p: 0.5, '&.Mui-checked': { color: '#2e7d32' } }} />}
                    label={
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: acceptedTerms ? '#2e7d32' : '#d32f2f', ml: 1 }}>
                        Elfogadom az <span style={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={(e) => { e.preventDefault(); setTermsOpen(true); }}>ÁSZF</span>-et. *
                      </Typography>
                    }
                  />
                </Stack>
              </Box>

              <Stack spacing={2}>
                <Button
                  type="submit" fullWidth variant="contained" size="large" disabled={!isOver18 || !acceptedTerms} startIcon={<CheckCircleIcon />}
                  sx={{ bgcolor: '#722f37', '&:hover': { bgcolor: '#5a252c', transform: 'scale(1.02)' }, py: 1.8, fontSize: '1rem', fontWeight: 'bold', borderRadius: 50, transition: 'all 0.2s', boxShadow: '0 6px 15px rgba(114, 47, 55, 0.3)', '&.Mui-disabled': { bgcolor: '#e0e0e0', color: '#9e9e9e', boxShadow: 'none', transform: 'none' } }}
                >
                  Fizetési kötelezettséggel járó megrendelés
                </Button>
                <Button fullWidth variant="text" startIcon={<ArrowBackIcon />} onClick={() => navigate("/borrendeles")} sx={{ color: '#777', '&:hover': { color: '#333', bgcolor: 'transparent' } }}>
                  Vissza a vásárláshoz
                </Button>
              </Stack>
            </Paper>
          </Box>
        </Box>
      </form>

      <LegalDialogs 
        open={termsOpen} 
        onClose={() => { setAcceptedTerms(true); setTermsOpen(false); }} 
        type="aszf" 
      />
      
    </Container>
  );
}