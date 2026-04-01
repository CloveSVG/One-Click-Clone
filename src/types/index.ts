export interface ModelCard {
  title: string;
  poweredBy: string;
  features: string[];
  mediaSrc: string;
  mediaType: 'video' | 'image';
  href: string;
}

export interface ApiTab {
  label: string;
  title: string;
  description: string;
  tags: string[];
  mediaType: 'video' | 'image';
  mediaSrc: string;
  promptText: string;
  learnMoreHref: string;
}

export interface ClientCase {
  title: string;
  description: string;
}

export interface FooterLinkGroup {
  title?: string;
  links: { text: string; href: string }[];
}
