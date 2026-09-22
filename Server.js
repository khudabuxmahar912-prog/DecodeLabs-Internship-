const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse incoming JSON request bodies
app.use(express.json());

// ------------------------------------------------------
// In-memory "database" — resets every time the server restarts
// ------------------------------------------------------
let tasks = [
  { id: 1, title: 'Set up the repository', done: true },
  { id: 2, title: 'Build the responsive frontend', done: true },
  { id: 3, title: 'Build the backend API', done: false }
];
let nextId = 4;

// ------------------------------------------------------
// GET /tasks — retrieve all tasks
// ------------------------------------------------------
app.get('/tasks', (req, res) => {
  res.status(200).json(tasks);
});

// ------------------------------------------------------
// GET /tasks/:id — retrieve a single task by id
// ------------------------------------------------------
app.get('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ error: `Task with id ${id} not found` });
  }

  res.status(200).json(task);
});

// ------------------------------------------------------
// POST /tasks — create a new task
// The Gatekeeper Rule: never trust the client. Validate first.
// ------------------------------------------------------
app.post('/tasks', (req, res) => {
  const { title } = req.body;

  // Basic validation
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({ error: 'A non-empty "title" string is required' });
  }

  const newTask = {
    id: nextId++,
    title: title.trim(),
    done: false
  };

  tasks.push(newTask);

  // 201 Created — a new resource now exists
  res.status(201).json(newTask);
});

// ------------------------------------------------------
// Fallback for any route that doesn't exist
// ------------------------------------------------------
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
