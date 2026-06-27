# Admin rubric checklist (host dashboard)

Demo: **Cape Town** + international cities. Host: **Lerato** (`lerato@example.com`).

Open the app: `cd admin && npm run dev` → http://localhost:5174  
Backend must run: `cd backend && npm start`

Log in as host: **lerato@example.com** / password321

## Login and auth

- [x] Login page with email + password
- [x] JWT stored and sent on protected API calls
- [x] Non-host accounts rejected at login
- [x] Protected routes redirect to `/login` when logged out

## Header (all admin views)

- [x] Logo + **airbnb** branding
- [x] Logged out: **Become a host** → login page
- [x] Logged in: Welcome + profile dropdown
- [x] Sub-nav pills: View Reservations, View Listings, Create Listing

## Dashboard

- [x] Welcome message for logged-in host
- [x] Quick links to listings and reservations
- [x] Link to open public client site

## Listings (CRUD)

- [x] View host listings in card layout (`/listings`, `/view-listings`)
- [x] Create listing — two-column form (`/listings/new`)
- [x] Update listing (`/listings/:id/edit`)
- [x] Delete listing with confirmation
- [x] Image upload — Multer → `/uploads/...` → saved on listing

## Reservations

- [x] Host reservations table (`/reservations`, `/view-reservations`)
- [x] Booked by, property name, dates, Delete action
- [x] Delete booking (optional — backend supports host cancel)

## Code quality

- [x] Separate API helper (`src/api/client.js`)
- [x] Auth context for shared login state
- [x] Components split by page
- [x] Separate localStorage keys from public client

## Before submission

- [ ] Walk through `../INTEGRATION-TEST.md` admin sections
- [ ] Test create → appears on public client
- [ ] Test mobile width (375px) on login, listings, reservations
- [ ] Commit and push `admin/` changes
