"use client"

import { useAboutStore } from "../../../lib/stores"
import { useMemo } from "react"

/**
 * Custom hook for about section data
 * Provides computed values and selectors
 */
export function useAboutData() {
  const aboutData = useAboutStore((state) => state.aboutData)

  // Memoized computed values
  const sortedJourney = useMemo(
    () => [...aboutData.journey].sort((a, b) => b.date.localeCompare(a.date)),
    [aboutData.journey],
  )

  return {
    bio: aboutData.bio,
    focus: aboutData.focus,
    journey: sortedJourney,
    values: aboutData.values,
    mission: aboutData.mission,
    isLoading: false,
  }
}
