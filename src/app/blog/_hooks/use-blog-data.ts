'use client';

import { useEffect, useMemo } from 'react';
import { useBlogStore } from '../../../lib/stores';

/**
 * Custom hook for blog data
 * Provides computed values and selectors with null safety
 * Automatically fetches Medium posts on mount
 */
export function useBlogData() {
  const posts = useBlogStore((state) => state.posts);
  const fetchPosts = useBlogStore((state) => state.fetchPosts);
  const getBlogPostBySlug = useBlogStore((state) => state.getBlogPostBySlug);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const internalPosts = useMemo(
    () =>
      [...posts]
        .filter((p) => !p.externalUrl)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [posts]
  );
  const externalPosts = useMemo(
    () =>
      [...posts]
        .filter((p) => !!p.externalUrl)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [posts]
  );

  // Memoized latest posts (first 3)
  const latestInternalPosts = useMemo(() => {
    return Array.isArray(internalPosts) ? internalPosts.slice(0, 3) : [];
  }, [internalPosts]);

  const latestExternalPosts = useMemo(() => {
    return Array.isArray(externalPosts)
      ? externalPosts.slice(0, 4)
      : [];
  }, [externalPosts]);

  return {
    internalPosts,
    externalPosts,
    latestInternalPosts,
    latestExternalPosts,
    getBlogPostBySlug,
    isLoading: false,
  };
}
