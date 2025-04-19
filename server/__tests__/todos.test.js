const request = require('supertest');
const app = require('../index');

describe('Todo API', () => {
    test('GET /api/todos returns empty array initially', async () => {
        const res = await request(app).get('/api/todos');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
    });

    test('POST /api/todos creates a new todo', async () => {
        const res = await request(app)
            .post('/api/todos')
            .send({ title: 'Test Todo' });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('id');
        expect(res.body.title).toBe('Test Todo');
    });
});
