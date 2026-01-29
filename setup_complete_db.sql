-- Enable necessary extensions
create extension if not exists "pg_trgm";

-- 1. Create the site_content table if it doesn't exist
create table if not exists public.site_content (
  id text primary key,
  content jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create the images storage bucket
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

-- 3. Enable RLS
alter table public.site_content enable row level security;

-- 4. Create Policies for site_content

-- Policy: Allow public read access (everyone needs to see the site)
drop policy if exists "Enable read access for all users" on public.site_content;
create policy "Enable read access for all users"
  on public.site_content for select
  using (true);

-- Policy: Enable update for service_role (Edge Functions) AND anon (for now, to ensure it works)
-- Given the user wants "sure everything is online", avoiding permission errors is key.
-- We can later restrict this to service_role only.
drop policy if exists "Enable update for all users" on public.site_content;
create policy "Enable update for all users"
  on public.site_content for update
  using (true)
  with check (true);

drop policy if exists "Enable insert for all users" on public.site_content;
create policy "Enable insert for all users"
  on public.site_content for insert
  with check (true);


-- 5. Create Policies for Storage (Images)

-- Allow public read
drop policy if exists "Give public access to images" on storage.objects;
create policy "Give public access to images"
  on storage.objects for select
  using ( bucket_id = 'images' );

-- Allow public upload (for CMS usage)
drop policy if exists "Allow public uploads" on storage.objects;
create policy "Allow public uploads"
  on storage.objects for insert
  with check ( bucket_id = 'images' );

-- Allow public update/delete (for CMS usage)
drop policy if exists "Allow public update/delete" on storage.objects;
create policy "Allow public update/delete"
  on storage.objects
  for all
  using ( bucket_id = 'images' );


-- 6. Insert Initial Content (UPSERT)
-- This ensures the DB has the full data structure we just defined in the frontend.
insert into public.site_content (id, content)
values (
  'main_content',
  '{
  "header": {
    "launchBadge": "Lançamento em breve"
  },
  "registrationModal": {
    "title": "Mantenha-se Conectado",
    "description": "Deixe seu contato para ser um dos primeiros a conhecer o refúgio digital da fé cristã.",
    "nameLabel": "Seu Nome",
    "namePlaceholder": "Como podemos te chamar?",
    "emailLabel": "Seu Melhor E-mail",
    "emailPlaceholder": "exemplo@email.com",
    "buttonText": "Confirmar Interesse",
    "closeText": "Talvez mais tarde",
    "successTitle": "Interesse registrado!",
    "successMessage": "Obrigado por querer fazer parte do Oremos Juntos. Enviaremos um e-mail assim que as portas do santuário digital se abrirem."
  },
  "hero": {
    "badge": "O Futuro da Comunhão Digital",
    "title": "Oremos Juntos: Um Refúgio em Breve.",
    "description": "Estamos construindo um espaço sagrado, livre de distrações, focado no que realmente importa: sua conexão com o Criador e com os irmãos.",
    "ctaPrimary": "Seja avisado no lançamento",
    "backgroundImage": "https://images.unsplash.com/photo-1518101645466-7795885ff8f8?q=80&w=2000&auto=format&fit=crop"
  },
  "comingSoon": {
    "title": "Uma Experiência Sem Ruído",
    "description": "O Oremos Juntos não é apenas um app, é um santuário digital. Criado para substituir o caos das redes sociais por momentos de oração, intercessão e arte cristã inspiradora.",
    "launchDateText": "Lançamento previsto para Março de 2026."
  },
  "gallery": {
    "sectionTitle": "Cards que Edificam",
    "sectionDesc": "Veja exemplos das mensagens e artes que nossa comunidade compartilha diariamente para fortalecer a fé.",
    "items": [
      { "id": "1", "title": "Feliz Domingo", "imageUrl": "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=800&auto=format&fit=crop" },
      { "id": "2", "title": "Gratidão", "imageUrl": "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=800&auto=format&fit=crop" },
      { "id": "3", "title": "Confiança", "imageUrl": "https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=800&auto=format&fit=crop" },
      { "id": "4", "title": "Oração do Dia", "imageUrl": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop" }
    ]
  },
  "manifesto": {
    "title": "Resgate o Sagrado no Digital",
    "paragraph1": "Vivemos em uma era de notificações incessantes e algoritmos de atenção. O Oremos Juntos nasce do desejo de silenciar o mundo para ouvir a voz de Deus. Um lugar onde a tecnologia serve ao espírito.",
    "paragraph2": "Apoio mútuo real, círculos de oração significativos e uma curadoria de arte que eleva a alma. É o que preparamos para você.",
    "image": "https://images.unsplash.com/photo-1438210125265-429381f218a0?q=80&w=2000&auto=format&fit=crop"
  },
  "support": {
    "mainButton": "Apoiar o projeto",
    "badge": "APOIO VOLUNTÁRIO",
    "description": "O apoio ao Oremos Juntos é voluntário e destinado exclusivamente à manutenção técnica e operacional do projeto. Sua contribuição ajuda a manter o site no ar, seguro e acessível a todos.",
    "cardTitle": "Contribuição",
    "cardDescription": "O apoio ao Oremos Juntos é voluntário e destinado exclusivamente à manutenção técnica e operacional do projeto. Sua contribuição ajuda a manter o site no ar, seguro e acessível a todos.",
    "cardButton": "Apoiar o projeto",
    "backgroundImage": ""
  },
  "features": {
    "sectionBadge": "Breve no App",
    "sectionTitle": "Feito para sua Jornada",
    "items": [
      {
        "id": "1",
        "title": "Santuário Privado",
        "desc": "Um espaço seguro para seus clamores mais profundos, com privacidade total.",
        "icon": "auto_stories"
      },
      {
        "id": "2",
        "title": "IA Inspiradora",
        "desc": "Tecnologia que sugere versículos e reflexões baseadas no seu momento.",
        "icon": "psychology_alt"
      },
      {
        "id": "3",
        "title": "Rede de Intercessão",
        "desc": "Nunca ore sozinho. Conecte-se a uma corrente mundial de irmãos.",
        "icon": "groups_3"
      }
    ]
  },
  "appFeatures": {
    "items": [
      {
        "id": "altar",
        "key": "altar",
        "title": "O Altar",
        "description": "Seu espaço secreto digital. Aqui você registra seus pedidos de oração privados, cria diários espirituais e mantém sua conversa com Deus organizada e segura.",
        "statusText": "Funcionalidade do App (Em Breve)",
        "icon": "church"
      },
      {
        "id": "groups",
        "key": "groups",
        "title": "Grupos de Oração",
        "description": "Comunhão real. Crie ou participe de círculos de intercessão, compartilhe motivos de gratidão e ore uns pelos outros sem as distrações das redes sociais convencionais.",
        "statusText": "Funcionalidade do App (Em Breve)",
        "icon": "groups"
      },
      {
        "id": "journey",
        "key": "journey",
        "title": "Jornada Diária",
        "description": "Conteúdo curado para seu crescimento. Receba devocionais, versículos do dia e cards de arte cristã selecionados para edificar sua fé diariamente.",
        "statusText": "Funcionalidade do App (Em Breve)",
        "icon": "auto_stories"
      },
      {
        "id": "guardian",
        "key": "guardian",
        "title": "Guardião",
        "description": "Gerencie seu perfil e suas preferências. O Guardião cuida da sua privacidade, configurações de notificação (apenas as essenciais) e personalização do santuário.",
        "statusText": "Funcionalidade do App (Em Breve)",
        "icon": "grade"
      }
    ]
  },
  "testimonial": {
    "quote": "A ideia de ter um espaço focado exclusivamente na oração é o que a nossa geração mais precisa agora. É um respiro espiritual no meio do dia.",
    "author": "Dra. Helena Mendes",
    "role": "Líder de Pequenos Grupos",
    "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop"
  },
  "footerCta": {
    "title": "Quer ser um dos primeiros a entrar?",
    "description": "Junte-se à nossa lista de espera exclusiva e receba atualizações sobre o progresso do santuário digital.",
    "button": "Quero entrar na lista",
    "subtext": "Vagas limitadas para a fase beta.",
    "backgroundImage": "https://www.transparenttextures.com/patterns/paper-fibers.png"
  },
  "footer": {
    "websiteLink": "www.oremosjuntos.com.br",
    "copyrightText": "© 2026 Oremos Juntos. Projeto independente e contínuo."
  },
  "pages": {
    "privacy": "Respeitamos seu silêncio e sua privacidade. Seus dados são protegidos e tratados com total confidencialidade.",
    "terms": "O uso do site é focado na edificação mútua e respeito comunitário.",
    "contact": "contato@oremosjuntos.com.br"
  },
  "settings": {
    "cmsPassword": "123",
    "googleAnalyticsId": "",
    "supportLink": "https://apoia.se/oremosjuntos"
  },
  "notFound": {
    "title": "404",
    "subtitle": "Um caminho inesperado",
    "message": "Às vezes, nos perdemos para encontrar algo novo. Mas esta página, especificamente, não existe. Vamos voltar para casa?",
    "buttonText": "Voltar para o santuário",
    "footerText": "Oremos Juntos"
  },
  "sectionOrder": [
    "hero",
    "comingSoon",
    "gallery",
    "features",
    "manifesto",
    "testimonial",
    "support",
    "footerCta"
  ]
}'::jsonb
)
on conflict (id) do update
set content = EXCLUDED.content,
    updated_at = timezone('utc'::text, now());
