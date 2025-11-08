'use client';

import type React from 'react';
import { useEffect, useRef, useState } from 'react';

/**
 * Hook to safely handle hydration mismatches
 * Returns true only after client-side hydration is complete
 */
export function useHydration() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Use requestAnimationFrame to delay state update until after paint
    const frame = requestAnimationFrame(() => {
      setIsHydrated(true);
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  return isHydrated;
}

export function useStoreHydration() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Wait for stores to hydrate by checking multiple times
    // Zustand persist rehydration happens asynchronously
    const checkHydration = () => {
      // Check if stores exist and have data
      const hasStores =
        typeof window !== 'undefined' &&
        localStorage.getItem('blog-storage') &&
        localStorage.getItem('projects-storage') &&
        localStorage.getItem('skills-storage');

      if (hasStores) {
        // Use requestAnimationFrame to ensure DOM updates complete
        requestAnimationFrame(() => {
          setIsHydrated(true);
        });
      }
    };

    // Check immediately
    checkHydration();

    // Also check after a small delay to catch late hydration
    const timeout = setTimeout(checkHydration, 100);

    return () => clearTimeout(timeout);
  }, []);

  return isHydrated;
}

export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const media = window.matchMedia(query);

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);

    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

export const useIsMobile = () => useMediaQuery('(max-width: 768px)');
export const useIsTablet = () =>
  useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1025px)');

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}

export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
): [React.RefObject<HTMLDivElement | null>, boolean] {
  const {
    threshold = 0.1,
    root = null,
    rootMargin = '0px',
    freezeOnceVisible = false,
  } = options;
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    if (freezeOnceVisible && isVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry.isIntersecting;
        setIsVisible(isIntersecting);
        if (isIntersecting && freezeOnceVisible) {
          observer.unobserve(element);
        }
      },
      { threshold, root, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, root, rootMargin, freezeOnceVisible, isVisible]);

  return [elementRef, isVisible];
}

export function useOptimisticUpdate<T>(
  initialData: T,
  updateFn: (data: T) => Promise<T>
) {
  const [data, setData] = useState<T>(initialData);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const update = async (optimisticData: T) => {
    const previousData = data;
    setData(optimisticData);
    setIsUpdating(true);
    setError(null);

    try {
      const result = await updateFn(optimisticData);
      setData(result);
    } catch (err) {
      setData(previousData);
      setError(err instanceof Error ? err : new Error('Update failed'));
    } finally {
      setIsUpdating(false);
    }
  };

  return { data, isUpdating, error, update };
}
