import { createClient } from "@/lib/supabase/client"
import { Database } from "@/lib/types/supabase"
import { SupabaseClient } from "@supabase/supabase-js"
import { nanoid } from "nanoid"
import { create } from "zustand"

export type Skill = {
  id: string
  name: string
  level: number
  category: string
}

export type SkillCategory = {
  id: string
  name: string
  description?: string
  order: number
}

type SkillsStore = {
  skills: Skill[]
  categories: SkillCategory[]
  isLoading: boolean
  error: string | null
  fetchSkills: () => Promise<void>
  addSkill: (skill: Omit<Skill, "id">) => Promise<void>
  updateSkill: (id: string, skill: Partial<Skill>) => Promise<void>
  deleteSkill: (id: string) => Promise<void>
  getSkillsByCategory: (category: string) => Skill[]
  addCategory: (category: Omit<SkillCategory, "id">) => void
  updateCategory: (id: string, category: Partial<SkillCategory>) => void
  deleteCategory: (id: string) => void
  resetSkills: () => void
}

const defaultSkills: Skill[] = []

const defaultCategories: SkillCategory[] = [
  { id: "core", name: "Core Languages", description: "Primary programming languages", order: 1 },
  { id: "backend", name: "Backend Development", description: "Server-side frameworks and APIs", order: 2 },
  { id: "frontend", name: "Frontend Development", description: "Client-side technologies and frameworks", order: 3 },
  { id: "databases", name: "Databases", description: "Database systems and design", order: 4 },
  { id: "devops", name: "DevOps & Tools", description: "Development operations and tooling", order: 5 },
  { id: "architecture", name: "Architecture & Design", description: "System design and software architecture", order: 6 },
  { id: "emerging", name: "Emerging Tech", description: "Blockchain, AI, and cutting-edge technologies", order: 7 },
  { id: "cms", name: "CMS & Platforms", description: "Content management and platform development", order: 8 },
  { id: "learning", name: "Currently Learning", description: "Technologies actively being mastered", order: 9 },
]

export const useSkillsStore = create<SkillsStore>((set, get) => ({
  skills: defaultSkills,
  categories: defaultCategories,
  isLoading: false,
  error: null,

  fetchSkills: async () => {
    set({ isLoading: true, error: null })
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .order("order_index", { ascending: true })

      if (error) throw error

      if (data) {
        const mappedSkills: Skill[] = data.map((s: any) => ({
          id: s.id,
          name: s.name,
          level: s.proficiency || 0,
          category: s.category || "other",
        }))
        set({ skills: mappedSkills })
      }
    } catch (error: any) {
      console.error("Failed to fetch skills:", error)
      set({ error: error?.message || "Failed to fetch skills" })
    } finally {
      set({ isLoading: false })
    }
  },

  addSkill: async (skill) => {
    set({ isLoading: true, error: null })
    try {
      const supabase = createClient()
      
      const dbSkill = {
        name: skill.name,
        proficiency: skill.level,
        category: skill.category,
        order_index: 0, // Default order
      }

      const { error } = await supabase
        .from("skills")
        .insert(dbSkill)

      if (error) throw error

      await get().fetchSkills()
    } catch (error: any) {
      console.error("Failed to add skill:", error)
      set({ error: error?.message || "Failed to add skill" })
    } finally {
      set({ isLoading: false })
    }
  },

  updateSkill: async (id, skill) => {
    set({ isLoading: true, error: null })
    try {
      const supabase = createClient()
      
      const updates: any = {}
      if (skill.name) updates.name = skill.name
      if (skill.level !== undefined) updates.proficiency = skill.level
      if (skill.category) updates.category = skill.category

      const { error } = await supabase
        .from("skills")
        .update(updates)
        .eq("id", id)

      if (error) throw error

      await get().fetchSkills()
    } catch (error: any) {
      console.error("Failed to update skill:", error)
      set({ error: error?.message || "Failed to update skill" })
    } finally {
      set({ isLoading: false })
    }
  },

  deleteSkill: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("skills")
        .delete()
        .eq("id", id)

      if (error) throw error

      set((state) => ({
        skills: state.skills.filter((s) => s.id !== id),
      }))
    } catch (error: any) {
      console.error("Failed to delete skill:", error)
      set({ error: error?.message || "Failed to delete skill" })
    } finally {
      set({ isLoading: false })
    }
  },

  getSkillsByCategory: (category) => get().skills.filter((s) => s.category === category),

  addCategory: (category) =>
    set((state) => ({
      categories: [...state.categories, { ...category, id: nanoid() }],
    })),

  updateCategory: (id, category) =>
    set((state) => ({
      categories: state.categories.map((c) => (c.id === id ? { ...c, ...category } : c)),
    })),

  deleteCategory: (id) =>
    set((state) => ({
      categories: state.categories.filter((c) => c.id !== id),
    })),

  resetSkills: () => set({ skills: defaultSkills, categories: defaultCategories }),
}))
