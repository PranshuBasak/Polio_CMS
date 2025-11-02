'use client';

import type { HeroData } from '@/lib/types';
import { HeroContent } from './hero-content';
import { HeroScrollButton } from './hero-scroll-button';

/**
 * Hero Client - Client Component Wrapper
 *
 * Thin client component that receives server-fetched data
 * and coordinates interactive sub-components.
 */
interface HeroClientProps {
  heroData: HeroData;
}

export function HeroClient({ heroData }: HeroClientProps) {
  return (
    <section className="py-16 md:py-24 flex flex-col justify-center min-h-[calc(100vh-4rem)]">
      <HeroContent heroData={heroData} />
      <HeroScrollButton />
    </section>
  );
}
