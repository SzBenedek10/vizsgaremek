const request = require('supertest');  
const app = require('./server');
const assert = require('assert');

describe('Borászat API Végpontok Tesztelése (Izolált, NUnit stílus)', () => {
    describe('Autentikációs végpontok', () => {
        test('POST /api/register - Hiányzó adatokkal 400-as hiba', async () => {
            const response = await request(app).post('/api/register').send({ email: 'teszt@teszt.hu' });
            assert.strictEqual(response.statusCode, 400);
            assert.ok(response.body.error, "Hibajelzésnek kell lennie a válaszban!");
        });

        test('POST /api/login - Hibás adatokkal 401-es hiba', async () => {
            const response = await request(app).post('/api/login').send({ email: 'nemletezo@email.hu', password_hash: 'rosszjelszo' });
            assert.strictEqual(response.statusCode, 401);
            assert.strictEqual(response.body.error, 'Hibás adatok!');
        });
    });
    describe('Borok végpontjai', () => {
        let tesztBorId = null;

        test('GET /api/borok - Összes bor lekérése', async () => {
            const response = await request(app).get('/api/borok');
            assert.strictEqual(response.statusCode, 200);
            assert.ok(Array.isArray(response.body));
        });

        test('GET /api/borok/top és /new - Szűrések', async () => {
            const resTop = await request(app).get('/api/borok/top');
            const resNew = await request(app).get('/api/borok/new');
            assert.strictEqual(resTop.statusCode, 200);
            assert.strictEqual(resNew.statusCode, 200);
        });

        test('POST /api/borok - Új bor hozzáadása', async () => {
            const newBor = { nev: 'Teszt Bor', evjarat: 2023, ar: 5000, keszlet: 10, leiras: 'Teszt', kiszereles_id: 1 };
            const response = await request(app).post('/api/borok').send(newBor);
            
            assert.strictEqual(response.statusCode, 200);
            assert.ok(response.body.insertId > 0, "Nem kaptunk vissza azonosítót!");
            tesztBorId = response.body.insertId; 
        });

        test('PUT /api/borok/:id - Létrehozott bor módosítása', async () => {
            assert.ok(tesztBorId, "Nincs meg a teszt bor ID!");
            const updateBor = { nev: 'Frissített Teszt Bor', evjarat: 2024, ar: 6000, keszlet: 5, leiras: 'Frissített' };
            
            const response = await request(app).put(`/api/borok/${tesztBorId}`).send(updateBor);
            assert.strictEqual(response.statusCode, 200); 
        });

        test('DELETE /api/borok/:id - Létrehozott bor törlése', async () => {
            assert.ok(tesztBorId, "Nincs meg a teszt bor ID!");
            const response = await request(app).delete(`/api/borok/${tesztBorId}`);
            assert.strictEqual(response.statusCode, 200);
        });
        afterAll(async () => {
            if (tesztBorId) await request(app).delete(`/api/borok/${tesztBorId}`);
        });
    });
    describe('Kiszerelések és Cégadatok', () => {
        test('GET /api/kiszerelesek - Kiszerelések lekérése', async () => {
            const response = await request(app).get('/api/kiszerelesek');
            assert.strictEqual(response.statusCode, 200);
            assert.ok(Array.isArray(response.body));
        });

        test('GET /api/cegadatok - Cégadatok lekérése', async () => {
            const response = await request(app).get('/api/cegadatok');
            assert.strictEqual(response.statusCode, 200);
            assert.ok(response.body.cim);
        });
    });
    describe('Felhasználók végpontjai', () => {
        test('GET /api/users - Összes felhasználó lekérése', async () => {
            const response = await request(app).get('/api/users');
            assert.strictEqual(response.statusCode, 200);
            assert.ok(Array.isArray(response.body));
        });

        test('DELETE /api/users/:id - Fő admin (id:1) törlésének megtagadása', async () => {
            const response = await request(app).delete('/api/users/1');
            assert.strictEqual(response.statusCode, 403);
            assert.strictEqual(response.body.error, 'A fő admint nem lehet törölni!');
        });
    });
    describe('Szolgáltatások végpontjai', () => {
        let tesztSzolgId = null;

        test('GET /api/szolgaltatasok - Aktív és Összes lekérése', async () => {
            const resAktiv = await request(app).get('/api/szolgaltatasok');
            const resAll = await request(app).get('/api/admin/szolgaltatasok');
            assert.strictEqual(resAktiv.statusCode, 200);
            assert.strictEqual(resAll.statusCode, 200);
        });

        test('POST /api/szolgaltatasok - Új szolgáltatás létrehozása', async () => {
            const newSzolg = { nev: 'Izolált Teszt Kóstoló', leiras: 'Teszt', ar: 5000, kapacitas: 10 };
            const response = await request(app).post('/api/szolgaltatasok').send(newSzolg);
            
            assert.strictEqual(response.statusCode, 200);
            tesztSzolgId = response.body.insertId;
        });

        test('PUT /api/szolgaltatasok/:id - Szolgáltatás módosítása', async () => {
            assert.ok(tesztSzolgId);
            const updateSzolg = { nev: 'Frissített Kóstoló', leiras: 'Frissített', ar: 6000, kapacitas: 15 };
            const response = await request(app).put(`/api/szolgaltatasok/${tesztSzolgId}`).send(updateSzolg);
            assert.strictEqual(response.statusCode, 200);
        });

        test('DELETE /api/szolgaltatasok/:id - Szolgáltatás törlése', async () => {
            assert.ok(tesztSzolgId);
            const response = await request(app).delete(`/api/szolgaltatasok/${tesztSzolgId}`);
            assert.strictEqual(response.statusCode, 200);
        });

        afterAll(async () => {
            if (tesztSzolgId) await request(app).delete(`/api/szolgaltatasok/${tesztSzolgId}`);
        });
    });
    describe('Kapcsolat és Üzenetek', () => {
        let tesztUzenetId = null;

        test('POST /api/contact - Hiányzó adatokkal 400', async () => {
            const response = await request(app).post('/api/contact').send({ nev: 'Teszt Elek' });
            assert.strictEqual(response.statusCode, 400);
        });

        test('POST /api/contact - Sikeres üzenetküldés', async () => {
            const validMsg = { nev: 'Teszt Elek', email: 'teszt@teszt.hu', targy: 'Teszt Tárgy', uzenet: 'Izolált teszt üzenet' };
            const response = await request(app).post('/api/contact').send(validMsg);
            
            assert.strictEqual(response.statusCode, 200);
            tesztUzenetId = response.body.insertId; 
        });

        test('GET /api/admin/uzenetek - Összes lekérése', async () => {
            const response = await request(app).get('/api/admin/uzenetek');
            assert.strictEqual(response.statusCode, 200);
            assert.ok(Array.isArray(response.body));
        });

        test('PUT /api/admin/uzenetek/:id - Létrehozott üzenet frissítése', async () => {
            assert.ok(tesztUzenetId);
            const response = await request(app).put(`/api/admin/uzenetek/${tesztUzenetId}`).send({ uzenet: 'Frissített teszt' });
            assert.strictEqual(response.statusCode, 200);
        });

        test('DELETE /api/admin/uzenetek/:id - Üzenet törlése', async () => {
            assert.ok(tesztUzenetId);
            const response = await request(app).delete(`/api/admin/uzenetek/${tesztUzenetId}`);
            assert.strictEqual(response.statusCode, 200);
        });

        afterAll(async () => {
            if (tesztUzenetId) await request(app).delete(`/api/admin/uzenetek/${tesztUzenetId}`);
        });
    });
    describe('Rendelések és Foglalások (Státusz tesztek)', () => {
        
        test('POST /api/rendeles - Üres kosárral 400', async () => {
            const response = await request(app).post('/api/rendeles').send({ tetelek: [] });
            assert.strictEqual(response.statusCode, 400);
        });

        test('GET /api/rendeles/user/:userId - Rendelések lekérése', async () => {
            const response = await request(app).get('/api/rendeles/user/1');
            assert.strictEqual(response.statusCode, 200);
        });

        test('POST /api/foglalas - Hiányzó adatokkal 400', async () => {
            const response = await request(app).post('/api/foglalas').send({ userId: 1 }); 
            assert.strictEqual(response.statusCode, 400);
        });

        test('GET /api/foglaltsag - Foglaltság lekérése', async () => {
            const response = await request(app).get('/api/foglaltsag');
            assert.strictEqual(response.statusCode, 200);
            assert.ok(Array.isArray(response.body));
        });
    });

});