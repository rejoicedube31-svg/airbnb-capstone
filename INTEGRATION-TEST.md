# Full-stack integration test (Day 23)

Walk through this checklist before submission.

**Demo:** Cape Town (2 listings), plus New York, Paris, Tokyo, Phuket (1 each).  
**Users:** Jannie (guest), Lerato (host).

## Prerequisites

| Terminal | Folder | Command | URL |
|----------|--------|---------|-----|
| 1 | `backend/` | `npm start` | http://localhost:5000/api/health |
| 2 | `client/` | `npm run dev` | http://localhost:5173 |
| 3 | `admin/` | `npm run dev` | http://localhost:5174 |

Seed data (if DB is empty):

```powershell
cd C:\Users\rejoi\Projects\airbnb-capstone\backend
npm run seed
```

**Demo accounts**

| Role | Email | Password |
|------|-------|----------|
| Guest | jannie@example.com | password123 |
| Host | lerato@example.com | password321 |

---

## 1. Backend API (automated)

With the server running:

```powershell
cd C:\Users\rejoi\Projects\airbnb-capstone\backend
npm run test:api
```

- [ ] All tests show **PASS**
- [ ] Health check reports `"database": "connected"`

---

## 2. Public client → backend

### Browse (no login)

- [ ] Home loads — hero, inspiration cards, footer
- [ ] Inspiration cards show listings from API
- [ ] `/locations?location=Cape Town` — two listing rows with images and prices
- [ ] `/locations?location=all` — six listings
- [ ] Click a listing → details page with gallery and booking panel

### Book as guest (Jannie)

1. Open a listing details page
2. Set check-in / check-out — total updates
3. Log in: jannie@example.com / password123
4. Click **Reserve**

- [ ] **Reservation successful!** alert appears
- [ ] `/reservations` or `/view-reservations` shows the booking in the table

---

## 3. Admin → backend

Log in to http://localhost:5174 as **lerato@example.com** / password321

### Listings CRUD

- [ ] **View Listings** (`/listings` or `/view-listings`) — Lerato’s six listings in card layout
- [ ] **Create Listing** — two-column form; create a property → appears in list
- [ ] **Update** on a card — edit price → save succeeds
- [ ] **Upload Images** — preview appears → save listing with image
- [ ] **Delete** a test listing (optional) — confirm dialog works

### Cross-check with public client

- [ ] New/edited listing appears on client Home or Location page (refresh)
- [ ] Uploaded `/uploads/...` image displays on client listing page

### Host reservations

- [ ] **View Reservations** shows bookings on Lerato’s listings (including Jannie’s)
- [ ] Booked by, property name, dates, and Delete button display correctly
- [ ] **Delete** works (optional — re-seed to restore sample data)

---

## 4. Auth isolation

- [ ] Client login (Jannie) and admin login (Lerato) can be open in **separate tabs** without overwriting each other
- [ ] Admin rejects non-host login (try jannie@example.com on admin login page)
- [ ] Logging out in admin returns header to “Become a host” state

---

## 5. Mobile width (375px)

Use browser DevTools → responsive mode.

**Client**

- [ ] Home — hero and cards stack cleanly
- [ ] Location page — rows readable
- [ ] Listing details — booking panel stacks below info
- [ ] Login and reservations table scroll horizontally if needed

**Admin**

- [ ] Login form fits screen
- [ ] Listings cards stack on narrow screens
- [ ] Reservations table scrolls horizontally if needed

---

## 6. Security quick check

- [ ] `backend/.env`, `client/.env`, `admin/.env` are **not** in git
- [ ] `JWT_SECRET` in backend `.env` is not the placeholder value
- [ ] No real passwords committed in README or code

---

## 7. GitHub

- [ ] Latest code pushed to https://github.com/rejoicedube31-svg/airbnb-capstone
- [ ] Repo includes `backend/`, `client/`, and `admin/`

---

## Common issues

| Problem | Fix |
|---------|-----|
| API error on client/admin | Start backend first (`cd backend; npm start`) |
| Empty listings | Run `npm run seed` in `backend/` |
| Images blank | Run `npm run setup:images` in `client/`; check `/images/` paths |
| `querySrv ECONNREFUSED` | Use `mongodb://` not `mongodb+srv://` in `.env` |
| Admin on wrong port | Admin = 5174, client = 5173 |

---

## Pass criteria

You are integration-ready when:

1. `npm run test:api` — all pass  
2. Jannie can book on the client and see the reservation  
3. Lerato can manage listings and see/delete reservations in admin  
4. Changes in admin appear on the public client  
5. Mobile layouts are usable at 375px  

Next: push to GitHub, record demo video, submit before **1 July 2026**.
