import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';

function HomepageHeader() {
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <h1 className={styles.heroTitle}>Szente Pincészet</h1>
        <p className={styles.heroSubtitle}>Szoftverfejlesztési és Rendszerdokumentáció</p>
        <div className={styles.buttons}>
          <Link
            className={styles.wineButton}
            to="/docs/">
            Dokumentáció megtekintése
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Üdvözöljük`}
      description="A Szente Pincészet webes rendszerének hivatalos dokumentációja.">
      <HomepageHeader />
      <main className={styles.mainContent}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ color: '#722f37', marginTop: '2rem', marginBottom: '1rem' }}>A Projektről</h2>
          <p style={{ fontSize: '1.1rem', color: '#555', lineHeight: '1.6' }}>
            Ez a weboldal tartalmazza a Szente Pincészet online bor webshopja és borkostoló foglalási 
            rendszerének teljes fejlesztői dokumentációját. A fenti gombra vagy a menüben 
            található "Dokumentáció" hivatkozásra kattintva megtekintheti az adatbázis-terveket, 
            a frontend komponensek leírását, és az API végpontok működését. A blog oldalon pedig a github repot láthatja,
            a commit üzenetekkel együtt, hogy nyomon követhesse a fejlesztés előrehaladását.
          </p>
        </div>
      </main>
    </Layout>
  );
}