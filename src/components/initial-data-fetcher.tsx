"use client"

import { useEffect } from "react"
import { useHeroStore, useProjectsStore, useBlogStore, useSkillsStore, useAboutStore, useSiteSettingsStore } from "@/lib/stores"

export function InitialDataFetcher() {
  const fetchHeroData = useHeroStore((state) => state.fetchHeroData)
  const fetchProjects = useProjectsStore((state) => state.fetchProjects)
  const fetchPosts = useBlogStore((state) => state.fetchPosts)
  const fetchSkills = useSkillsStore((state) => state.fetchSkills)
  const fetchAboutData = useAboutStore((state) => state.fetchAboutData)
  const fetchSettings = useSiteSettingsStore((state) => state.fetchSettings)

  useEffect(() => {
    fetchHeroData()
    fetchProjects()
    fetchPosts()
    fetchSkills()
    fetchAboutData()
    fetchSettings()
  }, [fetchAboutData, fetchHeroData, fetchPosts, fetchProjects, fetchSettings, fetchSkills])

  return null
}
