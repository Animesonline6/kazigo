-- ============================================================
-- KaziGo — Apagar trabalho remove automaticamente candidaturas
-- e favoritos associados (evita erro de chave estrangeira)
-- Corre no Supabase: SQL Editor → New query → cola tudo → Run
-- ============================================================

alter table public.job_applications
  drop constraint if exists job_applications_job_id_fkey;

alter table public.job_applications
  add constraint job_applications_job_id_fkey
  foreign key (job_id) references public.jobs(id) on delete cascade;

alter table public.favorites
  drop constraint if exists favorites_job_id_fkey;

alter table public.favorites
  add constraint favorites_job_id_fkey
  foreign key (job_id) references public.jobs(id) on delete cascade;
