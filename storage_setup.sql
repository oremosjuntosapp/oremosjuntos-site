-- Criar um bucket público chamado 'images' para upload
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

-- Política 1: Permitir que qualquer pessoa vejas as imagens (Leitura Pública)
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'images' );

-- Política 2: Permitir Upload (Inserção) para qualquer um (já que a validação de senha é no front)
-- Nota: Em produção real, validariamos o usuário autenticado.
create policy "Allow Uploads"
  on storage.objects for insert
  with check ( bucket_id = 'images' );

-- Política 3: Permitir Atualizar/Deletar (para remover imagens antigas se necessário)
create policy "Allow Updates"
  on storage.objects for update
  using ( bucket_id = 'images' );
