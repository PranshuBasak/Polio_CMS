import type { MetadataRoute } from 'next';

/**
 * Robots.txt Configuration
 * Controls search engine crawling and sitemap location
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://0xPranshu.dev';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
