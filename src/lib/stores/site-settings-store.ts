import { createClient } from "@/lib/supabase/client"
import type { Database } from "@/lib/types/supabase"
import { setClientLoggerDebugMode } from "@/lib/logger/client-logger"
import { create } from 'zustand';

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
    twitterImage?: string;
    iconUrl?: string;
    appleIconUrl?: string;
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
  isLoading: boolean;
  error: string | null;
  fetchSettings: () => Promise<void>;
  updateSettings: (settings: Partial<SiteSettings>) => Promise<void>;
  updateSocial: (social: Partial<SiteSettings['social']>) => void;
  updateSEO: (seo: Partial<SiteSettings['seo']>) => void;
  updateAppearance: (appearance: Partial<SiteSettings['appearance']>) => void;
  updateAdvanced: (advanced: Partial<SiteSettings['advanced']>) => void;
  resetSettings: () => void;
};

const defaultSettings: SiteSettings = {
  siteName: '',
  siteDescription: '',
  siteUrl: '',
  timezone: 'utc',
  publicProfile: false,

  social: {
    github: '',
    linkedin: '',
    email: '',
    medium: '',
    twitter: '',
  },

  seo: {
    metaTitle: '',
    metaDescription: '',
    keywords: [],
    ogImage: '',
    twitterImage: '',
    iconUrl: '',
    appleIconUrl: '',
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

type SiteSettingsRow = Database['public']['Tables']['site_settings']['Row'];
type SiteSettingsUpsert = Database['public']['Tables']['site_settings']['Insert'];

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

const normalizeSocialSettings = (
  social: SiteSettingsRow['social']
): SiteSettings['social'] => {
  if (!social || typeof social !== 'object' || Array.isArray(social)) {
    return defaultSettings.social;
  }

  const socialRecord = social as Record<string, unknown>;

  return {
    github:
      typeof socialRecord.github === 'string'
        ? socialRecord.github
        : defaultSettings.social.github,
    linkedin:
      typeof socialRecord.linkedin === 'string'
        ? socialRecord.linkedin
        : defaultSettings.social.linkedin,
    email:
      typeof socialRecord.email === 'string'
        ? socialRecord.email
        : defaultSettings.social.email,
    medium:
      typeof socialRecord.medium === 'string'
        ? socialRecord.medium
        : defaultSettings.social.medium,
    twitter:
      typeof socialRecord.twitter === 'string'
        ? socialRecord.twitter
        : defaultSettings.social.twitter,
  };
};

const normalizeSeoSettings = (
  seo: SiteSettingsRow['seo']
): SiteSettings['seo'] => {
  if (!seo || typeof seo !== 'object' || Array.isArray(seo)) {
    return defaultSettings.seo;
  }

  const seoRecord = seo as Record<string, unknown>;

  return {
    metaTitle:
      typeof seoRecord.metaTitle === 'string'
        ? seoRecord.metaTitle
        : defaultSettings.seo.metaTitle,
    metaDescription:
      typeof seoRecord.metaDescription === 'string'
        ? seoRecord.metaDescription
        : defaultSettings.seo.metaDescription,
    keywords: Array.isArray(seoRecord.keywords)
      ? seoRecord.keywords.filter(
          (keyword): keyword is string => typeof keyword === 'string'
        )
      : defaultSettings.seo.keywords,
    ogImage:
      typeof seoRecord.ogImage === 'string'
        ? seoRecord.ogImage
        : defaultSettings.seo.ogImage,
    twitterImage:
      typeof seoRecord.twitterImage === 'string'
        ? seoRecord.twitterImage
        : defaultSettings.seo.twitterImage,
    iconUrl:
      typeof seoRecord.iconUrl === 'string'
        ? seoRecord.iconUrl
        : defaultSettings.seo.iconUrl,
    appleIconUrl:
      typeof seoRecord.appleIconUrl === 'string'
        ? seoRecord.appleIconUrl
        : defaultSettings.seo.appleIconUrl,
  };
};

const normalizeAppearanceSettings = (
  appearance: SiteSettingsRow['appearance']
): SiteSettings['appearance'] => {
  if (!appearance || typeof appearance !== 'object' || Array.isArray(appearance)) {
    return defaultSettings.appearance;
  }

  const appearanceRecord = appearance as Record<string, unknown>;
  const themeValue = appearanceRecord.theme;

  return {
    theme:
      themeValue === 'light' || themeValue === 'dark' || themeValue === 'system'
        ? themeValue
        : defaultSettings.appearance.theme,
    primaryColor:
      typeof appearanceRecord.primaryColor === 'string'
        ? appearanceRecord.primaryColor
        : defaultSettings.appearance.primaryColor,
    animations:
      typeof appearanceRecord.animations === 'boolean'
        ? appearanceRecord.animations
        : defaultSettings.appearance.animations,
    reducedMotion:
      typeof appearanceRecord.reducedMotion === 'boolean'
        ? appearanceRecord.reducedMotion
        : defaultSettings.appearance.reducedMotion,
  };
};

const normalizeAdvancedSettings = (
  advanced: unknown
): SiteSettings['advanced'] => {
  if (!advanced || typeof advanced !== 'object') {
    return defaultSettings.advanced;
  }

  const advancedRecord = advanced as Partial<SiteSettings['advanced']>;

  return {
    cacheDuration:
      typeof advancedRecord.cacheDuration === 'number'
        ? advancedRecord.cacheDuration
        : defaultSettings.advanced.cacheDuration,
    debugMode:
      typeof advancedRecord.debugMode === 'boolean'
        ? advancedRecord.debugMode
        : defaultSettings.advanced.debugMode,
  };
};

export const useSiteSettingsStore = create<SiteSettingsStore>((set, get) => ({
  settings: defaultSettings,
  isLoading: false,
  error: null,

  fetchSettings: async () => {
    set({ isLoading: true, error: null })
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .single()

      if (error && error.code !== "PGRST116") {
        throw error
      }

      if (data) {
        const normalizedAdvanced = normalizeAdvancedSettings(data.advanced);
        setClientLoggerDebugMode(normalizedAdvanced.debugMode);

        set({
          settings: {
            siteName: data.site_name || defaultSettings.siteName,
            siteDescription: data.site_description || defaultSettings.siteDescription,
            siteUrl: data.site_url || defaultSettings.siteUrl,
            timezone: data.timezone || defaultSettings.timezone,
            publicProfile: data.public_profile ?? defaultSettings.publicProfile,
            social: normalizeSocialSettings(data.social),
            seo: normalizeSeoSettings(data.seo),
            appearance: normalizeAppearanceSettings(data.appearance),
            advanced: normalizedAdvanced,
          },
        })
      } else {
        setClientLoggerDebugMode(defaultSettings.advanced.debugMode);
      }
    } catch (error: unknown) {
      console.error("Failed to fetch site settings:", error)
      set({
        error: getErrorMessage(error, "Failed to fetch site settings"),
      })
      set({ settings: defaultSettings })
      setClientLoggerDebugMode(defaultSettings.advanced.debugMode);
    } finally {
      set({ isLoading: false })
    }
  },

  updateSettings: async (newSettings) => {
    const currentSettings = get().settings
    // Optimistic update
    set({
      settings: { ...currentSettings, ...newSettings },
      isLoading: true,
      error: null,
    })

    try {
      const supabase = createClient()
      const { settings } = get()

      // Check if row exists
      const { data: existingData } = await supabase
        .from("site_settings")
        .select("id")
        .single()

      const updatePayload: SiteSettingsUpsert = {
        site_name: settings.siteName,
        site_description: settings.siteDescription,
        site_url: settings.siteUrl,
        timezone: settings.timezone,
        public_profile: settings.publicProfile,
        social: settings.social,
        seo: settings.seo,
        appearance: settings.appearance,
        advanced: settings.advanced,
      }

      if (existingData) {
        const { error } = await supabase
          .from("site_settings")
          .update(updatePayload)
          .eq("id", existingData.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from("site_settings")
          .insert(updatePayload)

        if (error) throw error
      }

      setClientLoggerDebugMode(settings.advanced.debugMode);
    } catch (error: unknown) {
      console.error("Failed to update site settings:", error)
      set({
        error: getErrorMessage(error, "Failed to update site settings"),
      })
      set({ settings: currentSettings })
    } finally {
      set({ isLoading: false })
    }
  },

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
    set((state) => {
      const nextAdvanced = { ...state.settings.advanced, ...advanced };
      setClientLoggerDebugMode(nextAdvanced.debugMode);

      return {
        settings: {
          ...state.settings,
          advanced: nextAdvanced,
        },
      };
    }),

  resetSettings: () => set({ settings: defaultSettings }),
}));

// Export default settings for use in server components and metadata
export { defaultSettings as defaultSiteSettings };
