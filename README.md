# Beverly Kiko Housing (Next.js + Nylon Pay + Postgres + Auth.js)

## What's where
- `app/page.js`                       UI (same design) for tenants and landlord
- `auth.js`                           Auth.js admin login (username/password, 8h session, lockout after 5 bad tries / 15 min)
- `lib/db.js`                         Postgres connection; creates tables and seeds the 5 demo units on first run
- `app/api/units`                     public list of units (no tenant details)
- `app/api/pay-nylon-rent`            starts a payment; amount is computed on the server from the unit's price
- `app/api/payment-status`            checks a payment and returns the receipt once confirmed
- `app/api/nylon-webhook`             Nylon Pay -> your server confirmation (signature verified)
- `app/api/admin/*`                   landlord-only: units add/remove, payment records

## Database tables (created automatically on first request, no SQL to run)
units, payments (name, email, phone, unit, months, amount, status), admins, login_failures, meta

## Deploy on Vercel
1. Supabase: open your project > Connect > copy the **Transaction pooler** connection string (port 6543, not the "Direct connection" one: Vercel can't reach it over IPv4). Put it in DATABASE_URL with your database password filled in.
2. Add every variable from `.env.example` in Vercel > Settings > Environment Variables, then deploy.
3. Open the site > Landlord Portal > log in with ADMIN_USERNAME / ADMIN_PASSWORD.
4. (Recommended) In the Nylon Pay dashboard add a webhook pointing to https://YOUR-DOMAIN/api/nylon-webhook and put its signing secret in NYLONPAY_WEBHOOK_SECRET.

## Run locally
    npm install
    cp .env.example .env.local     # fill it in
    npm run dev

Old files to delete from your repo: `api/`, `src/`, `public/index.html`, `vercel.json`.

## Supabase notes
- Tables are created in the `public` schema with Row Level Security ON and no policies, so Supabase's public Data API cannot read them (including the admins table). The app connects directly as the database owner, which is allowed.
- Never put the Supabase `service_role` key in this project; it isn't needed.
- You can view payments in Supabase > Table Editor > payments.
