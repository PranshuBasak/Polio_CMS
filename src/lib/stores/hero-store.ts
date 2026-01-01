import { createClient } from "@/lib/supabase/client"
import { create } from "zustand"

export type HeroData = {
  name: string
  title: string
  description: string
  avatarUrl: string
  status: string
}

type HeroStore = {
  heroData: HeroData
  isLoading: boolean
  error: string | null
  fetchHeroData: () => Promise<void>
  updateHeroData: (data: Partial<HeroData>) => Promise<void>
  resetHeroData: () => void
}

const defaultHeroData: HeroData = {
  name: "Pranshu",
  title: "Backend Developer & System Design Enthusiast",
  description:
    "Passionate backend developer specializing in scalable systems, microservices, and database design. Proficient in TypeScript & Java, mastering C++. Strong advocate for clean code and building high-performance applications. Exploring AI, blockchain, and system scalability.",
  avatarUrl: "https://media.licdn.com/dms/image/v2/D4D03AQHQrREy7e6Rtg/profile-displayphoto-scale_200_200/B4DZnJTBmyIgAY-/0/1760018833625?e=1764201600&v=beta&t=vyCLeSdMBoBRggqkBS6sLubEG0q6IUZIcbowwpyQ_Joi",
  status: "AVAILABLE FOR HIRE"
}

export const useHeroStore = create<HeroStore>((set, get) => ({
  heroData: defaultHeroData,
  isLoading: false,
  error: null,

  fetchHeroData: async () => {
    set({ isLoading: true, error: null })
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("about")
        .select("*")
        .single()

      if (error) {
        // If no rows found, use defaults
        if (error.code !== "PGRST116") {
          console.error("Supabase error fetching hero data:", error)
          throw error
        }
        console.log("No hero data found in database, using defaults")
        set({ heroData: defaultHeroData })
        return
      }

      if (data) {
        set({
          heroData: {
            name: (data as any).name || defaultHeroData.name,
            title: (data as any).tagline || defaultHeroData.title,
            description: (data as any).bio || defaultHeroData.description,
            avatarUrl: (data as any).avatar_url || defaultHeroData.avatarUrl,
            status: (data as any).status || defaultHeroData.status,
          },
        })
        console.log("✅ Hero data loaded from Supabase:", data)
      }
    } catch (error: any) {
      console.error("Failed to fetch hero data:", error)
      set({ error: error?.message || "Failed to fetch hero data" })
      set({ heroData: defaultHeroData })
    } finally {
      set({ isLoading: false })
    }
  },

  updateHeroData: async (data) => {
    const currentData = get().heroData
    // Optimistic update
    set({
      heroData: { ...currentData, ...data },
      isLoading: true,
      error: null,
    })

    try {
      const supabase = createClient()
      const { heroData } = get()

      // Check if row exists
      const { data: existingData, error: selectError } = await supabase
        .from("about")
        .select("id")
        .single()

      if (selectError && selectError.code !== "PGRST116") {
        console.error("Error checking existing data:", selectError)
        throw selectError
      }

      const updatePayload: any = {
        name: heroData.name,
        tagline: heroData.title,
        bio: heroData.description,
        avatar_url: heroData.avatarUrl,
        status: heroData.status,
      }

      if (existingData) {
        // Update existing row
        const { error } = await supabase
          .from("about")
          .update(updatePayload)
          .eq("id", (existingData as any).id)

        if (error) {
          console.error("Error updating hero data:", error)
          throw error
        }
      } else {
        // Insert new row
        const { error } = await supabase
          .from("about")
          .insert(updatePayload)

        if (error) {
          console.error("Error inserting hero data:", error)
          throw error
        }
      }

      console.log("✅ Hero data updated successfully in Supabase")
    } catch (error: any) {
      console.error("Failed to update hero data:", error)
      set({ error: error?.message || "Failed to update hero data" })
      // Revert to previous data on error
      set({ heroData: currentData })
    } finally {
      set({ isLoading: false })
    }
  },

  resetHeroData: () => set({ heroData: defaultHeroData }),
}))
