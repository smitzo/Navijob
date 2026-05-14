# Navijob Backend

Django backend scaffold with models aligned to the Supabase/Postgres schema.

Current frontend writes directly to Supabase for waitlist. Later, point the frontend to Django API:

```txt
POST /api/waitlist/
```

## Local setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements/local.txt
cp .env.example .env
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

## Supabase setup

1. Open Supabase SQL Editor.
2. Run `supabase_schema.sql`.
3. Copy your project URL and anon key into `frontend/.env.local`.
4. Copy your database connection string into `backend/.env` as `DATABASE_URL`.

## Notes

- `waitlist_leads` table is shared by frontend and Django.
- Frontend inserts via Supabase anon key and RLS insert policy.
- Django connects using the Postgres connection string.
- Never put Supabase service role key in frontend.
