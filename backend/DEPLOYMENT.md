# Deployment and security (backend)

Guide for submitting and running the Airbnb capstone API in production.

## Local development (what you use now)

```powershell
cd backend
copy .env.example .env
# Edit .env — set MONGODB_URI and JWT_SECRET
npm install
npm run seed
npm start
```

| Script | Purpose |
|--------|---------|
| `npm start` | Run API |
| `npm run dev` | Auto-restart on file changes |
| `npm run seed` | Sample Centurion data + users |
| `npm run test:api` | Test all endpoints (server must be running) |

## Environment variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `PORT` | No (default 5000) | API port |
| `MONGODB_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Signs login tokens — never share or commit |
| `CLIENT_URL` | No | Public React app URL for CORS (production) |
| `ADMIN_URL` | No | Admin React app URL for CORS (production) |

## Security checklist (backend rubric)

- [x] Passwords hashed with bcrypt before save (`User` model)
- [x] JWT for authenticated routes (`middleware/auth.js`)
- [x] Host-only create/update/delete listings
- [x] Guests can only cancel their own reservations; hosts their bookings
- [x] Secrets in `.env`, not in git (`.gitignore`)
- [x] Input validation on login, listings, reservations
- [x] HTTP status codes: 400, 401, 403, 404, 201, 200
- [x] Image upload limited to JPEG/PNG/WebP, max 5MB
- [ ] **You:** Use a strong `JWT_SECRET` before submission
- [ ] **You:** Rotate Atlas password if it was ever shared
- [ ] **Production:** Set `CLIENT_URL` and `ADMIN_URL` instead of open CORS

## MongoDB Atlas (production)

1. Cluster on M0 free tier
2. Database Access — app user with read/write
3. Network Access — allow your host IP (or `0.0.0.0/0` only for demos)
4. Connection string: prefer `mongodb://` standard URI if `mongodb+srv` fails on Windows
5. Database name in URI: `/airbnb-capstone`

## Deploying the API (common options)

### Render / Railway / similar

1. Connect GitHub repo
2. Root directory: `backend`
3. Build: `npm install`
4. Start: `npm start`
5. Add env vars: `MONGODB_URI`, `JWT_SECRET`, `PORT` (often set by platform)
6. Uploaded images: disk uploads reset on free tiers — for production use cloud storage (S3, Cloudinary). For capstone demo, local/seed image URLs are acceptable.

### Health check URL

```text
GET https://your-api.onrender.com/api/health
```

Should return `"database": "connected"`.

## Frontend connection (Days 11+)

React apps will call:

```text
http://localhost:5000/api/...
```

Use an env variable in React, e.g. `VITE_API_URL=http://localhost:5000`.

Images from upload:

```text
http://localhost:5000/uploads/filename.jpg
```

## Final backend verification before starting React

**Window 1:** `npm start`  
**Window 2:** `npm run test:api` → all **PASS**

Manual spot-check:

- [ ] Login Jane → token returned
- [ ] GET accommodations → Centurion listings
- [ ] Upload image → URL opens in browser
- [ ] John creates reservation → Jane sees on `/api/reservations/host`

## Project structure (matches brief)

```text
backend/
├── controllers/
│   ├── accommodationController.js
│   ├── reservationController.js
│   └── userController.js
├── models/
│   ├── Accommodation.js
│   ├── Reservation.js
│   └── User.js
├── routes/
│   ├── accommodationRoutes.js
│   ├── reservationRoutes.js
│   └── userRoutes.js
├── middleware/
│   ├── auth.js
│   ├── errorHandler.js
│   └── upload.js
├── config/db.js
├── scripts/seed.js
├── server.js
└── uploads/
```

## Submitting to your course

**Start here:** [../SUBMISSION.md](../SUBMISSION.md) — full setup for markers, demo accounts, demo flow, and pre-submission checklist.

Also include:

- GitHub repo URL
- How to run backend (`npm install`, `.env`, `npm run seed`, `npm start`)
- Seed login emails (john / jane)
- Demo location: Centurion
- API docs: `backend/API.md`
