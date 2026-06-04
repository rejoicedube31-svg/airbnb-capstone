# Airbnb Capstone

Full-stack Airbnb clone for the web development capstone (due 27 June 2026).

**Demo location:** Centurion, Gauteng, South Africa — used in seed data and examples.

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

### Day 4 — login and JWT

1. Set a strong `JWT_SECRET` in `backend/.env` (long random string).
2. Start the server: `npm start`
3. **Login** (PowerShell):

   ```powershell
   $body = @{ email = "jane@example.com"; password = "password321" } | ConvertTo-Json
   Invoke-RestMethod -Method Post -Uri "http://localhost:5000/api/users/login" -Body $body -ContentType "application/json"
   ```

   Copy the `token` from the response.

4. **Protected route** (replace `YOUR_TOKEN`):

   ```powershell
   $headers = @{ Authorization = "Bearer YOUR_TOKEN" }
   Invoke-RestMethod -Uri "http://localhost:5000/api/users/me" -Headers $headers
   ```

   Seed users: `john@example.com` / `password123`, `jane@example.com` / `password321`.

### Day 5 — accommodations (GET + POST)

1. Start server: `npm start`
2. **Get all listings** (browser or PowerShell):

   ```powershell
   Invoke-RestMethod -Uri "http://localhost:5000/api/accommodations"
   ```

3. **Filter by location (Centurion, South Africa):**

   ```powershell
   Invoke-RestMethod -Uri "http://localhost:5000/api/accommodations?location=Centurion"
   ```

4. **Create listing** (login as host Jane first, then POST with token):

   ```powershell
   $login = @{ email = "jane@example.com"; password = "password321" } | ConvertTo-Json
   $auth = Invoke-RestMethod -Method Post -Uri "http://localhost:5000/api/users/login" -Body $login -ContentType "application/json"

   $listing = @{
     title = "Family Home in Centurion"
     description = "Quiet suburb in Centurion with garden and fast Wi-Fi."
     type = "Entire house"
     location = "Centurion"
     guests = 6
     bedrooms = 3
     bathrooms = 2
     price = 1200
     amenities = @("wifi", "kitchen", "free parking", "braai area")
     images = @("/images/centurion-house.jpg")
   } | ConvertTo-Json

   $headers = @{ Authorization = "Bearer $($auth.token)" }
   Invoke-RestMethod -Method Post -Uri "http://localhost:5000/api/accommodations" -Body $listing -ContentType "application/json" -Headers $headers
   ```

### Day 6 — update and delete listings

Use the listing `_id` from GET (e.g. Family Home in Centurion). Replace `LISTING_ID` below.

1. Window 1: `npm start`
2. Window 2 — login as Jane (same as Day 5 Step 4)
3. **Get one listing** (browser): `http://localhost:5000/api/accommodations/LISTING_ID`
4. **Update** (change price to 1100):

   ```powershell
   $headers = @{ Authorization = "Bearer $($auth.token)" }
   $updates = @{ price = 1100; title = "Family Home in Centurion (Updated)" } | ConvertTo-Json
   Invoke-RestMethod -Method Put -Uri "http://localhost:5000/api/accommodations/LISTING_ID" -Body $updates -ContentType "application/json" -Headers $headers
   ```

5. **Delete** (optional — removes that listing):

   ```powershell
   Invoke-RestMethod -Method Delete -Uri "http://localhost:5000/api/accommodations/LISTING_ID" -Headers $headers
   ```

6. Check all listings: `http://localhost:5000/api/accommodations` — count should drop by 1 after delete.
