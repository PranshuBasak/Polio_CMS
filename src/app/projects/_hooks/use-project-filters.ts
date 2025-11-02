"use client"

import { useState, useMemo, useCallback } from "react"
import type { Project } from "../../../lib/types"

/**
 * Custom hook for project filtering logic
 * Handles search and technology filtering
 */
export function useProjectFilters(projects: Project[]) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTech, setSelectedTech] = useState("all")

  // Memoized filtered projects
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesTech = selectedTech === "all" || project.technologies.includes(selectedTech)

      return matchesSearch && matchesTech
    })
  }, [projects, searchTerm, selectedTech])

  const resetFilters = useCallback(() => {
    setSearchTerm("")
    setSelectedTech("all")
  }, [])

  return {
    searchTerm,
    setSearchTerm,
    selectedTech,
    setSelectedTech,
    filteredProjects,
    resetFilters,
    hasActiveFilters: searchTerm !== "" || selectedTech !== "all",
  }
}
