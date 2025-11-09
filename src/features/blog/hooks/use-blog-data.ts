import { useBlogStore } from '@/lib/stores';
import { useMemo } from 'react';

/**
 * Custom hook for Blog data transformation
 */
export function useBlogData() {
  const internalPosts = useBlogStore((state) => state.internalPosts || []);
  const externalPosts = useBlogStore((state) => state.externalPosts || []);

  const allPosts = useMemo(() => {
    return [...internalPosts, ...externalPosts].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [internalPosts, externalPosts]);

  const recentPosts = useMemo(() => {
    return allPosts.slice(0, 6);
  }, [allPosts]);

  const internalOnly = useMemo(() => {
    return [...internalPosts].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [internalPosts]);

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
