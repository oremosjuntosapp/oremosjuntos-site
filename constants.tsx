
import { CMSContent } from './types';

export const INITIAL_CONTENT: CMSContent = {
  hero: {
    badge: "O Futuro da Comunhão Digital",
    title: "Oremos Juntos: Um Refúgio em Breve.",
    description: "Estamos construindo um espaço sagrado, livre de distrações, focado no que realmente importa: sua conexão com o Criador e com os irmãos.",
    ctaPrimary: "Seja avisado no lançamento",
    backgroundImage: "https://images.unsplash.com/photo-1518101645466-7795885ff8f8?q=80&w=2000&auto=format&fit=crop"
  },
  comingSoon: {
    title: "Uma Experiência Sem Ruído",
    description: "O Oremos Juntos não é apenas um app, é um santuário digital. Criado para substituir o caos das redes sociais por momentos de oração, intercessão e arte cristã inspiradora.",
    launchDateText: "Lançamento previsto para Março de 2026."
  },
  gallery: {
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
    title: "Resgate o Sagrado no Digital",
    paragraph1: "Vivemos em uma era de notificações incessantes e algoritmos de atenção. O Oremos Juntos nasce do desejo de silenciar o mundo para ouvir a voz de Deus. Um lugar onde a tecnologia serve ao espírito.",
    paragraph2: "Apoio mútuo real, círculos de oração significativos e uma curadoria de arte que eleva a alma. É o que preparamos para você.",
    image: "https://images.unsplash.com/photo-1438210125265-429381f218a0?q=80&w=2000&auto=format&fit=crop"
  },
  support: {
    mainButton: "Apoiar o projeto",
    badge: "APOIO VOLUNTÁRIO",
    description: "O apoio ao Oremos Juntos é voluntário e destinado exclusivamente à manutenção técnica e operacional do projeto. Sua contribuição ajuda a manter o site no ar, seguro e acessível a todos.",
    cardTitle: "Contribuição",
    cardDescription: "O apoio ao Oremos Juntos é voluntário e destinado exclusivamente à manutenção técnica e operacional do projeto. Sua contribuição ajuda a manter o site no ar, seguro e acessível a todos.",
    cardButton: "Apoiar o projeto",
    backgroundImage: ""
  },
  features: {
    sectionBadge: "Breve no App",
    sectionTitle: "Feito para sua Jornada",
    feature1: {
      title: "Santuário Privado",
      desc: "Um espaço seguro para seus clamores mais profundos, com privacidade total.",
      icon: "auto_stories"
    },
    feature2: {
      title: "IA Inspiradora",
      desc: "Tecnologia que sugere versículos e reflexões baseadas no seu momento.",
      icon: "psychology_alt"
    },
    feature3: {
      title: "Rede de Intercessão",
      desc: "Nunca ore sozinho. Conecte-se a uma corrente mundial de irmãos.",
      icon: "groups_3"
    }
  },
  appFeatures: {
    altar: {
      title: "O Altar",
      description: "Seu espaço secreto digital. Aqui você registra seus pedidos de oração privados, cria diários espirituais e mantém sua conversa com Deus organizada e segura.",
      statusText: "Funcionalidade do App (Em Breve)"
    },
    groups: {
      title: "Grupos de Oração",
      description: "Comunhão real. Crie ou participe de círculos de intercessão, compartilhe motivos de gratidão e ore uns pelos outros sem as distrações das redes sociais convencionais.",
      statusText: "Funcionalidade do App (Em Breve)"
    },
    journey: {
      title: "Jornada Diária",
      description: "Conteúdo curado para seu crescimento. Receba devocionais, versículos do dia e cards de arte cristã selecionados para edificar sua fé diariamente.",
      statusText: "Funcionalidade do App (Em Breve)"
    },
    guardian: {
      title: "Guardião",
      description: "Gerencie seu perfil e suas preferências. O Guardião cuida da sua privacidade, configurações de notificação (apenas as essenciais) e personalização do santuário.",
      statusText: "Funcionalidade do App (Em Breve)"
    }
  },
  testimonial: {
    quote: "A ideia de ter um espaço focado exclusivamente na oração é o que a nossa geração mais precisa agora. É um respiro espiritual no meio do dia.",
    author: "Dra. Helena Mendes",
    role: "Líder de Pequenos Grupos",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop"
  },
  footerCta: {
    title: "Quer ser um dos primeiros a entrar?",
    description: "Junte-se à nossa lista de espera exclusiva e receba atualizações sobre o progresso do santuário digital.",
    button: "Quero entrar na lista",
    subtext: "Vagas limitadas para a fase beta.",
    backgroundImage: "https://www.transparenttextures.com/patterns/paper-fibers.png"
  },
  footer: {
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
  }
};
