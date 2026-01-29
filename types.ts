
export interface FaithCardExample {
  id: string;
  imageUrl: string;
  title: string;
}

export interface AppFeatureDetail {
  title: string;
  description: string;
  statusText: string;
}

export interface CMSContent {
  hero: {
    badge: string;
    title: string;
    description: string;
    ctaPrimary: string;
    backgroundImage: string;
  };
  comingSoon: {
    title: string;
    description: string;
    launchDateText: string;
  };
  gallery: {
    sectionTitle: string;
    sectionDesc: string;
    items: FaithCardExample[];
  };
  manifesto: {
    title: string;
    paragraph1: string;
    paragraph2: string;
    image: string;
  };
  support: {
    mainButton: string;
    badge: string;
    description: string;
    cardTitle: string;
    cardDescription: string;
    cardButton: string;
    backgroundImage: string;
  };
  features: {
    sectionBadge: string;
    sectionTitle: string;
    feature1: { title: string; desc: string; icon: string };
    feature2: { title: string; desc: string; icon: string };
    feature3: { title: string; desc: string; icon: string };
  };
  appFeatures: {
    altar: AppFeatureDetail;
    groups: AppFeatureDetail;
    journey: AppFeatureDetail;
    guardian: AppFeatureDetail;
  };
  testimonial: {
    quote: string;
    author: string;
    role: string;
    avatar: string;
  };
  footerCta: {
    title: string;
    description: string;
    button: string;
    subtext: string;
    backgroundImage: string;
  };
  footer: {
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
}

export type SectionKey = keyof CMSContent;
