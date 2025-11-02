"use client"

import { useSkillsStore } from "../../../lib/stores"
import { useMemo } from "react"

export function useSkillsData() {
  const skills = useSkillsStore((state) => state.skills)
  const categories = useSkillsStore((state) => state.categories)

  const skillsByCategory = useMemo(() => {
    const grouped: Record<string, typeof skills> = {}

    skills?.forEach((skill) => {
      const category = skill.category || "Other"
      if (!grouped[category]) {
        grouped[category] = []
      }
      grouped[category].push(skill)
    })

    return grouped
  }, [skills])

  return {
    skills: skills ?? [],
    categories: categories ?? [],
    skillsByCategory,
    allSkills: skills ?? [],
  }
}
