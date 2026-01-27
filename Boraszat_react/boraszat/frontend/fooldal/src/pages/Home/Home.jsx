import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="container">
      <div className="welcome">
        <h1>Üdvözlünk Szente Pincéjében!</h1>
        <p className="lead">Családi hagyomány, kiváló minőség és a bor szeretete 2015 óta</p>
      </div>

      <div className="gallery">
        <img src="/images/hegykozseg.jpg" alt="Hegyközség" loading="lazy" />
        <img src="/images/borvidek.jpg" alt="Borvidék" loading="lazy" />
        <img src="/images/20130802122143_kekszolo.jpg" alt="Kékszőlő" loading="lazy" />
        <img src="/images/pince3.jpg" alt="Pince" loading="lazy" />
      </div>

      <p className="lead">
        Kóstold meg válogatott borainkat, és rendeld meg egyszerűen otthonod kényelméből!
        Minőségi boraink széles választékával várunk minden borkedvelőt.
      </p>

      <div className="separator" />

      <h2 className="sectionTitle">Online Borrendelés</h2>
      <p className="lead">Rendelj online, gyorsan és egyszerűen - a legjobb borok otthonáig!</p>

      <div className="gallery gallery3">
        <img src="/images/Vorosbor.jpg" alt="Vörösbor" loading="lazy" />
        <img src="/images/feher.jpg" alt="Fehérbor" loading="lazy" />
        <img src="/images/roze.jpg" alt="Rosé bor" loading="lazy" />
      </div>

      <div className="features">
        <div className="featureItem">
          <h3>Kézműves Borok</h3>
          <p>Kizárólag gondosan válogatott, kézműves borokat kínálunk, ahol mindegyik üveg egy történet.</p>
        </div>

        <div className="featureItem">
          <Link to="/borrendeles" className="customLink">Borrendelés</Link>
          <p>Rendeld meg online borainkat, és akár 2 munkanapon belül házhoz visszük a válogatást.</p>
        </div>

        <div className="featureItem">
          <h3>Versenyképes Árak</h3>
          <p>Kedvező árainkkal könnyedén beszerezheted kedvenc boraidat anélkül, hogy kompromisszumot kötnél.</p>
        </div>
      </div>
    </div>
  );
}
