-- =============================================================================
-- Migration: education / experiences "period" text → start_month + end_month
-- Run once in the Supabase SQL editor on a database created with the earlier
-- schema.sql. Safe to re-run (it does nothing once the period column is gone).
--
-- Existing periods only have years ("2024 — 2025", "2025 — Present"), so the
-- months are set to January. Update the real months in /admin afterwards.
--   "2024 — 2025"     → Jan 2024 — Jan 2025
--   "2025 — Present"  → Jan 2025 — Present (end_month null)
--   "2025"            → Jan 2025 (start = end)
-- =============================================================================

do $$
declare t text;
begin
  foreach t in array array['education', 'experiences']
  loop
    if exists (
      select 1 from information_schema.columns
      where table_schema = 'public' and table_name = t and column_name = 'period'
    ) then
      execute format('alter table public.%I add column if not exists start_month date', t);
      execute format('alter table public.%I add column if not exists end_month date', t);

      execute format($f$
        update public.%I set
          start_month = coalesce(
            make_date(substring(period from '(\d{4})')::int, 1, 1),
            date_trunc('month', current_date)::date
          ),
          end_month = case
            when period ~* 'present|now|current' then null
            when (regexp_match(period, '\d{4}\D+(\d{4})')) is not null
              then make_date(((regexp_match(period, '\d{4}\D+(\d{4})'))[1])::int, 1, 1)
            else make_date(substring(period from '(\d{4})')::int, 1, 1)
          end
      $f$, t);

      execute format('alter table public.%I alter column start_month set not null', t);
      execute format(
        'alter table public.%I add constraint %I check (end_month is null or end_month >= start_month)',
        t, t || '_period_check'
      );
      execute format('alter table public.%I drop column period', t);
    end if;
  end loop;
end $$;

-- PostgREST caches the table structure; tell it to reload.
notify pgrst, 'reload schema';
