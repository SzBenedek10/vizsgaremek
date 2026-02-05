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
      foglData.forEach(f => {
        foglMap[f.szolgaltatas_id] = f.ossz_letszam;
      });
      setFoglaltsag(foglMap);
      setLoading(false);
    })
    .catch(err => {
      console.error("Hiba az adatok letöltésekor:", err);
      setLoading(false);
    });
  }, []);

  const handleValasztas = (csomag) => {
    setValasztott({ ...csomag, letszam: 1 });
  };

  const handleTorles = () => {
    setValasztott(null);
  };

  const updateLetszam = (ujLetszam) => {
    const jelenlegFoglalt = foglaltsag[valasztott.id] || 0;
    const szabadHely = valasztott.kapacitas - jelenlegFoglalt;

    if (ujLetszam < 1) return;
    if (ujLetszam > szabadHely) {
      alert(`Sajnos erre a programra már csak ${szabadHely} szabad hely van!`);
      return;
    }
    setValasztott(prev => ({ ...prev, letszam: ujLetszam }));
  };

  if (loading) return <div className="loading">Betöltés...</div>;

  return (
    <div className="shopPageWrap">
      <div className="shopContainer">
        
        {/* BAL OLDAL: KOSÁR SÁV */}
        <section className="cartSection">
          <div className="cartCard">
            <h2>Kiválasztott kóstoló</h2>
            {!valasztott ? (
              <p className="emptyCartMsg">Nincs kiválasztott program.</p>
            ) : (
              <ul className="cartList">
                <li className="cartItem" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold', color: '#722f37', fontSize: '1rem' }}>
                        {valasztott.nev}
                    </span>
                    <button onClick={handleTorles} className="removeBtn" title="Törlés">❌</button>
                  </div>
                  
                  {/* LÉTSZÁM KEZELŐ */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
                    <button 
                      onClick={() => updateLetszam(valasztott.letszam - 1)}
                      style={{ padding: '2px 10px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#fff' }}
                    >-</button>
                    <span style={{ fontWeight: 'bold' }}>{valasztott.letszam} fő</span>
                    <button 
                      onClick={() => updateLetszam(valasztott.letszam + 1)}
                      style={{ padding: '2px 10px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#fff' }}
                    >+</button>
                  </div>

                  {/* ÚJ: SZABAD HELYEK KIJELZÉSE KICSIBEN */}
                  <div style={{ fontSize: '0.75rem', color: '#d32f2f', fontWeight: '500' }}>
                    Még {valasztott.kapacitas - (foglaltsag[valasztott.id] || 0)} szabad hely elérhető
                  </div>
                  
                  <span style={{ fontSize: '0.85rem', color: '#666' }}>
                    Egységár: {HUF.format(valasztott.ar)} Ft / fő
                  </span>
                </li>

                <li className="totalPrice" style={{ borderTop: '2px solid #722f37', marginTop: '10px', paddingTop: '10px' }}>
                  Összesen: {HUF.format(valasztott.ar * valasztott.letszam)} Ft
                </li>
              </ul>
            )}

            {valasztott && (
              <button 
                className="checkoutBtn"
                style={{ 
                  marginTop: '20px', 
                  width: '100%', 
                  padding: '12px', 
                  cursor: 'pointer', 
                  backgroundColor: '#722f37', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '5px',
                  fontWeight: 'bold',
                  fontSize: '1rem'
                }} 
                onClick={() => navigate("/kostolo-foglalas", { state: { selectedPackage: valasztott } })}
              >
                Tovább a foglaláshoz
              </button>
            )}
          </div>
        </section>

        {/* JOBB OLDAL: KÍNÁLAT (2 kártya egy sorban) */}
        <section className="wineSelection">
          <div className="wineGrid" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: '20px' 
          }}>
            {csomagok.map((csomag) => {
              const jelenlegiLetszam = foglaltsag[csomag.id] || 0;
              const isFull = jelenlegiLetszam >= csomag.kapacitas;

              return (
                <TastingCard 
                  key={csomag.id} 
                  csomag={csomag} 
                  onValaszt={handleValasztas} 
                  isFull={isFull} 
                />
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
}