# Backend API reference (Airbnb capstone)

Base URL: `http://localhost:5000`

Demo location: **Centurion, South Africa**

## Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/health` | No | Server + DB status |
| POST | `/api/users/login` | No | Returns JWT |
| GET | `/api/users/me` | JWT | Current user from token |
| GET | `/api/accommodations` | No | All listings (`?location=Centurion`) |
| GET | `/api/accommodations/:id` | No | One listing |
| POST | `/api/accommodations` | JWT host | Create listing |
| PUT | `/api/accommodations/:id` | JWT host owner | Update listing |
| DELETE | `/api/accommodations/:id` | JWT host owner | Delete listing |
| POST | `/api/accommodations/upload` | JWT host | Upload image (form field `image`) → returns `url` |
| POST | `/api/reservations` | JWT | Book a stay |
| GET | `/api/reservations/user` | JWT | Guest's bookings |
| GET | `/api/reservations/host` | JWT host | Host's bookings |
| DELETE | `/api/reservations/:id` | JWT guest or host | Cancel booking |

## Seed logins

| Email | Password | Role |
|-------|----------|------|
| john@example.com | password123 | user |
| jane@example.com | password321 | host |

## Day 8 — full backend test

**Window 1:**

```powershell
cd backend
npm start
```

**Window 2:**

```powershell
cd backend
npm run test:api
```

All lines should show `PASS`.

## Backend rubric checklist (self-score)

Mark before submission. See `DEPLOYMENT.md` for security and deploy notes.

- [x] Project structure: controllers, models, routes, middleware, server.js
- [x] Accommodations CRUD (create, read all, read one, update, delete)
- [x] User login with JWT
- [x] Reservations create, user list, host list, delete
- [x] auth.js on protected routes
- [x] JSON errors with correct status codes (400, 401, 403, 404)
- [x] MongoDB via Mongoose with schemas
- [x] Passwords hashed (bcrypt)
- [x] CORS enabled for React apps
- [x] .env for secrets (not committed)
- [x] Optional: Multer image upload
- [ ] API test script passes: `npm run test:api`
- [ ] Strong JWT_SECRET set in production `.env`
