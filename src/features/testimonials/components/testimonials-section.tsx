'use client';

import { useHydration } from '@/lib/hooks/use-hydration';
import { useTestimonialsStore } from '@/lib/stores';
import { TestimonialsClient } from './testimonials-client';

/**
 * Testimonials Section - Client Component
 *
 * Uses Zustand store as single source of truth for testimonials data.
 * Ensures consistency across admin and public pages.
 */
export default function TestimonialsSection() {
  const testimonials = useTestimonialsStore((state) => state.testimonials);
  const isHydrated = useHydration();

  if (!isHydrated) return null;

  return <TestimonialsClient testimonials={testimonials} />;
}
