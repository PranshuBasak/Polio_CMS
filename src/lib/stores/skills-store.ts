import { create } from "zustand"
import { persist } from "zustand/middleware"
import { nanoid } from "nanoid"

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
  addSkill: (skill: Omit<Skill, "id">) => void
  updateSkill: (id: string, skill: Partial<Skill>) => void
  deleteSkill: (id: string) => void
  getSkillsByCategory: (category: string) => Skill[]
  addCategory: (category: Omit<SkillCategory, "id">) => void
  updateCategory: (id: string, category: Partial<SkillCategory>) => void
  deleteCategory: (id: string) => void
  resetSkills: () => void
}

const defaultSkills: Skill[] = [
  { id: "1", name: "TypeScript", level: 90, category: "core" },
  { id: "2", name: "Java", level: 85, category: "core" },
  { id: "3", name: "Spring Boot", level: 80, category: "core" },
  { id: "4", name: "Node.js", level: 85, category: "core" },
  { id: "5", name: "System Design", level: 80, category: "core" },
  { id: "6", name: "Docker", level: 75, category: "devops" },
  { id: "7", name: "Kubernetes", level: 70, category: "devops" },
  { id: "8", name: "CI/CD", level: 80, category: "devops" },
  { id: "9", name: "GitHub Actions", level: 85, category: "devops" },
  { id: "10", name: "Terraform", level: 65, category: "devops" },
  { id: "11", name: "PostgreSQL", level: 85, category: "databases" },
  { id: "12", name: "MongoDB", level: 80, category: "databases" },
  { id: "13", name: "Redis", level: 75, category: "databases" },
  { id: "14", name: "Elasticsearch", level: 70, category: "databases" },
  { id: "15", name: "Rust", level: 50, category: "learning" },
  { id: "16", name: "Go", level: 60, category: "learning" },
  { id: "17", name: "Machine Learning", level: 40, category: "learning" },
]

const defaultCategories: SkillCategory[] = [
  { id: "core", name: "Core", description: "Primary programming languages and frameworks", order: 1 },
  { id: "devops", name: "DevOps", description: "Containerization, orchestration, and CI/CD", order: 2 },
  { id: "databases", name: "Databases", description: "Database systems and data storage", order: 3 },
  { id: "learning", name: "Learning", description: "Technologies I'm currently learning", order: 4 },
]

export const useSkillsStore = create<SkillsStore>()(
  persist(
    (set, get) => ({
      skills: defaultSkills,
      categories: defaultCategories,
      addSkill: (skill) =>
        set((state) => ({
          skills: [...state.skills, { ...skill, id: nanoid() }],
        })),
      updateSkill: (id, skill) =>
        set((state) => ({
          skills: state.skills.map((s) => (s.id === id ? { ...s, ...skill } : s)),
        })),
      deleteSkill: (id) =>
        set((state) => ({
          skills: state.skills.filter((s) => s.id !== id),
        })),
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
    }),
    {
      name: "skills-storage",
    },
  ),
)
