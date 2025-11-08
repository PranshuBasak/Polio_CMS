"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

// Types
export type HeroData = {
  name: string
  title: string
  description: string
  image: string
}

export type AboutData = {
  bio: string
  focus: string
  journey: {
    id: string
    title: string
    company: string
    date: string
    description: string
  }[]
  values: {
    id: string
    title: string
    description: string
    icon: string
  }[]
  mission: string
}

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

export type BlogPost = {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  date: string
}

export type ExternalBlogPost = {
  id: string
  title: string
  excerpt: string
  url: string
  date: string
  source: string
}

export type BlogData = {
  internalPosts: BlogPost[]
  externalPosts: ExternalBlogPost[]
}

export type ResumeData = {
  experiences: {
    id: string
    title: string
    company: string
    location: string
    startDate: string
    endDate: string
    description: string
    achievements: string[]
  }[]
  education: {
    id: string
    degree: string
    institution: string
    location: string
    startDate: string
    endDate: string
    description: string
    courses: string[]
  }[]
  skills: {
    category: string
    items: {
      name: string
      level: number
    }[]
  }[]
  certifications: {
    id: string
    name: string
    issuer: string
    date: string
    description: string
    url?: string
  }[]
  languages: {
    name: string
    proficiency: string
  }[]
  interests: string[]
  pdfUrl: string
}

export type Testimonial = {
  id: string
  content: string
  author: string
  position: string
  company: string
  avatar?: string
  rating?: number
}

// Default data
const defaultHeroData: HeroData = {
  name: "Tanzim",
  title: "Software Architect & Backend Developer",
  description:
    "I build scalable backend systems and architect software solutions with a focus on performance, security, and maintainability.",
  image: "/avatar-placeholder.svg",
}

const defaultAboutData: AboutData = {
  bio: "I'm a software architect and backend developer with expertise in TypeScript, Java, Spring Boot, and Node.js. I specialize in designing and implementing scalable, maintainable, and secure backend systems.",
  focus:
    "My focus areas include system design, microservices architecture, and DevOps practices. I'm passionate about creating efficient solutions that solve complex problems while maintaining code quality and performance.",
  journey: [
    {
      id: "1",
      title: "Senior Software Architect",
      company: "TechInnovate",
      date: "2022 - Present",
      description:
        "Leading the architecture design for distributed systems and microservices. Implementing event-driven architecture and CQRS patterns for scalable and maintainable systems.",
    },
    {
      id: "2",
      title: "Backend Team Lead",
      company: "DataFlow Systems",
      date: "2019 - 2022",
      description:
        "Led a team of 6 backend developers. Designed and implemented scalable APIs and services using Spring Boot and Node.js. Mentored junior developers and established coding standards.",
    },
    {
      id: "3",
      title: "Software Engineer",
      company: "CloudScale",
      date: "2017 - 2019",
      description:
        "Developed and maintained backend services for high-traffic applications. Implemented CI/CD pipelines and DevOps practices to improve deployment efficiency and system reliability.",
    },
  ],
  values: [
    {
      id: "1",
      title: "Passion",
      description: "I'm deeply passionate about creating elegant solutions to complex problems.",
      icon: "Heart",
    },
    {
      id: "2",
      title: "Excellence",
      description: "I strive for excellence in every line of code and system design decision.",
      icon: "Target",
    },
    {
      id: "3",
      title: "Innovation",
      description: "I believe in continuous learning and embracing innovative approaches.",
      icon: "Lightbulb",
    },
  ],
  mission:
    "To create elegant, scalable, and maintainable software solutions that solve real-world problems and deliver exceptional value to users and businesses.",
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
        "/project-placeholder.svg",
        "/project-placeholder.svg",
        "/project-placeholder.svg",
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
        "/project-placeholder.svg",
        "/project-placeholder.svg",
        "/project-placeholder.svg",
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
        "/project-placeholder.svg",
        "/project-placeholder.svg",
        "/project-placeholder.svg",
      ],
    },
  },
]

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

const defaultSkillCategories: SkillCategory[] = [
  { id: "core", name: "Core", description: "Primary programming languages and frameworks", order: 1 },
  { id: "devops", name: "DevOps", description: "Containerization, orchestration, and CI/CD", order: 2 },
  { id: "databases", name: "Databases", description: "Database systems and data storage", order: 3 },
  { id: "learning", name: "Learning", description: "Technologies I'm currently learning", order: 4 },
]

const defaultBlogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Microservices vs Monoliths: Making the Right Choice",
    slug: "microservices-vs-monoliths",
    content:
      "# Microservices vs Monoliths\n\nWhen designing a new system, one of the first architectural decisions you'll face is whether to build a monolith or microservices...",
    excerpt:
      "Exploring the trade-offs between microservices and monolithic architectures to help you make the right choice for your next project.",
    date: "2023-10-15",
  },
  {
    id: "2",
    title: "Event Sourcing: A Practical Introduction",
    slug: "event-sourcing-introduction",
    content:
      "# Event Sourcing: A Practical Introduction\n\nEvent sourcing is a powerful pattern that changes how we think about state in our applications...",
    excerpt:
      "Learn how event sourcing can improve auditability, scalability, and flexibility in your applications with practical examples.",
    date: "2023-11-20",
  },
  {
    id: "3",
    title: "Optimizing Spring Boot Applications for Production",
    slug: "optimizing-spring-boot",
    content:
      "# Optimizing Spring Boot Applications\n\nSpring Boot makes it easy to create stand-alone, production-grade applications, but there's more to consider when preparing for production...",
    excerpt:
      "Discover essential techniques to optimize your Spring Boot applications for production environments, focusing on performance and reliability.",
    date: "2024-01-05",
  },
]

const defaultExternalPosts: ExternalBlogPost[] = [
  {
    id: "e1",
    title: "Building Resilient Microservices with Circuit Breakers",
    excerpt:
      "Learn how to implement circuit breakers in your microservices architecture to prevent cascading failures and improve system resilience.",
    url: "https://medium.com/@0xTanzim/building-resilient-microservices",
    date: "2023-09-10",
    source: "Medium",
  },
  {
    id: "e2",
    title: "TypeScript Best Practices for Large-Scale Applications",
    excerpt:
      "Discover proven TypeScript patterns and practices that help maintain code quality and developer productivity in large-scale applications.",
    url: "https://dev.to/@0xTanzim/typescript-best-practices",
    date: "2023-12-05",
    source: "Dev.to",
  },
  {
    id: "e3",
    title: "Implementing CQRS in Modern Applications",
    excerpt:
      "A deep dive into Command Query Responsibility Segregation (CQRS) and how it can be implemented in modern application architectures.",
    url: "https://hashnode.com/@0xTanzim/implementing-cqrs",
    date: "2024-02-15",
    source: "Hashnode",
  },
]

const defaultResumeData: ResumeData = {
  experiences: [
    {
      id: "1",
      title: "Senior Software Architect",
      company: "TechInnovate",
      location: "Remote",
      startDate: "2022-01",
      endDate: "Present",
      description:
        "Leading the architecture design for distributed systems and microservices. Implementing event-driven architecture and CQRS patterns for scalable and maintainable systems.",
      achievements: [
        "Designed and implemented a scalable microservice architecture that reduced system latency by 40%",
        "Led a team of 8 developers across multiple projects",
        "Introduced event sourcing pattern that improved data traceability and system resilience",
        "Established architecture review processes that improved code quality and reduced technical debt",
      ],
    },
    {
      id: "2",
      title: "Backend Team Lead",
      company: "DataFlow Systems",
      location: "San Francisco, CA",
      startDate: "2019-03",
      endDate: "2021-12",
      description:
        "Led a team of 6 backend developers. Designed and implemented scalable APIs and services using Spring Boot and Node.js.",
      achievements: [
        "Redesigned the API layer resulting in 30% performance improvement",
        "Implemented CI/CD pipelines that reduced deployment time from days to hours",
        "Mentored junior developers and established coding standards",
        "Introduced automated testing that increased code coverage from 60% to 90%",
      ],
    },
    {
      id: "3",
      title: "Software Engineer",
      company: "CloudScale",
      location: "Seattle, WA",
      startDate: "2017-06",
      endDate: "2019-02",
      description:
        "Developed and maintained backend services for high-traffic applications. Implemented CI/CD pipelines and DevOps practices.",
      achievements: [
        "Developed RESTful APIs serving over 1 million requests per day",
        "Optimized database queries that reduced response times by 50%",
        "Implemented caching strategies that improved system throughput",
        "Contributed to open-source projects related to backend development",
      ],
    },
  ],
  education: [
    {
      id: "1",
      degree: "Master's in Computer Science",
      institution: "Tech University",
      location: "Boston, MA",
      startDate: "2015-09",
      endDate: "2017-05",
      description:
        "Specialized in Distributed Systems and Cloud Computing. Thesis on Scalable Microservice Architectures.",
      courses: [
        "Advanced Algorithms",
        "Distributed Systems",
        "Cloud Computing",
        "Database Management Systems",
        "Software Engineering",
      ],
    },
    {
      id: "2",
      degree: "Bachelor's in Computer Engineering",
      institution: "State University",
      location: "Chicago, IL",
      startDate: "2011-09",
      endDate: "2015-05",
      description: "Graduated with honors. Focus on software development and computer architecture.",
      courses: ["Data Structures", "Algorithms", "Operating Systems", "Computer Networks", "Software Development"],
    },
  ],
  skills: [
    {
      category: "Programming Languages",
      items: [
        { name: "TypeScript/JavaScript", level: 90 },
        { name: "Java", level: 85 },
        { name: "Python", level: 75 },
        { name: "Go", level: 60 },
        { name: "Rust", level: 50 },
      ],
    },
    {
      category: "Frameworks & Libraries",
      items: [
        { name: "Spring Boot", level: 85 },
        { name: "Node.js", level: 90 },
        { name: "Express", level: 85 },
        { name: "React", level: 70 },
        { name: "Next.js", level: 65 },
      ],
    },
    {
      category: "DevOps & Cloud",
      items: [
        { name: "Docker", level: 80 },
        { name: "Kubernetes", level: 75 },
        { name: "AWS", level: 70 },
        { name: "GitHub Actions", level: 85 },
        { name: "Terraform", level: 65 },
      ],
    },
    {
      category: "Databases",
      items: [
        { name: "PostgreSQL", level: 85 },
        { name: "MongoDB", level: 80 },
        { name: "Redis", level: 75 },
        { name: "Elasticsearch", level: 70 },
      ],
    },
  ],
  certifications: [
    {
      id: "1",
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      date: "2023-05",
      description: "Professional certification validating expertise in designing distributed systems on AWS.",
      url: "https://aws.amazon.com/certification/certified-solutions-architect-professional/",
    },
    {
      id: "2",
      name: "Certified Kubernetes Administrator",
      issuer: "Cloud Native Computing Foundation",
      date: "2022-08",
      description: "Certification demonstrating proficiency in Kubernetes administration and deployment.",
      url: "https://www.cncf.io/certification/cka/",
    },
    {
      id: "3",
      name: "Oracle Certified Professional, Java SE 11 Developer",
      issuer: "Oracle",
      date: "2021-03",
      description: "Certification validating expertise in Java development and best practices.",
      url: "https://education.oracle.com/java-se-11-developer/pexam_1Z0-819",
    },
  ],
  languages: [
    { name: "English", proficiency: "Native" },
    { name: "Spanish", proficiency: "Intermediate" },
  ],
  interests: ["Open Source Development", "System Architecture", "Cloud Computing", "Hiking", "Photography"],
  pdfUrl: "/placeholder.pdf",
}

const defaultTestimonials: Testimonial[] = [
  {
    id: "1",
    content:
      "Tanzim's expertise in backend architecture transformed our system. His solutions are not only efficient but also highly scalable and maintainable.",
    author: "Sarah Johnson",
    position: "CTO",
    company: "TechInnovate",
    avatar: "/avatar-placeholder.svg",
    rating: 5,
  },
  {
    id: "2",
    content:
      "Working with Tanzim was a game-changer for our startup. His deep knowledge of microservices and system design helped us build a robust foundation for growth.",
    author: "Michael Chen",
    position: "Founder",
    company: "DataFlow Systems",
    avatar: "/avatar-placeholder.svg",
    rating: 5,
  },
  {
    id: "3",
    content:
      "Tanzim delivered exceptional results on our API gateway project. His attention to detail and commitment to best practices resulted in a secure and high-performance solution.",
    author: "Priya Patel",
    position: "Lead Developer",
    company: "CloudScale",
    avatar: "/avatar-placeholder.svg",
    rating: 5,
  },
]

// Context
type DataContextType = {
  heroData: HeroData
  updateHeroData: (data: Partial<HeroData>) => void
  aboutData: AboutData
  updateAboutData: (data: Partial<AboutData>) => void
  updateAboutJourney: (journeys: AboutData["journey"]) => void
  updateAboutValues: (values: AboutData["values"]) => void
  projectsData: Project[]
  addProject: (project: Omit<Project, "id">) => void
  updateProject: (id: string, project: Partial<Project>) => void
  deleteProject: (id: string) => void
  skillsData: Skill[]
  addSkill: (skill: Omit<Skill, "id">) => void
  updateSkill: (id: string, skill: Partial<Skill>) => void
  deleteSkill: (id: string) => void
  skillCategories: SkillCategory[]
  addSkillCategory: (category: Omit<SkillCategory, "id">) => void
  updateSkillCategory: (id: string, category: Partial<SkillCategory>) => void
  deleteSkillCategory: (id: string) => void
  blogData: BlogData
  addBlogPost: (post: Omit<BlogPost, "id" | "slug">) => void
  updateBlogPost: (id: string, post: Partial<BlogPost>) => void
  deleteBlogPost: (id: string) => void
  refreshExternalPosts: () => Promise<void>
  resumeData: ResumeData
  updateResumeData: (data: Partial<ResumeData>) => void
  updateResumeExperiences: (experiences: ResumeData["experiences"]) => void
  updateResumeEducation: (education: ResumeData["education"]) => void
  updateResumeSkills: (skills: ResumeData["skills"]) => void
  updateResumeCertifications: (certifications: ResumeData["certifications"]) => void
  testimonials: Testimonial[]
  addTestimonial: (testimonial: Omit<Testimonial, "id">) => void
  updateTestimonial: (id: string, testimonial: Partial<Testimonial>) => void
  deleteTestimonial: (id: string) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  // Initialize state from localStorage if available, otherwise use defaults
  const [heroData, setHeroData] = useState<HeroData>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("heroData")
      return saved ? JSON.parse(saved) : defaultHeroData
    }
    return defaultHeroData
  })

  const [aboutData, setAboutData] = useState<AboutData>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("aboutData")
      return saved ? JSON.parse(saved) : defaultAboutData
    }
    return defaultAboutData
  })

  const [projectsData, setProjectsData] = useState<Project[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("projectsData")
      return saved ? JSON.parse(saved) : defaultProjects
    }
    return defaultProjects
  })

  const [skillsData, setSkillsData] = useState<Skill[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("skillsData")
      return saved ? JSON.parse(saved) : defaultSkills
    }
    return defaultSkills
  })

  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("skillCategories")
      return saved ? JSON.parse(saved) : defaultSkillCategories
    }
    return defaultSkillCategories
  })

  const [blogData, setBlogData] = useState<BlogData>(() => {
    if (typeof window !== "undefined") {
      const savedPosts = localStorage.getItem("blogPosts")
      const savedExternalPosts = localStorage.getItem("externalBlogPosts")

      return {
        internalPosts: savedPosts ? JSON.parse(savedPosts) : defaultBlogPosts,
        externalPosts: savedExternalPosts ? JSON.parse(savedExternalPosts) : defaultExternalPosts,
      }
    }
    return {
      internalPosts: defaultBlogPosts,
      externalPosts: defaultExternalPosts,
    }
  })

  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("resumeData")
      return saved ? JSON.parse(saved) : defaultResumeData
    }
    return defaultResumeData
  })

  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("testimonials")
      return saved ? JSON.parse(saved) : defaultTestimonials
    }
    return defaultTestimonials
  })

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("heroData", JSON.stringify(heroData))
      localStorage.setItem("aboutData", JSON.stringify(aboutData))
      localStorage.setItem("projectsData", JSON.stringify(projectsData))
      localStorage.setItem("skillsData", JSON.stringify(skillsData))
      localStorage.setItem("skillCategories", JSON.stringify(skillCategories))
      localStorage.setItem("blogPosts", JSON.stringify(blogData.internalPosts))
      localStorage.setItem("externalBlogPosts", JSON.stringify(blogData.externalPosts))
      localStorage.setItem("resumeData", JSON.stringify(resumeData))
      localStorage.setItem("testimonials", JSON.stringify(testimonials))
    }
  }, [heroData, aboutData, projectsData, skillsData, skillCategories, blogData, resumeData, testimonials])

  // Update functions
  const updateHeroData = (data: Partial<HeroData>) => {
    setHeroData((prev) => ({ ...prev, ...data }))
  }

  const updateAboutData = (data: Partial<AboutData>) => {
    setAboutData((prev) => ({ ...prev, ...data }))
  }

  const updateAboutJourney = (journeys: AboutData["journey"]) => {
    setAboutData((prev) => ({ ...prev, journey: journeys }))
  }

  const updateAboutValues = (values: AboutData["values"]) => {
    setAboutData((prev) => ({ ...prev, values: values }))
  }

  const addProject = (project: Omit<Project, "id">) => {
    const newProject = {
      ...project,
      id: Date.now().toString(),
    }
    setProjectsData((prev) => [...prev, newProject])
  }

  const updateProject = (id: string, project: Partial<Project>) => {
    setProjectsData((prev) => prev.map((p) => (p.id === id ? { ...p, ...project } : p)))
  }

  const deleteProject = (id: string) => {
    setProjectsData((prev) => prev.filter((p) => p.id !== id))
  }

  const addSkill = (skill: Omit<Skill, "id">) => {
    const newSkill = {
      ...skill,
      id: Date.now().toString(),
    }
    setSkillsData((prev) => [...prev, newSkill])
  }

  const updateSkill = (id: string, skill: Partial<Skill>) => {
    setSkillsData((prev) => prev.map((s) => (s.id === id ? { ...s, ...skill } : s)))
  }

  const deleteSkill = (id: string) => {
    setSkillsData((prev) => prev.filter((s) => s.id !== id))
  }

  const addSkillCategory = (category: Omit<SkillCategory, "id">) => {
    const newCategory = {
      ...category,
      id: Date.now().toString(),
    }
    setSkillCategories((prev) => [...prev, newCategory])
  }

  const updateSkillCategory = (id: string, category: Partial<SkillCategory>) => {
    setSkillCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...category } : c)))
  }

  const deleteSkillCategory = (id: string) => {
    setSkillCategories((prev) => prev.filter((c) => c.id !== id))
  }

  const addBlogPost = (post: Omit<BlogPost, "id" | "slug">) => {
    const slug = post.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-")

    const newPost = {
      ...post,
      id: Date.now().toString(),
      slug,
    }

    setBlogData((prev) => ({
      ...prev,
      internalPosts: [...prev.internalPosts, newPost],
    }))
  }

  const updateBlogPost = (id: string, post: Partial<BlogPost>) => {
    setBlogData((prev) => ({
      ...prev,
      internalPosts: prev.internalPosts.map((p) =>
        p.id === id
          ? {
              ...p,
              ...post,
              slug: post.title
                ? post.title
                    .toLowerCase()
                    .replace(/[^\w\s]/gi, "")
                    .replace(/\s+/g, "-")
                : p.slug,
            }
          : p,
      ),
    }))
  }

  const deleteBlogPost = (id: string) => {
    setBlogData((prev) => ({
      ...prev,
      internalPosts: prev.internalPosts.filter((p) => p.id !== id),
    }))
  }

  const refreshExternalPosts = async () => {
    try {
      // In a real implementation, this would fetch from actual RSS feeds
      // For this demo, we'll just simulate a refresh by adding a timestamp
      const timestamp = new Date().toISOString()

      setBlogData((prev) => ({
        ...prev,
        externalPosts: prev.externalPosts.map((post) => ({
          ...post,
          title: post.title.includes("(Updated)")
            ? post.title
            : `${post.title} (Updated: ${new Date().toLocaleTimeString()})`,
        })),
      }))

      return Promise.resolve()
    } catch (error) {
      console.error("Failed to refresh external posts:", error)
      return Promise.reject(error)
    }
  }

  const updateResumeData = (data: Partial<ResumeData>) => {
    setResumeData((prev) => ({ ...prev, ...data }))
  }

  const updateResumeExperiences = (experiences: ResumeData["experiences"]) => {
    setResumeData((prev) => ({ ...prev, experiences }))
  }

  const updateResumeEducation = (education: ResumeData["education"]) => {
    setResumeData((prev) => ({ ...prev, education }))
  }

  const updateResumeSkills = (skills: ResumeData["skills"]) => {
    setResumeData((prev) => ({ ...prev, skills }))
  }

  const updateResumeCertifications = (certifications: ResumeData["certifications"]) => {
    setResumeData((prev) => ({ ...prev, certifications }))
  }

  const addTestimonial = (testimonial: Omit<Testimonial, "id">) => {
    const newTestimonial = {
      ...testimonial,
      id: Date.now().toString(),
    }
    setTestimonials((prev) => [...prev, newTestimonial])
  }

  const updateTestimonial = (id: string, testimonial: Partial<Testimonial>) => {
    setTestimonials((prev) => prev.map((t) => (t.id === id ? { ...t, ...testimonial } : t)))
  }

  const deleteTestimonial = (id: string) => {
    setTestimonials((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <DataContext.Provider
      value={{
        heroData,
        updateHeroData,
        aboutData,
        updateAboutData,
        updateAboutJourney,
        updateAboutValues,
        projectsData,
        addProject,
        updateProject,
        deleteProject,
        skillsData,
        addSkill,
        updateSkill,
        deleteSkill,
        skillCategories,
        addSkillCategory,
        updateSkillCategory,
        deleteSkillCategory,
        blogData,
        addBlogPost,
        updateBlogPost,
        deleteBlogPost,
        refreshExternalPosts,
        resumeData,
        updateResumeData,
        updateResumeExperiences,
        updateResumeEducation,
        updateResumeSkills,
        updateResumeCertifications,
        testimonials,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
