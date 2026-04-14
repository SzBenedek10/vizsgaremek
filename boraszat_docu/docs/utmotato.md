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
* **Git** - A projekt letöltéséhez.

---

## 2. A Projekt Indítása

Az alkalmazás (a frontend, a backend és a Docusaurus dokumentáció) egyetlen központi parancssorból elindítható.

**1. Lépés: A projekt letöltése** Nyiss egy parancssort (Terminal), és klónozd a tárolót:
```bash
git clone [https://github.com/szentepinceszet/vizsgaremek.git](https://github.com/szentepinceszet/vizsgaremek.git)
cd vizsgaremek