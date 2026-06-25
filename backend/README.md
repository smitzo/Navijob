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

## Job Marketplace Backend

The backend now includes the first marketplace foundation:

- `Company`: startup profile, stage, size, verification, and premium partner flags.
- `ApplicantProfile`: candidate job-search profile linked to a Django user.
- `RecruiterProfile`: hiring-side profile linked to a Django user and company.
- `Job`: premium startup listing with status, compensation, equity, skills, and curation fields.
- `JobApplication`: application workflow connecting an applicant to a job.

## API Endpoints

```txt
GET /api/jobs/
GET /api/jobs/<slug>/
GET /api/applications/
POST /api/applications/
```

`/api/jobs/` is public and returns only active, published jobs. It supports query parameters such as `q`, `work_mode`, `job_type`, `seniority`, `location`, and `is_premium`.

`/api/applications/` requires an authenticated user with an applicant profile.

## Backend Checks

```bash
cd backend
source .venv/bin/activate
python manage.py check
python manage.py test
```
