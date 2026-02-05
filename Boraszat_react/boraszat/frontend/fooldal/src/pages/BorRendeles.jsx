import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import WineCard from "../components/WineCard"; 
import { useCart } from "../context/CartContext"; 

// MUI Importok
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';

const HUF = new Intl.NumberFormat("hu-HU");

export default function BorRendeles() {
  const [borok, setBorok] = useState([]); 
  const [kiszerelesek, setKiszerelesek] = useState([]); 
  
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate(); 
  const { cartItems, removeFromCart, totalAmount } = useCart();

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:5000/api/borok").then(res => {
        if (!res.ok) throw new Error("Hiba a borok lekérésekor");
        return res.json();
      }),
      fetch("http://localhost:5000/api/kiszerelesek").then(res => {
        if (!res.ok) throw new Error("Hiba a kiszerelések lekérésekor");
        return res.json();
      })
    ])
    .then(([borData, kiszerelesData]) => {
      if (Array.isArray(borData)) setBorok(borData);
      if (Array.isArray(kiszerelesData)) setKiszerelesek(kiszerelesData);
      setLoading(false);
    })
    .catch((err) => {
      console.error("Hiba:", err);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="shopHeader"><h1>Borok betöltése...</h1></div>;

  return (
    <div className="shopPageWrap">
      <header className="shopHeader">
        <h1>Borválogatásunk</h1>
        <p>Válasszon borok közül közvetlenül a helyi pincészetekből</p>
      </header>

      <div className="shopContainer">
        
        <section className="cartSection">
          <div className="cartCard">
            <h2>Kosarad tartalma</h2>
            {cartItems.length === 0 ? (
              <p>Még nem választottál semmit.</p>
            ) : (
              <ul className="cartList">
                {cartItems.map((item) => (
                  <li key={`${item.id}-${item.kiszereles_id}`} className="cartItem">
                    <span style={{fontSize:'0.9rem'}}>
                        <strong>{item.nev}</strong> <br/> 
                        <em style={{color:'#777'}}>{item.kiszereles_nev}</em> ({item.amount} db)
                    </span>
                    
                    {/* Ár és Törlés gomb egy sorban, szépen igazítva */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span style={{ fontWeight: 'bold', marginRight: '5px' }}>
                            {HUF.format(item.ar * item.amount)} Ft
                        </span>

                        <Tooltip title="Törlés">
                            <IconButton 
                                size="small" 
                                // FONTOS: Itt át kell adni a kiszereles_id-t is!
                                onClick={() => removeFromCart(item.id, item.kiszereles_id)}
                                sx={{ 
                                    color: '#722f37', // Pincészet színe
                                    '&:hover': { 
                                        color: '#d32f2f', 
                                        backgroundColor: 'rgba(114, 47, 55, 0.1)' 
                                    }
                                }}
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </div>
                  </li>
                ))}
                
                <li className="totalPrice" style={{marginTop: '15px', paddingTop: '10px', borderTop: '1px solid #eee'}}>
                    Összesen: {HUF.format(totalAmount)} Ft
                </li>
              </ul>
            )}
            
            {cartItems.length > 0 && (
                <button 
                    style={{
                        marginTop: '15px', 
                        width: '100%', 
                        padding: '12px', 
                        cursor: 'pointer', 
                        backgroundColor: '#722f37', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        transition: '0.3s'
                    }} 
                    onMouseOver={(e) => e.target.style.backgroundColor = '#5a252c'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#722f37'}
                    onClick={() => navigate("/Checkout")}
                >
                    Tovább a Pénztárhoz
                </button>
            )}
          </div>
        </section>

        <section className="wineSelection">
          <div className="wineGrid">
            {borok.map((bor) => (
              <WineCard  key={bor.id} bor={bor} kiszerelesek={kiszerelesek} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}