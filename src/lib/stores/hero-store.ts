import { create } from "zustand"
import { persist } from "zustand/middleware"

export type HeroData = {
  name: string
  title: string
  description: string
  image: string
}

type HeroStore = {
  heroData: HeroData
  updateHeroData: (data: Partial<HeroData>) => void
  resetHeroData: () => void
}

const defaultHeroData: HeroData = {
  name: "Tanzim",
  title: "Software Architect & Backend Developer",
  description:
    "I build scalable backend systems and architect software solutions with a focus on performance, security, and maintainability.",
  image: "/placeholder.svg?height=400&width=400",
}

export const useHeroStore = create<HeroStore>()(
  persist(
    (set) => ({
      heroData: defaultHeroData,
      updateHeroData: (data) =>
        set((state) => ({
          heroData: { ...state.heroData, ...data },
        })),
      resetHeroData: () => set({ heroData: defaultHeroData }),
    }),
    {
      name: "hero-storage",
    },
  ),
)
