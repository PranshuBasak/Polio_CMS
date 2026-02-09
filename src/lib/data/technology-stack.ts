import type { ComponentType, SVGProps } from "react"
import {
  SiCloudinary,
  SiCypress,
  SiDocker,
  SiExpress,
  SiFigma,
  SiFramer,
  SiGit,
  SiGithub,
  SiGooglecloud,
  SiGraphql,
  SiJest,
  SiKubernetes,
  SiLinux,
  SiMongodb,
  SiNextdotjs,
  SiNodedotjs,
  SiOpenai,
  SiPostgresql,
  SiPrisma,
  SiPython,
  SiReact,
  SiRedis,
  SiShadcnui,
  SiSocketdotio,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
  SiJavascript,
} from "@icons-pack/react-simple-icons"

export type TechnologyItem = {
  name: string
  icon?: ComponentType<SVGProps<SVGSVGElement>>
  slug?: string
  category:
    | "language"
    | "frontend"
    | "backend"
    | "database"
    | "cloud"
    | "tooling"
    | "ai"
    | "crm"
    | "integration"
}

export const technologyStack: TechnologyItem[] = [
  // Programming Languages
  { name: "C#", slug: "c", category: "language" },
  { name: "JavaScript", icon: SiJavascript, slug: "javascript", category: "language" },
  { name: "TypeScript", icon: SiTypescript, slug: "typescript", category: "language" },
  { name: "SQL", slug: "postgresql", category: "language" },
  { name: "Python", icon: SiPython, slug: "python", category: "language" },
  { name: "HTML5", slug: "html5", category: "language" },
  { name: "CSS3", slug: "css", category: "language" },

  // Frontend Frameworks & Libraries
  { name: "React", icon: SiReact, slug: "react", category: "frontend" },
  { name: "Next.js", icon: SiNextdotjs, slug: "nextdotjs", category: "frontend" },
  { name: "Zustand", slug: "zazzle", category: "frontend" },
  { name: "Clerk", slug: "clerk", category: "frontend" },
  { name: "Tailwind CSS", icon: SiTailwindcss, slug: "tailwindcss", category: "frontend" },
  { name: "Angular", slug: "angular", category: "frontend" },
  { name: "React Query", slug: "reactquery", category: "frontend" },
  { name: "Vue.js", slug: "vuedotjs", category: "frontend" },
  { name: "shadcn/ui", icon: SiShadcnui, slug: "shadcnui", category: "frontend" },

  // Backend & Runtime
  { name: "Node.js", icon: SiNodedotjs, slug: "nodedotjs", category: "backend" },
  { name: ".NET / C#", slug: "dotnet", category: "backend" },
  { name: "Express", icon: SiExpress, slug: "express", category: "backend" },

  // Databases
  { name: "PostgreSQL", icon: SiPostgresql, slug: "postgresql", category: "database" },
  { name: "MSSQL", slug: "mysql", category: "database" },
  { name: "MongoDB", icon: SiMongodb, slug: "mongodb", category: "database" },
  { name: "Redis", icon: SiRedis, slug: "redis", category: "database" },
  { name: "Prisma", icon: SiPrisma, slug: "prisma", category: "database" },

  // AI & Machine Learning
  { name: "Vercel AI SDK", slug: "vercel", category: "ai" },
  { name: "Google Gemini AI", slug: "googlegemini", category: "ai" },
  { name: "Groq", slug: "grocy", category: "ai" },
  { name: "OpenAI API", icon: SiOpenai, slug: "openai", category: "ai" },
  { name: "AI Agent SDKs", slug: "opentofu", category: "ai" },
  { name: "LLM Notebook Tools", slug: "googlecolab", category: "ai" },
  { name: "GraphQL", icon: SiGraphql, slug: "graphql", category: "ai" },

  // CRM & Low-Code Platforms
  { name: "Creatio CRM", slug: "craftcms", category: "crm" },
  { name: "SharePoint", slug: "sharex", category: "crm" },
  { name: "Microsoft Graph API", slug: "graphite", category: "crm" },
  { name: "DocuSign", slug: "signal", category: "crm" },

  // Cloud & Deployment
  { name: "Supabase", icon: SiSupabase, slug: "supabase", category: "cloud" },
  { name: "Docker", icon: SiDocker, slug: "docker", category: "cloud" },
  { name: "Kubernetes", icon: SiKubernetes, slug: "kubernetes", category: "cloud" },
  { name: "Vercel", icon: SiVercel, slug: "vercel", category: "cloud" },
  { name: "Google Cloud", icon: SiGooglecloud, slug: "googlecloud", category: "cloud" },
  { name: "Cloudinary", icon: SiCloudinary, slug: "cloudinary", category: "cloud" },

  // Development Tools & IDEs
  { name: "VS Code", slug: "V", category: "tooling" },
  { name: "Antigravity IDE", slug: "google", category: "tooling" },
  { name: "Windsurf", slug: "windsurf", category: "tooling" },
  { name: "Postman", slug: "postman", category: "tooling" },
  { name: "Ngrok", slug: "ngrok", category: "tooling" },
  { name: "Socket.IO", icon: SiSocketdotio, slug: "socketdotio", category: "tooling" },
  { name: "Git", icon: SiGit, slug: "git", category: "tooling" },
  { name: "GitHub", icon: SiGithub, slug: "github", category: "tooling" },
  { name: "Jest", icon: SiJest, slug: "jest", category: "tooling" },
  { name: "Cypress", icon: SiCypress, slug: "cypress", category: "tooling" },
  { name: "Figma", icon: SiFigma, slug: "figma", category: "tooling" },
  { name: "Framer", icon: SiFramer, slug: "framer", category: "tooling" },
  { name: "Linux", icon: SiLinux, slug: "linux", category: "tooling" },

  // Integration & APIs
  { name: "REST API", slug: "fastapi", category: "integration" },
  { name: "OData", slug: "datocms", category: "integration" },
  { name: "OAuth", slug: "authelia", category: "integration" },
]
