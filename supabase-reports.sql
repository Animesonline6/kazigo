-- ============================================================
-- KaziGo — Sistema de denúncias
-- Corre no Supabase: SQL Editor → New query → cola tudo → Run
-- ============================================================

create type report_status as enum ('pendente', 'em_analise', 'resolvida', 'rejeitada');
create type report_target as enum ('user', 'job');

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  target_type report_target not null,
  reported_user_id uuid references public.profiles(id) on delete cascade,
  job_id uuid references public.jobs(id) on delete cascade,
  reason text not null,
  description text,
  status report_status not null default 'pendente',
  admin_note text,
  created_at timestamptz not null default now()
);

alter table public.reports enable row level security;

-- Quem denuncia pode ver as próprias denúncias
create policy "Utilizadores veem as próprias denúncias"
  on public.reports for select
  using (auth.uid() = reporter_id);

-- Qualquer utilizador autenticado pode criar uma denúncia
create policy "Utilizadores podem denunciar"
  on public.reports for insert
  with check (auth.uid() = reporter_id);

-- Admins veem e gerem TODAS as denúncias
create policy "Admins veem todas as denúncias"
  on public.reports for select
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "Admins atualizam denúncias"
  on public.reports for update
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- ============================================================
-- Fim. Confirma em Table Editor → reports → tabela criada
-- ============================================================
