import { cache } from 'react';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import {
  seoFallbackSettings,
  type RuntimeAdvancedSettings,
  type RuntimeAppearanceSettings,
  type RuntimeSeoSettings,
  type RuntimeSiteSettings,
  type RuntimeSocialSettings,
} from '@/config/seo-fallback';
import type { Database, Json } from '@/lib/types/supabase';

type SiteSettingsRow = Database['public']['Tables']['site_settings']['Row'];
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const toAbsoluteUrl = (value: unknown, fallback: string) => {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return fallback;
  }

  try {
    const url = new URL(value);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      throw new Error('Only http/https protocols are supported for runtime URLs');
    }
    return `${url.origin}${url.pathname === '/' ? '' : url.pathname}`.replace(/\/$/, '');
  } catch {
    return fallback;
  }
};

const toSeoAssetUrl = (value: unknown, fallback: string) => {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return fallback;
  }

  const normalized = value.trim();
  if (normalized.startsWith('/')) {
    return normalized;
  }

  try {
    const url = new URL(normalized);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      throw new Error('Only http/https protocols are supported for runtime URLs');
    }

    return normalized;
  } catch {
    return fallback;
  }
};

const normalizeSocialSettings = (social: Json | null): RuntimeSocialSettings => {
  if (!isRecord(social)) {
    return seoFallbackSettings.social;
  }

  return {
    github:
      typeof social.github === 'string'
        ? social.github
        : seoFallbackSettings.social.github,
    linkedin:
      typeof social.linkedin === 'string'
        ? social.linkedin
        : seoFallbackSettings.social.linkedin,
    email:
      typeof social.email === 'string'
        ? social.email
        : seoFallbackSettings.social.email,
    medium:
      typeof social.medium === 'string'
        ? social.medium
        : seoFallbackSettings.social.medium,
    twitter:
      typeof social.twitter === 'string'
        ? social.twitter
        : seoFallbackSettings.social.twitter,
  };
};

const normalizeKeywords = (keywords: unknown): string[] => {
  if (Array.isArray(keywords)) {
    return keywords.filter((keyword): keyword is string => typeof keyword === 'string');
  }

  if (typeof keywords === 'string') {
    return keywords
      .split(',')
      .map((keyword) => keyword.trim())
      .filter(Boolean);
  }

  return seoFallbackSettings.seo.keywords;
};

const normalizeSeoSettings = (seo: Json | null): RuntimeSeoSettings => {
  if (!isRecord(seo)) {
    return {
      ...seoFallbackSettings.seo,
      ogImage: toSeoAssetUrl(
        seoFallbackSettings.seo.ogImage,
        '/android-chrome-512x512.png'
      ),
      twitterImage: toSeoAssetUrl(
        seoFallbackSettings.seo.twitterImage,
        '/android-chrome-512x512.png'
      ),
      iconUrl: toSeoAssetUrl(seoFallbackSettings.seo.iconUrl, '/favicon-32x32.png'),
      appleIconUrl: toSeoAssetUrl(
        seoFallbackSettings.seo.appleIconUrl,
        '/apple-touch-icon.png'
      ),
    };
  }

  const ogImage = toSeoAssetUrl(seo.ogImage, '/android-chrome-512x512.png');

  return {
    metaTitle:
      typeof seo.metaTitle === 'string'
        ? seo.metaTitle
        : seoFallbackSettings.seo.metaTitle,
    metaDescription:
      typeof seo.metaDescription === 'string'
        ? seo.metaDescription
        : seoFallbackSettings.seo.metaDescription,
    keywords: normalizeKeywords(seo.keywords),
    ogImage,
    twitterImage: toSeoAssetUrl(seo.twitterImage, ogImage),
    iconUrl: toSeoAssetUrl(seo.iconUrl, '/favicon-32x32.png'),
    appleIconUrl: toSeoAssetUrl(seo.appleIconUrl, '/apple-touch-icon.png'),
  };
};

const normalizeAppearanceSettings = (
  appearance: Json | null
): RuntimeAppearanceSettings => {
  if (!isRecord(appearance)) {
    return seoFallbackSettings.appearance;
  }

  const theme = appearance.theme;

  return {
    theme:
      theme === 'light' || theme === 'dark' || theme === 'system'
        ? theme
        : seoFallbackSettings.appearance.theme,
    primaryColor:
      typeof appearance.primaryColor === 'string'
        ? appearance.primaryColor
        : seoFallbackSettings.appearance.primaryColor,
    animations:
      typeof appearance.animations === 'boolean'
        ? appearance.animations
        : seoFallbackSettings.appearance.animations,
    reducedMotion:
      typeof appearance.reducedMotion === 'boolean'
        ? appearance.reducedMotion
        : seoFallbackSettings.appearance.reducedMotion,
  };
};

const normalizeAdvancedSettings = (advanced: Json | null): RuntimeAdvancedSettings => {
  if (!isRecord(advanced)) {
    return seoFallbackSettings.advanced;
  }

  return {
    cacheDuration:
      typeof advanced.cacheDuration === 'number'
        ? advanced.cacheDuration
        : seoFallbackSettings.advanced.cacheDuration,
    debugMode:
      typeof advanced.debugMode === 'boolean'
        ? advanced.debugMode
        : seoFallbackSettings.advanced.debugMode,
  };
};

const normalizeSiteSettingsRow = (row: SiteSettingsRow): RuntimeSiteSettings => {
  // site_url must include protocol (for example: http://localhost:3000).
  const normalizedSiteUrl = toAbsoluteUrl(row.site_url, seoFallbackSettings.siteUrl);

  return {
    siteName: row.site_name || seoFallbackSettings.siteName,
    siteDescription: row.site_description || seoFallbackSettings.siteDescription,
    siteUrl: normalizedSiteUrl,
    timezone: row.timezone || seoFallbackSettings.timezone,
    publicProfile: row.public_profile ?? seoFallbackSettings.publicProfile,
    social: normalizeSocialSettings(row.social),
    seo: normalizeSeoSettings(row.seo),
    appearance: normalizeAppearanceSettings(row.appearance),
    advanced: normalizeAdvancedSettings(row.advanced),
  };
};

export const getRuntimeSiteSettings = cache(async (): Promise<RuntimeSiteSettings> => {
  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      return seoFallbackSettings;
    }

    const supabase = createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey);
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return seoFallbackSettings;
    }

    return normalizeSiteSettingsRow(data);
  } catch {
    return seoFallbackSettings;
  }
});
