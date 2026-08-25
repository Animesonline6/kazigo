-- ============================================================
-- KaziGo — Contas com papel duplo (cliente + trabalhador)
-- Corre no Supabase: SQL Editor → New query → cola tudo → Run
-- ============================================================

-- Permite que qualquer utilizador crie o seu próprio registo em
-- worker_profiles, mesmo que a conta não tenha sido criada
-- originalmente como "worker" (necessário para contas que também
-- querem candidatar-se a trabalhos e receber avaliações como
-- trabalhador).
drop policy if exists "Utilizadores podem criar o próprio worker_profile" on public.worker_profiles;

create policy "Utilizadores podem criar o próprio worker_profile"
  on public.worker_profiles for insert
  with check (auth.uid() = id);

-- Preenche o registo em falta para contas já existentes que ainda
-- não têm worker_profiles (ex: contas client/company)
insert into public.worker_profiles (id)
select p.id from public.profiles p
where not exists (select 1 from public.worker_profiles w where w.id = p.id)
on conflict (id) do nothing;

-- ============================================================
-- Fim.
-- ============================================================
