-- ============================================================
-- KaziGo — Preferências de notificações do utilizador
-- Corre no Supabase: SQL Editor → New query → cola tudo → Run
-- ============================================================

create table if not exists public.user_settings (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  notify_candidaturas boolean not null default true,
  notify_mensagens boolean not null default true,
  notify_marketing boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.user_settings enable row level security;

create policy "Utilizadores veem as próprias preferências"
  on public.user_settings for select
  using (auth.uid() = user_id);

create policy "Utilizadores criam as próprias preferências"
  on public.user_settings for insert
  with check (auth.uid() = user_id);

create policy "Utilizadores atualizam as próprias preferências"
  on public.user_settings for update
  using (auth.uid() = user_id);

-- ============================================================
-- Fim.
-- ============================================================
