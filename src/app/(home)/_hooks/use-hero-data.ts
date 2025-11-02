import { useHeroStore } from "../../../lib/stores"

/**
 * Custom hook for hero section data
 * Encapsulates data fetching logic
 */
export function useHeroData() {
  const heroData = useHeroStore((state) => state.heroData)

  return {
    heroData,
    isLoading: false, // Zustand loads synchronously from localStorage
  }
}
