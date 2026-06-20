# Full-stack integration test (Day 23)

Walk through this checklist before submission. **Demo location:** Centurion, Gauteng, South Africa.

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
| Guest | john@example.com | password123 |
| Host | jane@example.com | password321 |

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
- [ ] Inspiration cards show Centurion listings from API
- [ ] `/locations?location=Centurion` — listing rows with images and prices
- [ ] Click a listing → details page with gallery and booking panel

### Book as guest (John)

1. Open a listing details page
2. Set check-in / check-out — total updates
3. Log in: john@example.com / password123
4. Click **Reserve**

- [ ] Success message appears
- [ ] `/reservations` shows the new booking in the table

---

## 3. Admin → backend

Log in to http://localhost:5174 as **jane@example.com** / password321

### Listings CRUD

- [ ] `/listings` shows Jane’s listings only
- [ ] **Add listing** — create a new Centurion property → appears in table
- [ ] **Edit listing** — change price → save succeeds
- [ ] **Upload photo** — image preview appears → save listing with image
- [ ] **Delete** a test listing (optional) — confirm dialog works

### Cross-check with public client

- [ ] New/edited listing appears on client Home or Location page (refresh)
- [ ] Uploaded `/uploads/...` image displays on client listing page

### Host reservations

- [ ] `/reservations` shows bookings on Jane’s listings (including John’s)
- [ ] Guest name, dates, nights, and total display correctly
- [ ] **Cancel** works (optional — re-seed to restore sample data)

---

## 4. Auth isolation

- [ ] Client login (John) and admin login (Jane) can be open in **separate tabs** without overwriting each other
- [ ] Admin rejects non-host login (try john@example.com on admin login page)
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
- [ ] Listings table scrolls horizontally
- [ ] Reservations table scrolls horizontally

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
| API error on client/admin | Start backend first (`cd backend && npm start`) |
| Empty listings | Run `npm run seed` in `backend/` |
| Images blank | Use uploaded `/uploads/...` paths or local placeholders |
| `querySrv ECONNREFUSED` | Use `mongodb://` not `mongodb+srv://` in `.env` |
| Admin on wrong port | Admin = 5174, client = 5173 |

---

## Pass criteria

You are integration-ready when:

1. `npm run test:api` — all pass  
2. John can book on the client and see the reservation  
3. Jane can manage listings and see/cancel reservations in admin  
4. Changes in admin appear on the public client  
5. Mobile layouts are usable at 375px  

Next: **Day 25** — final rubric gap review and buffer before due date.
