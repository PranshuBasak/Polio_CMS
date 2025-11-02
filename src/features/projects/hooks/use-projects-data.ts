import { useProjectsStore } from '@/lib/stores';
import { useMemo } from 'react';

/**
 * Custom hook for Projects data transformation
 */
export function useProjectsData() {
  const projects = useProjectsStore((state) => state.projects);

  const featuredProjects = useMemo(() => {
    return projects.filter((project) => project.id).slice(0, 6);
  }, [projects]);

  const allProjects = useMemo(() => {
    return [...projects];
  }, [projects]);

  const projectsByTechnology = useMemo(() => {
    const map = new Map<string, typeof projects>();
    projects.forEach((project) => {
      project.technologies?.forEach((tech) => {
        const existing = map.get(tech) || [];
        map.set(tech, [...existing, project]);
      });
    });
    return map;
  }, [projects]);

  return {
    projects: allProjects,
    featuredProjects,
    projectsByTechnology,
    totalCount: projects.length,
  };
}
