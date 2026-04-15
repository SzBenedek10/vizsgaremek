import React, { useEffect, useState } from 'react';
import { 
  Container, Typography, Box, Divider, ImageList, ImageListItem, 
  Dialog, IconButton, Fade 
} from '@mui/material';
import { keyframes } from '@emotion/react';

import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

export default function About() {
  const [isVisible, setIsVisible] = useState(false);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    setIsVisible(true);
  }, []);
  
 
  const galleryModules = import.meta.glob('/public/images/gallery/*.{jpg,jpeg,png,webp}', { eager: true });
  
  const dynamicGalleryImages = Object.keys(galleryModules).map((path) => {
    const imgUrl = path.replace('/public', '');
    
   
    const fileName = path.split('/').pop().split('.')[0]; 
    const niceTitle = fileName.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());

    return { img: imgUrl, title: niceTitle };
  });

  const animationStyle = (delay = '0s') => ({
    opacity: isVisible ? 1 : 0,
    animation: isVisible ? `${fadeInUp} 0.8s ease-out forwards` : 'none',
    animationDelay: delay,
  });

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const showNextImage = (e) => {
    e.stopPropagation(); 
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % dynamicGalleryImages.length);
  };

  const showPrevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? dynamicGalleryImages.length - 1 : prevIndex - 1));
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;
      if (e.key === 'ArrowRight') showNextImage(e);
      if (e.key === 'ArrowLeft') showPrevImage(e);
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen]);

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#fdfbfb', minHeight: '100vh', overflowX: 'hidden' }}>
      <Box 
        component="img" 
        src="/images/szolo-skicc.png" 
        sx={{ 
          position: 'absolute',
          top: '100%',
          left: '-20px',
          width: { xs: '120px', md: '250px' },
          opacity: 1, 
          transform: 'rotate(-10deg)',
          zIndex: 0,
          pointerEvents: 'none'
        }} 
      />

      <Box 
        component="img" 
        src="/images/szolo-skicc.png" 
        sx={{ 
          position: 'absolute',
          top: '20%',
          right: '-20px',
          width: { xs: '140px', md: '280px' },
          opacity: 1, 
          transform: 'rotate(15deg) scaleX(-1)', 
          zIndex: 0,
          pointerEvents: 'none'
        }} 
      />
      <Container maxWidth="md"> 
        <Box sx={{ textAlign: 'center', mb: 10, ...animationStyle('0.1s') }}>
          <Typography variant="overline" sx={{ color: '#722f37', fontWeight: 'bold', fontSize: '1.2rem', letterSpacing: 3 }}>
            Hagyomány és Szenvedély
          </Typography>
          <Typography variant="h2" sx={{ fontFamily: 'Playfair Display, serif', fontWeight: 'bold', color: '#333', mb: 3, mt: 1 }}>
            A Szente Pincészet Története
          </Typography>
          <Divider sx={{ width: '650px', mx: 'auto', borderBottomWidth: 3, borderColor: '#722f37', opacity: 0.6 }} />
        </Box>

      <Box sx={{ mb: 10, textAlign: 'center', ...animationStyle('0.3s') }}>
            <Typography variant="h4" sx={{ fontFamily: 'Playfair Display', fontWeight: 'bold', color: '#722f37', mb: 4 }}>
                Generációk óta a szőlő bűvöletében
            </Typography>
            
            <Typography paragraph sx={{ fontSize: '1.15rem', color: '#555', lineHeight: 1.9, mb: 3 }}>
                Pincészetünk története nem csupán évtizedekre, hanem generációkra nyúlik vissza. Családi vállalkozásunkban a szőlő iránti tiszteletet és a borkészítés titkait apáról fiúra adtuk át. Hiszünk abban, hogy a nemes bor a tőkén születik: minden egyes hajtást alázattal és kemény munkával gondozunk, hogy a palackokba a családunk legjava kerüljön.
            </Typography>

            <Typography paragraph sx={{ fontSize: '1.15rem', color: '#555', lineHeight: 1.9 }}>
                Dűlőink kiváló mikroklímája és a talaj ásványossága teszi lehetővé, hogy évről évre harmonikus, testes és elegáns borokat alkossunk. Számunkra a borkészítés nem csupán munka, hanem szent hivatás: modern technikákkal ötvözzük a hagyományos, fahordós érlelés művészetét, megőrizve a Szente hamisítatlan karakterét.
            </Typography>
        </Box>

        <Divider sx={{ my: 8, borderColor: 'rgba(0,0,0,0.05)' }} />

        <Box sx={{ mb: 12, textAlign: 'center', ...animationStyle('0.5s') }}>
          <Typography variant="h3" sx={{ fontFamily: 'Playfair Display', fontWeight: 'bold', color: '#333', mb: 1 }}>
            Szente Benedek Rafaello
          </Typography>
          <Typography variant="overline" sx={{ color: '#722f37', fontWeight: 'bold', fontSize: '1rem', letterSpacing: 2, display: 'block', mb: 6 }}>
            Alapító & Főborász
          </Typography>
          
          <Box sx={{ position: 'relative', mb: 6, maxWidth: '85%', mx: 'auto' }}>
            <Typography sx={{ position: 'absolute', top: -35, left: '50%', transform: 'translateX(-50%)', fontSize: '6rem', color: 'rgba(114, 47, 55, 0.08)', fontFamily: 'serif', lineHeight: 1 }}>
              "
            </Typography>
            <Typography variant="h5" sx={{ fontFamily: 'Playfair Display', fontStyle: 'italic', color: '#444', lineHeight: 1.7, position: 'relative', zIndex: 2 }}>
              A bor nem csupán egy ital a pohárban. A bor a föld sóhaja, az évszakok emléke, és annak a rengeteg munkának a gyümölcse, amit a szőlőbe fektettünk. Minden palack egy történetet mesél el.
            </Typography>
          </Box>

          <Typography paragraph sx={{ fontSize: '1.15rem', color: '#555', lineHeight: 1.9, mb: 3 }}>
            Célunk sosem a tömegtermelés volt. Sokkal inkább az, hogy olyan borokat alkossunk, amelyek megállják a helyüket a legkiválóbb asztalokon is, és amiket büszkén bonthatunk fel a családunk, barátaink körében. 
          </Typography>
          <Typography paragraph sx={{ fontSize: '1.15rem', color: '#555', lineHeight: 1.9 }}>
            Számomra a legnagyobb elismerés nem egy aranyérem, hanem az, amikor látom az elégedettséget egy kóstolás alkalmával a vendégeink arcán. Ezt az élményt szeretném átadni minden egyes palack Szente borral.
          </Typography>
        </Box>
      </Container>

 
      <Container maxWidth="lg" sx={{ ...animationStyle('0.7s') }}>
        <Box sx={{ pt: 4 }}>
          {dynamicGalleryImages.length > 0 ? (
            <>
              <Typography variant="h4" sx={{ fontFamily: 'Playfair Display', fontWeight: 'bold', color: '#333', textAlign: 'center', mb: 6 }}>
                Kattints a képekre a galéria megnyitásához
              </Typography>
              
              <ImageList variant="masonry" cols={window.innerWidth < 600 ? 1 : 3} gap={16}>
                {dynamicGalleryImages.map((item, index) => (
                  <ImageListItem 
                    key={index} 
                    onClick={() => openLightbox(index)} 
                    sx={{ 
                      overflow: 'hidden', cursor: 'zoom-in', borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                      '&:hover img': { transform: 'scale(1.05)', filter: 'brightness(0.9)' } 
                    }}
                  >
                    <img
                      src={`${item.img}`}
                      alt={item.title}
                      loading="lazy"
                      style={{ transition: 'all 0.5s ease', display: 'block', width: '100%', minHeight: '150px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            </>
          ) : (
             <Typography variant="h6" sx={{ color: '#888', textAlign: 'center', mt: 4 }}>
               Még nincsenek feltöltve képek a galériába. Dobálj be párat a public/images/gallery mappába!
             </Typography>
          )}
        </Box>
      </Container>
      
      <Dialog 
        fullScreen open={lightboxOpen} onClose={closeLightbox} TransitionComponent={Fade} 
        PaperProps={{ sx: { bgcolor: 'rgba(0, 0, 0, 0.95)', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' } }}
      >
        <IconButton onClick={closeLightbox} sx={{ position: 'absolute', top: 20, right: 20, color: 'white', zIndex: 10, bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}>
          <CloseIcon fontSize="large" />
        </IconButton>

        {dynamicGalleryImages.length > 1 && (
          <>
            <IconButton onClick={showPrevImage} sx={{ position: 'absolute', left: { xs: 10, md: 40 }, color: 'white', zIndex: 10, bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}>
              <ArrowBackIosNewIcon fontSize="large" />
            </IconButton>

            <IconButton onClick={showNextImage} sx={{ position: 'absolute', right: { xs: 10, md: 40 }, color: 'white', zIndex: 10, bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}>
              <ArrowForwardIosIcon fontSize="large" />
            </IconButton>
          </>
        )}

        <Box 
          component="img" src={dynamicGalleryImages[currentImageIndex]?.img} alt={dynamicGalleryImages[currentImageIndex]?.title}
          sx={{ maxHeight: '90vh', maxWidth: '90vw', objectFit: 'contain', boxShadow: '0 0 50px rgba(0,0,0,0.5)' }}
        />
        
       

      </Dialog>
    </Box>
  );
}