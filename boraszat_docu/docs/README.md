---
slug: /
sidebar_label: 'Bemutatkozás'
sidebar_position: 1
---

# 🍷 Borászat Webalkalmazás - Vizsgaremek

:::info Projekt adatok
**Intézmény:** Premontrei Szakgimnázium és Technikum, Keszthely (2026)  
**Szak:** Szoftverfejlesztő és tesztelő szak (5-0613-12-03)  
**Készítette:** Sinthavong Bence, Szente Benedek Rafael  
:::

## 🎯 Motiváció és Célkitűzés

Választásunkat elsősorban a személyes érintettség és a helyi értékek iránti elkötelezettség vezérelte. Mindketten a Balaton-felvidék és a Badacsonyi borvidék közvetlen közelében nőttünk fel, így a szőlőművelés és a borkészítés hagyománya nem csupán egy távoli iparág, hanem a mindennapjaink részét képező kulturális örökség számunkra. 

Azt tapasztaltuk, hogy bár a Balaton környéki borászatok magas színvonalú termékekkel rendelkeznek, a kisebb, családi pincészetek gyakran láthatatlanok maradnak az online térben. Fő célkitűzésünk egy olyan komplex szoftverrendszer kifejlesztése, amely hidat képez a tradicionális borászat és a modern fogyasztó között. Egy olyan közösségi és kereskedelmi csomópontot terveztünk, ahol a helyi termelők nemcsak boraikat értékesíthetik, hanem teljes körű élménycsomagot – szállást és borkóstolást – is kínálhatnak.

---

## 📋 A webalkalmazás fő funkciói

Az alkalmazás egy magán borászat számára készül, amelynek célja az online jelenlét erősítése és a vásárlási folyamat digitalizálása. 

**Fő modulok és lehetőségek:**
* 📦 **Kínálat bemutatása:** borok leírása, ára, kategóriája, évjárata és készletinformációk.
* 🛒 **Webshop:** online rendelés leadása, kosár és rendeléskezelés.
* 📅 **Élménycsomagok:** foglalások kezelése (például borkóstoló, pincelátogatás).
* 🔐 **Biztonság:** regisztráció/bejelentkezés, jogosultságkezelés (felhasználó vs. admin).
* 💻 **Adminisztráció:** termékek, rendelések és foglalások átlátható menedzselése a borászat számára.

---

## 🚀 Tervezett vállalásaink

Szoftverfejlesztő és -tesztelő szakos hallgatókként kiemelt fontosságú számunkra, hogy a rendszer ne csak esztétikus, hanem technológiailag is stabil, biztonságos és skálázható legyen.

### 💻 Frontend

| Kategória | Feladatok |
| :--- | :--- |
| **Felhasználókezelés** | Regisztráció, bejelentkezés, kijelentkezés; profil adatok megtekintése / módosítása. |
| **Borok megjelenítése** | Borlista szűréssel (szőlőfajta, ár, típus, évjárat); bor részletes oldal (leírás, készlet, ár). |
| **Rendelés** | Kosár funkció; rendelés leadása; rendelési státusz megjelenítése (pl. feldolgozás alatt, kiszállítva). |
| **Foglalások** | Elérhető időpontok megtekintése; foglalás rögzítése és lemondása; saját foglalások listázása. |

### ⚙️ Backend
* **Kiszolgáló:** REST API végpontok a frontend kiszolgálására.
* **Technológia:** Node.js / ASP.NET alapú kiszolgáló felépítése.
* **Biztonság:** Hitelesítés és jogosultságkezelés (pl. JWT token segítségével).
* **Stabilitás:** Rendszeres naplózás és megbízható hibakezelés.

---

## 📊 Adatbázistervezés

A rendszerhez egy megbízható relációs adatbázis készült, amely biztosítja az adatok következetességét és a gyors lekérdezhetőséget.

:::tip Adatbázis Struktúra
Az adatbázis sémája 11 főbb táblából áll, többek között:
* **`users`**: Felhasználói adatok, hitelesítés és szerepkörök.
* **`bor` & `bor_szin`**: Borok adatai (évjárat, alkohol, ár, készlet) és kategóriái.
* **`rendeles` & `rendeles_tetel`**: Rendelések fejléce és a hozzájuk tartozó tételek.
* **`fizetes`**: Tranzakciók adatai és státuszai.
* **`szolgaltatas` & `foglalas`**: Borkóstolók, események adatai és a hozzájuk tartozó foglalások.
:::

![Adatbázis séma](/img/adatbazis.png)


---

## 🧪 Tesztelés

A projektben mind backend, mind frontend oldali tesztek készülnek, hogy a működés a felhasználók számára zökkenőmentes legyen.

* 🔴 **Backend tesztek:** Egységtesztek és integrációs tesztek; API végpontok és adatbázis műveletek helyes működésének ellenőrzése.
* 🔵 **Frontend tesztek:** Automatizált UI tesztek **Selenium** segítségével; alapfunkciók (regisztráció, belépés, kosár, rendelés, foglalás) végigkattintása.