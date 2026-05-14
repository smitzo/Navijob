# Navijob

Production-minded monorepo for Navijob.

## Structure

```txt
Navijob/
├── frontend/   # Next.js landing page + Supabase waitlist form
└── backend/    # Django project with schema synced to Supabase/Postgres
```

## Current flow

```txt
Next.js landing page -> Supabase Postgres table: waitlist_leads
```

## Future flow

```txt
Next.js frontend -> Django REST API -> same Postgres schema
```

The Django `WaitlistLead` model is intentionally aligned with the Supabase SQL table.
