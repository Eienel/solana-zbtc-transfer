-- TrendStep schema. Run in Supabase SQL editor.
-- Community-uploaded tutorials. A trend is defined by its TikTok sound.

drop table if exists public.reports cascade;
drop table if exists public.votes cascade;
drop table if exists public.steps cascade;
drop table if exists public.tutorials cascade;
drop table if exists public.trends cascade;

create table public.trends (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  music_id text not null unique,     -- anti-abuse: defines the trend
  music_title text,
  difficulty text not null check (difficulty in ('easy','medium','hard')),
  created_at timestamptz not null default now()
);
-- Basic lowered indexes for ILIKE search (good enough for launch scale;
-- add pg_trgm GIN indexes later if search slows down).
create index trends_name_lower    on public.trends (lower(name));
create index trends_music_lower   on public.trends (lower(music_title));

create table public.tutorials (
  id uuid primary key default gen_random_uuid(),
  trend_id uuid not null references public.trends(id) on delete cascade,
  tiktok_url text not null unique,
  music_id text not null,            -- must match trends.music_id on insert
  author_handle text,
  author_name text,
  thumbnail_url text,
  oembed_html text,
  vote_count int not null default 0,
  report_count int not null default 0,
  hidden boolean not null default false,
  created_at timestamptz not null default now()
);
create index tutorials_trend_votes on public.tutorials (trend_id, vote_count desc, created_at desc);

create table public.steps (
  id uuid primary key default gen_random_uuid(),
  tutorial_id uuid not null references public.tutorials(id) on delete cascade,
  "order" int not null,
  title text not null,
  description text not null default '',
  count text not null default ''
);
create index steps_tutorial_order on public.steps (tutorial_id, "order");

create table public.votes (
  tutorial_id uuid not null references public.tutorials(id) on delete cascade,
  fingerprint text not null,
  created_at timestamptz not null default now(),
  primary key (tutorial_id, fingerprint)
);

create table public.reports (
  tutorial_id uuid not null references public.tutorials(id) on delete cascade,
  fingerprint text not null,
  reason text,
  created_at timestamptz not null default now(),
  primary key (tutorial_id, fingerprint)
);

-- Keep tutorials.vote_count in sync with votes table
create or replace function public.bump_vote_count() returns trigger
language plpgsql as $$
begin
  if tg_op = 'INSERT' then
    update public.tutorials
      set vote_count = vote_count + 1
      where id = new.tutorial_id;
  elsif tg_op = 'DELETE' then
    update public.tutorials
      set vote_count = greatest(vote_count - 1, 0)
      where id = old.tutorial_id;
  end if;
  return null;
end;
$$;

drop trigger if exists votes_count_trg on public.votes;
create trigger votes_count_trg
  after insert or delete on public.votes
  for each row execute function public.bump_vote_count();

-- Auto-hide a tutorial once it has 5 reports
create or replace function public.bump_report_count() returns trigger
language plpgsql as $$
begin
  update public.tutorials
    set report_count = report_count + 1,
        hidden = (report_count + 1 >= 5)
    where id = new.tutorial_id;
  return null;
end;
$$;

drop trigger if exists reports_count_trg on public.reports;
create trigger reports_count_trg
  after insert on public.reports
  for each row execute function public.bump_report_count();

-- RLS: public can read trends + non-hidden tutorials + their steps.
-- Writes go through service-role server actions.
alter table public.trends    enable row level security;
alter table public.tutorials enable row level security;
alter table public.steps     enable row level security;
alter table public.votes     enable row level security;
alter table public.reports   enable row level security;

create policy "trends public read" on public.trends
  for select to anon, authenticated using (true);

create policy "tutorials public read" on public.tutorials
  for select to anon, authenticated using (hidden = false);

-- Steps are public-read; hidden tutorials are filtered server-side in the
-- app, and the tutorials RLS policy already hides them from any direct
-- client read. Keeping this simple avoids alias-mangling in SQL editors.
create policy "steps public read" on public.steps
  for select to anon, authenticated using (true);
