# Navijob Frontend

## Green platform development

The selected UI uses B / Open Road with the Sage & Forest palette. Start Django on 127.0.0.1:8100 and Next.js on port 3100. Set BACKEND_URL for a different local backend; /api/ requests share the frontend origin through a rewrite. Server-owned sessions and CSRF replace demo localStorage authentication for the real product. Self-hosted Manrope is bundled through Fontsource.

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

## Candidate Demo Jobs

The candidate workspace reads demo jobs from the backend JSON fixtures through read-only Next API routes:

```txt
GET /api/demo/jobs
GET /api/demo/jobs/<slug>
```

Candidate users can filter demo jobs by:

- Search text
- Location
- Work mode: remote, hybrid, on-site
- Job type: full-time or internship
- Tech stack
- Required experience
- Minimum salary

Job cards link to `/candidate/jobs/<slug>` for a detail view with responsibilities, requirements, benefits, salary, skills, and company context.

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
