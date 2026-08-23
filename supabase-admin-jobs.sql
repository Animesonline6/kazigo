-- ============================================================
-- KaziGo — Permitir que admins giram trabalhos de qualquer conta
-- Corre no Supabase: SQL Editor → New query → cola tudo → Run
-- ============================================================

create policy "Admins podem atualizar qualquer trabalho"
  on public.jobs for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );
