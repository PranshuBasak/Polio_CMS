'use client';

import { useHydration } from '@/lib/hooks/use-hydration';
import { useAboutStore } from '@/lib/stores';
import { AboutClient } from './about-client';

/**
 * About Section - Client Component
 *
 * Uses Zustand store as single source of truth for about data.
 * Ensures consistency across admin and public pages.
 */
export default function AboutSection() {
  const aboutData = useAboutStore((state) => state.aboutData);
  const isHydrated = useHydration();

  if (!isHydrated) return null;

  return <AboutClient aboutData={aboutData} />;
}
