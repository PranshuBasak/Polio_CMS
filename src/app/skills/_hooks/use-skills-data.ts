'use client'

import { useMemo } from 'react'

import { useSkillsStore } from '../../../lib/stores'

export function useSkillsData() {
  const skills = useSkillsStore((state) => state.skills)
  const categories = useSkillsStore((state) => state.categories)

  const sortedCategories = useMemo(() => {
    return [...(categories ?? [])].sort((a, b) => a.order - b.order)
  }, [categories])

  const sortedSkills = useMemo(() => {
    return [...(skills ?? [])].sort((a, b) => a.orderIndex - b.orderIndex)
  }, [skills])

  const skillsByCategory = useMemo(() => {
    const grouped: Record<string, typeof sortedSkills> = {}

    sortedSkills.forEach((skill) => {
      const categoryKey = skill.category || 'other'
      if (!grouped[categoryKey]) {
        grouped[categoryKey] = []
      }
      grouped[categoryKey].push(skill)
    })

    return grouped
  }, [sortedSkills])

  return {
    skills: sortedSkills,
    categories: sortedCategories,
    skillsByCategory,
    allSkills: sortedSkills,
  }
}
