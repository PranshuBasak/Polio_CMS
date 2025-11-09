'use client';

import { useHydration } from '@/lib/hooks/use-hydration';
import { useProjectsStore } from '@/lib/stores';
import { useMemo } from 'react';
import { ProjectsClient } from './projects-client';

/**
 * Projects Section - Client Component
 *
 * Uses Zustand store as single source of truth for projects data.
 * Ensures consistency across admin and public pages.
 */
export default function ProjectsSection() {
  const allProjects = useProjectsStore((state) => state.projects);
  const isHydrated = useHydration();

  // Get first 6 projects as featured
  const projects = useMemo(() => allProjects.slice(0, 6), [allProjects]);

  if (!isHydrated) return null;

  return <ProjectsClient projects={projects} />;
}
