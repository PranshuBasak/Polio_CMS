import { create } from "zustand"
import { persist } from "zustand/middleware"
import { nanoid } from "nanoid"

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
    title: "Microservice Architecture",
    description: "A scalable microservice architecture using Spring Boot and Docker",
    technologies: ["Java", "Spring Boot", "Docker", "Kubernetes", "RabbitMQ"],
    githubUrl: "https://github.com/0xTanzim/microservice-architecture",
    caseStudy: {
      challenge:
        "The client needed a scalable microservice architecture that could handle high traffic loads while maintaining data consistency across services.",
      solution:
        "Implemented a robust microservice architecture using Spring Boot for core services and Node.js for lightweight services. Used Kafka for event-driven communication between services.",
      results:
        "The new architecture resulted in a 40% improvement in response times and enabled the system to handle 3x the previous traffic load without performance degradation.",
      process: [
        "Analyzed the existing monolithic architecture and identified service boundaries",
        "Designed the new microservice architecture with clear domain boundaries",
        "Implemented core services using Spring Boot with domain-driven design principles",
        "Set up Kafka for event-driven communication between services",
        "Deployed the solution using Docker and Kubernetes for scalability",
      ],
      screenshots: [
        "/placeholder.svg?height=300&width=500",
        "/placeholder.svg?height=300&width=500",
        "/placeholder.svg?height=300&width=500",
      ],
    },
  },
  {
    id: "2",
    title: "API Gateway",
    description: "A high-performance API gateway with rate limiting and authentication",
    technologies: ["TypeScript", "Node.js", "Express", "Redis"],
    githubUrl: "https://github.com/0xTanzim/api-gateway",
    liveUrl: "https://api-gateway-demo.vercel.app",
    caseStudy: {
      challenge:
        "The client needed a centralized API gateway to manage authentication, rate limiting, and request routing for multiple microservices.",
      solution:
        "Built a custom API gateway using Node.js and Express with Redis for caching and rate limiting. Implemented JWT authentication and role-based access control.",
      results:
        "The API gateway reduced unauthorized access attempts by 95% and improved overall API performance by 30% through effective caching and load balancing.",
      process: [
        "Designed the gateway architecture with security and performance in mind",
        "Implemented JWT authentication and role-based access control",
        "Set up Redis for caching and rate limiting",
        "Created a flexible routing system for microservice endpoints",
        "Implemented comprehensive logging and monitoring",
      ],
      screenshots: [
        "/placeholder.svg?height=300&width=500",
        "/placeholder.svg?height=300&width=500",
        "/placeholder.svg?height=300&width=500",
      ],
    },
  },
  {
    id: "3",
    title: "Event Sourcing System",
    description: "An event sourcing implementation with CQRS pattern",
    technologies: ["Java", "Spring Boot", "Kafka", "MongoDB", "PostgreSQL"],
    githubUrl: "https://github.com/0xTanzim/event-sourcing",
    caseStudy: {
      challenge:
        "The client needed a system that could maintain a complete audit trail of all data changes while providing high-performance read operations.",
      solution:
        "Implemented an event sourcing architecture with CQRS pattern using Spring Boot, Kafka for event streaming, MongoDB for the event store, and PostgreSQL for read models.",
      results:
        "The system provided 100% data traceability with the ability to reconstruct the state at any point in time, while maintaining sub-100ms query response times.",
      process: [
        "Designed the event sourcing and CQRS architecture",
        "Implemented the event store using MongoDB",
        "Set up Kafka for event streaming and processing",
        "Created optimized read models in PostgreSQL",
        "Developed a mechanism to rebuild read models from the event store",
      ],
      screenshots: [
        "/placeholder.svg?height=300&width=500",
        "/placeholder.svg?height=300&width=500",
        "/placeholder.svg?height=300&width=500",
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
