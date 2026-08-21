-- ============================================================
-- KaziGo — Storage de avatars + campo whatsapp
-- Corre este ficheiro completo no Supabase: SQL Editor → New query → Run
-- (Não apaga nem altera nada que já existe — só adiciona)
-- ============================================================

-- Novo campo: whatsapp (telefone já existe na tabela profiles)
alter table public.profiles
  add column if not exists whatsapp text;

-- ============================================================
-- Bucket de Storage para fotos de perfil
-- ============================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  3145728, -- 3MB
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

-- Qualquer pessoa pode VER os avatars (necessário para aparecerem no site)
create policy "Avatars são visíveis publicamente"
  on storage.objects for select
  using (bucket_id = 'avatars');

-- Um utilizador só pode enviar ficheiros dentro da sua própria pasta
-- (a pasta é o próprio user id, ex: avatars/<user_id>/foto.jpg)
create policy "Utilizadores podem enviar o próprio avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Utilizadores podem atualizar o próprio avatar"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Utilizadores podem apagar o próprio avatar"
  on storage.objects for delete
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ============================================================
-- Fim. Depois de correr isto, confirma em:
-- Storage → deves ver um bucket chamado "avatars" (público)
-- Table Editor → profiles → deve ter uma nova coluna "whatsapp"
-- ============================================================
