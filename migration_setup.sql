-- Tabela para armazenar Leads (Lista de Espera)
create table if not exists public.leads (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  email text not null
);

-- Habilitar RLS (Row Level Security)
alter table public.leads enable row level security;

-- Política: Qualquer pessoa (anon) pode INSERIR dados na lista de espera
create policy "Enable insert for everyone" on public.leads
  for insert with check (true);

-- Política: Apenas o admin (service_role) pode VER os dados (segurança)
-- Isso impede que alguém acesse a lista de nomes via API
create policy "Enable select for service_role only" on public.leads
  for select using (auth.role() = 'service_role');


-- Tabela para armazenar Conteúdo do Site (CMS)
create table if not exists public.site_content (
  id text not null primary key, -- Usaremos 'main_content' como ID único
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  content jsonb not null
);

-- Habilitar RLS
alter table public.site_content enable row level security;

-- Política: Qualquer pessoa pode LER o conteúdo do site
create policy "Enable read access for all users" on public.site_content
  for select using (true);

-- Política: Apenas usuários autenticados (ou com senha no app logic) podem ATUALIZAR
-- Como estamos sem Auth completa por enquanto, vamos permitir update público TEMPORARIAMENTE
-- SÓ USE ISSO SE TIVER PROTEÇÃO DE SENHA NO FRONT-END que valida antes de chamar
-- Idealmente: conectar com Supabase Auth. Por enquanto, para manter simples:
create policy "Enable update for all users" on public.site_content
  for update using (true) with check (true);

-- Inserir conteúdo inicial (se não existir)
insert into public.site_content (id, content)
values ('main_content', '{}'::jsonb)
on conflict (id) do nothing;
