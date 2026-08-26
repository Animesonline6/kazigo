-- ============================================================
-- KaziGo — Configurações da plataforma (editáveis pelo admin)
-- Corre no Supabase: SQL Editor → New query → cola tudo → Run
-- ============================================================

create table if not exists public.platform_settings (
  key text primary key,
  value text,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles(id)
);

alter table public.platform_settings enable row level security;

-- Legível por qualquer pessoa (ex: para mostrar a comissão ao
-- publicar um trabalho, no futuro)
create policy "Configurações são visíveis publicamente"
  on public.platform_settings for select
  using (true);

-- Só admins podem alterar
create policy "Admins podem criar configurações"
  on public.platform_settings for insert
  with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "Admins podem editar configurações"
  on public.platform_settings for update
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- Valores por defeito (não substitui se já existirem)
insert into public.platform_settings (key, value) values
  ('nome_plataforma', 'KaziGo'),
  ('descricao_plataforma', 'A plataforma que conecta profissionais, trabalhadores, freelancers, empresas e clientes em Moçambique.'),
  ('email_suporte', 'suporte@kazigo.co.mz'),
  ('telefone_suporte', ''),
  ('comissao_percentagem', '10'),
  ('regras_publicacao', 'O trabalho deve ter uma descrição clara, orçamento realista e cumprir a lei moçambicana.'),
  ('regras_candidatura', 'As candidaturas devem ser sérias e relevantes para o trabalho publicado.')
on conflict (key) do nothing;

-- ============================================================
-- Fim. Confirma em Table Editor → platform_settings → 7 linhas
-- ============================================================
