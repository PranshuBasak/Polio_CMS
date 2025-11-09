import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SiteSettings = {
  // General settings
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  timezone: string;
  publicProfile: boolean;

  // Social links
  social: {
    github: string;
    linkedin: string;
    email: string;
    medium: string;
    twitter: string;
  };

  // SEO settings
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    ogImage: string;
  };

  // Appearance settings
  appearance: {
    theme: 'light' | 'dark' | 'system';
    primaryColor: string;
    animations: boolean;
    reducedMotion: boolean;
  };

  // Advanced settings
  advanced: {
    cacheDuration: number;
    debugMode: boolean;
  };
};

type SiteSettingsStore = {
  settings: SiteSettings;
  updateSettings: (settings: Partial<SiteSettings>) => void;
  updateSocial: (social: Partial<SiteSettings['social']>) => void;
  updateSEO: (seo: Partial<SiteSettings['seo']>) => void;
  updateAppearance: (appearance: Partial<SiteSettings['appearance']>) => void;
  updateAdvanced: (advanced: Partial<SiteSettings['advanced']>) => void;
  resetSettings: () => void;
};

const defaultSettings: SiteSettings = {
  siteName: '0xTanzim Portfolio',
  siteDescription:
    'Portfolio of Tanzim - Expert Software Architect & Backend Developer specializing in scalable systems, microservices, TypeScript, Java, Spring Boot, and Node.js. Building enterprise-grade solutions.',
  siteUrl: 'https://0xtanzim.dev',
  timezone: 'utc',
  publicProfile: true,

  social: {
    github: 'https://github.com/0xTanzim',
    linkedin: 'https://linkedin.com/in/0xTanzim',
    email: 'tanzimhossain2@gmail.com',
    medium: 'https://medium.com/@0xTanzim',
    twitter: '@0xTanzim',
  },

  seo: {
    metaTitle: 'Tanzim | Software Architect & Backend Developer',
    metaDescription:
      'Portfolio of Tanzim - Expert Software Architect & Backend Developer specializing in scalable systems, microservices, TypeScript, Java, Spring Boot, and Node.js. Building enterprise-grade solutions.',
    keywords: [
      'Software Architect',
      'Backend Developer',
      'TypeScript',
      'Java',
      'Spring Boot',
      'Node.js',
      'Microservices',
      'System Design',
      'Full Stack Developer',
      'Tanzim',
      'Portfolio',
    ],
    ogImage: 'https://0xtanzim.dev/og-image.png',
  },

  appearance: {
    theme: 'system',
    primaryColor: '#3b82f6',
    animations: true,
    reducedMotion: true,
  },

  advanced: {
    cacheDuration: 60,
    debugMode: false,
  },
};

export const useSiteSettingsStore = create<SiteSettingsStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
      updateSocial: (social) =>
        set((state) => ({
          settings: {
            ...state.settings,
            social: { ...state.settings.social, ...social },
          },
        })),
      updateSEO: (seo) =>
        set((state) => ({
          settings: {
            ...state.settings,
            seo: { ...state.settings.seo, ...seo },
          },
        })),
      updateAppearance: (appearance) =>
        set((state) => ({
          settings: {
            ...state.settings,
            appearance: { ...state.settings.appearance, ...appearance },
          },
        })),
      updateAdvanced: (advanced) =>
        set((state) => ({
          settings: {
            ...state.settings,
            advanced: { ...state.settings.advanced, ...advanced },
          },
        })),
      resetSettings: () => set({ settings: defaultSettings }),
    }),
    {
      name: 'site-settings-storage',
    }
  )
);

// Export default settings for use in server components and metadata
export { defaultSettings as defaultSiteSettings };
