-- ============================================================
-- KaziGo — Notificações reais
-- Corre no Supabase: SQL Editor → New query → cola tudo → Run
-- ============================================================

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null check (type in ('candidatura', 'mensagem', 'pagamento', 'avaliacao', 'sistema')),
  title text not null,
  description text,
  related_job_id uuid references public.jobs(id) on delete cascade,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.notifications enable row level security;

-- Cada utilizador só vê e só marca como lidas as SUAS notificações
create policy "Utilizadores veem as próprias notificações"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "Utilizadores marcam as próprias notificações como lidas"
  on public.notifications for update
  using (auth.uid() = user_id);

-- Qualquer utilizador autenticado pode CRIAR uma notificação para
-- OUTRO utilizador (necessário: quem se candidata cria a
-- notificação para o dono do trabalho, por exemplo)
create policy "Utilizadores autenticados podem criar notificações"
  on public.notifications for insert
  with check (auth.uid() is not null);

create index if not exists notifications_user_id_read_idx
  on public.notifications (user_id, read);

-- ============================================================
-- Fim. Confirma em Table Editor → notifications → tabela criada
-- ============================================================
