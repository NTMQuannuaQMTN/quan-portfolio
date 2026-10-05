-- =============================================================================
-- quan-portfolio — Supabase schema
-- Run this once in the Supabase SQL editor (Dashboard → SQL Editor → New query).
-- Safe to re-run: everything is "if not exists" / "or replace".
--
-- Access model
--   • The website reads with the service-role key on the server, and anyone may
--     read public content through RLS (anon key) — unpublished posts stay hidden.
--   • Only the server (service-role key, which bypasses RLS) can write. There
--     are deliberately no insert/update/delete policies.
-- =============================================================================

create extension if not exists pgcrypto;

-- Keeps updated_at current on every update.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- Profile (a single row: id is always 1)
-- -----------------------------------------------------------------------------
create table if not exists public.profile (
  id            smallint primary key default 1 check (id = 1),
  name          text not null default '',
  role          text not null default '',
  tagline       text not null default '',
  location      text not null default '',
  story         text not null default '',
  email         text not null default '',
  github_url    text not null default '',
  linkedin_url  text not null default '',
  resume_url    text not null default '',
  avatar_url    text not null default '',
  cover_url     text not null default '',
  updated_at    timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- Education
-- -----------------------------------------------------------------------------
create table if not exists public.education (
  id          uuid primary key default gen_random_uuid(),
  school      text not null,
  degree      text not null default '',
  start_month date not null,               -- first day of the month, e.g. 2026-08-01
  end_month   date,                        -- null = Present
  detail      text not null default '',
  logo_url    text not null default '',
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint education_period_check check (end_month is null or end_month >= start_month)
);
create index if not exists education_sort_idx on public.education (sort_order);

-- -----------------------------------------------------------------------------
-- Experiences
-- -----------------------------------------------------------------------------
create table if not exists public.experiences (
  id               uuid primary key default gen_random_uuid(),
  role             text not null,              -- LinkedIn "Title"
  employment_type  text not null default ''
    check (employment_type in ('', 'Full-time', 'Part-time', 'Self-employed', 'Freelance',
                               'Contract', 'Internship', 'Apprenticeship', 'Seasonal')),
  company          text not null default '',
  logo_url         text not null default '',
  location         text not null default '',
  location_type    text not null default ''
    check (location_type in ('', 'On-site', 'Hybrid', 'Remote')),
  start_month      date not null,              -- first day of the month
  end_month        date,                       -- null = Present
  description      text not null default '',
  tech             text[] not null default '{}', -- skills
  sort_order       integer not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  constraint experiences_period_check check (end_month is null or end_month >= start_month)
);
create index if not exists experiences_sort_idx on public.experiences (sort_order);

-- -----------------------------------------------------------------------------
-- Projects
-- -----------------------------------------------------------------------------
create table if not exists public.projects (
  id                        uuid primary key default gen_random_uuid(),
  title                     text not null,      -- LinkedIn "Project name"
  description               text not null default '',
  tech                      text[] not null default '{}', -- skills
  image_url                 text not null default '',     -- media
  project_url               text not null default '',
  start_month               date,               -- optional; null with end_month null = no dates
  end_month                 date,               -- null with a start = currently working on it
  associated_experience_id  uuid references public.experiences (id) on delete set null,
  associated_education_id   uuid references public.education (id) on delete set null,
  sort_order                integer not null default 0,
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now(),
  constraint projects_period_check
    check (end_month is null or (start_month is not null and end_month >= start_month)),
  constraint projects_association_check
    check (num_nonnulls(associated_experience_id, associated_education_id) <= 1)
);
create index if not exists projects_sort_idx on public.projects (sort_order);

-- -----------------------------------------------------------------------------
-- About tab: skills (grouped by category) and journey timeline
-- -----------------------------------------------------------------------------
create table if not exists public.skills (
  id          uuid primary key default gen_random_uuid(),
  category    text not null,
  name        text not null,
  logo_url    text not null default '',
  sort_order  integer not null default 0,   -- order across all skills; categories appear in first-seen order
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists skills_sort_idx on public.skills (sort_order);

create table if not exists public.journey (
  id           uuid primary key default gen_random_uuid(),
  year         text not null,
  title        text not null,
  description  text not null default '',
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists journey_sort_idx on public.journey (sort_order);

-- -----------------------------------------------------------------------------
-- Blogs
-- -----------------------------------------------------------------------------
create table if not exists public.blogs (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title         text not null,
  excerpt       text not null default '',
  content       text not null default '',   -- Markdown
  cover_url     text not null default '',
  published     boolean not null default false,
  published_at  timestamptz,                -- set the first time a post is published
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists blogs_published_idx on public.blogs (published, created_at desc);

-- -----------------------------------------------------------------------------
-- Music of the day (Spotify)
-- -----------------------------------------------------------------------------
create table if not exists public.music (
  id           uuid primary key default gen_random_uuid(),
  day          date not null default current_date,
  spotify_url  text not null check (spotify_url ~ '^https://open\.spotify\.com/'),
  title        text not null,
  artist       text not null default '',
  cover_url    text not null default '',     -- auto-filled from Spotify when added
  note         text not null default '',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
-- Newest day first; several songs on one day are ordered by created_at.
create index if not exists music_day_idx on public.music (day desc, created_at desc);

-- -----------------------------------------------------------------------------
-- updated_at triggers
-- -----------------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['profile','education','experiences','projects','skills','journey','blogs','music']
  loop
    execute format('drop trigger if exists %I_updated_at on public.%I', t, t);
    execute format(
      'create trigger %I_updated_at before update on public.%I
         for each row execute function public.set_updated_at()', t, t);
  end loop;
end $$;

-- -----------------------------------------------------------------------------
-- Row Level Security: public read-only
-- -----------------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['profile','education','experiences','projects','skills','journey','music']
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "Public read" on public.%I', t);
    execute format('create policy "Public read" on public.%I for select using (true)', t);
  end loop;
end $$;

alter table public.blogs enable row level security;
drop policy if exists "Public read published" on public.blogs;
create policy "Public read published" on public.blogs for select using (published);

-- -----------------------------------------------------------------------------
-- Storage bucket for profile picture, cover photo, project/blog images and
-- resume. Public read; uploads only via signed URLs created by the server.
-- Folders: avatars/, covers/, uploads/
-- -----------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 10485760, array['image/*', 'application/pdf'])
on conflict (id) do update set
  public = true,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
