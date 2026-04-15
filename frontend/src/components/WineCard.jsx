import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom'; 
import './Wine.css';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import WineDetails from '../pages/wineshop/WineDetails';

const HUF = new Intl.NumberFormat("hu-HU");

export default function WineCard({ bor, kiszerelesek = [], onAddToCart }) {
  const [db, setDb] = useState(1);
  const [selectedKiszerelesId, setSelectedKiszerelesId] = useState(1); 
  const { addToCart } = useCart();
  const navigate = useNavigate(); 

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
      <div className="wine-image-container" onClick={goToDetails}>
        <img 
          src={bor.kep ? `http://localhost:5000${bor.kep}` : "/images/placeholder.jpg"}
          alt={bor.nev} 
          onError={(e) => { e.currentTarget.src = "/images/placeholder.jpg"; }}
        />
        {aktualisKiszereles.szorzo > 1 && (
          <span className="wine-chip">{aktualisKiszereles.megnevezes}</span>
        )}
      </div>

      <div className="wine-content">
        <div className="wine-info">
          <h3 className="wine-title" onClick={goToDetails}>{bor.nev}</h3>
          <p style={{ fontWeight: 'bold', color: '#555', margin: '0 0 10px 0', fontSize: '0.9rem' }}>
             Évjárat: {bor.evjarat}
          </p>
          <p className="wine-desc">{bor.leiras}</p>
        </div>

        <div className="wine-actions">
          
         
        <div className="wine-actions">
          
          <div className="wine-price">{HUF.format(vegsoAr)} Ft</div>

          <div className="wine-button-group" style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
         
            <button 
              className="details-button" 
              onClick={goToDetails}
              style={{
                flex: 1,
                padding: '8px',
                backgroundColor: '#f0f0f0',
                border: '1px solid #ccc',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Részletek
            </button>
              </div>
            </div>
          </div>
        </div>
      </div> 
  );
}