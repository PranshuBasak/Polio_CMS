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
  icon?: string
  year?: number
  orderIndex: number
  createdAt: string
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
  addSkill: (skill: Omit<Skill, "id" | "orderIndex" | "createdAt">) => Promise<void>
  updateSkill: (id: string, skill: Partial<Skill>) => Promise<void>
  deleteSkill: (id: string) => Promise<void>
  reorderSkills: (skills: Skill[]) => Promise<void>
  getSkillsByCategory: (category: string) => Skill[]
  addCategory: (category: Omit<SkillCategory, "id">) => Promise<void>
  updateCategory: (id: string, category: Partial<SkillCategory>) => Promise<void>
  deleteCategory: (id: string) => Promise<void>
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
      
      // Fetch skills and categories in parallel
      const [skillsResult, categoriesResult] = await Promise.all([
        supabase
          .from("skills")
          .select("*")
          .order("order_index", { ascending: true }),
        supabase
          .from("skill_categories")
          .select("*")
          .order("order", { ascending: true })
      ])

      if (skillsResult.error) throw skillsResult.error
      if (categoriesResult.error) throw categoriesResult.error

      if (skillsResult.data) {
        const mappedSkills: Skill[] = skillsResult.data.map((s: any) => ({
          id: s.id,
          name: s.name,
          level: s.proficiency || 0,
          category: s.category || "other",
          icon: s.icon || undefined,
          year: s.years_experience || undefined,
          orderIndex: s.order_index || 0,
          createdAt: s.created_at || new Date().toISOString(),
        }))
        set({ skills: mappedSkills })
      }

      if (categoriesResult.data) {
        const mappedCategories: SkillCategory[] = categoriesResult.data.map((c: any) => ({
          id: c.id,
          name: c.name,
          description: c.description || undefined,
          order: c.order || 0,
        }))
        set({ categories: mappedCategories })
      }
    } catch (error: any) {
      console.error("Failed to fetch skills data:", error)
      set({ error: error?.message || "Failed to fetch skills data" })
    } finally {
      set({ isLoading: false })
    }
  },

  addSkill: async (skill) => {
    set({ isLoading: true, error: null })
    try {
      const supabase = createClient()
      
      // Get max order index for the category
      const categorySkills = get().skills.filter(s => s.category === skill.category)
      const maxOrder = categorySkills.length > 0 
        ? Math.max(...categorySkills.map(s => s.orderIndex)) 
        : -1

      const dbSkill = {
        name: skill.name,
        proficiency: skill.level,
        category: skill.category,
        icon: skill.icon,
        years_experience: skill.year,
        order_index: maxOrder + 1,
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
      if (skill.icon !== undefined) updates.icon = skill.icon
      if (skill.year !== undefined) updates.years_experience = skill.year
      if (skill.orderIndex !== undefined) updates.order_index = skill.orderIndex

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

  reorderSkills: async (skills) => {
    // Optimistic update
    set({ skills })
    
    try {
      const supabase = createClient()
      
      await Promise.all(
        skills.map((skill, index) => 
          supabase
            .from("skills")
            .update({ order_index: index })
            .eq("id", skill.id)
        )
      )
      
    } catch (error: any) {
      console.error("Failed to reorder skills:", error)
      set({ error: error?.message || "Failed to reorder skills" })
      await get().fetchSkills()
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

  addCategory: async (category) => {
    set({ isLoading: true, error: null })
    try {
      const supabase = createClient()
      
      // Generate ID if not provided (though usually we want a slug-like ID)
      const id = category.name.toLowerCase().replace(/\s+/g, '-')
      
      const dbCategory = {
        id,
        name: category.name,
        description: category.description,
        order: category.order,
      }

      const { error } = await supabase
        .from("skill_categories")
        .insert(dbCategory)

      if (error) throw error

      await get().fetchSkills()
    } catch (error: any) {
      console.error("Failed to add category:", JSON.stringify(error, null, 2))
      set({ error: error?.message || "Failed to add category" })
    } finally {
      set({ isLoading: false })
    }
  },

  updateCategory: async (id, category) => {
    set({ isLoading: true, error: null })
    try {
      const supabase = createClient()
      
      const updates: any = {}
      if (category.name) updates.name = category.name
      if (category.description !== undefined) updates.description = category.description
      if (category.order !== undefined) updates.order = category.order

      const { error } = await supabase
        .from("skill_categories")
        .update(updates)
        .eq("id", id)

      if (error) throw error

      await get().fetchSkills()
    } catch (error: any) {
      console.error("Failed to update category:", error)
      set({ error: error?.message || "Failed to update category" })
    } finally {
      set({ isLoading: false })
    }
  },

  deleteCategory: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("skill_categories")
        .delete()
        .eq("id", id)

      if (error) throw error

      set((state) => ({
        categories: state.categories.filter((c) => c.id !== id),
      }))
    } catch (error: any) {
      console.error("Failed to delete category:", error)
      set({ error: error?.message || "Failed to delete category" })
    } finally {
      set({ isLoading: false })
    }
  },

  resetSkills: () => set({ skills: [], categories: [] }),
}))

// Force rebuild
