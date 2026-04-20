-- TrendStep schema. Run in Supabase SQL editor.

create table if not exists public.trends (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  tiktok_url text not null,
  difficulty text not null check (difficulty in ('easy','medium','hard')),
  thumbnail_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.steps (
  id uuid primary key default gen_random_uuid(),
  trend_id uuid not null references public.trends(id) on delete cascade,
  "order" int not null,
  title text not null,
  description text not null default '',
  count text not null default ''
);

create index if not exists steps_trend_order_idx
  on public.steps (trend_id, "order");

-- Row-level security: public read, writes via service role only.
alter table public.trends enable row level security;
alter table public.steps  enable row level security;

drop policy if exists "trends are public" on public.trends;
create policy "trends are public"
  on public.trends for select
  to anon, authenticated
  using (true);

drop policy if exists "steps are public" on public.steps;
create policy "steps are public"
  on public.steps for select
  to anon, authenticated
  using (true);
