"use client"

import { useResumeStore } from "../../../lib/stores"
import { useMemo } from "react"

/**
 * Custom hook for resume data
 * Provides computed values and selectors
 */
export function useResumeData() {
  const resumeData = useResumeStore((state) => state.resumeData)

  // Memoized sorted experiences (newest first)
  const sortedExperiences = useMemo(
    () => [...resumeData.experiences].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()),
    [resumeData.experiences],
  )

  // Memoized sorted education (newest first)
  const sortedEducation = useMemo(
    () => [...resumeData.education].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()),
    [resumeData.education],
  )

  return {
    experiences: sortedExperiences,
    education: sortedEducation,
    skills: resumeData.skills,
    certifications: resumeData.certifications,
    isLoading: false,
  }
}
