-- Pre-launch waitlist ("Request inaugural drop access"). Anyone may add an email; nobody can read the list with the public key.
create extension if not exists citext;
create table if not exists public.waitlist (
  id bigint generated always as identity primary key,
  email citext not null unique check (email ~ '^[^\s@]+@[^\s@]+\.[^\s@]+$' and length(email) <= 254),
  source text not null default 'teaser' check (length(source) <= 40),
  created_at timestamptz not null default now()
);
alter table public.waitlist enable row level security;
create policy "public can join waitlist" on public.waitlist for insert to anon with check (true);
