-- ============================================================
-- KaziGo — Sistema de avaliações
-- Corre no Supabase: SQL Editor → New query → cola tudo → Run
-- ============================================================

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  reviewed_id uuid not null references public.profiles(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  unique (job_id, author_id, reviewed_id)
);

alter table public.reviews enable row level security;

-- Avaliações são públicas (aparecem no perfil de quem foi avaliado)
create policy "Avaliações são visíveis publicamente"
  on public.reviews for select
  using (true);

-- Só pode avaliar quem participou no trabalho (cliente dono OU
-- trabalhador com candidatura aceite nesse trabalho), e o trabalho
-- tem de estar concluído
create policy "Participantes podem avaliar trabalhos concluídos"
  on public.reviews for insert
  with check (
    auth.uid() = author_id
    and exists (
      select 1 from public.jobs j
      where j.id = job_id
        and j.status = 'concluido'
        and (
          j.client_id = auth.uid()
          or exists (
            select 1 from public.job_applications ja
            where ja.job_id = j.id and ja.worker_id = auth.uid() and ja.status = 'aceite'
          )
        )
    )
  );

-- Admins podem remover avaliações inadequadas
create policy "Admins podem apagar avaliações"
  on public.reviews for delete
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- ============================================================
-- Recalcula rating/reviews_count em worker_profiles sempre que
-- uma avaliação é criada ou apagada
-- ============================================================
create or replace function public.recalculate_worker_rating()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target_id uuid;
begin
  target_id := coalesce(new.reviewed_id, old.reviewed_id);

  update public.worker_profiles
  set
    rating = coalesce((select avg(rating)::numeric(3,2) from public.reviews where reviewed_id = target_id), 0),
    reviews_count = (select count(*) from public.reviews where reviewed_id = target_id)
  where id = target_id;

  return coalesce(new, old);
end;
$$;

drop trigger if exists on_review_change on public.reviews;
create trigger on_review_change
  after insert or delete on public.reviews
  for each row execute function public.recalculate_worker_rating();

-- ============================================================
-- Fim. Confirma em Table Editor → reviews → tabela criada
-- ============================================================
