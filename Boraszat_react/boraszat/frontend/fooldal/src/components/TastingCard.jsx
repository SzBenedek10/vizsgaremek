import { useState } from "react";

const HUF = new Intl.NumberFormat("hu-HU");

export default function TastingCard({ csomag, onValaszt }) {
  const [letszam, setLetszam] = useState(2);


  const getWineImage = (nev) => {
    const n = nev.toLowerCase();
    if (n.includes("borkostolás")) return "borkostolo.jpg";
  
    return "placeholder.jpg";
  };


  return (
    <div className="wineCard">
      <div className="wineImage">
        <img
          src={`/images/${getWineImage(szolgaltatas.nev)}`} 
          alt={szolgaltatas.nev}
          onError={(e) => { e.currentTarget.src = "/images/placeholder.jpg"; }}
        />
      </div>
      <div className="wineInfo">
        <h3 className="wineName">{csomag.nev}</h3>
        <p className="wineDesc">{csomag.leiras}</p>
        {/* Adatbázisból jövő extra mezők megjelenítése */}
        {csomag.extra && <div className="wineStock" style={{color: '#722f37'}}>{csomag.extra}</div>}
        <div className="wineStock">Időtartam: {csomag.idotartam}</div>
        <div className="winePrice">{HUF.format(csomag.ar)} Ft / fő</div>
        
        <div className="wineActions">
          <select value={letszam} onChange={(e) => setLetszam(Number(e.target.value))}>
            {[1, 2, 3, 4, 5, 6, 8, 10, 15].map((n) => (
              <option key={n} value={n}>{n} fő</option>
            ))}
          </select>
          <button className="addToCartBtn" onClick={() => onValaszt(csomag, letszam)}>
            Kiválasztom
          </button>
        </div>
      </div>
    </div>
  );
}