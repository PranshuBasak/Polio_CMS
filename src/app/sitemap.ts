import { getRuntimeSiteSettings } from '@/lib/seo/runtime-site-settings';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/types/supabase';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getRuntimeSiteSettings();
  const baseUrl = settings.siteUrl;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return ['', '/about', '/projects', '/blog', '/skills', '/resume'].map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date().toISOString(),
      changeFrequency: route === '' ? 'daily' : 'weekly',
      priority: route === '' ? 1 : 0.8,
    }));
  }

  const supabase = createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey);

  const routes: MetadataRoute.Sitemap = ['', '/about', '/projects', '/blog', '/skills', '/resume'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));

  const [{ data: posts, error: postsError }, { data: projects, error: projectsError }] =
    await Promise.all([
      supabase.from('blog_posts').select('slug, updated_at').eq('published', true),
      supabase.from('projects').select('slug, updated_at').eq('published', true),
    ]);

  const blogRoutes: MetadataRoute.Sitemap = (postsError ? [] : posts || []).map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updated_at || new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  const projectRoutes: MetadataRoute.Sitemap = (projectsError ? [] : projects || []).map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: project.updated_at || new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...routes, ...blogRoutes, ...projectRoutes];
}
