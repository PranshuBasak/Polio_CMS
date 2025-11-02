import { getBlogPosts } from '@/services/portfolio-data';
import { BlogClient } from './blog-client';

/**
 * Blog Section - Server Component
 */
export default async function BlogSection() {
  const posts = await getBlogPosts();

  return <BlogClient posts={posts} />;
}
