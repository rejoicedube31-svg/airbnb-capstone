# Submission guide — Airbnb Capstone

**Due:** 1 July 2026  
**Demo locations:** Cape Town (primary), New York, Paris, Tokyo, Phuket  
**Demo users:** Jannie (guest), Lerato (host)  
**GitHub:** https://github.com/rejoicedube31-svg/airbnb-capstone

---

## What this project is

A full-stack Airbnb-style web application with three parts:

| Part | Folder | URL (local) | Purpose |
|------|--------|-------------|---------|
| API | `backend/` | http://localhost:5000 | Node.js, Express, MongoDB, JWT |
| Public site | `client/` | http://localhost:5173 | Browse listings, book stays |
| Admin dashboard | `admin/` | http://localhost:5174 | Host login, manage listings & reservations |

---

## First-time setup (for markers)

### 1. Clone and install

```powershell
git clone https://github.com/rejoicedube31-svg/airbnb-capstone.git
cd airbnb-capstone
```

**Backend**

```powershell
cd backend
copy .env.example .env
npm install
```

Edit `backend/.env`:
- Set `MONGODB_URI` (local MongoDB or Atlas)
- Set a strong `JWT_SECRET` (replace the placeholder)

```powershell
npm run seed
npm start
```

**Client**

```powershell
cd ..\client
copy .env.example .env
npm install
npm run setup:images
npm run dev
```

**Admin**

```powershell
cd ..\admin
copy .env.example .env
npm install
npm run dev
```

### 2. Verify API

With backend running, in a new terminal:

```powershell
cd backend
npm run test:api
```

All tests should show **PASS**.

---

## Demo accounts (seed data)

| Role | Email | Password | Use on |
|------|-------|----------|--------|
| Guest | jannie@example.com | password123 | Client (5173) — book stays |
| Host | lerato@example.com | password321 | Admin (5174) — manage listings |

---

## Suggested demo flow (5 minutes)

### Guest journey (public client)

1. Open http://localhost:5173
2. Browse Home → inspiration cards from API
3. Go to **Locations** or search **Cape Town** (or **All Locations** for all six stays)
4. Open a listing → set dates → log in as **Jannie** → **Reserve**
5. Confirm **Reservation successful!** alert → **View reservations** → see booking table

### Host journey (admin)

1. Open http://localhost:5174
2. Log in as **Lerato**
3. **View Listings** → card layout with Update / Delete; **Create Listing** → two-column form
4. **View Reservations** → see Jannie’s booking (guest, property, dates, Delete)
5. Refresh client — listing changes appear on the public site

---

## Documentation index

| Document | Purpose |
|----------|---------|
| [README.md](./README.md) | Project overview and day-by-day build log |
| [INTEGRATION-TEST.md](./INTEGRATION-TEST.md) | Full-stack test checklist |
| [backend/API.md](./backend/API.md) | API endpoints and backend rubric |
| [backend/DEPLOYMENT.md](./backend/DEPLOYMENT.md) | Security and deployment notes |
| [client/FRONTEND-RUBRIC.md](./client/FRONTEND-RUBRIC.md) | Public client rubric checklist |
| [admin/ADMIN-RUBRIC.md](./admin/ADMIN-RUBRIC.md) | Admin dashboard rubric checklist |

---

## Pre-submission checklist (student)

Before you submit to your course portal:

- [ ] GitHub repo is up to date (`git push`)
- [ ] `npm run test:api` — all **PASS**
- [ ] [INTEGRATION-TEST.md](./INTEGRATION-TEST.md) — all sections ticked
- [ ] Strong `JWT_SECRET` in `backend/.env` (not the placeholder)
- [ ] No `.env` files committed to git
- [ ] Mobile test at 375px on client and admin
- [ ] Submit **GitHub URL** + brief note: demo users Jannie/Lerato, six cities in seed data

---

## Tech stack summary

- **Backend:** Node.js, Express, Mongoose, bcrypt, JWT, Multer
- **Frontend:** React 19, Vite, React Router
- **Database:** MongoDB (Atlas or local)
- **Auth:** JWT in `Authorization: Bearer` header

---

## Optional: production deployment

See [backend/DEPLOYMENT.md](./backend/DEPLOYMENT.md) for Render/Railway notes. Local demo is sufficient for capstone marking if all three apps run as above.

**Next:** Record demo video, push to GitHub, submit before **1 July 2026**.
