---
slug: /
sidebar_label: 'Teljes Dokumentáció'
---

# Szente Pincészet Webalkalmazás

**Premontrei Szakgimnázium és Technikum** Keszthely, 2026  
**Szak:** Szoftverfejlesztő és tesztelő szak (5-0613-12-03)  
**Készítette:** Sinthavong Bence, Szente Benedek Rafael  

---

## Bevezetés

Választásunkat elsősorban a személyes érintettség és a helyi értékek iránti elkötelezettség vezérelte. Mindketten a Balaton-felvidék és a Badacsonyi borvidék közvetlen közelében nőttünk fel, így a szőlőművelés és a borkészítés hagyománya nem csupán egy távoli iparág, hanem a mindennapjaink részét képező kulturális örökség számunkra. Szüleink révén már fiatalon betekintést nyertünk a szüretek magával ragadó hangulatába, valamint abba a munkába, amely a minőségi borok előállításához szükséges.

A digitalizáció korában azt tapasztaltuk, hogy bár a Balaton környéki borászatok magas színvonalú termékekkel rendelkeznek, a kisebb, családi pincészetek gyakran láthatatlanok maradnak az online térben. Számos esetben a vendégek nehézkesen találnak információt a kóstolási lehetőségekről, vagy a szállásfoglalás folyamata megáll a telefonos egyeztetés szintjén, ami a mai felgyorsult igények mellett már nem hatékony. Projektünkkel ezen a ponton kívánunk beavatkozni: egy olyan webes platformot hozunk létre, amely hidat képez a tradicionális borászat és a modern fogyasztó között.

Fő célkitűzésünk egy olyan komplex szoftverrendszer kifejlesztése, amely túlmutat az egyszerű webshopok funkcióin. Egy olyan közösségi és kereskedelmi csomópontot terveztünk, ahol a helyi termelők nemcsak boraikat értékesíthetik, hanem teljes körű élménycsomagot – borkóstolást – is kínálhatnak. Szoftverfejlesztő és -tesztelő szakos hallgatókként kiemelt fontosságú számunkra, hogy a rendszer ne csak esztétikus, hanem technológiailag is stabil, biztonságos és skálázható legyen.

A projekt megvalósítása során a technikai feladatok megosztásán túl kiemelt figyelmet fordítottunk az egymás közötti folyamatos kommunikációra és a mentális támogatásra is, mivel egy ilyen komplex rendszer fejlesztése – amely magában foglalja a webshopot, a foglalási motort és a tesztelési folyamatokat is – gyakran állított minket váratlan szakmai kihívások elé.

A projekt megkezdésénél készítettünk egy Gantt diagramot, amely segítségével lépést tudtunk tartani az idővel. Ha a határidők közelsége miatt nőtt rajtunk a nyomás, tudatosan beiktattunk rövid szüneteket, ahol nem a kódról, hanem a közös terveinkről és a projekt várható sikeréről beszélgettünk. Ez a fajta érzelmi biztonság és a pozitív visszacsatolások – egy-egy jól sikerült modul vagy sikeres teszt lefuttatása után – folyamatosan fenntartották a motivációnkat.

---

## Adatbázis

Az adatbázisunk elengedhetetlen volt projektünk megvalósításához. Célja, hogy hatékonyan tudjuk tárolni, rendszerezni, lekérdezni és módosítani az információkat. Az adatbázisok nélkülözhetetlenek a modern digitális világban, webes alkalmazásokban. Segítségükkel több felhasználó egyszerre férhet hozzá ugyanazokhoz az adatokhoz, miközben biztosított az adatok integrálása és biztonsága.

Az adatbázisunk az alábbi táblákból áll:

### 1. Bor tábla
* **ID:** mező elsődleges kulcsként funkcionál, a rekordok automatikusan kiosztott azonosítójaként szolgál.
* **BOR_SZIN_ID:** mező a bor_szin táblával összekapcsoló idegenkulcsként funkcionál.
* **NEV:** mező a borok neveit tárolja.
* **EVJARAT:** mező a borok évjáratait tárolja el.
* **AR:** mező a boroknak az alapárat tartalmazza.
* **KISZERELES_ID:** a kiszerelés táblát kapcsolja össze, a mennyiségeket veszi át a másik táblából.
* **KESZLET:** A raktáron lévő borok számát tárolja.
* **ALKOHOLFOK:** Az adott borok alkoholfokát tárolja az adatbázisban.
* **LEÍRÁS:** Leírást tárolja el.
* **CREATED_AT:** A bor hozzáadásának dátumát tárolja el az adatbázisba.

### 2. Bor_szin tábla
* **ID:** elsődleges kulcsként funkcionál, a rekordok automatikusan kiosztott azonosítójaként szolgál. A BOR táblával összekötőként szolgál.
* **NEV:** A borok színét tárolja el.

### 3. CEG_ADATOK tábla
* **ID:** elsődleges kulcsként funkcionál, a rekordok automatikusan kiosztott azonosítójaként szolgál.
* **CIM:** A felvitt cég címét tárolja.
* **TELEFON:** A cég telefonszámát tárolja.
* **EMAIL:** A cég e-mail címét tárolja.
* **NYITVATARTÁS:** A cég nyitvatartását tárolja.

### 4. Ertekelesek tábla
* **ID:** elsődleges kulcsként funkcionál.
* **BOR_ID:** a bor táblával összekapcsoló idegenkulcsként funkcionál.
* **USER_ID:** a user táblával összekapcsoló idegenkulcsként funkcionál.
* **ERTEKELES:** a felhasználó által leadott értékelést tárolja.
* **SZOVEG:** a felhasználó által írt szöveget menti el.
* **DATUM:** az értékelés dátumát rögzíti.

### 5. FOGLALAS tábla
* **ID:** elsődleges kulcsként funkcionál.
* **USER_ID:** A users táblát kapcsolja össze a regisztrált felhasználók ID-jával.
* **SZOLGALTATAS_ID:** A szolgaltatas táblát kapcsolja össze és az adott borkóstolás eseményével kapcsolja össze.
* **DATUM:** A foglalás dátumát rögzíti.
* **IDOTARTAM:** A foglalás időtartamát rögzítjük benne.
* **LETSZAM:** A foglaláskor beállított résztvevők számát rögzíti a táblában.
* **STATUSZ:** A foglalásnak a pillanatnyi állapotát raktározza el.
* **FOGLALAS_DATUMA:** A foglalás pillanatát rögzíti a táblába datetime mezőként.
* **MEGJEGYZES:** Ha a felhasználó szeretne megjegyzést írni a foglalással kapcsolatban, akkor azt ebbe a mezőben raktározzuk el.
* **OSSZEG:** A foglaláskor feltüntetett fizetendő összeget tároljuk itt.
* **EXTRA_INFO:** A borkóstolásnál lévő plusz programok adatait tárolja.

### 6. Hirlevel_feliratkozok tábla
* **ID:** elsődleges kulcsként funkcionál.
* **NEV:** a feliratkozott felhasználó nevét menti el.
* **EMAIL:** a felhasználó e-mail címét menti, amire küldjük a hírlevelet.
* **FELIRATKOZAS_DATUMA:** menti a feliratkozás idejét.

### 7. KISZERELES tábla
* **ID:** elsődleges kulcsként funkcionál.
* **MEGNEVEZES:** A kiszerelés típusának nevét tárolja (Pl.: 0,75L vagy kannás bor).
* **SZORZO:** A kiszerelésekhez rendelt szorzó mennyisége.

### 8. Rendeles tábla
* **ID:** elsődleges kulcsként funkcionál.
* **USER_ID:** a user táblával kapcsolja össze.
* **SZAML_NEV, SZAML_ORSZAG, SZAML_IRSZ, SZAML_VAROS, SZAML_UTCA, SZAML_HAZSZAM:** a számlázási adatokat tárolja.
* **SZALL_NEV, SZALL_ORSZAG, SZALL_IRSZ, SZALL_VAROS, SZALL_UTCA, SZALL_HAZSZAM:** a szállítási adatokat tárolja.
* **DATUM:** a rendelés leadását tárolja.
* **STATUSZ:** a rendelés státuszát tárolja.
* **SZALLITASI_DIJ:** a szállítási költséget tárolja.
* **VEGOSSZEG:** a fizetendő összeget tárolja el.
* **MEGJEGYZÉS:** az esetleges megjegyzéseket tárolja el.

### 9. Rendeles_tetel tábla
* **ID:** elsődleges kulcsként funkcionál.
* **RENDEÉS_ID:** a rendelés táblával köti össze a rendeles_tetel táblát (idegen kulcs).
* **BOR_ID:** a bor táblával kapcsolja össze (idegen kulcs).
* **MENNYISEG:** a megrendelt mennyiség darabszámát tárolja el.
* **EGYSEGAR:** az egységárat tárolja minden plusz nélkül.

### 10. Szolgaltatas tábla
* **ID:** elsődleges kulcsként funkcionál.
* **NEV:** a szolgáltatás nevét tárolja (Pl.: Borkóstolás).
* **KAPACITAS:** az adott szolgáltatás férőhelyeit tárolja.
* **AR:** a szolgáltatás árát tárolja el.
* **LEIRAS:** a szolgáltatás leírását tárolja.
* **AKTIV:** tárolja, hogy elérhető-e a szolgáltatás.
* **DATUM:** a szolgáltatás időpontját tárolja.
* **IDOTARTAM:** a szolgáltatás hosszát tárolja.
* **EXTRA:** tárolja, ha esetleg van valami plusz a szolgáltatáshoz.

### 11. Users tábla
* **ID:** elsődleges kulcsként funkcionál.
* **EMAIL:** tárolja a felhasználó e-mail címét.
* **PASSWOD_HASH:** a felhasználó által megadott jelszó titkosítva.
* **ROLE:** a felhasználó szerepkörét tárolja (Pl.: ADMIN, USER).
* **NEV, TELEFONSZAM, ORSZAG, IRSZ, VAROS, UTCA, HAZSZAM:** a felhasználó személyes- és lakcímadatai.
* **IS_ACTIVE:** tárolja, hogy a fiók aktív vagy archiválva lett.
* **CREATED_AT:** tárolja, hogy mikor hozták létre a fiókot.
* **LAST_LOGIN:** a legutóbbi belépés ideje (jelenleg nem tárol semmit).

### 12. Uzenetek tábla
* **ID:** elsődleges kulcsként funkcionál.
* **USER_ID:** a user táblával csatolja össze az uzenetek táblát (idegen kulcs).
* **NEV, EMAIL:** az üzenetet hagyó felhasználó nevét és e-mail címét tárolja.
* **TARGY:** az üzenet okát tárolja el.
* **UZENET:** magát az üzenetet tárolja el.
* **DATUM:** az üzenet elküldésének időpontját tárolja.

---

## Backend

### Rendelés leadása (`POST /api/rendeles`)
Ez a végpont felelős a vásárlói rendelések rögzítéséért és a kapcsolódó adatbázis-műveletek elvégzéséért. A kérés beérkezésekor a rendszer először a számlázási és szállítási adatokat menti el a rendeles táblába, alapesetben 'FELDOLGOZAS' státusszal. Ezt követően a kosárban lévő tételeket is rögzíti, és a megvásárolt mennyiségekkel automatikusan csökkenti a borok raktárkészletét a túlrendelések elkerülése végett. A folyamat során a háttérben megtörténik a hírlevélre történő feliratkozás is, amennyiben a vásárló ezt igényelte. Végül a rendszer egy külső szolgáltatás segítségével e-mailes visszaigazolást küld a tranzakció részleteivel.

### Felhasználói hitelesítés (`POST /api/register`, `POST /api/login`)
Ezek a végpontok alkotják a rendszer biztonságos autentikációs modulját, amely az új regisztrációkat és a bejelentkezéseket kezeli. Regisztrációkor a beérkező jelszavakat a szerver a bcrypt könyvtár segítségével titkosítja, így az adatbázisba már kizárólag az egyirányú, biztonságos hash értékek kerülnek be. Bejelentkezés esetén a rendszer összehasonlítja a megadott jelszót a tárolt hash-sel, majd sikeres azonosítás után egy JSON Web Token-t (JWT) állít ki. Ez a 24 óráig érvényes token biztosítja a továbbiakban a felhasználó jogosultságainak ellenőrzését a védett funkcióknál. Ezzel a megoldással a rendszer modern, állapotmentes (stateless) és rendkívül biztonságos munkamenet-kezelést valósít meg.

### Termékkatalógus és alapadataok lekérése (`GET /api/borok`, `GET /api/bor-szinek`, `GET /api/kiszerelesek`)
Ez a publikus felület működését biztosító végpontcsoport a termékek és a hozzájuk tartozó metaadatok kiszolgálásáért felel. A borok lekérdezésekor a rendszer összekapcsolja a fő terméktáblát a kiszerelési adatokkal, és kizárólag a készleten lévő tételeket adja vissza a frontend számára. Külön végpontok biztosítják a szűréshez szükséges bor színkategóriák és a különböző kiszerelési opciók elérését. Ezek az információk elengedhetetlenek a kliensoldali felület dinamikus felépítéséhez és az árak pontos megjelenítéséhez.

### Szolgáltatások és borkóstolók kezelése (`GET, POST, PUT, DELETE /api/szolgaltatasok`)
Ez a végpontcsoport a pincészet által kínált különböző programok, például borkóstolók és dűlőtúrák adminisztrációját és publikus listázását látja el. Az adminisztrátorok új szolgáltatásokat hozhatnak létre, meghatározva azok nevét, leírását, árát, maximális kapacitását és pontos időtartamát. A rendszer rugalmas lehetőséget biztosít a meglévő programok adatainak utólagos szerkesztésére, valamint az inaktívvá vált szolgáltatások adminisztrátori törlésére is. A publikus lekérdező végpont gondoskodik arról, hogy a látogatók számára kizárólag az aktív, jelenleg is foglalható programok jelenjenek meg.

### Foglalási rendszer és digitális jegykezelés (`POST /api/foglalas`, jegy generálás és beváltás)
A rendszer egyik legkomplexebb, önálló modulja a szolgáltatásokra történő helyfoglalást és a helyszíni jegykezelést valósítja meg. A sikeres felhasználói foglalás rögzítése után egy dedikált végpont a pdfkit és qrcode modulok integrálásával automatikusan egyedi, vonalkóddal ellátott, formázott elektronikus belépőjegyet generál a vásárlónak. Az adminisztrációs oldalon a helyszíni beléptetés a jegyen lévő QR kód beolvasásával indul, amely azonnal lekérdezi a foglalás érvényességét az adatbázisból. Ezt követően a beváltó végpont módosítja a jegy státuszát, szoftveresen megakadályozva ezzel a belépők többszöri, jogosulatlan felhasználását.

### Felhasználói interakciók és automatizált kommunikáció (Értékelések, üzenetek, Cron hírlevél)
Ez a logikai egység a vásárlói visszajelzéseket és a proaktív, időzített kommunikációt fogja össze a szerveren. A látogatók a kapcsolati űrlapon keresztül üzeneteket küldhetnek. A termékoldalakon a bejelentkezett felhasználók értékelhetik a megvásárolt borokat. Kiemelkedő funkció a rendszerbe épített automatizált háttérfolyamat (Cron job), amely minden nap 11 órakor önállóan lefut: kigyűjti a legnépszerűbb borokat az eladások alapján, és hírlevél formájában automatikusan kiküldi azokat a feliratkozott érdeklődőknek.

### Adminisztrátori rendelés- és foglaláskezelés (`GET, PUT /api/admin/rendelesek`, `/api/admin/foglalasok`)
A lekérdező végpontok listázzák a rendszerbe beérkezett összes eddigi rendelést és szolgáltatásfoglalást. Kiemelten fontos a státuszok módosítási lehetősége (például „feldolgozás alatt”, „teljesítve” vagy „törölve”), amelyet egyedi azonosító alapján, PUT kéréseken keresztül hajthatnak végre az adminisztrátorok. Az adatbázis azonnali frissítése garantálja, hogy a vásárlók és a személyzet is naprakész információkat lásson.

### Felhasználói profil és vásárlási előzmények (`GET /api/rendeles/user/:userId`, `/api/foglalas/user/:userId`)
A regisztrált vásárlók személyes profiljának adatkiszolgálásáért ezek a specifikus végpontok felelnek. Segítségükkel a felhasználók megtekinthetik a saját fiókjukhoz tartozó, korábban leadott termékrendeléseik teljes listáját és a lefoglalt szolgáltatásokat, a tranzakciók dátuma szerint csökkenő sorrendben.

### Dinamikus tartalmak és cégadatok lekérése (`GET /api/borok/top`, `/api/borok/new`, `/api/cegadatok`)
A szerver összetett lekérdezéssel, a korábbi eladások mennyiségének aggregációja alapján képes visszaadni a három legnépszerűbb „Top” bor listáját, valamint a legutóbb feltöltött újdonságokat. A cégadatokat lekérdező végpont biztosítja, hogy a webshop láblécében és a kapcsolat oldalon mindig a hivatalos, adatbázisban tárolt elérhetőségek jelenjenek meg.

### Ügyfélszolgálati modul és üzenetkezelés (`GET, PUT, DELETE /api/admin/uzenetek`)
A publikus felületről beérkező vásárlói kérdések és észrevételek adminisztrátori kezelését ez az alrendszer fogja össze. A rendszer lehetőséget ad az üzenetek utólagos módosítására vagy frissítésére, illetve a már feldolgozott üzenetek végleges eltávolítására.

---

## Frontend

### Borrendelés és Vásárlási Folyamat
A rendszer célja, hogy a felhasználók egyszerűen, gyorsan és átláthatóan tudjanak böngészni a kínálatban, kiválasztani a megfelelő termékeket, majd biztonságosan leadni a rendelésüket.

#### Kínálat és Keresés
A vásárlás első lépése a borok közötti böngészés.
* **Terméklista:** Kártyás elrendezésben jeleníti meg a borokat (bor neve, képe és az alapvető információk).
* **Szűrési lehetőségek:** Lehetőség van szűrni a borok színére és évjáratára.
* **Rendezés:** A találati listát sorba rendezhetik (Ajánlott, Legnépszerűbb, Ár szerint növekvő/csökkenő).
* **Szűrők törlése:** Visszaállítható az eredeti, teljes lista.

#### Termék részletei és Kosárba tétel
* **Részletes információk:** Megjelenik a bor részletes leírása, származási helye és a pontos ára.
* **Kiszerelés és mennyiség:** A felhasználó kiválaszthatja a kívánt kiszerelést és a darabszámot.
* **Kosárba gomb:** A "Kosárba" gomb megnyomásával az adatok elmentődnek, a rendszer frissíti a végösszeget.
* **Értékelések:** Az oldalon láthatóak a korábbi vásárlók véleményei, bejelentkezve saját értékelés írható.

#### Pénztár és Rendelés Véglegesítése
* **Számlázási és Szállítási adatok:** Űrlap kitöltése. A rendszer figyeli a kötelező mezőket. Pipadoboz jelzi, ha a szállítási cím megegyezik a számlázásival.
* **Rendelés összesítő:** Folyamatosan látható a kosár tartalma, szállítási díj és a végösszeg.
* **Kötelező jogi nyilatkozatok:** Korhatár-ellenőrzés (18+), ÁSZF és Adatkezelési tájékoztató elfogadása kötelező.
* **A rendelés elküldése:** Ha minden adat helyes, aktívvá válik a "Fizetési kötelezettséggel járó megrendelés" gomb.

### Borkóstoló Programok és Foglalás

#### Kínálat és Keresés
* **Adaptív kártyás megjelenés:** Mobilon 1, tableten 2, asztali gépen 3 kártya alkot egy sort.
* **Valós idejű kapacitásfigyelés:** A felhasználó vizuálisan látja, ha egy program betelt, vagy mennyi szabad hely maradt.
* **Interaktív szűrés:** Szűrhetnek elérhetőségre és konkrét hónapokra. Üres állapot esetén barátságos üzenet és egykattintásos törlés jelenik meg.

#### Foglalás Véglegesítése
* **Intelligens űrlap:** Bejelentkezett vásárló esetén automatikusan kitölti az űrlapot a profiladatok alapján.
* **Dinamikus létszámkezelés:** A résztvevők számát "+" és "-" gombokkal lehet szabályozni, de nem lépheti túl a szabad helyek számát.
* **Élő összesítő panel:** A fizetendő végösszeg a beállított résztvevők számának függvényében valós időben frissül.
* **Jogi nyilatkozatok:** A kötelező nyilatkozatok (18+, ÁSZF) elfogadása kötelező. Sikeres foglaláskor SweetAlert2 ablak értesíti a felhasználót.

### Kapcsolat és Üzenetküldés
A Kapcsolat oldal kettős célt szolgál: biztosítja a hivatalos elérhetőségeket, és lehetőséget ad a közvetlen kapcsolatfelvételre.

* **Dinamikus adatbetöltés:** A rendszer a háttérből tölti be a legfrissebb cégadatokat (Telefonszám, E-mail, Cím, Nyitvatartás).
* **Üzenetküldő Űrlap:** Ha a felhasználó nincs bejelentkezve, a rendszer letiltja az űrlapot (spamszűrés céljából), és belépésre kéri a látogatót. Bejelentkezés után az űrlap egyszerűsített bevitellel (csak Tárgy és Üzenet) használható.

### Bemutatkozás és Képgaléria
* **Animált oldalbetöltés:** A szövegek és a képek finom, alulról felfelé történő úszó mozgással jelennek meg.
* **Dinamikus képgaléria:** A rendszer önállóan beolvassa a szerveren található képeket, rácsos elrendezésben jeleníti meg őket, a fájlnevekből pedig automatikus címkéket generál.
* **Teljes képernyős képnézegető:** Sötétített háttérrel jeleníti meg a felnagyított fotót, lehetővé téve a lapozást és az egyszerű bezárást.

### Bejelentkezés és Regisztráció
* **Bejelentkezés:** Egyszerűsített űrlap (E-mail és Jelszó). Intelligens visszanavigálás a korábbi oldalra. Személyre szabott üdvözlés.
* **Regisztráció:** Két logikus részre bontva (Személyes és Lakcím adatok). Rugalmas elrendezés, azonnali visszajelzések és hibakezelés.

### Felhasználói Profil
A profil oldal három fő fülből áll:
1. **Személyes Adatok:** Kártyás elrendezésben láthatóak a regisztrációkor megadott adatok, amiket a rendszer automatikusan betölt a pénztárnál.
2. **Korábbi rendeléseim:** Letisztult táblázat a rendelések dátumával, végösszegével és állapotával (színes címkék). A számla (PDF) csak "Kiszállítva" státusz után tölthető le.
3. **Borkóstoló Foglalásaim:** Az események listázása, szintén színes státuszjelzőkkel és PDF jegy letöltési lehetőséggel a visszaigazolás után.

---

## Adminisztrációs Vezérlőpult

Az adminisztrációs felülethez kizárólag a megfelelő jogosultsággal (ADMIN) rendelkező munkatársak férhetnek hozzá.

### Borok és Borkóstoló Csomagok Kezelése
* **Termékek felvitele és szerkesztése:** Elegáns felugró űrlapon történik, közvetlen képfeltöltési lehetőséggel.
* **Egyszerű törlés:** Biztonsági rákérdezés után a tételek eltávolíthatók.

### Rendelések és Foglalások Kezelése
* **Állapotok gyors átállítása:** A kezelő egyetlen kattintással módosíthatja a rendelések ("Feldolgozás alatt", "Kiszállítva") vagy foglalások ("Visszaigazolva") állapotát.

### Üzenetek és Felhasználók
* **Kapcsolat Üzenetek:** A beküldött kérdések egy központi postaládában gyűlnek össze.
* **Felhasználók Kezelése:** Az adminisztrátorok könnyedén adhatnak admin jogosultságot másoknak, vagy törölhetnek fiókokat.
* **Azonnali visszajelzések és Reszponzív táblázatok:** Az admin műveleteket megerősítő ablakok kísérik, az adatok görgethető táblázatokban jelennek meg.

---

## Jogi Nyilatkozatok és Tájékoztatók (Felugró ablakok)

A rendszer legfontosabb kényelmi funkciója, hogy a tájékoztatók nem egy új, különálló oldalon nyílnak meg, hanem elegáns felugró ablakban, így az adatok megadása nem szakad meg.
* **Általános Szerződési Feltételek (ÁSZF):** A vásárlás, szerződéskötés és foglalás szabályai.
* **Adatkezelési Tájékoztató:** Személyes adatok védelmének leírása.
* **Szállítás, Fizetés és Foglalás:** Információk a fizetési módokról és a kiszállításról.
* **Impresszum:** A borászat és a weboldal hivatalos cégadatai.

---

## Projekthez használt programok

* **Microsoft Office:** Word, PowerPoint a dokumentáció és a prezentáció készítéséhez.
* **Figma:** Felhasználói felület (UI) és élmény (UX) megtervezése.
* **Canva:** Gantt diagram készítése az időterv betartásához.
* **Inkscape:** Vektorgrafikus logótervezés.
* **Google Drive:** Fájlok tárolása és megosztása a csapaton belül.
* **GitHub:** Verziókövetés, dokumentumok és fejlesztési fázisok tárolása.
* **Visual Studio / Visual Studio Code:** A webes alkalmazás elsődleges fejlesztői környezete.
* **Postman:** Az API végpontok gyors tesztelésére és hibakeresésére.
* **Discord:** Csapatkommunikáció, képernyőmegosztás és azonnali fájlmegosztás.
* **Docker:** Konténerizáció, amely segítségével könnyebben hordozható az adatbázis és a szerver.
* **Material UI (MUI):** Kész komponensek (ikonok, gombok) a gyors és reszponzív frontend dizájnhoz.

---

## Melléklet
