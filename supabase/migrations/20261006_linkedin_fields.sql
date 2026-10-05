-- =============================================================================
-- Migration: LinkedIn-style Experiences and Projects
-- Run once in the Supabase SQL editor, after 20261005_period_months.sql.
-- Safe to re-run.
--
-- Experiences: + employment_type, location, location_type, logo_url
-- Projects:    category / summary / problem / solution / impact / demo_url /
--              github_url are replaced by description + project_url, plus
--              optional dates and "Associated with" an experience or school.
--   description = summary, then "Impact: …" (problem and solution are dropped:
--                 in the original content they repeat the summary)
--   project_url = demo URL, else GitHub URL (if both exist, the GitHub URL is
--                 appended to the description so nothing is lost)
-- =============================================================================

-- ---------- Experiences ----------
alter table public.experiences
  add column if not exists employment_type text not null default '',
  add column if not exists location        text not null default '',
  add column if not exists location_type   text not null default '',
  add column if not exists logo_url        text not null default '';

update public.experiences
set employment_type = 'Internship'
where employment_type = '' and role ~* '\mintern';

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'experiences_employment_type_check') then
    alter table public.experiences add constraint experiences_employment_type_check
      check (employment_type in ('', 'Full-time', 'Part-time', 'Self-employed', 'Freelance',
                                 'Contract', 'Internship', 'Apprenticeship', 'Seasonal'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'experiences_location_type_check') then
    alter table public.experiences add constraint experiences_location_type_check
      check (location_type in ('', 'On-site', 'Hybrid', 'Remote'));
  end if;
end $$;

-- ---------- Projects ----------
alter table public.projects
  add column if not exists description              text not null default '',
  add column if not exists project_url              text not null default '',
  add column if not exists start_month              date,
  add column if not exists end_month                date,
  add column if not exists associated_experience_id uuid references public.experiences (id) on delete set null,
  add column if not exists associated_education_id  uuid references public.education (id) on delete set null;

do $$
begin
  -- Copy the old columns over, only while they still exist.
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'projects' and column_name = 'summary'
  ) then
    update public.projects set
      description = concat_ws(
        E'\n\n',
        nullif(summary, ''),
        'Impact: ' || nullif(impact, ''),
        case when demo_url <> '' and github_url <> '' then 'Code: ' || github_url end
      ),
      project_url = coalesce(nullif(demo_url, ''), github_url, '');

    alter table public.projects
      drop column category,
      drop column summary,
      drop column problem,
      drop column solution,
      drop column impact,
      drop column demo_url,
      drop column github_url;
  end if;

  if not exists (select 1 from pg_constraint where conname = 'projects_period_check') then
    alter table public.projects add constraint projects_period_check
      check (end_month is null or (start_month is not null and end_month >= start_month));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'projects_association_check') then
    alter table public.projects add constraint projects_association_check
      check (num_nonnulls(associated_experience_id, associated_education_id) <= 1);
  end if;
end $$;

-- PostgREST caches the table structure; tell it to reload.
notify pgrst, 'reload schema';
