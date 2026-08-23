-- ============================================================
-- KaziGo — Tabela de categorias (gestão real via admin)
-- Corre no Supabase: SQL Editor → New query → cola tudo → Run
-- ============================================================

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;

-- Qualquer pessoa pode ver as categorias (necessário para o
-- formulário de publicar trabalho e páginas públicas)
create policy "Categorias são visíveis publicamente"
  on public.categories for select
  using (true);

-- Só admins podem criar/editar/apagar categorias
create policy "Admins podem criar categorias"
  on public.categories for insert
  with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "Admins podem editar categorias"
  on public.categories for update
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "Admins podem apagar categorias"
  on public.categories for delete
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- Semear com as categorias que já existiam fixas no código, para
-- não quebrar nenhum trabalho já publicado com esses nomes
insert into public.categories (name, slug) values
  ('Construção & Reparações', 'construcao-reparacoes'),
  ('Design & Criação', 'design-criacao'),
  ('Tecnologia & Programação', 'tecnologia-programacao'),
  ('Transporte & Entregas', 'transporte-entregas'),
  ('Educação & Explicações', 'educacao-explicacoes'),
  ('Beleza & Bem-estar', 'beleza-bem-estar'),
  ('Eventos & Catering', 'eventos-catering'),
  ('Limpeza & Doméstico', 'limpeza-domestico'),
  ('Contabilidade & Negócios', 'contabilidade-negocios'),
  ('Agricultura', 'agricultura')
on conflict (name) do nothing;

-- ============================================================
-- Fim. Confirma em Table Editor → categories → deve ter 10 linhas
-- ============================================================
