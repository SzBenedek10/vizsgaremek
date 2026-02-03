import { useState, useEffect } from "react";
import TastingCard from "../components/TastingCard";

const HUF = new Intl.NumberFormat("hu-HU");

export default function BorKostolas() {
  const [csomagok, setCsomagok] = useState([]);
  const [valasztott, setValasztott] = useState(null);
  const [loading, setLoading] = useState(true);

  // Adatok lekérése a szerverről
  useEffect(() => {
    fetch("http://localhost:5000/api/szolgaltatasok")
      .then((res) => res.json())
      .then((data) => {
        setCsomagok(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Hiba a borkóstolók betöltésekor:", err);
        setLoading(false);
      });
  }, []);

  const handleValasztas = (csomag, letszam) => {
    setValasztott({ ...csomag, letszam });
  };

  if (loading) return <div className="shopHeader"><h1>Kóstolók betöltése...</h1></div>;

  return (
    <div className="shopPageWrap">
      <header className="shopHeader">
        <h1>Borkóstolás & Élmények</h1>
        <p>Válasszon aktuális ajánlataink közül!</p>
      </header>

      <div className="shopContainer">
        <section className="cartSection">
          <div className="cartCard">
            <h2>Foglalásod</h2>
            {!valasztott ? (
              <p>Még nem választottál csomagot.</p>
            ) : (
              <ul className="cartList">
                <li className="cartItem">
                  <span><strong>{valasztott.nev}</strong></span>
                  <span>{valasztott.letszam} fő</span>
                </li>
                <li className="totalPrice">
                  Összesen: {HUF.format(valasztott.ar * valasztott.letszam)} Ft
                </li>
              </ul>
            )}
            {valasztott && (
              <button 
                style={{
                  marginTop: '15px', width: '100%', padding: '12px', cursor: 'pointer', 
                  backgroundColor: '#722f37', color: 'white', border: 'none',
                  fontWeight: 'bold', borderRadius: '4px'
                }} 
                onClick={() => alert("Sikeres kiválasztás!")}
              >
                Tovább a foglaláshoz
              </button>
            )}
          </div>
        </section>

        <section className="wineSelection">
          <div 
            className="wineGrid" 
            style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}
          >
            {csomagok.map((csomag) => (
              <TastingCard key={csomag.id} csomag={csomag} onValaszt={handleValasztas} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}