import { nanoid } from "nanoid"
import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Project = {
  id: string
  title: string
  description: string
  technologies: string[]
  githubUrl?: string
  liveUrl?: string
  image?: string
  caseStudy?: {
    challenge: string
    solution: string
    results: string
    process: string[]
    screenshots: string[]
  }
}

type ProjectsStore = {
  projects: Project[]
  addProject: (project: Omit<Project, "id">) => void
  updateProject: (id: string, project: Partial<Project>) => void
  deleteProject: (id: string) => void
  getProjectById: (id: string) => Project | undefined
  resetProjects: () => void
}

const defaultProjects: Project[] = [
  {
    id: "1",
    title: "nextRush",
    description: "Zero-dependency backend framework built from scratch in TypeScript - A lightweight, modern framework for building scalable Node.js applications",
    technologies: ["TypeScript", "Node.js", "Backend Framework", "Zero Dependencies"],
    githubUrl: "https://github.com/0xTanzim/nextRush",
    caseStudy: {
      challenge:
        "Building a production-grade backend framework without relying on external dependencies, focusing on performance and simplicity.",
      solution:
        "Developed nextRush as a zero-dependency backend framework from scratch, implementing core features like routing, middleware, request/response handling, and more using pure TypeScript.",
      results:
        "Created a lightweight, performant framework that demonstrates deep understanding of backend architecture and Node.js internals without bloated dependencies.",
      process: [
        "Architected core framework structure with TypeScript",
        "Implemented custom routing engine and middleware system",
        "Built request/response handling from scratch",
        "Created developer-friendly API with minimal footprint",
        "Optimized for performance with zero external dependencies",
      ],
      screenshots: [],
    },
  },
  {
    id: "2",
    title: "ContentChat AI",
    description: "AI-powered content interaction platform with intelligent chat capabilities - Upload documents and have natural conversations with your content",
    technologies: ["TypeScript", "Next.js", "OpenAI API", "AI/ML", "RAG"],
    githubUrl: "https://github.com/0xTanzim/contentchat-ai",
    caseStudy: {
      challenge:
        "Creating an intelligent system that allows users to interact with uploaded documents through natural language conversations.",
      solution:
        "Built an AI-powered platform integrating OpenAI's GPT models with custom RAG (Retrieval-Augmented Generation) pipeline, enabling semantic search and context-aware conversations.",
      results:
        "Delivered a seamless user experience where complex documents become interactive conversations, improving information accessibility and understanding.",
      process: [
        "Integrated OpenAI API for natural language processing",
        "Developed content parsing and chunking algorithms",
        "Implemented RAG pipeline for semantic search",
        "Created real-time chat interface with streaming responses",
        "Optimized for performance with efficient token usage",
      ],
      screenshots: [],
    },
  },
  {
    id: "3",
    title: "Multivendor E-commerce Platform",
    description: "Full-stack multivendor marketplace with vendor dashboards, product management, and order processing",
    technologies: ["TypeScript", "Next.js", "Node.js", "PostgreSQL", "Stripe"],
    githubUrl: "https://github.com/0xTanzim/Multivendor_E-commerce",
    caseStudy: {
      challenge:
        "Building a scalable e-commerce platform that supports multiple vendors with separate dashboards, inventory management, and payment processing.",
      solution:
        "Developed a full-stack multivendor platform with vendor-specific dashboards, product catalogs, order management, and integrated payment system.",
      results:
        "Created a comprehensive marketplace enabling multiple vendors to manage their stores independently with centralized admin controls.",
      process: [
        "Designed multi-tenant database architecture",
        "Implemented vendor authentication and authorization",
        "Built product catalog and inventory management system",
        "Integrated Stripe for payment processing",
        "Created admin panel for platform oversight",
      ],
      screenshots: [],
    },
  },
  {
    id: "4",
    title: "FileTree Pro",
    description: "Advanced file tree visualization and navigation tool for developers - Generate beautiful directory structures",
    technologies: ["TypeScript", "Node.js", "CLI", "File System"],
    githubUrl: "https://github.com/0xTanzim/filetree-pro",
    caseStudy: {
      challenge:
        "Creating a developer tool that generates clean, readable file tree visualizations for documentation and code exploration.",
      solution:
        "Built a CLI tool with advanced filtering, customization options, and beautiful ASCII tree generation for project directory structures.",
      results:
        "Developed a powerful yet simple tool used by developers for generating directory trees in documentation, README files, and code reviews.",
      process: [
        "Implemented recursive file system traversal",
        "Created customizable ASCII tree rendering engine",
        "Added filtering and ignore pattern support",
        "Built CLI interface with intuitive commands",
        "Optimized for performance with large directory structures",
      ],
      screenshots: [],
    },
  },
  {
    id: "5",
    title: "Aquila WordPress Theme",
    description: "Modern, responsive WordPress theme with custom JavaScript architecture",
    technologies: ["JavaScript", "PHP", "WordPress", "CSS3", "HTML5"],
    githubUrl: "https://github.com/code-BitLabs/Aquila",
    caseStudy: {
      challenge:
        "Developing a professional WordPress theme that balances modern design with performance and customizability.",
      solution:
        "Created a custom WordPress theme from scratch with modern JavaScript, PHP best practices, and a flexible customization system.",
      results:
        "Delivered a production-ready WordPress theme with excellent performance scores, SEO optimization, and intuitive customization options.",
      process: [
        "Designed theme architecture following WordPress coding standards",
        "Implemented custom Gutenberg blocks for content flexibility",
        "Created responsive layouts with mobile-first approach",
        "Optimized for performance with lazy loading and asset minification",
        "Added comprehensive theme customizer options",
      ],
      screenshots: [
        "/project-placeholder.svg",
        "/project-placeholder.svg",
        "/project-placeholder.svg",
      ],
    },
  },
  {
    id: "6",
    title: "Attendance System API",
    description: "Robust backend API for managing attendance tracking with authentication and reporting",
    technologies: ["JavaScript", "Node.js", "Express", "MongoDB", "JWT"],
    githubUrl: "https://github.com/0xTanzim/attendance-system-api",
    caseStudy: {
      challenge:
        "Building a reliable attendance management system with secure authentication, role-based access, and comprehensive reporting capabilities.",
      solution:
        "Developed a RESTful API with Express.js handling user management, attendance tracking, and automated report generation with proper security measures.",
      results:
        "Created a scalable backend system processing thousands of attendance records efficiently with real-time updates and detailed analytics.",
      process: [
        "Designed database schema for users, attendance, and reports",
        "Implemented JWT authentication with role-based authorization",
        "Created CRUD APIs for attendance management",
        "Built automated reporting system with data aggregation",
        "Added real-time notifications and email alerts",
      ],
      screenshots: [
        "/project-placeholder.svg",
        "/project-placeholder.svg",
        "/project-placeholder.svg",
      ],
    },
  },
  {
    id: "7",
    title: "Google ADK",
    description: "Python-based development kit for Google API integrations and automation",
    technologies: ["Python", "Google APIs", "REST", "OAuth2"],
    githubUrl: "https://github.com/0xTanzim/google_adk",
    caseStudy: {
      challenge:
        "Simplifying Google API integrations by creating a unified development kit that handles authentication and common operations.",
      solution:
        "Built a Python SDK wrapping multiple Google APIs with simplified interfaces, automatic authentication handling, and error management.",
      results:
        "Reduced integration time for Google services by 60% with reusable components and clear documentation.",
      process: [
        "Studied Google API documentation and common use cases",
        "Implemented OAuth2 authentication flow wrapper",
        "Created abstraction layers for frequently used APIs",
        "Built comprehensive error handling and retry mechanisms",
        "Wrote detailed documentation with code examples",
      ],
      screenshots: [
        "/project-placeholder.svg",
        "/project-placeholder.svg",
        "/project-placeholder.svg",
      ],
    },
  },
]

export const useProjectsStore = create<ProjectsStore>()(
  persist(
    (set, get) => ({
      projects: defaultProjects,
      addProject: (project) =>
        set((state) => ({
          projects: [...state.projects, { ...project, id: nanoid() }],
        })),
      updateProject: (id, project) =>
        set((state) => ({
          projects: state.projects.map((p) => (p.id === id ? { ...p, ...project } : p)),
        })),
      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        })),
      getProjectById: (id) => get().projects.find((p) => p.id === id),
      resetProjects: () => set({ projects: defaultProjects }),
    }),
    {
      name: "projects-storage",
    },
  ),
)
