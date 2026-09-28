# Brooke & Matt — Wedding Website

A private wedding website and guest portal: public wedding info, name-based
guest login, a real RSVP flow backed by Postgres (Supabase), and a hidden
admin dashboard for managing the guest list.

## Stack

- **Next.js 14** (App Router) + TypeScript + Tailwind CSS
- **Supabase** (Postgres + Realtime) as the database — accessed only from
  the server via the service role key
- Custom signed-cookie sessions (via `jose`) for both guest and admin
  login — not Supabase Auth, since guests log in with just their name
- Node's built-in `crypto.scrypt` for admin password hashing (no bcrypt
  dependency)

## Project structure

```
src/app/                 Public pages, portal, admin, API routes
src/components/          UI components (public + portal + admin/)
src/lib/                 Config, types, auth, data access, server actions
supabase/migrations/     SQL schema (run in order against your project)
scripts/create-admin.ts  Bootstraps/resets an admin login
public/images/           Photos — see public/images/README.md to swap them
```

## One file to edit for wedding details

**`src/lib/config.ts`** holds the date, times, venue names/addresses,
dress code, gift wording, child-free note, and itinerary. Edit that file
and redeploy to change any of it — no other code changes needed.

## Local setup

1. `npm install`
2. Copy `.env.example` to `.env.local` and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` — from your
     Supabase project's Settings → API. **The service role key is secret —
     never commit it or put it in a `NEXT_PUBLIC_` variable.**
   - `SESSION_SECRET` — any long random string (`openssl rand -base64 48`)
3. Run the schema: in the Supabase SQL editor, run
   `supabase/migrations/0001_init.sql` (and any later files in order).
4. Create your admin login:
   ```
   ADMIN_BOOTSTRAP_EMAIL=you@example.com \
   ADMIN_BOOTSTRAP_PASSWORD=a-strong-password \
   npm run seed:admin
   ```
5. `npm run dev` and open http://localhost:3000

## Adding guests

Log in at `/admin` and use **Groups** to create a household, then **Guests**
to add people to it. A guest logs in at `/rsvp` with the exact full name you
entered (case/spacing don't matter, nicknames do — add nicknames as
"Alternate Accepted Names" on that guest if you want them to work too).

## Deploying

This repo deploys to Vercel with zero config beyond the environment
variables above (set them in Vercel's Project Settings → Environment
Variables, matching `.env.example`). Any push to your production branch —
or a redeploy — picks up changes to `src/lib/config.ts` immediately.

## Security notes

- Every table has Row Level Security enabled with **no** policies granted
  to the public/anon role — the app only ever talks to Supabase using the
  service role key from server-side code (Server Components, Server
  Actions, Route Handlers). Guests and admins never get a Supabase key of
  their own.
- Guest name matching is exact (after trimming/case/punctuation
  normalization) — nicknames must be added explicitly as alternate names
  on that guest in the admin panel. This is intentional: it's what stops
  "Chris Smith" from matching "Christopher Michael Smith" by accident.
- Both login flows are rate-limited (tracked in Postgres, not in memory,
  so it holds up across serverless instances) and return a generic
  "not found" message — never a hint about which part was wrong.
