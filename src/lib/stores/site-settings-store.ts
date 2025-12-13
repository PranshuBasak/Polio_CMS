import { createClient } from "@/lib/supabase/client"
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
        set({
          settings: {
            siteName: (data as any).site_name || defaultSettings.siteName,
            siteDescription: (data as any).site_description || defaultSettings.siteDescription,
            siteUrl: (data as any).site_url || defaultSettings.siteUrl,
            timezone: (data as any).timezone || defaultSettings.timezone,
            publicProfile: (data as any).public_profile ?? defaultSettings.publicProfile,
            social: (data as any).social || defaultSettings.social,
            seo: (data as any).seo || defaultSettings.seo,
            appearance: (data as any).appearance || defaultSettings.appearance,
            advanced: (data as any).advanced || defaultSettings.advanced,
          },
        })
      }
    } catch (error: any) {
      console.error("Failed to fetch site settings:", error)
      set({ error: error?.message || "Failed to fetch site settings" })
      set({ settings: defaultSettings })
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

      const updatePayload: any = {
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
          .eq("id", (existingData as any).id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from("site_settings")
          .insert(updatePayload)

        if (error) throw error
      }
    } catch (error: any) {
      console.error("Failed to update site settings:", error)
      set({ error: error?.message || "Failed to update site settings" })
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
    set((state) => ({
      settings: {
        ...state.settings,
        advanced: { ...state.settings.advanced, ...advanced },
      },
    })),

  resetSettings: () => set({ settings: defaultSettings }),
}));

// Export default settings for use in server components and metadata
export { defaultSettings as defaultSiteSettings };
