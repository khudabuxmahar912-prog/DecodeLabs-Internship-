# Task API — Backend Server

A simple backend REST API built with Node.js and Express, created for DecodeLabs Internship Project 2.

## Endpoints

| Method | Route         | Description                        |
|--------|---------------|-------------------------------------|
| GET    | /tasks        | Returns the full list of tasks      |
| GET    | /tasks/:id    | Returns a single task by its id     |
| POST   | /tasks        | Creates a new task                  |

## Status Codes Used

- 200 OK — successful GET request
- 201 Created — a new task was successfully created
- 400 Bad Request — the request body failed validation
- 404 Not Found — the requested task id, or route, doesn't exist

## How to Run

1. Install Node.js from nodejs.org
2. Open terminal in this folder
3. Run: npm install
4. Run: npm start
5. Server runs at http://localhost:3000

## Author

Full Stack Development Intern, DecodeLabs
