import { createClient } from '@/lib/supabase/client';
import { MetadataRoute } from 'next';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const supabase = createClient();

  // Fetch site settings for base URL
  const { data: settings } = await supabase
    .from('site_settings')
    .select('site_url')
    .single();

  const baseUrl = settings?.site_url || 'https://pranshubasak.com'; // Fallback

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
