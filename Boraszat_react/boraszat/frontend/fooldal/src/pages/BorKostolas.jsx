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
          <div className="cartCard" style={{ padding: '25px', borderRadius: '15px' }}>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '25px', fontWeight: '600' }}>
              Kiválasztott program
            </h2>

            {!valasztott ? (
              <p className="emptyCartMsg" style={{ textAlign: 'center', color: '#888', padding: '20px 0' }}>
                Válasszon a kóstolók közül!
              </p>
            ) : (
              <div className="cartList">
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ 
                    fontSize: '1.1rem', 
                    margin: '0 0 15px 0', 
                    textTransform: 'uppercase', 
                    letterSpacing: '1px',
                    color: '#333'
                  }}>
                    {valasztott.nev}
                  </h3>

                  {/* Létszámválasztó kontrollerek */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      border: '1px solid #ddd', 
                      borderRadius: '6px',
                      backgroundColor: '#fff'
                    }}>
                      <button 
                        onClick={() => updateLetszam(valasztott.letszam - 1)}
                        style={{ width: '35px', height: '35px', border: 'none', background: '#f8f8f8', cursor: 'pointer', fontSize: '1.2rem' }}
                      >-</button>
                      <span style={{ padding: '0 15px', fontWeight: '500', minWidth: '45px', textAlign: 'center' }}>
                        {valasztott.letszam} fő
                      </span>
                      <button 
                        onClick={() => updateLetszam(valasztott.letszam + 1)}
                        style={{ width: '35px', height: '35px', border: 'none', background: '#f8f8f8', cursor: 'pointer', fontSize: '1.2rem' }}
                      >+</button>
                    </div>
                  </div>

                  <p style={{ color: '#e63946', fontSize: '0.9rem', marginTop: '12px', fontWeight: '500' }}>
                    Még {valasztott.kapacitas - (foglaltsag[valasztott.id] || 0)} szabad hely
                  </p>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '20px 0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                  <span style={{ fontSize: '1.3rem', fontWeight: '700' }}>Összesen:</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: '800', color: '#722f37' }}>
                    {HUF.format(valasztott.ar * valasztott.letszam)} Ft
                  </span>
                </div>

                <button 
                  className="checkoutBtn"
                  style={{
                    width: '100%', 
                    padding: '14px', 
                    backgroundColor: '#722f37', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '8px', 
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '1.05rem',
                    boxShadow: '0 4px 10px rgba(114, 47, 55, 0.2)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#5a252c'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#722f37'}
                  onClick={() => navigate("/kostolo-foglalas", { state: { selectedPackage: valasztott } })}
                >
                  Tovább a foglaláshoz
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="wineSelection">
          <div className="wineGrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '25px' }}>
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