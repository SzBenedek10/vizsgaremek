import { useState } from "react";
import { useCart } from "../context/CartContext"; // <--- FONTOS IMPORT

const HUF = new Intl.NumberFormat("hu-HU");

export default function WineCard({ bor }) {
  const [db, setDb] = useState(1);
  const { addToCart } = useCart(); // <--- Bekötjük a Contextet

  
  const getWineImage = (nev) => {
    const n = nev.toLowerCase();
    if (n.includes("lesencei")) return "lacibetyar.jpg";
    if (n.includes("kéknyelvű")) return "keknyelvu.jpg";
    if (n.includes("lecsó")) return "lecsó.jpg";
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
        <div className="wineStock">Készleten: {bor.keszlet} db</div>
        <div className="winePrice">{HUF.format(bor.ar)} Ft</div>
        <div className="wineActions">
          <select value={db} onChange={(e) => setDb(Number(e.target.value))}>
            {[1, 2, 3, 4, 5, 6, 12].map((n) => (
              <option key={n} value={n}>{n} db</option>
            ))}
          </select>
          {/* Itt már az addToCart-ot hívjuk a Contextből */}
          <button className="addToCartBtn" onClick={() => addToCart(bor, db)}>
            Kosárba 
          </button>
        </div>
      </div>
    </div>
  );
}