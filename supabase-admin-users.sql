-- ============================================================
-- KaziGo — Gestão de utilizadores (Etapa 2 do Admin)
-- Corre no Supabase: SQL Editor → New query → cola tudo → Run
-- (Não apaga nem altera dados existentes — só adiciona)
-- ============================================================

-- Novos campos para suspender contas
alter table public.profiles
  add column if not exists is_suspended boolean not null default false;

alter table public.profiles
  add column if not exists suspended_at timestamptz;

-- Até agora, um utilizador só podia atualizar o PRÓPRIO perfil.
-- Esta política extra permite que uma conta admin atualize
-- qualquer perfil (necessário para suspender/reativar outras
-- contas a partir de /admin/utilizadores).
create policy "Admins podem atualizar qualquer perfil"
  on public.profiles for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- ============================================================
-- Fim. Confirma em Table Editor → profiles → devem existir as
-- colunas "is_suspended" e "suspended_at"
-- ============================================================
