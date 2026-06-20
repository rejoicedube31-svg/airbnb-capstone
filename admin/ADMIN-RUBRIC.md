# Admin rubric checklist (host dashboard)

Demo location: **Centurion, Gauteng, South Africa**

Open the app: `cd admin && npm run dev` → http://localhost:5174  
Backend must run: `cd backend && npm start`

Log in as host: **jane@example.com** / password321

## Login and auth

- [x] Login page with email + password
- [x] JWT stored and sent on protected API calls
- [x] Non-host accounts rejected at login
- [x] Protected routes redirect to `/login` when logged out

## Header (all admin views)

- [x] Logo + “Airbnb Admin” branding
- [x] Logged out: **Become a host** → login page
- [x] Logged in: greeting + profile dropdown (reservations, listings, log out)
- [x] Nav links: Dashboard, Listings, Reservations

## Dashboard

- [x] Welcome message for logged-in host
- [x] Quick links to listings and reservations
- [x] Link to open public client site

## Listings (CRUD)

- [x] View table of host’s own listings
- [x] Create new listing form (`/listings/new`)
- [x] Edit existing listing (`/listings/:id/edit`)
- [x] Delete listing with confirmation
- [x] Image upload — Multer → `/uploads/...` → saved on listing

## Reservations

- [x] Host reservations table (`/reservations`)
- [x] Shows listing, guest, dates, guests, nights, total
- [x] Cancel booking (optional — backend supports host cancel)

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
