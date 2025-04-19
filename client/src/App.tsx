import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

type Todo = {
  id: number,
  title: string,
}
const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://my-todo-app-backend.onrender.com'
  : 'http://localhost:5001';

function App() {
  const [todos, setTodos] = useState<Array<Todo>>([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    axios.get(`${API_URL}/api/todos`)
      .then(res => setTodos(res.data))
      .catch(err => console.error(err));
  }, []);

  const addTodo = () => {
    axios.post(`${API_URL}/api/todos`, { title: newTodo })
      .then(res => setTodos([...todos, res.data]))
      .catch(err => console.error(err));
    setNewTodo('');
  };

  const deleteTodo = (id: number) => {
    axios.delete(`${API_URL}/api/todos/${id}`)
      .then(() => setTodos(todos.filter(todo => todo.id !== id)))
      .catch(err => console.error(err));
  };

  return (
    <div className="App">
      <h1>To-Do List</h1>
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Название задачи"
      />
      <button onClick={addTodo}>Добавить задау</button>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            {todo.title}
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
