'use client';

import { useMemo } from 'react';
import { useBlogStore } from '../../../lib/stores';

/**
 * Custom hook for blog data
 * Provides computed values and selectors with null safety
 */
export function useBlogData() {
  const blogPosts = useBlogStore((state) => state.blogPosts) || [];
  const externalBlogPosts =
    useBlogStore((state) => state.externalBlogPosts) || [];
  const getBlogPostBySlug = useBlogStore((state) => state.getBlogPostBySlug);

  // Memoized latest posts (first 3)
  const latestInternalPosts = useMemo(() => {
    return Array.isArray(blogPosts) ? blogPosts.slice(0, 3) : [];
  }, [blogPosts]);

  const latestExternalPosts = useMemo(() => {
    return Array.isArray(externalBlogPosts)
      ? externalBlogPosts.slice(0, 3)
      : [];
  }, [externalBlogPosts]);

  return {
    internalPosts: blogPosts || [],
    externalPosts: externalBlogPosts || [],
    latestInternalPosts,
    latestExternalPosts,
    getBlogPostBySlug,
    isLoading: false,
  };
}
