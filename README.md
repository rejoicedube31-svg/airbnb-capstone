# Airbnb Capstone

Full-stack Airbnb clone for the web development capstone (due 1 July 2026).

**Demo location:** Cape Town, New York, Paris, Tokyo, Phuket — used in seed data and examples.  
**Demo users:** Jannie (guest), Lerato (host).

**GitHub:** https://github.com/rejoicedube31-svg/airbnb-capstone  
**For markers:** start with [SUBMISSION.md](./SUBMISSION.md) — setup, demo accounts, and demo flow.

## Project layout

| Folder     | Purpose                                      |
| ---------- | -------------------------------------------- |
| `backend/` | Node.js, Express, MongoDB, JWT API           |
| `client/`  | Public site — browse locations and book      |
| `admin/`   | Admin dashboard — manage listings (CRUD)     |

## Stack

- **Backend:** Node.js, Express, Mongoose, JWT — **complete** (see `backend/API.md`)
- **Client:** React + Vite public site — **complete** (see `client/FRONTEND-RUBRIC.md`)
- **Admin:** React + Vite host dashboard — **complete** (see `admin/ADMIN-RUBRIC.md`)

## Run the full stack (3 terminals)

**Terminal 1 — API**

```powershell
cd C:\Users\rejoi\Projects\airbnb-capstone\backend
npm start
```

**Terminal 2 — Public client**

```powershell
cd C:\Users\rejoi\Projects\airbnb-capstone\client
npm run dev
```

Open http://localhost:5173

**Terminal 3 — Admin dashboard**

```powershell
cd C:\Users\rejoi\Projects\airbnb-capstone\admin
npm run dev
```

Open http://localhost:5174 — log in as **lerato@example.com** / password321

**Integration checklist:** see [INTEGRATION-TEST.md](./INTEGRATION-TEST.md)

## Getting started

### Day 2 — database models and seed

1. Open a terminal in `backend/`:
   ```powershell
   cd C:\Users\rejoi\Projects\airbnb-capstone\backend
   npm install
   ```
2. Copy environment file and set your MongoDB URL:
   ```powershell
   copy .env.example .env
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
   $body = @{ email = "lerato@example.com"; password = "password321" } | ConvertTo-Json
   Invoke-RestMethod -Method Post -Uri "http://localhost:5000/api/users/login" -Body $body -ContentType "application/json"
   ```

   Copy the `token` from the response.

4. **Protected route** (replace `YOUR_TOKEN`):

   ```powershell
   $headers = @{ Authorization = "Bearer YOUR_TOKEN" }
   Invoke-RestMethod -Uri "http://localhost:5000/api/users/me" -Headers $headers
   ```

   Seed users: `jannie@example.com` / `password123`, `lerato@example.com` / `password321`.

### Day 5 — accommodations (GET + POST)

1. Start server: `npm start`
2. **Get all listings** (browser or PowerShell):

   ```powershell
   Invoke-RestMethod -Uri "http://localhost:5000/api/accommodations"
   ```

3. **Filter by location (Cape Town, South Africa):**

   ```powershell
   Invoke-RestMethod -Uri "http://localhost:5000/api/accommodations?location=Cape Town"
   ```

4. **Create listing** (login as host Lerato first, then POST with token):

   ```powershell
   $login = @{ email = "lerato@example.com"; password = "password321" } | ConvertTo-Json
   $auth = Invoke-RestMethod -Method Post -Uri "http://localhost:5000/api/users/login" -Body $login -ContentType "application/json"

   $listing = @{
     title = "Family Home in Cape Town"
     description = "Quiet suburb in Cape Town with garden and fast Wi-Fi."
     type = "Entire house"
     location = "Cape Town"
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

Use the listing `_id` from GET (e.g. Family Home in Cape Town). Replace `LISTING_ID` below.

1. Window 1: `npm start`
2. Window 2 — login as Lerato (same as Day 5 Step 4)
3. **Get one listing** (browser): `http://localhost:5000/api/accommodations/LISTING_ID`
4. **Update** (change price to 1100):

   ```powershell
   $headers = @{ Authorization = "Bearer $($auth.token)" }
   $updates = @{ price = 1100; title = "Family Home in Cape Town (Updated)" } | ConvertTo-Json
   Invoke-RestMethod -Method Put -Uri "http://localhost:5000/api/accommodations/LISTING_ID" -Body $updates -ContentType "application/json" -Headers $headers
   ```

5. **Delete** (optional — removes that listing):

   ```powershell
   Invoke-RestMethod -Method Delete -Uri "http://localhost:5000/api/accommodations/LISTING_ID" -Headers $headers
   ```

6. Check all listings: `http://localhost:5000/api/accommodations` — count should drop by 1 after delete.

### Day 7 — reservations

1. Window 1: `npm start` (restart if server was already running)
2. Window 2 — copy a listing `_id` from `http://localhost:5000/api/accommodations` (e.g. Modern Apartment in Cape Town)
3. **Book as Jannie (guest):**

   ```powershell
   $listingId = "PASTE_LISTING_ID_HERE"

   $login = @{ email = "jannie@example.com"; password = "password123" } | ConvertTo-Json
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

4. **Jannie sees his bookings:** `GET /api/reservations/user`

   ```powershell
   Invoke-RestMethod -Uri "http://localhost:5000/api/reservations/user" -Headers $headers
   ```

5. **Lerato sees bookings on her listings:**

   ```powershell
   $login = @{ email = "lerato@example.com"; password = "password321" } | ConvertTo-Json
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
2. Window 2 — login as Lerato, upload a photo from your PC:

   ```powershell
   $login = @{ email = "lerato@example.com"; password = "password321" } | ConvertTo-Json
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

**Backend phase done.** Next: **Day 11** — create the React `client/` app (public Cape Town site).

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

- Cape Town hero banner with “Explore Cape Town stays” button
- Green line: “Connected to API — X Cape Town listings available”

If you see a red API error, start the backend first (Terminal 1).

### Day 12 — inspiration location cards

Scroll below the hero on [http://localhost:5173](http://localhost:5173):

- Section title: **Inspiration for your next trip**
- Grid of Cape Town listings from `GET /api/accommodations?location=Cape Town`
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
3. Log in as Jannie: `jannie@example.com` / `password123`
4. Click **Reserve** — saves to MongoDB via `POST /api/reservations`

**Success:** green message “Reservation confirmed! Saved to MongoDB.”

Verify: log in as Lerato in API or check Atlas `reservations` collection.

### Day 18 — header login + reservations table

1. **Logged out:** header shows **Become a host** → links to `/login`
2. Click **profile icon** (☰) → **Log in** or browse
3. Log in as Jannie: `jannie@example.com` / password123
4. Header shows **Hi, Jannie** + avatar → dropdown: **View reservations**, **Log out**
5. `/reservations` shows a **table** of your bookings

**Host test:** log in as `lerato@example.com` / password321 → table shows guest bookings on her listings.

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

Open [http://localhost:5173/locations?location=Cape Town](http://localhost:5173/locations?location=Cape Town)

Or click **Explore Cape Town stays** on the hero, or search from the header.

**Success:**

- Heading: `X accommodations in Cape Town`
- Each row: image **left**, details **right** (type, title, amenities, rating, reviews, R/night)
- Change filter to search another location (e.g. Cape Town only for now in your data)
- Click a row → listing details placeholder

### Day 16 — listing details (gallery + static sections)

Click any listing from Home or Location page, or open an id directly:

`http://localhost:5173/listings/LISTING_ID`

**Success:**

- Heading: `{type} in Cape Town`, subheading (title), ★ rating + reviews + location
- Gallery: large image left, 4 smaller images (2×2) on the right
- Left column: about, sleep, amenities, 7 nights, reviews, host, policies
- Right column: price card (full calculator on Day 17)
- Footer + copyright at bottom

### Day 20 — admin app shell

```powershell
cd C:\Users\rejoi\Projects\airbnb-capstone\admin
copy .env.example .env
npm install
npm run dev
```

Open http://localhost:5174

- [x] Host login (lerato@example.com / password321)
- [x] Protected dashboard — redirects to login when logged out
- [x] Header: logged out vs logged in states

### Day 21 — admin listing CRUD

Log in as Lerato on http://localhost:5174

- [x] `/listings` — table of your listings
- [x] Create, edit, delete listings
- [x] Upload images → `/uploads/...` on listing

Verify on public client: new listing appears on Home or Location page.

### Day 22 — admin host reservations

- [x] `/reservations` — bookings on Lerato’s listings
- [x] Guest name, dates, nights, total
- [x] Cancel booking (optional)

### Day 23 — full-stack integration test

1. Start all three apps (see **Run the full stack** above)
2. Backend: `npm run test:api` → all **PASS**
3. Walk through [INTEGRATION-TEST.md](./INTEGRATION-TEST.md)
4. Tick checklists in:
   - `client/FRONTEND-RUBRIC.md`
   - `admin/ADMIN-RUBRIC.md`

### Day 24 — submission prep

1. Read [SUBMISSION.md](./SUBMISSION.md) — marker setup, demo flow, pre-submission checklist
2. Confirm GitHub repo is public/up to date
3. Replace placeholder `JWT_SECRET` in `backend/.env`
4. Prepare what to submit to your course (repo URL + Cape Town demo note)

**Next: Day 25** — final rubric gap review and buffer before due date (1 July 2026).
