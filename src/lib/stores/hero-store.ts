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



export const useHeroStore = create<HeroStore>((set, get) => ({
  heroData: {
    name: "",
    title: "",
    description: "",
    avatarUrl: "",
    status: "",
  },
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
        // If no rows found, just return (state remains empty/default structure)
        if (error.code !== "PGRST116") {
          console.error("Supabase error fetching hero data:", error)
          throw error
        }
        console.log("No hero data found in database")
        return
      }

      if (data) {
        set({
          heroData: {
            name: (data as any).name || "",
            title: (data as any).tagline || "",
            description: (data as any).bio || "",
            avatarUrl: (data as any).avatar_url || "",
            status: (data as any).status || "AVAILABLE FOR HIRE",
          },
        })
        console.log("✅ Hero data loaded from Supabase:", data)
      }
    } catch (error: any) {
      console.error("Failed to fetch hero data:", error)
      set({ error: error?.message || "Failed to fetch hero data" })
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

      console.log("Debug: Existing Data:", existingData)
      console.log("Debug: Hero Data:", heroData)
      console.log("Debug: Update Payload:", updatePayload)

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
      console.error("Error details:", JSON.stringify(error, null, 2))
      if (error instanceof Error) {
        console.error("Error message:", error.message)
        console.error("Error stack:", error.stack)
      }
      set({ error: error?.message || "Failed to update hero data" })
      // Revert to previous data on error
      set({ heroData: currentData })
    } finally {
      set({ isLoading: false })
    }
  },

  resetHeroData: () => set({ 
    heroData: {
      name: "",
      title: "",
      description: "",
      avatarUrl: "",
      status: "",
    } 
  }),
}))
