'use client';

import { useHydration } from '@/lib/hooks/use-hydration';
import { useBlogStore } from '@/lib/stores';
import { useMemo } from 'react';
import { BlogClient } from './blog-client';

/**
 * Blog Section - Client Component
 *
 * Uses Zustand store as single source of truth for blog data.
 * Ensures consistency across admin and public pages.
 */
export default function BlogSection() {
  const allPosts = useBlogStore((state) => state.posts);
  const isHydrated = useHydration();

  // Get latest 6 internal blog posts for homepage
  const posts = useMemo(() => {
    const internal = allPosts?.filter(p => !p.externalUrl) || [];
    return internal.slice(0, 6);
  }, [allPosts]);

  if (!isHydrated) return null;

  return <BlogClient posts={posts} />;
}
