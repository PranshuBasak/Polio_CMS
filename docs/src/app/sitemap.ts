import { MetadataRoute } from 'next'
import { getPageMap } from 'nextra/page-map'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Manual list of core documentation routes
  // In a real Nextra app, you can traverse the pageMap, but for stability we list key sections
  const routes = [
    '',
    '/getting-started',
    '/architecture',
    '/components',
    '/features',
    '/features/i18n',
    '/backend',
    '/backend/database',
    '/backend/api',
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }))
}
