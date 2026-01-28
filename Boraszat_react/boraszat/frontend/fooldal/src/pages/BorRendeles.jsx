import { useMemo, useState, useEffect } from "react";
import WineCard from "../components/WineCard"; 

const HUF = new Intl.NumberFormat("hu-HU");

export default function BorRendeles() {
  const [borok, setBorok] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [kosar, setKosar] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [form, setForm] = useState({ nev: "", email: "", tel: "", cim: "", megjegyzes: "" });

  // 1. ADATOK LEKÉRÉSE A BACKENDTŐL
  useEffect(() => {
    fetch("http://localhost:5000/api/borok") 
      .then((res) => res.json())
      .then((data) => {
        setBorok(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Hiba a borok betöltésekor:", err);
        setLoading(false);
      });
  }, []);

 
  const kosarba = (id, db) => {
    const adottBor = borok.find(b => b.id === id);
    const jelenlegKosarban = kosar[id] || 0;

    if (adottBor && (jelenlegKosarban + db) > adottBor.keszlet) {
      alert(`Sajnos ebből a borból csak ${adottBor.keszlet} db van készleten!`);
      return;
    }

    setKosar((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + db,
    }));
  };

  const torolTetel = (id) => {
    const ujKosar = { ...kosar };
    delete ujKosar[id];
    setKosar(ujKosar);
  };

  const kosarTetelek = useMemo(() => {
    return Object.entries(kosar)
      .map(([idStr, db]) => {
        const id = Number(idStr);
        const bor = borok.find((b) => b.id === id);
        if (!bor) return null;
        return { ...bor, db, reszosszeg: bor.ar * db };
      })
      .filter(Boolean);
  }, [kosar, borok]);

  const osszertek = useMemo(() => 
    kosarTetelek.reduce((acc, t) => acc + t.reszosszeg, 0), 
  [kosarTetelek]);

  // 3. FORM KEZELÉS
  const onChangeForm = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (kosarTetelek.length === 0) return alert("Üres a kosarad!");
    
    // Itt küldhetnéd el a backendnek a rendelést (POST kérés)
    console.log("Rendelés:", { vevo: form, tetelek: kosarTetelek });
    
    setShowSuccess(true);
    setKosar({});
    setTimeout(() => setShowSuccess(false), 5000);
  };

  if (loading) return <div className="shopHeader"><h1>Borok betöltése...</h1></div>;

  return (
    <div className="shopPageWrap">
      <header className="shopHeader">
        <h1>Borválogatásunk</h1>
        <p>Válasszon borok közül közvetlenül a helyi pincészetekből</p>
      </header>

      <div className="shopContainer">
        {/* KOSÁR SZEKCIÓ */}
        <section className="cartSection">
          <div className="cartCard">
            <h2>Kosarad tartalma</h2>
            {kosarTetelek.length === 0 ? (
              <p>Még nem választottál semmit.</p>
            ) : (
              <ul className="cartList">
                {kosarTetelek.map((t) => (
                  <li key={t.id} className="cartItem">
                    <span>{t.nev} ({t.db} db)</span>
                    <span>{HUF.format(t.reszosszeg)} Ft</span>
                    <button onClick={() => torolTetel(t.id)}>❌</button>
                  </li>
                ))}
                <li className="totalPrice">Összesen: {HUF.format(osszertek)} Ft</li>
              </ul>
            )}
          </div>
        </section>

        {/* BOR RÁCS */}
        <section className="wineSelection">
          <div className="wineGrid">
            {borok.map((bor) => (
              <WineCard key={bor.id} bor={bor} onAdd={kosarba} />
            ))}
          </div>
        </section>

        {/* RENDELÉSI ŰRLAP */}
        
      </div>

      {showSuccess && <div className="successMsg">Sikeres rendelés! Hamarosan keressük.</div>}
    </div>
  );
}