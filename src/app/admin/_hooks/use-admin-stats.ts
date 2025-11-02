"use client"

import { useProjectsStore, useBlogStore, useSkillsStore } from "../../../lib/stores"
import { useMemo } from "react"

/**
 * Custom hook for admin dashboard statistics
 * Provides computed stats from various stores
 */
export function useAdminStats() {
  const projects = useProjectsStore((state) => state.projects)
  const blogPosts = useBlogStore((state) => state.blogPosts)
  const externalBlogPosts = useBlogStore((state) => state.externalBlogPosts)
  const skills = useSkillsStore((state) => state.skills)

  const stats = useMemo(
    () => ({
      totalProjects: projects?.length ?? 0,
      totalBlogPosts: blogPosts?.length ?? 0,
      totalExternalPosts: externalBlogPosts?.length ?? 0,
      totalSkills: skills?.length ?? 0,
      totalContent: (projects?.length ?? 0) + (blogPosts?.length ?? 0) + (skills?.length ?? 0),
    }),
    [projects, blogPosts, externalBlogPosts, skills],
  )

  return stats
}
