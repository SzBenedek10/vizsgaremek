<p aligne="center">
  <img src="logo.png" alt="Szente Pincészet logo" width="220">
</p>


# vizsgaremek
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

Sinthavong Bence:
- Frontend dizájn
- Borrendelés oldalak készítése, a hozzá tartózo backend rész.
- Rólunk oldal tervezése
- Bejelentkezés, regisztráció
- Adatbázis tervezése.

Szente Benedek Rafael:
- Főoldal készítése
- Borkostolás foglalásához tartozó oldalak elkészítése, a hozzá tartózo backend rész.
- Logó készítése.
- Adatbázis tervezése, megvalósítása.
- Kapcsolat oldal tervezése.





### Frontend

#### Felhasználókezelés
- regisztráció, bejelentkezés, kijelentkezés
- profil adatok megtekintése

#### Borok megjelenítése
- borlista szűréssel (ár, típus, évjárat)
- bor részletes oldal (leírás, készlet, ár)

#### Bor rendelés
- kosár funkció
- rendelés leadása
- rendelési státusz megjelenítése (pl. feldolgozás alatt, kiszállítva) - jelenleg csak admin felületen.

#### Foglalások
- elérhető időpontok megtekintése
- leírás a programról
- foglalás rögzítése és lemondása
- foglalások listázása a felhasználónak
- QR kódos azonositás



### Backend

#### Backend kiszolgáló kialakítása
- REST API végpontok a frontend kiszolgálására
- hitelesítés és jogosultságkezelés (pl. JWT token)
- Nodemailer - email küldéshez (Hírlevél, visszaigazolás)

#### Technológiai vállalás
- Node.js alapú kiszolgáló



## Adatbázistervezés

A rendszerhez relációs adatbázis készül, amely tartalmazza többek között az alábbi táblákat:

- Bor (ID, bor_szinID, név, évjárat, ár,kiszerelésID,  készlet, alkoholfok, leírás, létrehozás dátumát.)
- Bor_szin (ID, név,)
- Cég adatok (ID, cím, telefon, email, nyitvatartás)
- Értékelés (ID, borID, userID, értékelés, szöveg, dátum)
- Foglalas (ID, userID, szolgáltatásID, dátum, időtartam, létszám, státusz, foglalá dátuma, megjegyzés, összeg, extra infó)
- Hírlevélre feliratkozottak (ID, név, email, feliratkozás dátuma)
- Kiszerelés (ID, megnevezés, szorzo)
- Rendelés (Id, UserID, Szaml_név..., Szállítási adatok)
- Rendelés tétel (ID, rendelésID, borID, mennyiség, egységár)
- Szolgáltatás (ID, nev, kapacítás, ár, leírás, aktív, dátum, idotartam, extar)
- Users (ID, email, password_hash, role, telefonszám, ország, irsz, város, utca, házszám, aktiv, létrehozása,)
- Üzenetek (ID, userID, név, email, tárgy, üzenet, dátum)

Az adatbázis célja, hogy biztosítsa:

- az adatok következetességét (kulcsok, kapcsolatok)
- a gyors lekérdezhetőséget (indexek, normalizálás)
- a későbbi bővíthetőséget


## Tesztelés

A projektben mind backend, mind frontend oldali tesztek készülnek, hogy a működés megbízható legyen.

### Backend tesztek
- egységtesztek és integrációs tesztek a Jest segitségével.
- API végpontok helyes működésének ellenőrzése
- adatbázis műveletek tesztelése

### Frontend tesztek
- automatizált UI tesztek Selenium segítségével
- alap funkciók tesztelése: regisztráció, belépés, kosár, rendelés, foglalás



