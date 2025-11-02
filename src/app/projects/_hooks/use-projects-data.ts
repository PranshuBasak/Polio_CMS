"use client"

import { useProjectsStore } from "../../../lib/stores"
import { useMemo } from "react"

/**
 * Custom hook for projects data
 * Provides computed values and selectors
 */
export function useProjectsData() {
  const projects = useProjectsStore((state) => state.projects)

  // Memoized featured projects (first 3)
  const featuredProjects = useMemo(() => projects.slice(0, 3), [projects])

  // Memoized unique technologies
  const allTechnologies = useMemo(() => Array.from(new Set(projects.flatMap((p) => p.technologies))).sort(), [projects])

  return {
    projects,
    featuredProjects,
    allTechnologies,
    isLoading: false,
  }
}
