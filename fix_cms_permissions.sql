-- Correção de Permissões para o CMS

-- 1. Permitir que o frontend crie o registro se ele não existir (INSERT)
-- O script anterior só permitia UPDATE, o que falha se a tabela estiver vazia.
create policy "Enable insert for all users" on public.site_content
  for insert with check (true);

-- 2. Garantir que o registro inicial exista preenchido
-- Se o id 'main_content' ainda não existir, cria ele.
insert into public.site_content (id, content)
values ('main_content', '{}'::jsonb)
on conflict (id) do nothing;
