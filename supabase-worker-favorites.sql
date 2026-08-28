-- ============================================================
-- KaziGo — Favoritar trabalhadores (perfis públicos)
-- Corre no Supabase: SQL Editor → New query → cola tudo → Run
-- ============================================================

create table if not exists public.worker_favorites (
  user_id uuid not null references public.profiles(id) on delete cascade,
  worker_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, worker_id),
  constraint no_self_favorite check (user_id <> worker_id)
);

alter table public.worker_favorites enable row level security;

create policy "Utilizadores veem os próprios favoritos de trabalhadores"
  on public.worker_favorites for select
  using (auth.uid() = user_id);

create policy "Utilizadores podem favoritar trabalhadores"
  on public.worker_favorites for insert
  with check (auth.uid() = user_id);

create policy "Utilizadores podem remover favoritos de trabalhadores"
  on public.worker_favorites for delete
  using (auth.uid() = user_id);

-- ============================================================
-- Fim.
-- ============================================================
