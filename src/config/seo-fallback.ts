export type RuntimeSocialSettings = {
  github: string;
  linkedin: string;
  email: string;
  medium: string;
  twitter: string;
};

export type RuntimeSeoSettings = {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  ogImage: string;
  twitterImage?: string;
  iconUrl?: string;
  appleIconUrl?: string;
};

export type RuntimeAppearanceSettings = {
  theme: 'light' | 'dark' | 'system';
  primaryColor: string;
  animations: boolean;
  reducedMotion: boolean;
};

export type RuntimeAdvancedSettings = {
  cacheDuration: number;
  debugMode: boolean;
};

export type RuntimeSiteSettings = {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  timezone: string;
  publicProfile: boolean;
  social: RuntimeSocialSettings;
  seo: RuntimeSeoSettings;
  appearance: RuntimeAppearanceSettings;
  advanced: RuntimeAdvancedSettings;
};

const DEFAULT_SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://pranshubasak.com';

const ensureAbsoluteUrl = (value: string) => {
  try {
    const url = new URL(value);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      throw new Error('Only http/https protocols are supported for site URL');
    }
    return `${url.origin}${url.pathname === '/' ? '' : url.pathname}`.replace(/\/$/, '');
  } catch {
    return 'https://pranshubasak.com';
  }
};

const resolvedSiteUrl = ensureAbsoluteUrl(DEFAULT_SITE_URL);

export const seoFallbackSettings: RuntimeSiteSettings = {
  siteName: 'Pranshu Basak Portfolio',
  siteDescription:
    'Pranshu Basak portfolio showcasing projects, skills, experience, and technical writing.',
  siteUrl: resolvedSiteUrl,
  timezone: 'utc',
  publicProfile: true,
  social: {
    github: 'https://github.com/PranshuBasak',
    linkedin: 'https://linkedin.com/in/pranshu-basak',
    email: 'pranshubasak@gmail.com',
    medium: 'https://medium.com/@pranshubasak',
    twitter: '@pranshubasak',
  },
  seo: {
    metaTitle: 'Pranshu Basak | Software Engineer Portfolio',
    metaDescription:
      'Explore projects, experience, and skills of Pranshu Basak, a software engineer focused on scalable backend and full-stack systems.',
    keywords: [
      'Pranshu Basak',
      'portfolio',
      'software engineer',
      'backend developer',
      'full stack developer',
      'typescript',
      'next.js',
      'supabase',
    ],
    ogImage: `${resolvedSiteUrl}/favicon.png`,
    twitterImage: `${resolvedSiteUrl}/favicon.png`,
    iconUrl: `${resolvedSiteUrl}/favicon.svg`,
    appleIconUrl: `${resolvedSiteUrl}/favicon.png`,
  },
  appearance: {
    theme: 'system',
    primaryColor: '#3b82f6',
    animations: true,
    reducedMotion: false,
  },
  advanced: {
    cacheDuration: 60,
    debugMode: false,
  },
};
