'use client';

import { useHydration } from '@/lib/hooks/use-hydration';
import { useHeroStore } from '@/lib/stores';
import { HeroClient } from './hero-client';

/**
 * Hero Section - Client Component
 *
 * Uses Zustand store as single source of truth for hero data.
 * Ensures consistency across admin and public pages.
 */
export default function HeroSection() {
  const heroData = useHeroStore((state) => state.heroData);
  const isHydrated = useHydration();

  if (!isHydrated) return null;

  return <HeroClient heroData={heroData} />;
}
