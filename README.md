# Airbnb Capstone

Full-stack Airbnb clone for the web development capstone (due 27 June 2026).

## Project layout

| Folder     | Purpose                                      |
| ---------- | -------------------------------------------- |
| `backend/` | Node.js, Express, MongoDB, JWT API           |
| `client/`  | Public site — browse locations and book      |
| `admin/`   | Admin dashboard — manage listings (CRUD)     |

## Stack

- **Backend:** Node.js, Express, Mongoose, JWT
- **Frontend:** React, CSS

## Getting started

### Day 2 — database models and seed

1. Open a terminal in `backend/`:
   ```powershell
   cd C:\Users\rejoi\Projects\airbnb-capstone\backend
   npm install
   ```
2. Copy environment file and set your MongoDB URL:
   ```powershell
   copy ..\.env.example .env
   ```
   Edit `backend/.env` — use your Atlas connection string or local `mongodb://127.0.0.1:27017/airbnb-capstone`.
3. Run the seed script:
   ```powershell
   npm run seed
   ```

You should see “MongoDB connected” and “Seed complete” with sample login emails.

### Day 3 — Express API server

1. Install dependencies (includes Express):
   ```powershell
   cd C:\Users\rejoi\Projects\airbnb-capstone\backend
   npm install
   ```
2. Start the server:
   ```powershell
   npm start
   ```
3. Open in a browser: [http://localhost:5000/api/health](http://localhost:5000/api/health)

   You should see JSON with `"success": true` and `"database": "connected"`.

4. Stop the server with `Ctrl+C` in the terminal.

`npm run dev` restarts the server automatically when you edit files (Node `--watch`).
