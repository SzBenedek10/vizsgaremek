// src/components/WineCard.jsx
import { useState } from "react";

const HUF = new Intl.NumberFormat("hu-HU");

export default function WineCard({ bor, onAdd }) {
  const [db, setDb] = useState(1);

  // Ez a függvény párosítja a nevet a képfájlhoz
  const getWineImage = (nev) => {
    const n = nev.toLowerCase();
    if (n.includes("kéknyelvű")) return "keknyelvu.jpg";
    if (n.includes("olaszrizling")) return "rizling.jpg";
    if (n.includes("szürkebarát")) return "szurkebarat.jpg";
    if (n.includes("rózsakő")) return "rozsako.jpg";
    if (n.includes("rosé")) return "rose.jpg";
    if (n.includes("cabernet")) return "cabernet.jpg";
    if (n.includes("kékfrankos")) return "kekfrankos.jpg";
    if (n.includes("muskotály")) return "muskotaly.jpg";
    return "placeholder.jpg";
  };

  return (
    <div className="wineCard">
      <div className="wineImage">
        <img
          src={`/images/${getWineImage(bor.nev)}`} 
          alt={bor.nev}
          onError={(e) => { e.currentTarget.src = "/images/placeholder.jpg"; }}
        />
      </div>
      <div className="wineInfo">
        <h3 className="wineName">{bor.nev}</h3>
        <p className="wineDesc">{bor.leiras}</p>
        <div className="winePrice">{HUF.format(bor.ar)} Ft</div>
        <div className="wineActions">
          <select value={db} onChange={(e) => setDb(Number(e.target.value))}>
            {[1, 2, 3, 4, 5, 6, 12].map((n) => (
              <option key={n} value={n}>{n} db</option>
            ))}
          </select>
          <button className="addToCartBtn" onClick={() => onAdd(bor.id, db)}>
            Kosárba 
          </button>
        </div>
      </div>
    </div>
  );
}