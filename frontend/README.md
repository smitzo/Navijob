# Navijob Frontend

Next.js landing page for Navijob.

## Development

```bash
npm install
npm run dev
```

This app expects Node 20.9+ because it uses Next 16.

## Environment

```txt
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

`SUPABASE_SERVICE_ROLE_KEY` is optional for local development. The visitor counter API first tries the Supabase `record_site_visit` RPC from `backend/supabase_schema.sql`. If Supabase is not configured yet, it uses a local development counter in `/tmp`.

## Current Landing Page

- Coming-soon hero for premium startup jobs.
- Waitlist form backed by Supabase `waitlist_leads`.
- Real visitor counter through `POST /api/visitors`.
- Tailwind utility classes for UI styling.

## Demo Auth Flow

The frontend includes a demo-only login/signup flow:

```txt
/login
/signup
/candidate
/recruiter
```

Temporary demo credentials:

```txt
demo / demo
admin / admin
```

Users choose either `Candidate` or `Recruiter` during login/signup. Candidate users land on `/candidate`; recruiter users land on `/recruiter`.

This is not production authentication. It stores a demo session in `localStorage` so the product flow can be previewed while real auth is still pending.

Next.js landing page with a direct Supabase waitlist form.

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Required Supabase env values

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Use the Supabase anon/public key, not the service role key.
