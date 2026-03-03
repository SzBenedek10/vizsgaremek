import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import TastingCard from "../components/TastingCard";

// MUI Importok - a borrendelés alapján
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const HUF = new Intl.NumberFormat("hu-HU");

export default function BorKostolas() {
  const [csomagok, setCsomagok] = useState([]);
  const [foglaltsag, setFoglaltsag] = useState({}); 
  const [cartItems, setCartItems] = useState([]); 
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:5000/api/szolgaltatasok").then(res => res.json()),
      fetch("http://localhost:5000/api/foglaltsag").then(res => res.json())
    ])
    .then(([szolgData, foglData]) => {
      setCsomagok(szolgData);
      const foglMap = {};
      foglData.forEach(f => { foglMap[f.szolgaltatas_id] = f.ossz_letszam; });
      setFoglaltsag(foglMap);
      setLoading(false);
    })
    .catch(err => { console.error(err); setLoading(false); });
  }, []);

  const handleAddToCart = (csomag) => {
    if (cartItems.find(item => item.id === csomag.id)) return;
    setCartItems([...cartItems, { ...csomag, selectedLetszam: 1 }]);
  };

  const updateQuantity = (id, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const uj = Math.max(1, item.selectedLetszam + delta);
        const max = item.kapacitas - (foglaltsag[item.id] || 0);
        return uj <= max ? { ...item, selectedLetszam: uj } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (id) => setCartItems(cartItems.filter(item => item.id !== id));

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.ar * item.selectedLetszam), 0);

  if (loading) return <div className="loading">Betöltés...</div>;

  return (
    // PONTOS MÁSOLAT A BORRENDELES.JSX SZERKEZETÉRŐL
    <main className="wineOrderContainer" style={{ display: 'flex', gap: '20px', padding: '20px' }}>
      
      {/* BAL OLDAL: KOSÁR (A BorRendeles stílusa alapján) */}
      <section className="cartSection" style={{ width: '350px', position: 'sticky', top: '20px', height: 'fit-content' }}>
        <h2 style={{ color: '#722f37' }}>Foglalási kosár</h2>
        <div className="cartItems" style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          {cartItems.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666' }}>Még nem választott túrát.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {cartItems.map((item) => (
                <li key={item.id} className="cartItem" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #eee' }}>
                  <div className="itemInfo">
                    <strong style={{ display: 'block' }}>{item.nev}</strong>
                    <span style={{ fontSize: '0.9rem', color: '#666' }}>
                        {item.selectedLetszam} fő × {HUF.format(item.ar)} Ft
                    </span>
                  </div>
                  
                  <div className="itemActions" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', background: '#f5f5f5', borderRadius: '4px' }}>
                        <IconButton size="small" onClick={() => updateQuantity(item.id, -1)}><RemoveIcon fontSize="small" /></IconButton>
                        <span style={{ padding: '0 5px' }}>{item.selectedLetszam}</span>
                        <IconButton size="small" onClick={() => updateQuantity(item.id, 1)}><AddIcon fontSize="small" /></IconButton>
                    </div>
                    <Tooltip title="Eltávolítás">
                      <IconButton onClick={() => removeFromCart(item.id)} color="error" size="small">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </div>
                </li>
              ))}
              
              <li className="totalPrice" style={{ marginTop: '15px', paddingTop: '10px', borderTop: '1px solid #eee', fontWeight: 'bold', textAlign: 'right' }}>
                Összesen: {HUF.format(totalAmount)} Ft
              </li>
            </ul>
          )}
          
          {cartItems.length > 0 && (
            <button 
              className="checkoutBtn"
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
              onClick={() => navigate("/kostolo-foglalas", { state: { cart: cartItems } })}
            >
              Tovább a foglaláshoz
            </button>
          )}
        </div>
      </section>

      {/* JOBB OLDAL: KÍNÁLAT (A BorRendeles wineGrid elrendezése) */}
      <section className="wineSelection" style={{ flex: 1 }}>
        <div className="wineGrid">
          {csomagok.map((csomag) => (
            <TastingCard 
              key={csomag.id} 
              csomag={csomag} 
              onValaszt={handleAddToCart} 
              isFull={(foglaltsag[csomag.id] || 0) >= csomag.kapacitas} 
            />
          ))}
        </div>
      </section>
    </main>
  );
}