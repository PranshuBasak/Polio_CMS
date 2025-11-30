'use client';

import { useEffect, useMemo } from 'react';
import { useBlogStore } from '../../../lib/stores';

/**
 * Custom hook for blog data
 * Provides computed values and selectors with null safety
 * Automatically fetches Medium posts on mount
 */
export function useBlogData() {
  const rawInternalPosts = useBlogStore((state) => state.internalPosts);
  const rawExternalPosts = useBlogStore((state) => state.externalPosts);

  const internalPosts = useMemo(() => rawInternalPosts || [], [rawInternalPosts]);
  const externalPosts = useMemo(() => rawExternalPosts || [], [rawExternalPosts]);
  const getBlogPostBySlug = useBlogStore((state) => state.getBlogPostBySlug);
  const refreshExternalPosts = useBlogStore((state) => state.refreshExternalPosts);

  // Auto-fetch Medium posts on mount if we only have the default placeholder
  useEffect(() => {
    const hasOnlyPlaceholder =
      externalPosts.length === 1 &&
      externalPosts[0]?.title?.includes('Read more articles on Medium');

    if (hasOnlyPlaceholder) {
      // We don't need to set isLoading here if we derive it, but to be safe and avoid the lint error,
      // we can just trigger the fetch. The UI will show the placeholder until data arrives.
      // If we really want a loading spinner, we can set it, but let's avoid the sync set state.
      refreshExternalPosts()
        .then(() => {
          console.log('✅ Medium posts fetched successfully');
        })
        .catch((error) => {
          console.error('Failed to fetch Medium posts:', error);
        });
    }
  }, [externalPosts, refreshExternalPosts]); // Only run on mount

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
