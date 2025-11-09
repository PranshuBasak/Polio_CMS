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
  name: "Tanzim Hossain",
  title: "Backend Developer & System Design Enthusiast",
  description:
    "Passionate backend developer specializing in scalable systems, microservices, and database design. Proficient in TypeScript & Java, mastering C++. Strong advocate for clean code and building high-performance applications. Exploring AI, blockchain, and system scalability.",
  image: "https://media.licdn.com/dms/image/v2/D4D03AQHQrREy7e6Rtg/profile-displayphoto-scale_200_200/B4DZnJTBmyIgAY-/0/1760018833625?e=1764201600&v=beta&t=vyCLeSdMBoBRggqkBS6sLubEG0q6IUZIcbowwpyQ_Joi",
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
