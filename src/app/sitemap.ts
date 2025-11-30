import type { MetadataRoute } from 'next';

/**
 * Dynamic Sitemap Generation
 * Automatically includes all static pages and dynamic content
 *
 * Note: For dynamic content (blog posts), we use static data here
 * since sitemap generation happens at build time.
 * For real-time updates, consider using a dynamic route handler.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://0xPranshu.dev';
  const currentDate = new Date();

  // Static pages with priorities
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/skills`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/resume`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  // For blog posts, sitemap will be regenerated on build
  // Dynamic blog post URLs would need to be added via build-time data fetching
  // or by using a dynamic route handler approach

  return staticPages;
}
