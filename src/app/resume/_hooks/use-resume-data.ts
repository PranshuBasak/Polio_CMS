"use client"

import { useResumeStore } from "../../../lib/stores"
import { useMemo, useEffect } from "react"

/**
 * Custom hook for resume data
 * Provides computed values and selectors
 */
export function useResumeData() {
  const resumeData = useResumeStore((state) => state.resumeData)
  const fetchResumeData = useResumeStore((state) => state.fetchResumeData)
  const isLoading = useResumeStore((state) => state.isLoading)

  // Fetch data on mount
  useEffect(() => {
    fetchResumeData()
  }, [fetchResumeData])

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
    languages: resumeData.languages,
    interests: resumeData.interests,
    isLoading,
  }
}
