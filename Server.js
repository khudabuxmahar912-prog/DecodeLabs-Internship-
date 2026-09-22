const express = require('express');
const db = require('./db');

const app = express();
const PORT = 3000;

app.use(express.json());

// ========================================================
// CREATE — POST /tasks
// ========================================================
app.post('/tasks', (req, res) => {
  const { title } = req.body;

  // The Gatekeeper Rule: never trust client input.
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({ error: 'A non-empty "title" string is required' });
  }

  // Parameterized query — the "?" placeholder means the title is always
  // treated as plain data, never as executable SQL. This is what
  // prevents SQL injection.
  const insert = db.prepare('INSERT INTO tasks (title, done) VALUES (?, 0)');
  const result = insert.run(title.trim());

  const newTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(newTask);
});

// ========================================================
// READ — GET /tasks (all) and GET /tasks/:id (one)
// ========================================================
app.get('/tasks', (req, res) => {
  const tasks = db.prepare('SELECT * FROM tasks').all();
  res.status(200).json(tasks);
});

app.get('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);

  if (!task) {
    return res.status(404).json({ error: `Task with id ${id} not found` });
  }

  res.status(200).json(task);
});

// ========================================================
// UPDATE — PUT /tasks/:id
// ========================================================
app.put('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const { title, done } = req.body;

  const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  if (!existing) {
    return res.status(404).json({ error: `Task with id ${id} not found` });
  }

  if (title !== undefined && (typeof title !== 'string' || title.trim().length === 0)) {
    return res.status(400).json({ error: '"title" must be a non-empty string' });
  }

  const updatedTitle = title !== undefined ? title.trim() : existing.title;
  const updatedDone = done !== undefined ? (done ? 1 : 0) : existing.done;

  db.prepare('UPDATE tasks SET title = ?, done = ? WHERE id = ?')
    .run(updatedTitle, updatedDone, id);

  const updatedTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  res.status(200).json(updatedTask);
});

// ========================================================
// DELETE — DELETE /tasks/:id
// ========================================================
app.delete('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);

  const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  if (!existing) {
    return res.status(404).json({ error: `Task with id ${id} not found` });
  }

  db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
  res.status(204).send(); // 204 No Content — successfully deleted, nothing to return
});

// ========================================================
// Fallback for unknown routes
// ========================================================
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log('Database file: tasks.db');
});
