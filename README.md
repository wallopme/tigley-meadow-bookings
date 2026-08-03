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
│   │   ├── db.ts           # SQLite schema & helpers
│   │   ├── routes.ts       # Public & admin endpoints
│   │   └── index.ts
│   └── data/               # Booking data (store.json, created on first run)
└── package.json
```

## Next steps

- [ ] Add your own property photos
- [ ] Update the description in `property.ts` with your new copy
- [ ] Set a secure admin password in production
- [ ] Add your Instagram URL in admin settings when the account is live
- [ ] Deploy (Railway, Fly.io, or a VPS work well for Node + SQLite)
- [ ] Optional: connect a custom domain and add email notifications for new bookings
