const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

app.use(cors({
    origin: process.env.VERCEL_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());

const pool = new Pool({
    connectionString: 'postgresql://my_todo_db_19sx_user:60vq0slWTI8rJ7XkT8wuCrGqgtH2xbIu@dpg-d01m96re5dus73bbftng-a.oregon-postgres.render.com/my_todo_db_19sx',
    ssl: { rejectUnauthorized: false }
});

pool.query(`CREATE TABLE IF NOT EXISTS todos (
  id SERIAL PRIMARY KEY,
  title TEXT
)`, (err) => {
    if (err) console.error('Ошибка создания таблицы:', err);
    else console.log('Таблица todos готова');
});

// маршруты
app.get('/api/todos', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM todos');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/todos', async (req, res) => {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });
    try {
        const { rows } = await pool.query(
            'INSERT INTO todos (title) VALUES ($1) RETURNING *',
            [title]
        );
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/todos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { rowCount } = await pool.query('DELETE FROM todos WHERE id = $1', [id]);
        res.json({ deleted: rowCount });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// экспортируем и app, и pool
module.exports = { app, pool };
