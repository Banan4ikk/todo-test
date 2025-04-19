const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();

app.use(cors({
    origin: 'http://localhost:3000', // Разрешаем запросы только с этого адреса
    methods: ['GET', 'POST', 'DELETE'], // Разрешенные методы
    allowedHeaders: ['Content-Type','Access-Control-Allow-Origin'], // Разрешенные заголовки
}));

app.use(express.json());

const db = new sqlite3.Database(':memory:', (err) => {
    if (err) console.error(err.message);
    console.log('Connected to SQLite database.');
});

db.run(`CREATE TABLE todos (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT)`);

app.get('/api/todos', (req, res) => {
    db.all('SELECT * FROM todos', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/todos', (req, res) => {
    const { title } = req.body;
    db.run('INSERT INTO todos (title) VALUES (?)', [title], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, title });
    });
});

app.delete('/api/todos/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM todos WHERE id = ?', id, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ deleted: this.changes });
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
