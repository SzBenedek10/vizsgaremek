import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import TastingCard from "../components/TastingCard";

const HUF = new Intl.NumberFormat("hu-HU");

export default function BorKostolas() {
  const [csomagok, setCsomagok] = useState([]);
  const [foglaltsag, setFoglaltsag] = useState({}); 
  const [valasztott, setValasztott] = useState(null);
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
    .catch(err => {
      console.error("Hiba:", err);
      setLoading(false);
    });
  }, []);

  const handleValasztas = (csomag) => {
    setValasztott({ ...csomag, letszam: 1 });
  };

  const updateLetszam = (ujLetszam) => {
    const szabad = valasztott.kapacitas - (foglaltsag[valasztott.id] || 0);
    if (ujLetszam >= 1 && ujLetszam <= szabad) {
      setValasztott({ ...valasztott, letszam: ujLetszam });
    }
  };

  if (loading) return <div className="loading">Betöltés...</div>;

  return (
    <div className="shopPageWrap">
      <div className="shopContainer">
        <section className="cartSection">
          <div className="cartCard">
            <h2>Kiválasztott program</h2>
            {!valasztott ? (
              <p className="emptyCartMsg">Válasszon a kóstolók közül!</p>
            ) : (
              <ul className="cartList">
                <li className="cartItem" style={{flexDirection:'column', alignItems:'flex-start'}}>
                  <strong>{valasztott.nev}</strong>
                  <div style={{display:'flex', alignItems:'center', gap:'10px', marginTop:'10px'}}>
                    <button onClick={() => updateLetszam(valasztott.letszam - 1)}>-</button>
                    <span>{valasztott.letszam} fő</span>
                    <button onClick={() => updateLetszam(valasztott.letszam + 1)}>+</button>
                  </div>
                  <small style={{color:'red', marginTop:'5px'}}>
                    Még {valasztott.kapacitas - (foglaltsag[valasztott.id] || 0)} szabad hely
                  </small>
                </li>
                <li className="totalPrice">
                  Összesen: {HUF.format(valasztott.ar * valasztott.letszam)} Ft
                </li>
                <button 
                  className="checkoutBtn"
                  style={{marginTop:'20px', width:'100%', padding:'12px', backgroundColor:'#722f37', color:'white', border:'none', borderRadius:'5px', cursor:'pointer'}}
                  onClick={() => navigate("/kostolo-foglalas", { state: { selectedPackage: valasztott } })}
                >
                  Tovább a foglaláshoz
                </button>
              </ul>
            )}
          </div>
        </section>

        <section className="wineSelection">
          <div className="wineGrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            {csomagok.map((csomag) => (
              <TastingCard 
                key={csomag.id} 
                csomag={csomag} 
                onValaszt={handleValasztas} 
                isFull={(foglaltsag[csomag.id] || 0) >= csomag.kapacitas} 
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}