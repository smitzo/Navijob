-- Run this in Supabase SQL Editor first.
-- It creates the table currently used by the Next.js landing page.

create extension if not exists pgcrypto;

create table if not exists public.waitlist_leads (
  id uuid primary key default gen_random_uuid(),
  full_name varchar(160) not null,
  email varchar(254) not null,
  phone varchar(40),
  current_status varchar(80),
  interest varchar(120),
  source varchar(120) not null default 'landing_page',
  created_at timestamptz not null default now()
);

create index if not exists waitlist_leads_email_idx on public.waitlist_leads (email);
create index if not exists waitlist_leads_created_at_idx on public.waitlist_leads (created_at desc);

alter table public.waitlist_leads enable row level security;

-- Allows anonymous frontend inserts using Supabase anon key.
-- It does NOT allow anonymous reads/updates/deletes.
drop policy if exists "Allow public waitlist inserts" on public.waitlist_leads;
create policy "Allow public waitlist inserts"
on public.waitlist_leads
for insert
to anon
with check (true);
