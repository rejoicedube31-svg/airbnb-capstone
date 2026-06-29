# Deploy on Heroku (required for submission)

One Heroku app serves everything:

| URL | App |
|-----|-----|
| `https://YOUR-APP.herokuapp.com/` | Public client |
| `https://YOUR-APP.herokuapp.com/admin` | Host dashboard |
| `https://YOUR-APP.herokuapp.com/api/health` | API health check |

---

## Prerequisites

1. [Heroku account](https://signup.heroku.com) (free tier is fine)
2. [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) installed
3. MongoDB Atlas cluster with connection string (`mongodb://...`)
4. Code pushed to GitHub (or deploy from local git)

---

## Step 1 — Seed Atlas (once, from your PC)

```powershell
cd C:\Users\rejoi\Projects\airbnb-capstone\backend
# Put Atlas URI in backend\.env
npm run seed
```

---

## Step 2 — Create Heroku app

```powershell
cd C:\Users\rejoi\Projects\airbnb-capstone
heroku login
heroku create your-app-name
```

Save the URL shown, e.g. `https://your-app-name.herokuapp.com`

---

## Step 3 — Set config vars

Replace values with your own:

```powershell
heroku config:set MONGODB_URI="mongodb://USER:PASS@host1,host2,host3/airbnb-capstone?ssl=true&replicaSet=..."
heroku config:set JWT_SECRET="your-long-random-secret-at-least-32-characters"
heroku config:set NODE_ENV=production
```

Optional (same-origin deploy works without these):

```powershell
heroku config:set CLIENT_URL=https://your-app-name.herokuapp.com
heroku config:set ADMIN_URL=https://your-app-name.herokuapp.com
```

---

## Step 4 — Set Node buildpack (required if you see "No default language detected")

```powershell
heroku buildpacks:set heroku/nodejs -a aribnb-rejoice-capstone
heroku buildpacks -a aribnb-rejoice-capstone
```

You should see `heroku/nodejs` listed as buildpack #1.

---

## Step 5 — Commit Heroku files and deploy

Root `package.json`, `Procfile`, and `package-lock.json` **must be committed** before push.

```powershell
git add package.json package-lock.json Procfile .node-version app.json HEROKU.md backend/server.js
git status
git commit -m "Add Heroku Node.js deployment files"
git push heroku main
```

If your branch is `master`:

```powershell
git push heroku master
```

Heroku runs `heroku-postbuild` automatically (builds client + admin + installs backend).

---

## Step 6 — Verify

```powershell
heroku open
heroku logs --tail
```

Browser checks:

- [ ] `https://YOUR-APP.herokuapp.com/` — home page
- [ ] `https://YOUR-APP.herokuapp.com/locations?location=Cape Town` — listings
- [ ] `https://YOUR-APP.herokuapp.com/admin` — admin login
- [ ] `https://YOUR-APP.herokuapp.com/api/health` — `"database": "connected"`

**Demo logins**

| Role | Email | Password |
|------|-------|----------|
| Guest | jannie@example.com | password123 |
| Host | lerato@example.com | password321 |

---

## Save for submission

Copy this into your course portal:

```text
Heroku URL: https://YOUR-APP.herokuapp.com
Admin:      https://YOUR-APP.herokuapp.com/admin
Guest:      jannie@example.com / password123
Host:       lerato@example.com / password321
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Build fails: "No default language detected" | Run `heroku buildpacks:set heroku/nodejs -a YOUR-APP` and ensure root `package.json` + `Procfile` are committed |
| `database: disconnected` | Fix `MONGODB_URI`; allow `0.0.0.0/0` in Atlas Network Access |
| `Application Error` | `heroku logs --tail` — often missing env vars |
| Admin 404 | Use `/admin` not `/admin/` only for assets; both should work |
| Empty listings | Re-run seed against Atlas from your PC |
| Slow first load | Free dyno sleeps after 30 min idle — wake with one request |

### Re-seed production database

```powershell
# Temporarily point local .env to Atlas, then:
cd backend
npm run seed
```

---

## How it works

- Root `Procfile` → `npm start` → `backend/server.js`
- `heroku-postbuild` builds React client and admin into `dist/` folders
- Express serves API at `/api/*`, admin at `/admin`, client at `/`
- API calls use same origin (no CORS issues on Heroku)

See also [backend/DEPLOYMENT.md](./backend/DEPLOYMENT.md) for Atlas and security notes.
