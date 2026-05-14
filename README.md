# Shift Tracking System

Production-ready shift tracker for day/night teams using Netlify Functions + Neon PostgreSQL.

## Stack
Vanilla HTML/CSS/JS, Netlify Functions, Neon PostgreSQL, JWT, bcryptjs.

## Setup
1. `cp .env.example .env`
2. Set `DATABASE_URL`, `JWT_SECRET`.
3. Install deps: `npm install`
4. Run SQL files against Neon: `sql/schema.sql` then `sql/seed.sql`
5. Start: `npm run dev`

## Default Users
Seed creates `admin`, `dayshift`, `nightshift`, `viewer` with placeholder bcrypt hashes.
Generate real hashes:
```bash
node -e "import bcrypt from 'bcryptjs'; bcrypt.hash('YourPassword',10).then(console.log)"
```
Update `sql/seed.sql` with generated hashes before seeding production.

## Shift Windows (Africa/Nairobi)
- Day: 4:45 AM - 9:00 AM
- Night: 4:45 PM - 9:00 PM

## Deploy to Netlify
- Connect repo to Netlify.
- Set environment variables in Netlify dashboard.
- Build settings are in `netlify.toml`.

## Troubleshooting
- 401 errors: check JWT secret and token expiry.
- DB errors: validate Neon connection string and SSL options.
- Login failures: ensure seeded hashes are real bcrypt hashes.
