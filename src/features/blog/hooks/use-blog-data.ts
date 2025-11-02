import { useBlogStore } from '@/lib/stores';
import { useMemo } from 'react';

/**
 * Custom hook for Blog data transformation
 */
export function useBlogData() {
  const posts = useBlogStore((state) => state.posts || []);
  const externalPosts = useBlogStore((state) => state.externalPosts || []);

  const allPosts = useMemo(() => {
    return [...posts, ...externalPosts].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [posts, externalPosts]);

  const recentPosts = useMemo(() => {
    return allPosts.slice(0, 6);
  }, [allPosts]);

  const internalOnly = useMemo(() => {
    return [...posts].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [posts]);

  const externalOnly = useMemo(() => {
    return [...externalPosts].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [externalPosts]);

  return {
    allPosts,
    recentPosts,
    internalPosts: internalOnly,
    externalPosts: externalOnly,
    totalCount: allPosts.length,
  };
}
