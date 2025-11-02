import type { Skill, SkillCategory } from "../../lib/stores"

export const mockSkills: Skill[] = [
  { id: "1", name: "TypeScript", level: 95, category: "languages" },
  { id: "2", name: "Java", level: 90, category: "languages" },
  { id: "3", name: "Python", level: 85, category: "languages" },
  { id: "4", name: "Spring Boot", level: 90, category: "frameworks" },
  { id: "5", name: "Node.js", level: 88, category: "frameworks" },
  { id: "6", name: "React", level: 85, category: "frameworks" },
  { id: "7", name: "PostgreSQL", level: 90, category: "databases" },
  { id: "8", name: "MongoDB", level: 85, category: "databases" },
  { id: "9", name: "Redis", level: 88, category: "databases" },
  { id: "10", name: "Docker", level: 92, category: "devops" },
  { id: "11", name: "Kubernetes", level: 85, category: "devops" },
  { id: "12", name: "AWS", level: 88, category: "devops" },
]

export const mockSkillCategories: SkillCategory[] = [
  { id: "1", name: "Programming Languages", description: "Core programming languages", order: 1 },
  { id: "2", name: "Frameworks", description: "Backend and frontend frameworks", order: 2 },
  { id: "3", name: "Databases", description: "SQL and NoSQL databases", order: 3 },
  { id: "4", name: "DevOps", description: "DevOps tools and practices", order: 4 },
]
