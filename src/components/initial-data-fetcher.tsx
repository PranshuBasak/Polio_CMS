"use client"

import { useEffect } from "react"
import { useHeroStore } from "@/lib/stores/hero-store"
import { useProjectsStore } from "@/lib/stores/projects-store"
import { useBlogStore } from "@/lib/stores/blog-store"
import { useSkillsStore } from "@/lib/stores/skills-store"

export function InitialDataFetcher() {
  const fetchHeroData = useHeroStore((state) => state.fetchHeroData)
  const fetchProjects = useProjectsStore((state) => state.fetchProjects)
  const fetchInternalPosts = useBlogStore((state) => state.fetchInternalPosts)
  const fetchSkills = useSkillsStore((state) => state.fetchSkills)

  useEffect(() => {
    fetchHeroData()
    fetchProjects()
    fetchInternalPosts()
    fetchSkills()
  }, [fetchHeroData, fetchProjects, fetchInternalPosts, fetchSkills])

  return null
}
