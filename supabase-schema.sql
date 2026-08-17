-- ============================================================
-- KaziGo — Esquema de Autenticação e Perfis
-- Corre este ficheiro completo no Supabase: SQL Editor → New query → Run
-- ============================================================

-- Tipo de utilizador
create type user_role as enum ('worker', 'client', 'company', 'admin');

-- ============================================================
-- Tabela: profiles (dados comuns a todos os utilizadores)
-- Ligada 1-para-1 com auth.users (criada automaticamente no registo)
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  avatar_url text,
  role user_role not null default 'client',
  phone text,
  city text,
  bio text,
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Qualquer pessoa autenticada pode ver perfis (necessário para marketplace público)
create policy "Perfis são visíveis publicamente"
  on public.profiles for select
  using (true);

-- Só o próprio utilizador pode editar o seu perfil
create policy "Utilizadores podem editar o próprio perfil"
  on public.profiles for update
  using (auth.uid() = id);

-- ============================================================
-- Tabela: worker_profiles (dados específicos de trabalhadores)
-- ============================================================
create table public.worker_profiles (
  id uuid primary key references public.profiles(id) on delete cascade,
  headline text,
  skills text[] default '{}',
  hourly_rate numeric,
  completed_jobs integer not null default 0,
  rating numeric(2,1) default 0,
  reviews_count integer not null default 0,
  available boolean not null default true
);

alter table public.worker_profiles enable row level security;

create policy "Perfis de trabalhador são visíveis publicamente"
  on public.worker_profiles for select
  using (true);

create policy "Trabalhadores podem editar o próprio perfil"
  on public.worker_profiles for all
  using (auth.uid() = id);

-- ============================================================
-- Tabela: client_profiles (dados específicos de clientes)
-- ============================================================
create table public.client_profiles (
  id uuid primary key references public.profiles(id) on delete cascade,
  jobs_posted integer not null default 0
);

alter table public.client_profiles enable row level security;

create policy "Perfis de cliente são visíveis publicamente"
  on public.client_profiles for select
  using (true);

create policy "Clientes podem editar o próprio perfil"
  on public.client_profiles for all
  using (auth.uid() = id);

-- ============================================================
-- Tabela: companies (dados específicos de empresas)
-- ============================================================
create table public.companies (
  id uuid primary key references public.profiles(id) on delete cascade,
  company_name text not null,
  nuit text,
  sector text,
  employees_range text
);

alter table public.companies enable row level security;

create policy "Empresas são visíveis publicamente"
  on public.companies for select
  using (true);

create policy "Empresas podem editar o próprio perfil"
  on public.companies for all
  using (auth.uid() = id);

-- ============================================================
-- Trigger: cria automaticamente um "profile" quando alguém regista
-- Lê o "role" escolhido no registo a partir de metadata (raw_user_meta_data)
-- ============================================================
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'client')
  );

  -- Cria também a linha específica consoante o papel escolhido
  if coalesce(new.raw_user_meta_data->>'role', 'client') = 'worker' then
    insert into public.worker_profiles (id) values (new.id);
  elsif coalesce(new.raw_user_meta_data->>'role', 'client') = 'company' then
    insert into public.companies (id, company_name) values (new.id, coalesce(new.raw_user_meta_data->>'full_name', 'Empresa'));
  else
    insert into public.client_profiles (id) values (new.id);
  end if;

  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- Fim do esquema. Depois de correr isto, confirma em:
-- Table Editor → deves ver: profiles, worker_profiles, client_profiles, companies
-- ============================================================
