import { getRuntimeSiteSettings } from '@/lib/seo/runtime-site-settings';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/types/supabase';
import { MetadataRoute } from 'next';

type StaticRouteConfig = {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
  priority: number;
};

const staticRoutes: StaticRouteConfig[] = [
  { path: '', changeFrequency: 'daily', priority: 1 },
  { path: '/about', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/projects', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/blog', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/skills', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/resume', changeFrequency: 'monthly', priority: 0.75 },
  { path: '/resume/print', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/privacy-policy', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/terms-and-conditions', changeFrequency: 'yearly', priority: 0.3 },
];

const createStaticSitemap = (baseUrl: string, generatedAt: string): MetadataRoute.Sitemap =>
  staticRoutes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: generatedAt,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getRuntimeSiteSettings();
  const baseUrl = settings.siteUrl;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const generatedAt = new Date().toISOString();

  if (!supabaseUrl || !supabaseAnonKey) {
    return createStaticSitemap(baseUrl, generatedAt);
  }

  const supabase = createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey);

  const routes = createStaticSitemap(baseUrl, generatedAt);

  const [{ data: posts, error: postsError }, { data: projects, error: projectsError }] =
    await Promise.all([
      supabase.from('blog_posts').select('slug, updated_at').eq('published', true),
      supabase.from('projects').select('slug, updated_at').eq('published', true),
    ]);

  const blogRoutes: MetadataRoute.Sitemap = (postsError ? [] : posts || [])
    .filter((post): post is { slug: string; updated_at: string | null } => typeof post.slug === 'string' && post.slug.length > 0)
    .map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updated_at || generatedAt,
      changeFrequency: 'weekly',
      priority: 0.6,
    }));

  const projectRoutes: MetadataRoute.Sitemap = (projectsError ? [] : projects || [])
    .filter(
      (project): project is { slug: string; updated_at: string | null } =>
        typeof project.slug === 'string' && project.slug.length > 0
    )
    .map((project) => ({
      url: `${baseUrl}/projects/${project.slug}`,
      lastModified: project.updated_at || generatedAt,
      changeFrequency: 'weekly',
      priority: 0.6,
    }));

  return [...routes, ...blogRoutes, ...projectRoutes];
}
