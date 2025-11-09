"use client"

import { useMemo } from "react"
import { useBlogStore, useProjectsStore, useSkillsStore } from "../../../lib/stores"

/**
 * Custom hook for admin dashboard statistics
 * Provides computed stats from various stores
 */
export function useAdminStats() {
  const projects = useProjectsStore((state) => state.projects)
  const internalBlogPosts = useBlogStore((state) => state.internalPosts)
  const externalBlogPosts = useBlogStore((state) => state.externalPosts)
  const skills = useSkillsStore((state) => state.skills)

  const stats = useMemo(
    () => ({
      totalProjects: projects?.length ?? 0,
      totalBlogPosts: internalBlogPosts?.length ?? 0,
      totalExternalPosts: externalBlogPosts?.length ?? 0,
      totalSkills: skills?.length ?? 0,
      totalContent: (projects?.length ?? 0) + (internalBlogPosts?.length ?? 0) + (skills?.length ?? 0),
    }),
    [projects, internalBlogPosts, externalBlogPosts, skills],
  )

  return stats
}
