-- ============================================================
-- KaziGo — Notificações administrativas
-- Corre no Supabase: SQL Editor → New query → cola tudo → Run
-- ============================================================

create table if not exists public.admin_notifications (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('novo_utilizador', 'novo_trabalho', 'nova_denuncia', 'sistema')),
  title text not null,
  description text,
  related_id uuid,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.admin_notifications enable row level security;

-- Só admins veem/atualizam notificações administrativas
create policy "Admins veem notificações administrativas"
  on public.admin_notifications for select
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "Admins marcam notificações administrativas como lidas"
  on public.admin_notifications for update
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- Qualquer utilizador autenticado pode criar uma notificação
-- administrativa (necessário: quem publica um trabalho ou faz uma
-- denúncia dispara o aviso para o admin)
create policy "Utilizadores autenticados podem criar notificações administrativas"
  on public.admin_notifications for insert
  with check (auth.uid() is not null);

-- Cria automaticamente uma notificação sempre que um novo
-- utilizador se regista (via trigger, não depende do frontend)
create or replace function public.notify_admin_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.admin_notifications (type, title, description, related_id)
  values (
    'novo_utilizador',
    'Novo utilizador registado',
    coalesce(new.full_name, new.email) || ' registou-se na KaziGo.',
    new.id
  );
  return new;
end;
$$;

drop trigger if exists on_profile_created_notify_admin on public.profiles;
create trigger on_profile_created_notify_admin
  after insert on public.profiles
  for each row execute function public.notify_admin_new_user();

-- ============================================================
-- Fim. Confirma em Table Editor → admin_notifications
-- ============================================================
