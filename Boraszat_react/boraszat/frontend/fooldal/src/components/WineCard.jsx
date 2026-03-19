import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom'; 
import './Wine.css'; // Ne felejtsd el beimportálni a CSS fájlt!
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const HUF = new Intl.NumberFormat("hu-HU");

export default function WineCard({ bor, kiszerelesek = [] }) {
  const [db, setDb] = useState(1);
  const [selectedKiszerelesId, setSelectedKiszerelesId] = useState(1); 
  const { addToCart } = useCart();
  const navigate = useNavigate(); 

  const getWineImage = (nev) => {
    const n = nev.toLowerCase();
    if (n.includes("lesencei")) return "lacibetyar.jpg";
    if (n.includes("kéknyelvű")) return "keknyelvu.jpg";
    if (n.includes("lecsó")) return "lecsó.jpg";
    if (n.includes("olaszrizling")) return "rizling.jpg";
    if (n.includes("szürkebarát")) return "szurkebarat.jpg";
    if (n.includes("rózsakő")) return "rozsako.jpg";
    if (n.includes("rosé")) return "rose.jpg";
    if (n.includes("cabernet")) return "cabernet.jpg";
    if (n.includes("kékfrankos")) return "kekfrankos.jpg";
    if (n.includes("muskotály")) return "muskotaly.jpg";
    return "placeholder.jpg";
  };

  useEffect(() => {
    if (bor.kiszereles_id) {
        setSelectedKiszerelesId(bor.kiszereles_id);
    }
  }, [bor.kiszereles_id]);

  const aktualisKiszereles = kiszerelesek.find(k => k.id === Number(selectedKiszerelesId)) 
                              || { id: 1, megnevezes: '0.75L Palack', szorzo: 1 };
  const vegsoAr = Math.round(bor.ar * aktualisKiszereles.szorzo);

  const handleAddToCart = (e) => {
    e.stopPropagation(); 
    const tetel = {
        ...bor,
        id: bor.id,
        ar: vegsoAr,
        kiszereles_nev: aktualisKiszereles.megnevezes,
        kiszereles_id: selectedKiszerelesId
    };
    addToCart(tetel, db);
    if (onAddToCart) {
      onAddToCart();
    }
  
  };

  const goToDetails = () => {
    navigate(`/borok/${bor.id}`);
  };

  return (
    <div className="wine-card">
      {/* FIX 250px magas képtartó */}
      <div className="wine-image-container" onClick={goToDetails}>
        <img 
          src={`/images/${getWineImage(bor.nev)}`} 
          alt={bor.nev} 
          onError={(e) => { e.currentTarget.src = "/images/placeholder.jpg"; }}
        />
        {aktualisKiszereles.szorzo > 1 && (
          <span className="wine-chip">{aktualisKiszereles.megnevezes}</span>
        )}
      </div>

      {/* Kártya tartalma - flex-grow-val nyúlik */}
      <div className="wine-content">
        
        {/* Szöveges rész, ez foglalja el a maradék helyet */}
        <div className="wine-info">
          <h3 className="wine-title" onClick={goToDetails}>{bor.nev}</h3>
          <p style={{ fontWeight: 'bold', color: '#555', margin: '0 0 10px 0', fontSize: '0.9rem' }}>
             Évjárat: {bor.evjarat}
          </p>
          <p className="wine-desc">{bor.leiras}</p>
        </div>

        {/* Gombok és ár - a "margin-top: auto" mindig legalulra nyomja */}
        <div className="wine-actions">
          
         
          

          <div className="wine-price">{HUF.format(vegsoAr)} Ft</div>

        

            
          </div>
        </div>

      </div>
    
  );
}