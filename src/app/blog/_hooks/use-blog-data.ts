'use client';

import { useEffect, useMemo, useState } from 'react';
import { useBlogStore } from '../../../lib/stores';

/**
 * Custom hook for blog data
 * Provides computed values and selectors with null safety
 * Automatically fetches Medium posts on mount
 */
export function useBlogData() {
  const [isLoading, setIsLoading] = useState(false);
  const internalPosts = useBlogStore((state) => state.internalPosts) || [];
  const externalPosts =
    useBlogStore((state) => state.externalPosts) || [];
  const getBlogPostBySlug = useBlogStore((state) => state.getBlogPostBySlug);
  const refreshExternalPosts = useBlogStore((state) => state.refreshExternalPosts);

  // Auto-fetch Medium posts on mount if we only have the default placeholder
  useEffect(() => {
    const hasOnlyPlaceholder =
      externalPosts.length === 1 &&
      externalPosts[0]?.title?.includes('Read more articles on Medium');

    if (hasOnlyPlaceholder) {
      setIsLoading(true);
      refreshExternalPosts()
        .then(() => {
          console.log('✅ Medium posts fetched successfully');
        })
        .catch((error) => {
          console.error('Failed to fetch Medium posts:', error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, []); // Only run on mount

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
    isLoading,
  };
}
