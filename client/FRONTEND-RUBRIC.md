# Frontend rubric checklist (public client)

Demo location: **Centurion, Gauteng, South Africa**

Open the app: `cd client && npm run dev` → http://localhost:5173  
Backend must run for API features: `cd backend && npm start`

## Home page (80 marks total in rubric)

- [x] Hero banner with clear call-to-action
- [x] Inspiration section — location cards from API
- [x] Discover Experiences (two sections)
- [x] Things to do on your trip
- [x] Things to do at home
- [x] ShopAirbnb (title, button, image)
- [x] Future getaways — tabs + list
- [x] Footer — 4 columns
- [x] Copyright footer — social, language, currency

## Location page

- [x] Location filter (default Centurion)
- [x] Heading with count + location name
- [x] Cards: image left, details right (type, amenities, rating, reviews, price)

## Location details page

- [x] Heading + subheading + rating/location
- [x] Image gallery (1 large + 4 small)
- [x] Static info sections (left column)
- [x] Cost calculator — dates, fees, dynamic total
- [x] Reserve → MongoDB
- [x] Two-column layout (info + booking panel)
- [x] Footer on details page

## Top header (all views)

- [x] Logo
- [x] Location filter → `/locations?location=...`
- [x] Logged out: Become a host → login
- [x] Logged in: greeting + dropdown (reservations, log out)
- [x] Login page `/login`
- [x] Reservations table `/reservations`

## Code quality

- [x] Components split by page/section
- [x] API helper in `src/api/client.js`
- [x] Auth shared via `AuthContext`
- [x] Responsive CSS (mobile breakpoints)

## Before submission

- [ ] Run through all pages on mobile width (375px)
- [ ] Test John login + reserve + view reservations
- [ ] Test Jane host reservations table
- [ ] Commit and push `client/` changes

## Next: admin app (`admin/` folder)

Separate React app for host dashboard — Days 20+.
