<p align="center">
  <img src="logo.png" alt="Szente Pincészet logo" width="220">
</p>

# Szente Pincészet - Vizsgaremek
Szoftverfejlesztő és tesztelő záróvizsga remeke.  
Résztvevők: Sinthavong Bence és Szente Benedek Rafael

## Tartalomjegyzék
* [Vizsgaremek célkitűzése](#vizsgaremek-célkitűzése)
* [Feladat leírása, bemutatása](#feladat-leírása-bemutatása)
* [Tervezett vállalásaim](#tervezett-vállalásaim)
    * [Frontend](#frontend)
    * [Backend](#backend)
* [Adatbázistervezés](#adatbázistervezés)
* [Tesztelés](#tesztelés)
    * [Backend tesztek](#backend-tesztek)
    * [Frontend tesztek](#frontend-tesztek)
* [Rendszer indítása](#rendszer-indítása)

## Vizsgaremek célkitűzése

A vizsgaremek célja egy családi pincészet versenyképessé tétele és borértékesítést, borkostólást támogató webalkalmazás elkészítése, amely lehetőséget ad a felhasználóknak borok böngészésére, rendelés leadására, valamint borászati programokra / kóstolókra történő foglalásra.  
Az alkalmazás felhasználóbarát felületet biztosít a vásárlóknak, és egy adminisztrációs oldalt a borászat számára a termékek és rendelések kezeléséhez.

## Feladat leírása, bemutatása

Az alkalmazás egy magán borászat számára készül, amelynek célja az online jelenlét erősítése és a vásárlási folyamat digitalizálása.  
A webalkalmazás fő funkciói:

- a borászat és a borok bemutatása (leírás, ár, kategória, évjárat, készlet)
- online rendelés és rendeléskezelés
- foglalások kezelése (például borkóstoló)
- regisztráció/bejelentkezés, jogosultságkezelés (felhasználó, admin)
- admin oldalon termékek, rendelések és foglalások kezelése

## Tervezett vállalásaim

### Sinthavong Bence:
- Frontend dizájn
- Borrendelés oldalak készítése, a hozzá tartozó backend rész
- Rólunk oldal tervezése
- Bejelentkezés, regisztráció
- Adatbázis tervezése

### Szente Benedek Rafael:
- Főoldal készítése
- Borkóstolás foglalásához tartozó oldalak elkészítése, a hozzá tartozó backend rész
- Logó készítése
- Adatbázis tervezése, megvalósítása
- Kapcsolat oldal tervezése

## Frontend

### Felhasználókezelés
- regisztráció, bejelentkezés, kijelentkezés
- profil adatok megtekintése

### Borok megjelenítése
- borlista szűréssel (ár, típus, évjárat)
- bor részletes oldal (leírás, készlet, ár)

### Bor rendelés
- kosár funkció
- rendelés leadása
- rendelési státusz megjelenítése (pl. feldolgozás alatt, kiszállítva)

### Foglalások
- elérhető időpontok megtekintése
- program leírása
- foglalás rögzítése és lemondása
- foglalások listázása
- QR kódos azonosítás

## Backend

### Backend kiszolgáló kialakítása
- REST API végpontok a frontend kiszolgálására
- hitelesítés és jogosultságkezelés (pl. JWT token)
- email küldés (pl. visszaigazolás, hírlevél)

### Technológia
- Node.js

## Adatbázistervezés

A rendszerhez relációs adatbázis készül, amely tartalmazza többek között az alábbi táblákat:

- Bor
- Bor_szin
- Cég adatok
- Értékelés
- Foglalas
- Hírlevélre feliratkozottak
- Kiszerelés
- Rendelés
- Rendelés tétel
- Szolgáltatás
- Users
- Üzenetek

Az adatbázis célja:
- adatok következetessége
- gyors lekérdezhetőség
- bővíthetőség

## Tesztelés

### Backend tesztek
- egységtesztek és integrációs tesztek (Jest)
- API végpontok tesztelése
- adatbázis műveletek ellenőrzése

### Frontend tesztek
- automatizált UI tesztek (Selenium)
- alap funkciók tesztelése

## Rendszer indítása

A projekt futtatásához szükséges, hogy a Docker telepítve legyen és fusson a háttérben.

### Lépések:

1. Repository klónozása:
```bash
git clone <https://github.com/SzBenedek10/vizsgaremek.git>

```bash
npm run dev

