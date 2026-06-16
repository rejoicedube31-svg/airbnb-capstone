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

- **Backend:** Node.js, Express, Mongoose, JWT — **complete** (see `backend/API.md`)
- **Frontend:** React, CSS — **Day 11 started** (`client/`)

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

### Day 7 — reservations

1. Window 1: `npm start` (restart if server was already running)
2. Window 2 — copy a listing `_id` from `http://localhost:5000/api/accommodations` (e.g. Modern Apartment in Centurion)
3. **Book as John (guest):**

   ```powershell
   $listingId = "PASTE_LISTING_ID_HERE"

   $login = @{ email = "john@example.com"; password = "password123" } | ConvertTo-Json
   $john = Invoke-RestMethod -Method Post -Uri "http://localhost:5000/api/users/login" -Body $login -ContentType "application/json"
   $headers = @{ Authorization = "Bearer $($john.token)" }

   $booking = @{
     accommodation = $listingId
     checkIn = "2026-07-10"
     checkOut = "2026-07-17"
     guests = 2
   } | ConvertTo-Json

   $newBooking = Invoke-RestMethod -Method Post -Uri "http://localhost:5000/api/reservations" -Body $booking -ContentType "application/json" -Headers $headers
   $newBooking
   ```

4. **John sees his bookings:** `GET /api/reservations/user`

   ```powershell
   Invoke-RestMethod -Uri "http://localhost:5000/api/reservations/user" -Headers $headers
   ```

5. **Jane sees bookings on her listings:**

   ```powershell
   $login = @{ email = "jane@example.com"; password = "password321" } | ConvertTo-Json
   $jane = Invoke-RestMethod -Method Post -Uri "http://localhost:5000/api/users/login" -Body $login -ContentType "application/json"
   $janeHeaders = @{ Authorization = "Bearer $($jane.token)" }
   Invoke-RestMethod -Uri "http://localhost:5000/api/reservations/host" -Headers $janeHeaders
   ```

6. **Cancel** (use reservation `_id` from step 4):

   ```powershell
   Invoke-RestMethod -Method Delete -Uri "http://localhost:5000/api/reservations/RESERVATION_ID" -Headers $headers
   ```

### Day 8 — full backend test + polish

1. Window 1:
   ```powershell
   cd C:\Users\rejoi\Projects\airbnb-capstone\backend
   npm start
   ```
2. Window 2:
   ```powershell
   cd C:\Users\rejoi\Projects\airbnb-capstone\backend
   npm run test:api
   ```
3. All tests should show **PASS**. See `backend/API.md` for endpoint list and rubric checklist.

### Day 9 — image upload (optional brief feature)

1. Window 1: `npm start` (in `backend`)
2. Window 2 — login as Jane, upload a photo from your PC:

   ```powershell
   $login = @{ email = "jane@example.com"; password = "password321" } | ConvertTo-Json
   $auth = Invoke-RestMethod -Method Post -Uri "http://localhost:5000/api/users/login" -Body $login -ContentType "application/json"
   $headers = @{ Authorization = "Bearer $($auth.token)" }

   $form = @{ image = Get-Item -Path "C:\path\to\your\photo.jpg" }
   Invoke-RestMethod -Method Post -Uri "http://localhost:5000/api/accommodations/upload" -Headers $headers -Form $form
   ```

   **Windows PowerShell 5:** use `curl.exe` instead (no `-Form` support):

   ```powershell
   curl.exe -X POST "http://localhost:5000/api/accommodations/upload" -H "Authorization: Bearer $($auth.token)" -F "image=@C:\path\to\photo.jpg"
   ```

3. Response includes `url` like `/uploads/123456-photo.jpg`. Open in browser:

   `http://localhost:5000/uploads/123456-photo.jpg`

4. Add that `url` to the `images` array when creating or updating a listing.

### Day 10 — backend complete (security + deployment)

1. Read `backend/DEPLOYMENT.md` — security checklist and how to submit.
2. Set a **strong** `JWT_SECRET` in `backend/.env` (replace the placeholder).
3. Final test:
   ```powershell
   cd C:\Users\rejoi\Projects\airbnb-capstone\backend
   npm start
   ```
   Second window: `npm run test:api` → all **PASS**.

**Backend phase done.** Next: **Day 11** — create the React `client/` app (public Centurion site).

### Day 11 — React client setup + Home hero

You need **two terminals** — backend and client.

**Terminal 1 — API (must be running):**

```powershell
cd C:\Users\rejoi\Projects\airbnb-capstone\backend
npm start
```

**Terminal 2 — React app:**

```powershell
cd C:\Users\rejoi\Projects\airbnb-capstone\client
copy .env.example .env
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

**Success:**

- Centurion hero banner with “Explore Centurion stays” button
- Green line: “Connected to API — X Centurion listings available”

If you see a red API error, start the backend first (Terminal 1).

### Day 12 — inspiration location cards

Scroll below the hero on [http://localhost:5173](http://localhost:5173):

- Section title: **Inspiration for your next trip**
- Grid of Centurion listings from `GET /api/accommodations?location=Centurion`
- Each card: image, title, type, price (R/night), link to `/listings/:id`

**Success:** You see your seeded apartment, family home, and townhouse (if in DB).

### Day 13 — experiences, things to do, ShopAirbnb

Scroll the Home page — after inspiration you should see:

1. **Discover Airbnb Experiences** — two cards with buttons
2. **Things to do on your trip** + **Things to do at home** — image panels with buttons
3. **ShopAirbnb** — two columns (text + gift card image)

All static content (no API) — matches the brief’s Home page sections.

### Day 17 — cost calculator + Reserve

Open any listing details page. Backend must be running.

1. Pick **check-in** / **check-out** — total updates automatically
2. Choose **guests**
3. Log in as John: `john@example.com` / `password123`
4. Click **Reserve** — saves to MongoDB via `POST /api/reservations`

**Success:** green message “Reservation confirmed! Saved to MongoDB.”

Verify: log in as Jane in API or check Atlas `reservations` collection.

### Day 18 — header login + reservations table

1. **Logged out:** header shows **Become a host** → links to `/login`
2. Click **profile icon** (☰) → **Log in** or browse
3. Log in as John: `john@example.com` / password123
4. Header shows **Hi, John** + avatar → dropdown: **View reservations**, **Log out**
5. `/reservations` shows a **table** of your bookings

**Host test:** log in as `jane@example.com` / password321 → table shows guest bookings on her listings.

### Day 19 — client polish + rubric pass

1. Walk through `client/FRONTEND-RUBRIC.md` — tick each item in the browser
2. Test **mobile width** (DevTools → 375px): home, locations, listing details, login, reservations
3. Every page now uses **PageLayout** — footer + copyright on all views
4. Route changes **scroll to top** automatically

**Public client is feature-complete for the brief.** Next: **Day 20** — start `admin/` React app.

### Day 14 — future getaways + footers (Home page complete)

Scroll to the bottom of [http://localhost:5173](http://localhost:5173):

1. **Inspiration for future getaways** — click tabs (Gauteng, Coastal, Winelands); list updates
2. **Footer** — 4 columns of links (Support, Hosting, Airbnb, Explore)
3. **Copyright bar** — © text, social icons, Language (English ZA), Currency (ZAR)

**Home page rubric sections are now all present.**

### Day 15 — Location page

Open [http://localhost:5173/locations?location=Centurion](http://localhost:5173/locations?location=Centurion)

Or click **Explore Centurion stays** on the hero, or search from the header.

**Success:**

- Heading: `X accommodations in Centurion`
- Each row: image **left**, details **right** (type, title, amenities, rating, reviews, R/night)
- Change filter to search another location (e.g. Centurion only for now in your data)
- Click a row → listing details placeholder

### Day 16 — listing details (gallery + static sections)

Click any listing from Home or Location page, or open an id directly:

`http://localhost:5173/listings/LISTING_ID`

**Success:**

- Heading: `{type} in Centurion`, subheading (title), ★ rating + reviews + location
- Gallery: large image left, 4 smaller images (2×2) on the right
- Left column: about, sleep, amenities, 7 nights, reviews, host, policies
- Right column: price card (full calculator on Day 17)
- Footer + copyright at bottom
