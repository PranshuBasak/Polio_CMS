import { getRuntimeSiteSettings } from '@/lib/seo/runtime-site-settings';
import { MetadataRoute } from 'next';

export const revalidate = 300;

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getRuntimeSiteSettings();
  const baseUrl = settings.siteUrl;

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/',
    },
    host: baseUrl,
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
