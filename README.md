# Tigley Meadow Coach House

A custom holiday letting website for **Tigley Meadow Coach House** — a converted coach house annex near Dartington, Devon.

## What's included

- **Property website** — home, property details, location guide, guest reviews
- **Online booking** — availability calendar, date selection, booking requests
- **Admin dashboard** — manage bookings, block dates, edit journal posts, update settings
- **Journal (blog)** — markdown posts, managed from admin
- **Instagram link** — placeholder until your account is live (configurable in admin)

## Stack

| Layer    | Tech                                      |
| -------- | ----------------------------------------- |
| Frontend | Vite + React 18 + TypeScript + Tailwind   |
| Backend  | Express + JSON file store                 |
| Auth     | JWT (admin password via env var)          |

## Getting started

```bash
cd tigley-meadow
npm run install:all

# Copy and edit server environment
cp server/.env.example server/.env

npm run dev
```

- **Website:** http://localhost:5174
- **API:** http://localhost:3001
- **Admin:** http://localhost:5174/admin (default password: `change-me-in-production`)

## Configuration

Edit `server/.env`:

```env
PORT=3001
ADMIN_PASSWORD=your-secure-password
JWT_SECRET=a-long-random-string
CLIENT_ORIGIN=http://localhost:5174
```

In **Admin → Settings** you can also update:

- Nightly rate
- Minimum stay
- Max guests
- Contact email
- Instagram URL (when ready)

## Customising content

Property copy, features, reviews and gallery images live in:

```
client/src/data/property.ts
```

Replace the Unsplash placeholder images with your own photos in `client/public/images/` and update the paths in `property.ts`.

When you have your new description, update the `description` field in that file.

## Booking flow

1. Guest selects dates on the calendar and submits a **booking request**
2. Request appears in Admin → Bookings as **pending**
3. You confirm or cancel — confirmed dates block the calendar
4. You handle payment separately (email, bank transfer, etc.)

No payment processing is built in — this keeps things simple and avoids Stripe fees until you're ready.

## Production build

```bash
npm run build
npm start
```

The server serves the built frontend from `client/dist` and the API from `/api`.

## Auto-deploy (Railway — recommended)

GitHub Actions runs a **build check only** — a green tick there does not mean Railway deployed. Railway deploys separately when your repo is connected in the Railway dashboard.

Every push to `main` can deploy automatically. One-time setup (~5 minutes):

1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. **New Project → Deploy from GitHub repo → `wallopme/tigley-meadow-bookings`**
3. Railway detects the `Dockerfile` and deploys on every push to `main`
4. Open the service **Variables** tab and add:
   - `ADMIN_PASSWORD` — a secure password for `/admin`
   - `JWT_SECRET` — a long random string
5. Open **Settings → Volumes → Add volume**
   - Mount path: `/app/server/data` (keeps bookings between deploys)
6. **Settings → Networking → Generate domain** — your live URL
7. Optional: add `CLIENT_ORIGIN` = your Railway URL (usually auto-detected)

### Troubleshooting: site not updating?

1. **Check Railway, not GitHub** — open your service → **Deployments**. The latest must show **Success** (not Failed or Crashed).
2. **Check you're on the right URL** — use the domain from Railway **Settings → Networking** (not localhost).
3. **Hard refresh** — Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows).
4. **Verify the live version** — visit `https://YOUR-RAILWAY-URL/api/health`  
   The `commit` field should match your latest GitHub commit (e.g. `e59b66d`).
5. **Check billing** — if credits ran out, Railway stops your app (see below).

### Do you need to pay?

| Plan | Cost | Notes |
|------|------|-------|
| **Trial** | Free $5 credit | Lasts ~30 days, then stops |
| **Free** | $0 | Only $1/month usage — usually **not enough** for a site running 24/7 |
| **Hobby** | **$5/month** | Recommended for a live holiday site; includes $5 usage credit |

For a small Node app running continuously, expect to need the **Hobby plan ($5/month)** after the trial. If your trial credits expired, deployments may appear in the dashboard but the service won't stay running.

GitHub Actions also runs a **build check** on every push to `main`.

### Alternative: Render

1. Go to [render.com](https://render.com) and connect the GitHub repo
2. Render picks up `render.yaml` automatically
3. Set `ADMIN_PASSWORD` in the dashboard
4. Requires **Starter plan** ($7/mo) for persistent booking storage (disk)

## Project structure

```
tigley-meadow/
├── client/                 # React frontend
│   └── src/
│       ├── components/     # Header, Footer, BookingForm
│       ├── data/           # Property content (edit here)
│       ├── lib/            # API client, date helpers
│       └── pages/          # Home, Property, Location, Book, Blog, Admin
├── server/                 # Express API
│   ├── src/
│   │   ├── db.ts           # JSON store & helpers
│   │   ├── routes.ts       # Public & admin endpoints
│   │   └── index.ts
│   └── data/               # Booking data (store.json, created on first run)
└── package.json
```

## Next steps

- [x] Add your own property photos (hero image added)
- [x] Update the description in `property.ts`
- [ ] Complete Railway one-time setup (see Auto-deploy above)
- [ ] Set a secure admin password in production
- [ ] Add your Instagram URL in admin settings when the account is live
- [ ] Optional: connect a custom domain and add email notifications for new bookings
