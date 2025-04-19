import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { app, pool } from '../sever';
import request from 'supertest';

let server;

beforeAll(() => {
    server = app.listen(); // создаёт http.Server
});

afterAll(async () => {
    server.close();
    await pool.end(); // закрываем pool, если он используется
});

describe('Todo API', () => {
    it('GET /api/todos возвращает массив', async () => {
        const res = await request(server).get('/api/todos');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('POST /api/todos создаёт новую задачу', async () => {
        const res = await request(server)
            .post('/api/todos')
            .send({ title: 'Проверка' });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('id');
        expect(res.body.title).toBe('Проверка');
    });
});
