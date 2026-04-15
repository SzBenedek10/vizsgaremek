---
slug: /telepites
sidebar_label: 'Indítási Útmutató'
---

# Telepítési és Indítási Útmutató

Ez az útmutató lépésről lépésre bemutatja, hogyan lehet a Szente Pincészet webalkalmazást és a hozzá tartozó dokumentációt elindítani fejlesztői környezetben.

A projekt kialakításakor kiemelt figyelmet fordítottunk az egyszerű hordozhatóságra. **A rendszer felhőalapú adatbázist használ**, így semmilyen helyi adatbázis-szerver (pl. MySQL vagy XAMPP) telepítésére és konfigurálására nincs szükség az indításhoz.

---

## 1. Rendszerkövetelmények (Előfeltételek)

Mielőtt elkezdenéd, győződj meg róla, hogy a számítógépeden telepítve vannak az alábbi szoftverek:

* **Node.js** (v18.0 vagy újabb) - A fejlesztői környezet és a csomagok futtatásához.
* **Docker Desktop** - A konténerizált háttérszolgáltatásokhoz.
* **Github Desktop** - A projekt letöltéséhez.

---

## 2. A Projekt Indítása

Az alkalmazás (a frontend, a backend és a Docusaurus) egyetlen központi parancssorból elindítható.

**1. Lépés: A projekt letöltése** A github Desktop segítségével klónoza le a repository vagy töltse le zip ként.
```bash
[https://github.com/szentepinceszet/vizsgaremek.git](https://github.com/szentepinceszet/vizsgaremek.git)
```
**2. Lépés: Futtatás**
Nyison egy terminált és a főkönyvtárba írja be az alábbit:
```bash
npm run dev
```
Ezzel elindul a webalkalmazás és a docusaurus is.

## 3. QR-kód szkennelő indítása
Mivel a QR-kód szkennelő és a vizsgaremek fő része egy porton fut, hogy megfelelően működjön. Így a user által foglalt és az admin által jóváhagyott a borkostolóról szóló pdf-et elösször töltse le. Ezt követően töltse le majd indítsa el az Expo go alkalmazást a telefonján. A terminálba megjelenő QR-kódot szkennelje be az Expo go alkalmazáson belül. Megjelenik a QR-kód olvasó, ha még nem, akkor engedéjezni kell, hogy használhassa a kameráját a program. A már letöltött pdf-ben a QR-kódot be tudja szkennelni vele és tudja érvényesíteni.

**1. Lépés**
Lépjen át a főkönyvtárból a QR-kód mappájába:
```bash
cd .\SzenteJegykezelo\
```
**2. Lépés**
Az indításhoz irja be a terminálba:
```bash
npx expo start
```
Amennyiben hiba lépne fel inditásnál akkor írja be a terminálba és indítsa el újra:
```bash 
npx expo install expo-camera
```
vagy 
```bash 
npm install expo
```

