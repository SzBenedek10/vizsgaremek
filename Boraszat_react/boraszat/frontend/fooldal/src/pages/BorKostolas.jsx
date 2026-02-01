import { useState } from "react";
import TastingCard from "../components/TastingCard";

const HUF = new Intl.NumberFormat("hu-HU");

export default function BorKostolas() {
  const [valasztott, setValasztott] = useState(null);

  const csomagok = [
    { id: 1, nev: "Alap Borkóstoló", leiras: "5 fajta bor kóstolása helyi borkorcsolyával.", ar: 4500, idotartam: "1.5 óra" },
    { id: 2, nev: "Prémium Válogatás", leiras: "7 fajta dűlőszelektált bor és teljes pincetúra.", ar: 8900, idotartam: "3 óra" },
    { id: 3, nev: "Dűlőmenti Séta", leiras: "Interaktív séta a szőlőben borkóstolással.", ar: 6500, idotartam: "2 óra" }
  ];

  const handleValasztas = (csomag, letszam) => {
    setValasztott({ ...csomag, letszam });
  };

  return (
    <div className="shopPageWrap">
      <header className="shopHeader">
        <h1>Borkóstolás</h1>
        <p>Válasszon programjaink közül és foglaljon helyet!</p>
      </header>

      <div className="shopContainer">
        
        {/* Bal oldali panel (Összegző) */}
        <section className="cartSection">
          <div className="cartCard">
            <h2>Foglalásod</h2>
            {!valasztott ? (
              <p>Válassz egy csomagot a kínálatból!</p>
            ) : (
              <ul className="cartList">
                <li className="cartItem">
                  <span>{valasztott.nev}</span>
                  <span>{valasztott.letszam} fő</span>
                </li>
                <li className="totalPrice">
                  Összesen: {HUF.format(valasztott.ar * valasztott.letszam)} Ft
                </li>
              </ul>
            )}
            
            {valasztott && (
                <button 
                    style={{marginTop: '10px', width: '100%', padding: '10px', cursor: 'pointer', backgroundColor: 'darkred', color: 'white', border: 'none'}} 
                    onClick={() => alert("Sikeres foglalás!")}
                >
                    Tovább a foglaláshoz
                </button>
            )}
          </div>
        </section>

        {/* Jobb oldali panel (Kártyák) */}
        <section className="wineSelection">
          <div className="wineGrid">
            {csomagok.map((csomag) => (
              <TastingCard key={csomag.id} csomag={csomag} onValaszt={handleValasztas} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}