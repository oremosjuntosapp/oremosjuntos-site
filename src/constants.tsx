
import { CMSContent } from './types';

export const INITIAL_CONTENT: CMSContent = {
  header: {
    launchBadge: "Lançamento em breve"
  },
  registrationModal: {
    title: "Mantenha-se Conectado",
    description: "Deixe seu contato para ser um dos primeiros a conhecer o refúgio digital da fé cristã.",
    nameLabel: "Seu Nome",
    namePlaceholder: "Como podemos te chamar?",
    emailLabel: "Seu Melhor E-mail",
    emailPlaceholder: "exemplo@email.com",
    buttonText: "Confirmar Interesse",
    closeText: "Talvez mais tarde",
    successTitle: "Interesse registrado!",
    successMessage: "Obrigado por querer fazer parte do Oremos Juntos. Enviaremos um e-mail assim que as portas do santuário digital se abrirem."
  },
  hero: {
    visible: true,
    badge: "O Futuro da Comunhão Digital",
    title: "Oremos Juntos: Um Refúgio em Breve.",
    description: "Estamos construindo um espaço sagrado, livre de distrações, focado no que realmente importa: sua conexão com o Criador e com os irmãos.",
    ctaPrimary: "Seja avisado no lançamento",
    backgroundImage: "https://images.unsplash.com/photo-1518101645466-7795885ff8f8?q=80&w=2000&auto=format&fit=crop"
  },
  comingSoon: {
    visible: true,
    title: "Uma Experiência Sem Ruído",
    description: "O Oremos Juntos não é apenas um app, é um santuário digital. Criado para substituir o caos das redes sociais por momentos de oração, intercessão e arte cristã inspiradora.",
    launchDateText: "Lançamento previsto para Março de 2026."
  },
  gallery: {
    visible: true,
    sectionTitle: "Cards que Edificam",
    sectionDesc: "Veja exemplos das mensagens e artes que nossa comunidade compartilha diariamente para fortalecer a fé.",
    items: [
      { id: '1', title: 'Feliz Domingo', imageUrl: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=800&auto=format&fit=crop' },
      { id: '2', title: 'Gratidão', imageUrl: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=800&auto=format&fit=crop' },
      { id: '3', title: 'Confiança', imageUrl: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=800&auto=format&fit=crop' },
      { id: '4', title: 'Oração do Dia', imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop' }
    ]
  },
  manifesto: {
    visible: true,
    title: "Resgate o Sagrado no Digital",
    paragraph1: "Vivemos em uma era de notificações incessantes e algoritmos de atenção. O Oremos Juntos nasce do desejo de silenciar o mundo para ouvir a voz de Deus. Um lugar onde a tecnologia serve ao espírito.",
    paragraph2: "Apoio mútuo real, círculos de oração significativos e uma curadoria de arte que eleva a alma. É o que preparamos para você.",
    image: "https://images.unsplash.com/photo-1438210125265-429381f218a0?q=80&w=2000&auto=format&fit=crop"
  },
  support: {
    visible: true,
    mainButton: "Apoiar o projeto",
    badge: "APOIO VOLUNTÁRIO",
    description: "O apoio ao Oremos Juntos é voluntário e destinado exclusivamente à manutenção técnica e operacional do projeto. Sua contribuição ajuda a manter o site no ar, seguro e acessível a todos.",
    cardTitle: "Contribuição",
    cardDescription: "O apoio ao Oremos Juntos é voluntário e destinado exclusivamente à manutenção técnica e operacional do projeto. Sua contribuição ajuda a manter o site no ar, seguro e acessível a todos.",
    cardButton: "Apoiar o projeto",
    backgroundImage: ""
  },
  features: {
    visible: true,
    sectionBadge: "Breve no App",
    sectionTitle: "Feito para sua Jornada",
    items: [
      {
        id: '1',
        title: "Santuário Privado",
        desc: "Um espaço seguro para seus clamores mais profundos, com privacidade total.",
        icon: "auto_stories"
      },
      {
        id: '2',
        title: "IA Inspiradora",
        desc: "Tecnologia que sugere versículos e reflexões baseadas no seu momento.",
        icon: "psychology_alt"
      },
      {
        id: '3',
        title: "Rede de Intercessão",
        desc: "Nunca ore sozinho. Conecte-se a uma corrente mundial de irmãos.",
        icon: "groups_3"
      }
    ]
  },
  appFeatures: {
    visible: true,
    items: [
      {
        id: 'altar',
        key: 'altar',
        title: "O Altar",
        description: "Seu espaço seguro digital. Aqui você registra seus pedidos de oração privados, cria diários espirituais e mantém sua conversa com Deus organizada e segura.",
        statusText: "Funcionalidade do App (Em Breve)",
        icon: "church"
      },
      {
        id: 'groups',
        key: 'groups',
        title: "Grupos de Oração",
        description: "Comunhão real. Crie ou participe de círculos de intercessão, compartilhe motivos de gratidão e ore uns pelos outros sem as distrações das redes sociais convencionais.",
        statusText: "Funcionalidade do App (Em Breve)",
        icon: "groups"
      },
      {
        id: 'journey',
        key: 'journey',
        title: "Jornada Diária",
        description: "Conteúdo curado para seu crescimento. Receba devocionais, versículos do dia e cards de arte cristã selecionados para edificar sua fé diariamente.",
        statusText: "Funcionalidade do App (Em Breve)",
        icon: "auto_stories"
      },
      {
        id: 'guardian',
        key: 'guardian',
        title: "Guardião",
        description: "Gerencie seu perfil e suas preferências. O Guardião cuida da sua privacidade, configurações de notificação (apenas as essenciais) e personalização do santuário.",
        statusText: "Funcionalidade do App (Em Breve)",
        icon: "grade"
      }
    ]
  },
  testimonial: {
    visible: true,
    quote: "A ideia de ter um espaço focado exclusivamente na oração é o que a nossa geração mais precisa agora. É um respiro espiritual no meio do dia.",
    author: "Dra. Helena Mendes",
    role: "Líder de Pequenos Grupos",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop"
  },
  footerCta: {
    visible: true,
    title: "Quer ser um dos primeiros a entrar?",
    description: "Junte-se à nossa lista de espera exclusiva e receba atualizações sobre o progresso do santuário digital.",
    button: "Quero entrar na lista",
    subtext: "Vagas limitadas para a fase beta.",
    backgroundImage: "https://www.transparenttextures.com/patterns/paper-fibers.png"
  },
  footer: {
    visible: true,
    websiteLink: "www.oremosjuntos.com.br",
    copyrightText: "© 2026 Oremos Juntos. Projeto independente e contínuo."
  },
  pages: {
    privacy: "Respeitamos seu silêncio e sua privacidade. Seus dados são protegidos e tratados com total confidencialidade.",
    terms: "O uso do site é focado na edificação mútua e respeito comunitário.",
    contact: "contato@oremosjuntos.com.br"
  },
  settings: {
    cmsPassword: "123",
    googleAnalyticsId: "",
    supportLink: "https://apoia.se/oremosjuntos"
  },
  notFound: {
    title: "404",
    subtitle: "Um caminho inesperado",
    message: "Às vezes, nos perdemos para encontrar algo novo. Mas esta página, especificamente, não existe. Vamos voltar para casa?",
    buttonText: "Voltar para o santuário",
    footerText: "Oremos Juntos"
  },
  sectionOrder: [
    'hero',
    'comingSoon',
    'gallery',
    'appShowcase',
    'features',
    'manifesto',
    'testimonial',
    'support',
    'footerCta'
  ],
  appShowcase: {
    visible: true,
    title: "O App que te conecta ao céu",
    description: "Cada detalhe da interface foi pensado para criar foco, tranquilidade e reverência. Conheça as telas que farão parte do seu dia a dia.",
    videoUrl: "",
    screenImage: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1000&auto=format&fit=crop",
    badges: true
  }
};
