'use client';

import { useHydration } from '@/lib/hooks/use-hydration';
import { useSkillsStore } from '@/lib/stores';
import { SkillsClient } from './skills-client';

/**
 * Skills Section - Client Component
 *
 * Uses Zustand store as single source of truth for skills data.
 * Ensures consistency across admin and public pages.
 */
export default function SkillsSection() {
  const skills = useSkillsStore((state) => state.skills);
  const categories = useSkillsStore((state) => state.categories);
  const isHydrated = useHydration();

  if (!isHydrated) return null;

  return <SkillsClient skills={skills} categories={categories} />;
}
