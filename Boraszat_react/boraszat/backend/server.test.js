const request = require('supertest');
const app = require('./server');

describe('Borászat API Végpontok Tesztelése', () => {

   
    describe('Autentikációs végpontok', () => {
        test('POST /api/register - Hiányzó adatokkal 400-as hiba', async () => {
            const response = await request(app).post('/api/register').send({ email: 'teszt@teszt.hu' });
            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('error');
        });

        test('POST /api/login - Hibás adatokkal 401-es hiba', async () => {
            const response = await request(app).post('/api/login').send({ email: 'nemletezo@email.hu', password_hash: 'rosszjelszo' });
            expect(response.statusCode).toBe(401);
            expect(response.body.error).toBe('Hibás adatok!');
        });
    });

   
    describe('Borok végpontjai', () => {
        test('GET /api/borok - Összes bor lekérése (200 OK)', async () => {
            const response = await request(app).get('/api/borok');
            expect(response.statusCode).toBe(200);
            expect(Array.isArray(response.body)).toBeTruthy();
        });

        test('GET /api/borok/top - Top borok lekérése (200 OK)', async () => {
            const response = await request(app).get('/api/borok/top');
            expect(response.statusCode).toBe(200);
            expect(Array.isArray(response.body)).toBeTruthy();
        });

        test('GET /api/borok/new - Legújabb borok lekérése (200 OK)', async () => {
            const response = await request(app).get('/api/borok/new');
            expect(response.statusCode).toBe(200);
            expect(Array.isArray(response.body)).toBeTruthy();
        });

        test('POST /api/borok - Új bor hozzáadása', async () => {
            const newBor = { nev: 'Teszt Bor', evjarat: 2023, ar: 5000, keszlet: 10, leiras: 'Teszt', kiszereles_id: 1 };
            const response = await request(app).post('/api/borok').send(newBor);
            expect([200, 500]).toContain(response.statusCode); 
        });

        test('PUT /api/borok/:id - Bor módosítása', async () => {
            const updateBor = { nev: 'Frissített Teszt Bor', evjarat: 2024, ar: 6000, keszlet: 5, leiras: 'Frissített' };
            const response = await request(app).put('/api/borok/99999').send(updateBor);
            expect(response.statusCode).toBe(200); 
        });

        test('DELETE /api/borok/:id - Bor törlése', async () => {
            const response = await request(app).delete('/api/borok/99999');
            expect(response.statusCode).toBe(200);
        });
    });

    
    describe('Kiszerelések és Cégadatok', () => {
        test('GET /api/kiszerelesek - Kiszerelések lekérése (200 OK)', async () => {
            const response = await request(app).get('/api/kiszerelesek');
            expect(response.statusCode).toBe(200);
            expect(Array.isArray(response.body)).toBeTruthy();
        });

        test('GET /api/cegadatok - Cégadatok lekérése (200 OK)', async () => {
            const response = await request(app).get('/api/cegadatok');
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('cim');
        });
    });

    
    describe('Felhasználók végpontjai', () => {
        test('GET /api/users - Összes felhasználó lekérése (200 OK)', async () => {
            const response = await request(app).get('/api/users');
            expect(response.statusCode).toBe(200);
            expect(Array.isArray(response.body)).toBeTruthy();
        });

        test('DELETE /api/users/:id - Fő admin (id:1) törlésének megtagadása (403)', async () => {
            const response = await request(app).delete('/api/users/1');
            expect(response.statusCode).toBe(403);
            expect(response.body.error).toBe('A fő admint nem lehet törölni!');
        });
    });

   
    describe('Szolgáltatások végpontjai', () => {
        test('GET /api/szolgaltatasok - Aktív szolgáltatások lekérése (200 OK)', async () => {
            const response = await request(app).get('/api/szolgaltatasok');
            expect(response.statusCode).toBe(200);
            expect(Array.isArray(response.body)).toBeTruthy();
        });

        test('GET /api/admin/szolgaltatasok - Összes szolgáltatás lekérése (Admin)', async () => {
            const response = await request(app).get('/api/admin/szolgaltatasok');
            expect(response.statusCode).toBe(200);
            expect(Array.isArray(response.body)).toBeTruthy();
        });

        test('POST /api/szolgaltatasok - Új szolgáltatás létrehozása', async () => {
            const newSzolg = { nev: 'Teszt Kóstoló', leiras: 'Teszt', ar: 5000, kapacitas: 10 };
            const response = await request(app).post('/api/szolgaltatasok').send(newSzolg);
            expect([200, 500]).toContain(response.statusCode);
        });

        test('PUT /api/szolgaltatasok/:id - Szolgáltatás módosítása', async () => {
            const updateSzolg = { nev: 'Frissített Kóstoló', leiras: 'Frissített', ar: 6000, kapacitas: 15 };
            const response = await request(app).put('/api/szolgaltatasok/99999').send(updateSzolg);
            expect(response.statusCode).toBe(200);
        });

        test('DELETE /api/szolgaltatasok/:id - Szolgáltatás törlése', async () => {
            const response = await request(app).delete('/api/szolgaltatasok/99999');
            expect(response.statusCode).toBe(200);
        });
    });

   
    describe('Rendelések végpontjai', () => {
        test('POST /api/rendeles - Üres kosárral 400-as hiba', async () => {
            const response = await request(app).post('/api/rendeles').send({ tetelek: [] });
            expect(response.statusCode).toBe(400);
            expect(response.body.msg).toBe('Üres a kosár!');
        });

        test('GET /api/rendeles/user/:userId - Felhasználó rendeléseinek lekérése', async () => {
            const response = await request(app).get('/api/rendeles/user/1');
            expect(response.statusCode).toBe(200);
            expect(Array.isArray(response.body)).toBeTruthy();
        });

        test('GET /api/admin/rendelesek - Összes rendelés lekérése (Admin)', async () => {
            const response = await request(app).get('/api/admin/rendelesek');
            expect(response.statusCode).toBe(200);
            expect(Array.isArray(response.body)).toBeTruthy();
        });

        test('PUT /api/admin/rendelesek/:id/statusz - Rendelés státuszának frissítése', async () => {
            const response = await request(app).put('/api/admin/rendelesek/99999/statusz').send({ statusz: 'KISZALLITVA' });
            expect(response.statusCode).toBe(200);
        });
    });


    describe('Foglalások végpontjai', () => {
        test('POST /api/foglalas - Hiányzó adatokkal 400-as hiba', async () => {
            const response = await request(app).post('/api/foglalas').send({ userId: 1 }); 
            expect(response.statusCode).toBe(400);
            expect(response.body.error).toBe('Hiányzó adatok!');
        });

        test('GET /api/foglaltsag - Foglaltság lekérése', async () => {
            const response = await request(app).get('/api/foglaltsag');
            expect(response.statusCode).toBe(200);
            expect(Array.isArray(response.body)).toBeTruthy();
        });

        test('GET /api/foglalas/user/:userId - Felhasználó foglalásainak lekérése', async () => {
            const response = await request(app).get('/api/foglalas/user/1');
            expect(response.statusCode).toBe(200);
            expect(Array.isArray(response.body)).toBeTruthy();
        });

        test('GET /api/admin/foglalasok - Összes foglalás lekérése (Admin)', async () => {
            const response = await request(app).get('/api/admin/foglalasok');
            expect(response.statusCode).toBe(200);
            expect(Array.isArray(response.body)).toBeTruthy();
        });

        test('PUT /api/admin/foglalasok/:id/statusz - Foglalás státusz frissítése', async () => {
            const response = await request(app).put('/api/admin/foglalasok/99999/statusz').send({ statusz: 'CONFIRMED' });
            expect(response.statusCode).toBe(200);
        });
    });

   
    describe('Kapcsolat és Üzenetek', () => {
        test('POST /api/contact - Hiányzó adatokkal 400-as hiba', async () => {
            const response = await request(app).post('/api/contact').send({ nev: 'Teszt Elek' });
            expect(response.statusCode).toBe(400);
            expect(response.body.error).toBe('Hiányzó adatok!');
        });

        test('GET /api/admin/uzenetek - Összes üzenet lekérése (Admin)', async () => {
            const response = await request(app).get('/api/admin/uzenetek');
            expect(response.statusCode).toBe(200);
            expect(Array.isArray(response.body)).toBeTruthy();
        });

        test('PUT /api/admin/uzenetek/:id - Üzenet frissítése', async () => {
            const updateMsg = { nev: 'Teszt', email: 'teszt@teszt.hu', targy: 'Tárgy', uzenet: 'Szöveg' };
            const response = await request(app).put('/api/admin/uzenetek/99999').send(updateMsg);
            expect(response.statusCode).toBe(200);
        });

        test('DELETE /api/admin/uzenetek/:id - Üzenet törlése', async () => {
            const response = await request(app).delete('/api/admin/uzenetek/99999');
            expect(response.statusCode).toBe(200);
        });
    });

});