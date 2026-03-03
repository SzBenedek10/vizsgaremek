---
id: dokumentacio
title: A Borászat Dokumentációja
sidebar_label: Dokumentáció
sidebar_position: 1
---







# Projektmunka dokumentálása: Borászat webalkalmazás

**Készítette:** Sinthavong Bence, Szente Benedek Rafael  
**Intézmény:** Premontrei Szakgimnázium és Technikum, Keszthely (2026)  
**Szak:** Szoftverfejlesztő és tesztelő szak (5-0613-12-03)  

---

## Bevezetés

Választásunkat elsősorban a személyes érintettség és a helyi értékek iránti elkötelezettség vezérelte. Mindketten a Balaton-felvidék és a Badacsonyi borvidék közvetlen közelében nőttünk fel, így a szőlőművelés és a borkészítés hagyománya nem csupán egy távoli iparág, hanem a mindennapjaink részét képező kulturális örökség számunkra. Szüleink révén már fiatalon betekintést nyertünk a szüretek magával ragadó hangulatába, valamint abba a munkába, amely a minőségi borok előállításához szükséges.

A digitalizáció korában azt tapasztaltuk, hogy bár a Balaton környéki borászatok magas színvonalú termékekkel rendelkeznek, a kisebb, családi pincészetek gyakran láthatatlanok maradnak az online térben. Számos esetben a vendégek nehézkesen találnak információt a kóstolási lehetőségekről, vagy a szállásfoglalás folyamata megáll a telefonos egyeztetés szintjén, ami a mai felgyorsult igények mellett már nem hatékony. 

Projektünkkel ezen a ponton kívánunk beavatkozni: egy olyan webes platformot hozunk létre, amely hidat képez a tradicionális borászat és a modern fogyasztó között. Fő célkitűzésünk egy olyan komplex szoftverrendszer kifejlesztése, amely túlmutat az egyszerű webshopok funkcióin. Egy olyan közösségi és kereskedelmi csomópontot terveztünk, ahol a helyi termelők nemcsak boraikat értékesíthetik, hanem teljes körű élménycsomagot – szállást és borkóstolást – is kínálhatnak.

Szoftverfejlesztő és -tesztelő szakos hallgatókként kiemelt fontosságú számunkra, hogy a rendszer ne csak esztétikus, hanem technológiailag is stabil, biztonságos és skálázható legyen. A projekt megvalósítása során a technikai feladatok megosztásán túl kiemelt figyelmet fordítottunk az egymás közötti folyamatos kommunikációra és a mentális támogatásra is. Mivel egy ilyen komplex rendszer fejlesztése – amely magában foglalja a webshopot, a foglalási motort és a tesztelési folyamatokat is – gyakran állított minket váratlan szakmai kihívások elé. A projekt megkezdésénél készítettünk egy Gantt diagrammot, amely segítségével lépést tudtunk tartani az idővel. Ha a határidők közelsége miatt nőtt rajtunk a nyomás, tudatosan beiktattunk rövid szüneteket, ahol nem a kódról, hanem a közös terveinkről és a projekt várható sikeréről beszélgettünk. Ez a fajta érzelmi biztonság és a pozitív visszacsatolások – egy-egy jól sikerült modul vagy sikeres teszt lefuttatása után – folyamatosan fenntartották a motivációnkat.

---

## Adatbázis

Az adatbázisunk elengedhetetlen volt projektünk megvalósításához. Célja, hogy hatékonyan tudjuk tárolni, rendszerezni, lekérdezni és módosítani az információkat. Az adatbázisok nélkülözhetetlenek a modern digitális világban, webes alkalmazásokban. Segítségükkel több felhasználó egyszerre férhet hozzá ugyanazokhoz az adatokhoz, miközben biztosított az adatok integrálása és biztonsága. 

![Adatbázis szerkezete](/img/adatbazis.png)

Az adatbázisunk 11 táblából áll:

### Bor tábla
* **ID:** Mező elsődleges kulcsként funkcionál, a rekordok automatikusan kiosztott azonosítójaként szolgál.
* **BOR_SZIN_ID:** Mező a bor_szin táblával összekapcsoló idegenkulcsként funkcionál.
* **NEV:** Mező a borok neveit tárolja.
* **EVJARAT:** Mező a borok évjáratait tárolja el.
* **AR:** Mező a boroknak az alapárat tartalmazza.
* **KISZERELES_ID:** Mező a kiszerelés táblát kapcsolja össze, a mennyiségeket veszi át a másik táblából.
* **KESZLET:** Mező a raktáron lévő borok számát tárolja.
* **ALKOHOLFOK:** Mező az adott borok alkoholfokát tárolja az adatbázisba.
* **LEÍRÁS:** Mező leírást tárolja el.
* **CREATED_AT:** A bor hozzáadásának dátumát tárolja el az adatbázisba.

### Bor_szin tábla
* **ID:** Mező elsődleges kulcsként funkcionál, a rekordok automatikusan kiosztott azonosítójaként szolgál. A BOR táblával összeköttőként szolgál.
* **NEV:** A borok színét tárolja el.

### CEG_ADATOK tábla
* **ID:** Mező elsődleges kulcsként funkcionál, a rekordok automatikusan kiosztott azonosítójaként szolgál.
* **CIM:** A felvitt cég címét tárolja.
* **TELEFON:** A cég telefonszámát tárolja.
* **EMAIL:** A cég emailcímét tárolja.
* **NYITVATARTÁS:** A cég nyitvatartását tárolja.

### FOGLALAS tábla
* **ID:** Mező elsődleges kulcsként funkcionál, a rekordok automatikusan kiosztott azonosítójaként szolgál.
* **USER_ID:** A users táblát kapcsolja össze, a regisztrált felhasználók ID-val.
* **SZOLGALTATAS_ID:** A szolgaltatas táblát kapcsolja össze és az adott borkóstolás eseményével kapcsolja össze.
* **DATUM:** A foglalás dátumát rögzíti.
* **IDOTARTAM:** A foglalás időtartamát rögzítjük benne.
* **LETSZAM:** A foglaláskor beállított résztvevők számát rögzíti a táblában.
* **STATUSZ:** A foglalásnak a pillanatnyi állapotát raktározza el.
* **FOGLALAS_DATUMA:** A foglalás pillanatát rögzíti a táblába datetime mezőként.
* **MEGJEGYZES:** Ha a felhasználó szeretne megjegyzést írni a foglalással kapcsolatban, akkor azt ebbe a mezőben raktározzuk el.
* **OSSZEG:** A foglaláskor feltüntetett fizetendő összeget tároljuk itt.
* **EXTRA_INFO:** A borkóstolásnál plusz programok vannak.

### KISZERELES tábla
* **ID:** Mező elsődleges kulcsként funkcionál, a rekordok automatikusan kiosztott azonosítójaként szolgál.
* **MEGNEVEZES:** A kiszerelés típusának nevét tárolja (Pl.: 0,75L vagy kannás bor).
* **SZORZO:** A kiszerelésekhez rendelt szorzó mennyisége.

---

## Projekthez használt programok

* **Microsoft Office (Word, PowerPoint):** A Word és a PowerPoint segítségével könnyen meg tudtuk valósítani a feladatunkat. Mivel ICDL vizsgával rendelkezünk, így ez nem jelenthetett problémát.
* **Figma**
* **Canva:** Gantt diagram segítségével lépést tudtunk tartani az előre megszabott időtervünkkel és szemléltetni tudtuk, hogy mit mikorra készítettünk el.
* **Inkscape:** Vektorgrafika.
* **Google Drive**
* **GitHub:** A vizsgaremek egyes állapotait itt lehet nyomon követni, illetve minden dokumentum is elérhető dátummal ellátva és a fájlokhoz tartozó megfelelő leírással.
* **VTK:** Az iskolán belül használtuk fájlok megosztására a tanáraink és egymás között.
* **Visual Studio / Visual Studio Code:** A webes alkalmazásunk elsődleges fejlesztői környezete volt.
* **Postman:** Az API végpontok gyors tesztelésére és hibakeresésére alkalmasnak talált felület.
* **Discord:** A szerverünkön osztottuk meg egymással az elején a fájlokat és a kommunikációnk főbb helye volt, a képernyőmegosztást is előszeretettel használtuk.
* **Docker:** A konténerek segítségével könnyebben tudtuk az adatbázist eszközök közt hordozni.
* **Material UI:** A menüsáv, ikonok, gombok a frontend dizájnhoz elengedhetetlen volt számunkra.
* **GIMP**

---

## Melléklet
* **Gantt diagram**
![Gantt diagram](/img/gantt.png)