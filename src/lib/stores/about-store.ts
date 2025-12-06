import { createClient } from "@/lib/supabase/client"
import { create } from "zustand"

export type AboutJourneyItem = {
  id: string
  title: string
  company: string
  date: string
  description: string
  icon?: string | null
}

export type AboutValue = {
  id: string
  title: string
  description: string
 icon: string
}

export type AboutData = {
  bio: string
  tagline: string
  journey: AboutJourneyItem[]
  values: AboutValue[]
  mission: string
}

type AboutStore = {
  aboutData: AboutData
  isLoading: boolean
  error: string | null
  fetchAboutData: () => Promise<void>
  updateAboutData: (data: Partial<AboutData>) => Promise<void>
  updateAboutJourney: (journeys: AboutJourneyItem[]) => Promise<void>
  updateAboutValues: (values: AboutValue[]) => Promise<void>
  resetAboutData: () => void
}

const defaultAboutData: AboutData = {
  bio: "I'm Pranshu Basak, a passionate backend developer and system design enthusiast from Bangladesh. I'm dedicated to mastering software architecture, microservices, and building scalable, efficient applications. Proficient in TypeScript & Java, currently expanding expertise in C++. Strong advocate for clean code, industry best practices, and high-performance systems.",
  tagline:
    "🎯 Specializing in database design, API development, and DevOps.\\n\\n🤖 Enthusiastic about AI, blockchain, and system scalability.\\n\\n🔍 Passionate about emerging technologies and their impact on industries.\\n\\n🧠 Applying psychology & creative problem-solving to software engineering.\\n\\n🛠️ Active in open-source collaboration and tech community.\\n\\n⚡ Believe in working smarter, not just harder!",
  journey: [],
  values: [],
  mission:
    "To master software architecture and build scalable, efficient applications that solve real-world problems. Contributing to open-source, exploring cutting-edge technologies, and continuously honing my skills to make meaningful impact in the tech community. Working smarter to innovate and learn together! 🚀",
}

export const useAboutStore = create<AboutStore>((set, get) => ({
  aboutData: defaultAboutData,
  isLoading: false,
  error: null,

  fetchAboutData: async () => {
    set({ isLoading: true, error: null })
    try {
      const supabase = createClient()
      
      const { data: aboutData, error: aboutError } = await supabase
        .from("about")
        .select("bio, tagline, mission")
        .single()

      if (aboutError && aboutError.code !== "PGRST116") {
        console.error("Error fetching about:", aboutError)
      }

      const { data: journeyData, error: journeyError } = await supabase
        .from("journey")
        .select("*")
        .order("order_index", { ascending: true })

      if (journeyError && journeyError.code !== "PGRST116") {
        console.error("Error fetching journey:", journeyError)
      }

      const { data: valuesData, error: valuesError } = await supabase
        .from("core_values")
        .select("*")
        .order("order_index", { ascending: true })

      if (valuesError && valuesError.code !== "PGRST116") {
        console.error("Error fetching core values:", valuesError)
      }

      const mappedJourney: AboutJourneyItem[] = journeyData
        ? journeyData.map((item: any) => ({
            id: item.id,
            title: item.title,
            company: item.company || item.title, // Fallback to title if company is empty
            date: item.year?.toString() || "",
            description: item.description,
            icon: item.icon,
          }))
        : defaultAboutData.journey

      const mappedValues: AboutValue[] = valuesData
        ? valuesData.map((item: any) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            icon: item.icon || "",
          }))
        : defaultAboutData.values

      set({
        aboutData: {
          bio: (aboutData as any)?.bio || defaultAboutData.bio,
          tagline: (aboutData as any)?.tagline || defaultAboutData.tagline,
          mission: (aboutData as any)?.mission || defaultAboutData.mission,
          journey: mappedJourney,
          values: mappedValues,
        },
      })
      console.log("✅ About data loaded from Supabase (including journey & values)")
    } catch (error: any) {
      console.error("Failed to fetch about data:", error)
      set({ error: error?.message || "Failed to fetch about data" })
      set({ aboutData: defaultAboutData })
    } finally {
      set({ isLoading: false })
    }
  },

  updateAboutData: async (data) => {
    const currentData = get().aboutData
    set({
      aboutData: { ...currentData, ...data },
      isLoading: true,
      error: null,
    })

    try {
      const supabase = createClient()
      const { aboutData } = get()

      const { data: existingData, error: selectError } = await supabase
        .from("about")
        .select("id")
        .single()

      if (selectError && selectError.code !== "PGRST116") {
        console.error("Error checking existing data:", selectError)
        throw selectError
      }

      const updatePayload: any = {
        bio: aboutData.bio,
        tagline: aboutData.tagline,
        mission: aboutData.mission,
      }

      if (existingData) {
        const { error } = await supabase
          .from("about")
          .update(updatePayload)
          .eq("id", (existingData as any).id)

        if (error) {
          console.error("Error updating about data:", error)
          throw error
        }
      } else {
        const { error } = await supabase
          .from("about")
          .insert(updatePayload)

        if (error) {
          console.error("Error inserting about data:", error)
          throw error
        }
      }

      console.log("✅ About data updated successfully")
    } catch (error: any) {
      console.error("Failed to update about data:", error)
      set({ error: error?.message || "Failed to update about data" })
      set({ aboutData: currentData })
    } finally {
      set({ isLoading: false })
    }
  },

  updateAboutJourney: async (journeys) => {
    const currentData = get().aboutData
    
    set((state) => ({
      aboutData: { ...state.aboutData, journey: journeys },
    }))

    try {
      const supabase = createClient()

      await supabase.from("journey").delete().neq("id", "00000000-0000-0000-0000-000000000000")

      if (journeys.length > 0) {
        const journeyPayload = journeys.map((item, index) => ({
          title: item.title,
          description: item.description,
          year: item.date, // Now saving as string directly
          company: item.company,
          order_index: index,
          icon: item.icon || null,
        }))

        const { error } = await supabase.from("journey").insert(journeyPayload)

        if (error) {
          console.error("Error updating journey:", error)
          throw error
        }
      }

      console.log("✅ Journey updated successfully in Supabase")
    } catch (error: any) {
      console.error("Failed to update journey:", error)
      set({ aboutData: currentData })
    }
  },

  updateAboutValues: async (values) => {
    const currentData = get().aboutData
    
    set((state) => ({
      aboutData: { ...state.aboutData, values },
    }))

    try {
      const supabase = createClient()

      await supabase.from("core_values").delete().neq("id", "00000000-0000-0000-0000-000000000000")

      if (values.length > 0) {
        const valuesPayload = values.map((item, index) => ({
          title: item.title,
          description: item.description,
          icon: item.icon || null,
          order_index: index,
        }))

        const { error } = await supabase.from("core_values").insert(valuesPayload)

        if (error) {
          console.error("Error updating core values:", error)
          throw error
        }
      }

      console.log("✅ Core values updated successfully in Supabase")
    } catch (error: any) {
      console.error("Failed to update core values:", error)
      set({ aboutData: currentData })
    }
  },

  resetAboutData: () => set({ aboutData: defaultAboutData }),
}))
