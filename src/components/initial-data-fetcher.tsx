"use client"

import { useEffect } from "react"
import { useHeroStore, useProjectsStore, useBlogStore, useSkillsStore, useAboutStore } from "@/lib/stores"

export function InitialDataFetcher() {
  const fetchHeroData = useHeroStore((state) => state.fetchHeroData)
  const fetchProjects = useProjectsStore((state) => state.fetchProjects)
  const fetchInternalPosts = useBlogStore((state) => state.fetchInternalPosts)
  const fetchSkills = useSkillsStore((state) => state.fetchSkills)
  const fetchAboutData = useAboutStore((state) => state.fetchAboutData)

  useEffect(() => {
    fetchHeroData()
    fetchProjects()
    fetchInternalPosts()
    fetchSkills()
    fetchAboutData()
  }, [fetchHeroData, fetchProjects, fetchInternalPosts, fetchSkills, fetchAboutData])

  return null
}
