const Database = require('better-sqlite3');

// This creates (or opens, if it already exists) a file called tasks.db
// in the project folder — this file IS the database.
const db = new Database('tasks.db');

// ------------------------------------------------------
// SCHEMA
// One table: tasks
//   id     -> Primary Key, auto-increments, uniquely identifies each row
//   title  -> NOT NULL constraint: the database itself refuses empty titles
//   done   -> defaults to 0 (false) for every new task
// ------------------------------------------------------
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id    INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    done  INTEGER NOT NULL DEFAULT 0
  )
`);

// Seed a couple of starter rows the first time the database is created
const row = db.prepare('SELECT COUNT(*) AS count FROM tasks').get();
if (row.count === 0) {
  const insert = db.prepare('INSERT INTO tasks (title, done) VALUES (?, ?)');
  insert.run('Set up the repository', 1);
  insert.run('Build the responsive frontend', 1);
  insert.run('Build the backend API', 1);
}

module.exports = db;
