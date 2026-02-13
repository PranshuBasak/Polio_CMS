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

  // Get latest 4 external blog posts for homepage
  const posts = useMemo(() => {
    const external = allPosts?.filter((p) => !!p.externalUrl) || [];
    const sorted = [...external].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return sorted.slice(0, 4);
  }, [allPosts]);

  if (!isHydrated) return null;

  return <BlogClient posts={posts} isExternal />;
}
