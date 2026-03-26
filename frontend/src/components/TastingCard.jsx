import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Divider, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  IconButton 
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CloseIcon from '@mui/icons-material/Close';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const HUF = new Intl.NumberFormat("hu-HU");

export default function TastingCard({ csomag, onValaszt, isFull, szabadHely }) {
  const [openPopup, setOpenPopup] = useState(false);

  const handleOpen = () => setOpenPopup(true);
  const handleClose = () => setOpenPopup(false);
  
  const formatDatum = (dateString) => {
    if (!dateString) return "Hamarosan";
    const d = new Date(dateString);
    return d.toLocaleDateString('hu-HU', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }) + ".";
  };

  const getTemplateText = (id) => {
    const defaultId = id || 0;
    const sablonok = [
      "Szeretettel várjuk a Szente Pincészet exkluzív eseményén! Pincészetünk elkötelezett amellett, hogy a borkóstolás ne csupán egy egyszerű ízélmény, hanem egy felejthetetlen utazás legyen a szőlőtőkék és tölgyfahordók lenyűgöző világában. Szakértő borászaink mesélnek a dűlők történetéről, a gondos szüretről és arról a szenvedélyről, amit minden egyes palackba bezárunk. Lépjen ki a hétköznapok rohanásából, és engedje át magát a harmóniának egy pohár kiváló bor társaságában.",
      "Lépjen be a borok varázslatos világába, és ismerje meg a helyi terroir egyedi, utánozhatatlan adottságait! Ezen a különleges programon bepillantást nyerhet a borkészítés féltve őrzött kulisszatitkaiba a szőlőszemektől egészen a pohárig. Megtanítjuk az alapvető kóstolási technikákra, megmutatjuk, hogyan érdemes vizsgálni a bor színét, illatát és ízjegyeit. Mindezt csodálatos, autentikus környezetben, ahol a hagyomány és a természet közelsége teszi teljessé az élményt.",
      "Dőljön hátra, és élvezze a pillanatot a festői környezetben! Kóstolóinkat úgy állítottuk össze, hogy a laikus borbarátok és a sokat tapasztalt ínyencek is megtalálják a számukra legizgalmasabb zamatokat. Egy kötetlen és vidám program keretében barangolunk az ízek tengerén, ahol a friss, ropogós tételektől kezdve a testesebb, hordós érlelésű borokig sok mindent górcső alá veszünk. A jó társaság, a csodás kilátás és a kiváló nedűk garantálják a tökéletes kikapcsolódást.",
      "Engedje meg, hogy elkalauzoljuk a Szente Pincészet legféltettebb kincsei közé! Ezen a prémium túrán a többgenerációs hagyomány és a modern borászat tökéletes találkozását tapasztalhatja meg. Ritkábban kóstolható, különleges tételeink is előkerülnek a pince mélyéről, melyekhez izgalmas történetek és kulisszatitkok is társulnak. Ha egy igazán mély és komplex gasztronómiai utazásra vágyik, ahol a borok és a történelem összefonódik, ez a program Önnek szól."
    ];
    return sablonok[defaultId % sablonok.length];
  };

  // EZ A GYÖNYÖRŰ ALAPÉRTELMEZETT KÉP FOG BETÖLTENI
  const defaultImageUrl = "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80";

  return (
    <>
      <Paper 
        elevation={2} 
        sx={{ 
          borderRadius: 3, 
          overflow: 'hidden', 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          transition: 'transform 0.3s, box-shadow 0.3s',
          '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 8px 20px rgba(114, 47, 55, 0.15)' }
        }}
      >
        {/* KÉP BETÖLTÉSE */}
        <Box sx={{ height: 200, overflow: 'hidden', bgcolor: '#f0f0f0' }}>
          <img 
            src={csomag.kep ? `http://localhost:5000${csomag.kep}` : defaultImageUrl} 
            alt={csomag.nev}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => { 
              e.target.onerror = null; 
              e.target.src = defaultImageUrl; 
            }}
          />
        </Box>

        <Box sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: '#333' }}>
            {csomag.nev}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#666', mb: 0.5 }}>
            <CalendarMonthIcon sx={{ fontSize: 18, color: '#722f37' }} />
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              {formatDatum(csomag.datum)}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#666', mb: 2 }}>
            <AccessTimeIcon sx={{ fontSize: 18, color: '#722f37' }} />
            <Typography variant="body2">{csomag.idotartam || "14:00"}</Typography>
          </Box>

          <Typography variant="body2" sx={{ color: '#777', mb: 3, flexGrow: 1 }}>
            {csomag.leiras?.length > 60 ? csomag.leiras.substring(0, 60) + '...' : csomag.leiras}
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#722f37' }}>
              {HUF.format(csomag.ar)} Ft
            </Typography>
            <Typography variant="caption" sx={{ color: isFull ? 'error.main' : 'success.main', fontWeight: 'bold' }}>
              {isFull ? "BETELT" : `SZABAD (${szabadHely} hely)`}
            </Typography>
          </Box>

          {/* GOMBOK */}
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button 
              fullWidth 
              variant="contained" 
              disabled={isFull}
              onClick={() => onValaszt(csomag)}
              sx={{ 
                bgcolor: '#722f37', 
                '&:hover': { bgcolor: '#5a252c' },
                fontWeight: 'bold',
                borderRadius: 2,
                textTransform: 'none',
                py: 1,
                flex: 1
              }}
            >
              {isFull ? "Megtelt" : "Foglalás"}
            </Button>

            <Button 
              fullWidth 
              variant="outlined" 
              onClick={handleOpen}
              startIcon={<InfoOutlinedIcon />}
              sx={{ 
                color: '#722f37', 
                borderColor: '#722f37',
                '&:hover': { bgcolor: '#fdfbfb', borderColor: '#5a252c' },
                fontWeight: 'bold',
                borderRadius: 2,
                textTransform: 'none',
                py: 1,
                flex: 1
              }}
            >
              Leírás
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* POPUP ABLAK */}
      <Dialog 
        open={openPopup} 
        onClose={handleClose} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, overflow: 'hidden' } }}
      >
        <DialogTitle sx={{ 
          m: 0, p: 2, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          bgcolor: '#722f37',
          color: 'white'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Program részletei
          </Typography>
          <IconButton onClick={handleClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent dividers sx={{ p: 4, bgcolor: '#fdfbfb' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333', mb: 3, textAlign: 'center' }}>
            {csomag.nev}
          </Typography>

          {/* ELEGÁNS DÁTUM ÉS IDŐPONT MEGJELENÍTÉS A POPUPBAN */}
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 4, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: 'rgba(114, 47, 55, 0.08)', color: '#722f37', px: 2, py: 0.8, borderRadius: 2 }}>
              <CalendarMonthIcon sx={{ fontSize: 20 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', letterSpacing: 0.5 }}>
                {formatDatum(csomag.datum)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: 'rgba(114, 47, 55, 0.08)', color: '#722f37', px: 2, py: 0.8, borderRadius: 2 }}>
              <AccessTimeIcon sx={{ fontSize: 20 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', letterSpacing: 0.5 }}>
                {csomag.idotartam || "14:00"}
              </Typography>
            </Box>
          </Box>
          
          <Typography variant="body1" sx={{ color: '#555', mb: 4, textAlign: 'justify', lineHeight: 1.8 }}>
            {getTemplateText(csomag.id)}
          </Typography>

          <Paper elevation={0} sx={{ p: 3, bgcolor: '#fff', borderLeft: '4px solid #722f37', mb: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#722f37', mb: 1 }}>
              A csomag tartalma:
            </Typography>
            <Typography variant="body2" sx={{ color: '#444', lineHeight: 1.6 }}>
              {csomag.leiras || "Borkóstoló programunk keretében megismerkedhet pincészetünk legkiválóbb tételeivel."}
            </Typography>
          </Paper>

          {csomag.extra && (
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, p: 2, bgcolor: '#fcf8e3', borderRadius: 2, mb: 3 }}>
              <AutoAwesomeIcon sx={{ color: '#d4af37', mt: 0.5 }} />
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#8a6d3b' }}>
                  Különlegesség
                </Typography>
                <Typography variant="body2" sx={{ color: '#8a6d3b' }}>
                  {csomag.extra}
                </Typography>
              </Box>
            </Box>
          )}

          <Divider sx={{ my: 2 }} />
          
          <Typography variant="body2" sx={{ color: '#888', fontStyle: 'italic', textAlign: 'center' }}>
            Kérjük, érkezzen a kezdés előtt legalább 10 perccel, hogy kényelmesen elfoglalhassa a helyét!
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 2, justifyContent: 'center', bgcolor: '#fff' }}>
          <Button 
            onClick={handleClose} 
            variant="outlined" 
            sx={{ 
              color: '#555', 
              borderColor: '#ccc',
              '&:hover': { bgcolor: '#f0f0f0', borderColor: '#999' },
              textTransform: 'none',
              px: 4
            }}
          >
            Vissza
          </Button>
          <Button 
            onClick={() => {
              handleClose();
              if (!isFull) onValaszt(csomag);
            }} 
            variant="contained" 
            disabled={isFull}
            sx={{ 
              bgcolor: '#722f37', 
              '&:hover': { bgcolor: '#5a252c' },
              textTransform: 'none',
              px: 4
            }}
          >
            {isFull ? "Sajnos megtelt" : "Tovább a foglaláshoz"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}