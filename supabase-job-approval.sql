-- ============================================================
-- KaziGo — Moderação de trabalhos antes de publicar
-- Corre no Supabase: SQL Editor → New query → cola tudo → Run
-- ============================================================

-- Adiciona a coluna com valor "aprovado" por defeito, para que
-- TODOS os trabalhos já existentes continuem visíveis exatamente
-- como estavam (não desaparecem nem ficam pendentes).
alter table public.jobs
  add column if not exists approval_status text not null default 'aprovado'
  check (approval_status in ('pendente', 'aprovado', 'rejeitado'));

-- A partir de agora, qualquer trabalho NOVO fica "pendente" até um
-- admin aprovar — só isto muda o comportamento futuro, sem afetar
-- os trabalhos que já estavam publicados.
alter table public.jobs
  alter column approval_status set default 'pendente';

-- ============================================================
-- Fim. Confirma em Table Editor → jobs → nova coluna
-- approval_status, todos os trabalhos existentes com "aprovado"
-- ============================================================
