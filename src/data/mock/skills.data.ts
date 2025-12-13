import type { Skill, SkillCategory } from "../../lib/stores"

export const mockSkills: Skill[] = [
  { id: "1", name: "TypeScript", level: 95, category: "languages", orderIndex: 1, createdAt: "2024-01-01" },
  { id: "2", name: "Java", level: 90, category: "languages", orderIndex: 2, createdAt: "2024-01-01" },
  { id: "3", name: "Python", level: 85, category: "languages", orderIndex: 3, createdAt: "2024-01-01" },
  { id: "4", name: "Spring Boot", level: 90, category: "frameworks", orderIndex: 4, createdAt: "2024-01-01" },
  { id: "5", name: "Node.js", level: 88, category: "frameworks", orderIndex: 5, createdAt: "2024-01-01" },
  { id: "6", name: "React", level: 85, category: "frameworks", orderIndex: 6, createdAt: "2024-01-01" },
  { id: "7", name: "PostgreSQL", level: 90, category: "databases", orderIndex: 7, createdAt: "2024-01-01" },
  { id: "8", name: "MongoDB", level: 85, category: "databases", orderIndex: 8, createdAt: "2024-01-01" },
  { id: "9", name: "Redis", level: 88, category: "databases", orderIndex: 9, createdAt: "2024-01-01" },
  { id: "10", name: "Docker", level: 92, category: "devops", orderIndex: 10, createdAt: "2024-01-01" },
  { id: "11", name: "Kubernetes", level: 85, category: "devops", orderIndex: 11, createdAt: "2024-01-01" },
  { id: "12", name: "AWS", level: 88, category: "devops", orderIndex: 12, createdAt: "2024-01-01" },
]

export const mockSkillCategories: SkillCategory[] = [
  { id: "1", name: "Programming Languages", description: "Core programming languages", order: 1 },
  { id: "2", name: "Frameworks", description: "Backend and frontend frameworks", order: 2 },
  { id: "3", name: "Databases", description: "SQL and NoSQL databases", order: 3 },
  { id: "4", name: "DevOps", description: "DevOps tools and practices", order: 4 },
]
