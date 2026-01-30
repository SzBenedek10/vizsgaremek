import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // <--- 1. EZT KELL IMPORTÁLNI
import WineCard from "../components/WineCard"; 
import { useCart } from "../context/CartContext"; 

const HUF = new Intl.NumberFormat("hu-HU");

export default function BorRendeles() {
  const [borok, setBorok] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  // 2. Navigáció aktiválása
  const navigate = useNavigate(); 
  const { cartItems, removeFromCart, totalAmount } = useCart();

  useEffect(() => {
    fetch("http://localhost:5000/api/borok") 
      .then((res) => res.json())
      .then((data) => {
        setBorok(data);
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
                  <li key={item.id} className="cartItem">
                    <span>{item.nev} ({item.amount} db)</span>
                    <span>{HUF.format(item.ar * item.amount)} Ft</span>
                    <button onClick={() => removeFromCart(item.id)}>❌</button>
                  </li>
                ))}
                <li className="totalPrice">Összesen: {HUF.format(totalAmount)} Ft</li>
              </ul>
            )}
            
            {/* 3. ITT A VÁLTOZÁS: Gombnyomásra átmegyünk a /checkout oldalra */}
            {cartItems.length > 0 && (
                <button 
                    style={{marginTop: '10px', width: '100%', padding: '10px', cursor: 'pointer', backgroundColor: 'darkred', color: 'white', border: 'none'}} 
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
              <WineCard key={bor.id} bor={bor} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}