import { createClient } from "@/lib/supabase/client"
import type { Database } from "@/lib/types/supabase"
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
  focus: string
  tagline: string
  journey: AboutJourneyItem[]
  values: AboutValue[]
  mission: string
  avatarUrl?: string
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
  bio: "I'm Pranshu Basak, a backend-focused software engineer who enjoys building reliable systems and practical developer workflows.",
  focus:
    "Scalable backend architecture\nAPI design and performance\nCloud-native deployment\nAI-assisted product engineering",
  tagline:
    "Backend engineering, platform reliability, and thoughtful product development.",
  journey: [],
  values: [],
  mission:
    "Build dependable software that solves real problems, scales cleanly, and helps teams move faster with confidence.",
}

type AboutRow = Database["public"]["Tables"]["about"]["Row"]
type AboutInsert = Database["public"]["Tables"]["about"]["Insert"]
type JourneyRow = Database["public"]["Tables"]["journey"]["Row"]
type CoreValueRow = Database["public"]["Tables"]["core_values"]["Row"]

const mapJourneyRows = (rows: JourneyRow[] | null): AboutJourneyItem[] => {
  if (!rows || rows.length === 0) {
    return defaultAboutData.journey
  }

  return rows.map((item) => ({
    id: item.id,
    title: item.title,
    company: item.company || item.title,
    date: item.year || "",
    description: item.description,
    icon: item.icon,
  }))
}

const mapCoreValueRows = (rows: CoreValueRow[] | null): AboutValue[] => {
  if (!rows || rows.length === 0) {
    return defaultAboutData.values
  }

  return rows.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    icon: item.icon || "Heart",
  }))
}

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error) {
    return error.message
  }

  return fallback
}

const getAboutUpdatePayload = (aboutData: AboutData): AboutInsert => ({
  bio: aboutData.bio,
  bio_short: aboutData.focus,
  tagline: aboutData.tagline,
  mission: aboutData.mission,
  avatar_url: aboutData.avatarUrl || null,
})

export const useAboutStore = create<AboutStore>((set, get) => ({
  aboutData: defaultAboutData,
  isLoading: false,
  error: null,

  fetchAboutData: async () => {
    set({ isLoading: true, error: null })
    try {
      const supabase = createClient()

      const { data: aboutRow, error: aboutError } = await supabase
        .from("about")
        .select("bio, bio_short, tagline, mission, avatar_url")
        .single<Pick<AboutRow, "bio" | "bio_short" | "tagline" | "mission" | "avatar_url">>()

      if (aboutError && aboutError.code !== "PGRST116") {
        console.error("Error fetching about:", aboutError)
      }

      const { data: journeyRows, error: journeyError } = await supabase
        .from("journey")
        .select("id, title, company, year, description, icon")
        .order("order_index", { ascending: true })

      if (journeyError && journeyError.code !== "PGRST116") {
        console.error("Error fetching journey:", journeyError)
      }

      const { data: coreValueRows, error: coreValuesError } = await supabase
        .from("core_values")
        .select("id, title, description, icon")
        .order("order_index", { ascending: true })

      if (coreValuesError && coreValuesError.code !== "PGRST116") {
        console.error("Error fetching core values:", coreValuesError)
      }

      const nextAboutData: AboutData = {
        bio: aboutRow?.bio || defaultAboutData.bio,
        focus: aboutRow?.bio_short || defaultAboutData.focus,
        tagline: aboutRow?.tagline || defaultAboutData.tagline,
        mission: aboutRow?.mission || defaultAboutData.mission,
        avatarUrl: aboutRow?.avatar_url || undefined,
        journey: mapJourneyRows(journeyRows as JourneyRow[] | null),
        values: mapCoreValueRows(coreValueRows as CoreValueRow[] | null),
      }

      set({ aboutData: nextAboutData })
    } catch (error: unknown) {
      console.error("Failed to fetch about data:", error)
      set({ error: getErrorMessage(error, "Failed to fetch about data") })
      set({ aboutData: defaultAboutData })
    } finally {
      set({ isLoading: false })
    }
  },

  updateAboutData: async (data) => {
    const previousData = get().aboutData

    set({
      aboutData: { ...previousData, ...data },
      isLoading: true,
      error: null,
    })

    try {
      const supabase = createClient()
      const aboutData = get().aboutData

      const { data: existingRow, error: selectError } = await supabase
        .from("about")
        .select("id")
        .single<{ id: string }>()

      if (selectError && selectError.code !== "PGRST116") {
        throw selectError
      }

      const payload = getAboutUpdatePayload(aboutData)

      if (existingRow?.id) {
        const { error: updateError } = await supabase
          .from("about")
          .update(payload)
          .eq("id", existingRow.id)

        if (updateError) {
          throw updateError
        }
      } else {
        const { error: insertError } = await supabase.from("about").insert(payload)

        if (insertError) {
          throw insertError
        }
      }
    } catch (error: unknown) {
      console.error("Failed to update about data:", error)
      set({ error: getErrorMessage(error, "Failed to update about data") })
      set({ aboutData: previousData })
    } finally {
      set({ isLoading: false })
    }
  },

  updateAboutJourney: async (journeys) => {
    const previousData = get().aboutData

    set((state) => ({
      aboutData: { ...state.aboutData, journey: journeys },
    }))

    try {
      const supabase = createClient()

      await supabase
        .from("journey")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000")

      if (journeys.length > 0) {
        const payload: Database["public"]["Tables"]["journey"]["Insert"][] = journeys.map(
          (item, index) => ({
            title: item.title,
            description: item.description,
            year: item.date,
            company: item.company,
            order_index: index,
            icon: item.icon || null,
          })
        )

        const { error } = await supabase.from("journey").insert(payload)

        if (error) {
          throw error
        }
      }
    } catch (error: unknown) {
      console.error("Failed to update journey:", error)
      set({ aboutData: previousData })
    }
  },

  updateAboutValues: async (values) => {
    const previousData = get().aboutData

    set((state) => ({
      aboutData: { ...state.aboutData, values },
    }))

    try {
      const supabase = createClient()

      await supabase
        .from("core_values")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000")

      if (values.length > 0) {
        const payload: Database["public"]["Tables"]["core_values"]["Insert"][] = values.map(
          (item, index) => ({
            title: item.title,
            description: item.description,
            icon: item.icon || null,
            order_index: index,
          })
        )

        const { error } = await supabase.from("core_values").insert(payload)

        if (error) {
          throw error
        }
      }
    } catch (error: unknown) {
      console.error("Failed to update core values:", error)
      set({ aboutData: previousData })
    }
  },

  resetAboutData: () => set({ aboutData: defaultAboutData }),
}))
