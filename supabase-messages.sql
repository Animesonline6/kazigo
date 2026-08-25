-- ============================================================
-- KaziGo — Mensagens reais
-- Corre no Supabase: SQL Editor → New query → cola tudo → Run
-- ============================================================

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_a uuid not null references public.profiles(id) on delete cascade,
  user_b uuid not null references public.profiles(id) on delete cascade,
  job_id uuid references public.jobs(id) on delete set null,
  last_message_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint different_users check (user_a <> user_b),
  constraint ordered_pair check (user_a < user_b),
  unique (user_a, user_b)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.conversations enable row level security;
alter table public.messages enable row level security;

-- CONVERSAS: só os dois participantes veem/criam
create policy "Participantes veem as próprias conversas"
  on public.conversations for select
  using (auth.uid() = user_a or auth.uid() = user_b);

create policy "Utilizadores podem iniciar conversas"
  on public.conversations for insert
  with check (auth.uid() = user_a or auth.uid() = user_b);

-- MENSAGENS: só participantes da conversa veem/enviam/marcam como lidas
create policy "Participantes veem as mensagens da própria conversa"
  on public.messages for select
  using (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id and (c.user_a = auth.uid() or c.user_b = auth.uid())
    )
  );

create policy "Participantes podem enviar mensagens"
  on public.messages for insert
  with check (
    auth.uid() = sender_id
    and exists (
      select 1 from public.conversations c
      where c.id = conversation_id and (c.user_a = auth.uid() or c.user_b = auth.uid())
    )
  );

create policy "Participantes podem marcar mensagens como lidas"
  on public.messages for update
  using (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id and (c.user_a = auth.uid() or c.user_b = auth.uid())
    )
  );

-- Atualiza last_message_at na conversa sempre que chega mensagem nova
-- (para ordenar a lista de conversas pela mais recente)
create or replace function public.touch_conversation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.conversations set last_message_at = new.created_at where id = new.conversation_id;
  return new;
end;
$$;

drop trigger if exists on_message_insert on public.messages;
create trigger on_message_insert
  after insert on public.messages
  for each row execute function public.touch_conversation();

create index if not exists messages_conversation_id_idx on public.messages (conversation_id, created_at);
create index if not exists conversations_user_a_idx on public.conversations (user_a);
create index if not exists conversations_user_b_idx on public.conversations (user_b);

-- ============================================================
-- Fim. Confirma em Table Editor → conversations e messages
-- ============================================================
