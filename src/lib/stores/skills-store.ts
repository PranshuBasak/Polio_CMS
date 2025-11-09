import { nanoid } from "nanoid"
import { create } from "zustand"
import { persist } from "zustand/middleware"

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
  { id: "3", name: "JavaScript", level: 88, category: "core" },
  { id: "4", name: "Python", level: 75, category: "core" },
  { id: "5", name: "C++", level: 60, category: "learning" },
  { id: "6", name: "Node.js", level: 90, category: "backend" },
  { id: "7", name: "Express.js", level: 85, category: "backend" },
  { id: "8", name: "Next.js", level: 88, category: "backend" },
  { id: "9", name: "Spring Boot", level: 80, category: "backend" },
  { id: "10", name: "REST API", level: 90, category: "backend" },
  { id: "11", name: "Microservices", level: 85, category: "backend" },
  { id: "12", name: "React", level: 85, category: "frontend" },
  { id: "13", name: "Tailwind CSS", level: 80, category: "frontend" },
  { id: "14", name: "HTML5", level: 90, category: "frontend" },
  { id: "15", name: "CSS3", level: 85, category: "frontend" },
  { id: "16", name: "PostgreSQL", level: 85, category: "databases" },
  { id: "17", name: "MongoDB", level: 88, category: "databases" },
  { id: "18", name: "Redis", level: 75, category: "databases" },
  { id: "19", name: "MySQL", level: 80, category: "databases" },
  { id: "20", name: "Database Design", level: 90, category: "databases" },
  { id: "21", name: "Docker", level: 80, category: "devops" },
  { id: "22", name: "Git", level: 90, category: "devops" },
  { id: "23", name: "GitHub Actions", level: 85, category: "devops" },
  { id: "24", name: "CI/CD", level: 80, category: "devops" },
  { id: "25", name: "Linux", level: 85, category: "devops" },
  { id: "26", name: "System Design", level: 88, category: "architecture" },
  { id: "27", name: "System Architecture", level: 85, category: "architecture" },
  { id: "28", name: "API Design", level: 90, category: "architecture" },
  { id: "29", name: "Software Architecture", level: 85, category: "architecture" },
  { id: "30", name: "Clean Code", level: 92, category: "architecture" },
  { id: "31", name: "Blockchain", level: 65, category: "emerging" },
  { id: "32", name: "AI/ML", level: 60, category: "emerging" },
  { id: "33", name: "OpenAI API", level: 75, category: "emerging" },
  { id: "34", name: "WordPress", level: 80, category: "cms" },
  { id: "35", name: "PHP", level: 70, category: "cms" },
]

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
