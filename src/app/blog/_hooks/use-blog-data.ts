'use client';

import { useMemo } from 'react';
import { useBlogStore } from '../../../lib/stores';

/**
 * Custom hook for blog data
 * Provides computed values and selectors with null safety
 */
export function useBlogData() {
  const internalPosts = useBlogStore((state) => state.internalPosts) || [];
  const externalPosts =
    useBlogStore((state) => state.externalPosts) || [];
  const getBlogPostBySlug = useBlogStore((state) => state.getBlogPostBySlug);

  // Memoized latest posts (first 3)
  const latestInternalPosts = useMemo(() => {
    return Array.isArray(internalPosts) ? internalPosts.slice(0, 3) : [];
  }, [internalPosts]);

  const latestExternalPosts = useMemo(() => {
    return Array.isArray(externalPosts)
      ? externalPosts.slice(0, 3)
      : [];
  }, [externalPosts]);

  return {
    internalPosts: internalPosts || [],
    externalPosts: externalPosts || [],
    latestInternalPosts,
    latestExternalPosts,
    getBlogPostBySlug,
    isLoading: false,
  };
}
