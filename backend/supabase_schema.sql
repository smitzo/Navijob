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

-- Visitor counter for the coming-soon landing page.
-- `visitor_key` is generated in the browser and stored in localStorage.
-- One browser/device counts once, while repeat visits update `last_seen_at`.
create table if not exists public.site_visitors (
  id uuid primary key default gen_random_uuid(),
  visitor_key text not null unique,
  source varchar(120) not null default 'coming_soon_landing_page',
  visit_count integer not null default 1,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

create index if not exists site_visitors_last_seen_at_idx on public.site_visitors (last_seen_at desc);

alter table public.site_visitors enable row level security;

create or replace function public.record_site_visit(
  visitor_key_arg text,
  source_arg text default 'coming_soon_landing_page'
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  visitor_total integer;
begin
  insert into public.site_visitors (visitor_key, source)
  values (visitor_key_arg, source_arg)
  on conflict (visitor_key)
  do update set
    last_seen_at = now(),
    visit_count = public.site_visitors.visit_count + 1;

  select count(*) into visitor_total from public.site_visitors;

  return visitor_total;
end;
$$;

grant execute on function public.record_site_visit(text, text) to anon;
grant execute on function public.record_site_visit(text, text) to authenticated;
