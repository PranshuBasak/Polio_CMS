'use client';

import { createClient } from '@/lib/supabase/client';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

export function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    const trackPageView = async () => {
      // Prevent duplicate tracking for the same path (e.g. strict mode double invoke)
      const fullPath = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
      if (lastTrackedPath.current === fullPath) return;
      lastTrackedPath.current = fullPath;

      try {
        // Get IP address (optional, often handled by server/middleware, but we can try to get it or leave null)
        // For client-side tracking, we rely on what's available.
        // Supabase might not expose IP directly in client insert without edge function, 
        // but we can store user agent and path.

        await supabase.from('page_views').insert({
          page_path: pathname,
          user_agent: window.navigator.userAgent,
          referrer: document.referrer || null,
          // device_type, browser, country, city would typically require a server-side lookup or external API
          // We'll keep it simple for now and just track the hit.
        });
      } catch (error) {
        console.error('Failed to track page view:', error);
      }
    };

    trackPageView();
  }, [pathname, searchParams, supabase]);

  return null;
}
