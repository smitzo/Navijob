# Navijob Local Setup

## 1. Create Supabase table

In Supabase dashboard:

1. Open your project.
2. Go to SQL Editor.
3. Paste and run `backend/supabase_schema.sql`.

This creates:

```txt
waitlist_leads
```

and enables public anonymous inserts only.

## 2. Configure frontend

```bash
cd frontend
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

Find these in Supabase:

```txt
Project Settings -> API -> Project URL
Project Settings -> API -> anon public key
```

Run frontend:

```bash
npm install
npm run dev
```

Open:

```txt
http://localhost:3000
```

Submit the form. Check Supabase Table Editor -> `waitlist_leads`.

## 3. Configure Django backend

Backend is included now so your schema stays production-ready and in sync.

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements/local.txt
cp .env.example .env
```

Edit `.env`:

```env
DJANGO_SECRET_KEY=change-this
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

Run:

```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Open:

```txt
http://localhost:8000/admin/
```

## Important architecture note

Right now:

```txt
Next.js -> Supabase -> waitlist_leads
```

Later:

```txt
Next.js -> Django REST API -> Supabase Postgres
```

You do not need to change the database schema because Django's `WaitlistLead` model matches the Supabase table.
