
export interface FaithCardExample {
  id: string;
  imageUrl: string;
  title: string;
  footerText?: string;
}

export interface FeatureItem {
  id: string;
  title: string;
  desc: string;
  icon: string;
}

export interface AppFeatureItem {
  id: string;
  key: string; // Used for icon mapping or internal ref if needed
  title: string;
  description: string;
  statusText: string;
  icon: string; // moved icon here for full dynamic support
}

export interface CMSContent {
  header: {
    launchBadge: string;
  };
  registrationModal: {
    title: string;
    description: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    buttonText: string;
    closeText: string;
    successTitle: string;
    successMessage: string;
  };
  hero: {
    visible: boolean;
    badge: string;
    title: string;
    description: string;
    ctaPrimary: string;
    backgroundImage: string;
  };
  comingSoon: {
    visible: boolean;
    title: string;
    description: string;
    launchDateText: string;
  };
  gallery: {
    visible: boolean;
    sectionTitle: string;
    sectionDesc: string;
    items: FaithCardExample[];
  };
  manifesto: {
    visible: boolean;
    title: string;
    paragraph1: string;
    paragraph2: string;
    image: string;
  };
  support: {
    visible: boolean;
    mainButton: string;
    badge: string;
    description: string;
    cardTitle: string;
    cardDescription: string;
    cardButton: string;
    backgroundImage: string;
  };
  features: {
    visible: boolean;
    sectionBadge: string;
    sectionTitle: string;
    items: FeatureItem[];
  };
  appFeatures: {
    visible: boolean;
    items: AppFeatureItem[];
  };
  testimonial: {
    visible: boolean;
    quote: string;
    author: string;
    role: string;
    avatar: string;
  };
  footerCta: {
    visible: boolean;
    title: string;
    description: string;
    button: string;
    subtext: string;
    backgroundImage: string;
  };
  footer: {
    visible: boolean; // Just in case, usually always visible but user might want to hide
    websiteLink: string;
    copyrightText: string;
  };
  pages: {
    privacy: string;
    terms: string;
    contact: string;
  };
  settings: {
    cmsPassword: string;
    googleAnalyticsId: string;
    supportLink: string;
  };
  notFound: {
    title: string;
    subtitle: string;
    message: string;
    buttonText: string;
    footerText: string;
  };
  sectionOrder: SectionKey[];
  appShowcase: {
    visible: boolean;
    title: string;
    description: string;
    videoUrl: string;
    screenImage: string;
    badges: boolean;
  };
}

export type SectionKey = keyof CMSContent;

export interface Lead {
  id: string;
  created_at: string;
  name: string;
  email: string;
  contacted: boolean;
}
