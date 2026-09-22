# Task API — Database Integration

A backend REST API with a real, persistent SQLite database, built for DecodeLabs Internship Project 3.

## Description

This project upgrades the Project 2 API from an in-memory array to a real SQLite database. Data now survives server restarts — it lives in a file called `tasks.db` that gets created automatically the first time the server runs. All five CRUD-mapped HTTP methods are implemented, and every query is parameterized to prevent SQL injection.

**Tech stack:** Node.js, Express.js, SQLite (via `better-sqlite3`)

## Database Schema

**Table: `tasks`**

| Column | Type    | Constraint                  |
|--------|---------|------------------------------|
| id     | INTEGER | Primary Key, auto-increments |
| title  | TEXT    | NOT NULL                     |
| done   | INTEGER | NOT NULL, defaults to 0      |

## Endpoints (CRUD mapped to REST)

| Operation | HTTP Method | Route         | Description                  |
|-----------|-------------|---------------|-------------------------------|
| Create    | POST        | `/tasks`      | Insert a new task             |
| Read      | GET         | `/tasks`      | Get all tasks                 |
| Read      | GET         | `/tasks/:id`  | Get a single task             |
| Update    | PUT         | `/tasks/:id`  | Update a task's title/status  |
| Delete    | DELETE      | `/tasks/:id`  | Remove a task                 |

## Status Codes Used

- `200 OK` — successful GET or PUT
- `201 Created` — a task was inserted
- `204 No Content` — a task was deleted successfully
- `400 Bad Request` — invalid or missing input
- `404 Not Found` — task id or route doesn't exist

## Security: Parameterized Queries

Every SQL statement uses `?` placeholders instead of building queries by joining strings together:

```js
db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
```

This ensures user input is always treated as plain data, never as executable SQL — this is what prevents SQL injection attacks.

## How to Run

1. Make sure [Node.js](https://nodejs.org) is installed
2. Download this project folder
3. Open a terminal inside the folder and run:
   ```
   npm install
   ```
4. Start the server:
   ```
   npm start
   ```
5. The server runs at `http://localhost:3000`, and a `tasks.db` file will appear in the folder — that's your database
6. Test the endpoints with a browser (GET requests) or Postman/curl (POST, PUT, DELETE)

## Project Structure

```
├── server.js       API routes and CRUD logic
├── db.js           Database connection and schema setup
├── package.json    Project dependencies
├── tasks.db        Created automatically on first run (not uploaded — see note below)
└── README.md       This file
```

> **Note:** `tasks.db` is generated the first time you run the server — you don't need to upload it to GitHub. If you want to exclude it, add a `.gitignore` file with the line `tasks.db` in it.

## Author

Aditi Rao — Full Stack Development Intern, DecodeLabs
