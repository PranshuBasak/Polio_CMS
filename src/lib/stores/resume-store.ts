import { createClient } from "@/lib/supabase/client"
import { create } from "zustand"

export type ResumeExperience = {
  id: string
  title: string
  company: string
  location: string
  startDate: string
  endDate: string
  description: string
  achievements: string[]
}

export type ResumeEducation = {
  id: string
  degree: string
  institution: string
  location: string
  startDate: string
  endDate: string
  description: string
  courses: string[]
}

export type ResumeSkillCategory = {
  category: string
  items: {
    name: string
    level: number
  }[]
}

export type ResumeCertification = {
  id: string
  name: string
  issuer: string
  date: string
  description: string
  url?: string
}

export type ResumeData = {
  experiences: ResumeExperience[]
  education: ResumeEducation[]
  skills: ResumeSkillCategory[]
  certifications: ResumeCertification[]
  languages: {
    name: string
    proficiency: string
  }[]
  interests: string[]
  pdfUrl: string
}

type ResumeStore = {
  resumeData: ResumeData
  isLoading: boolean
  error: string | null
  fetchResumeData: () => Promise<void>
  updateResumeData: (data: Partial<ResumeData>) => Promise<void>
  updateExperiences: (experiences: ResumeExperience[]) => void
  updateEducation: (education: ResumeEducation[]) => void
  updateSkills: (skills: ResumeSkillCategory[]) => void
  updateCertifications: (certifications: ResumeCertification[]) => void
  resetResume: () => void
}

const defaultResumeData: ResumeData = {
  experiences: [
    {
      id: "1",
      title: "Backend Developer",
      company: "Softsasi",
      location: "Remote",
      startDate: "2025-01",
      endDate: "Present",
      description:
        "Developing scalable backend systems and APIs using modern technologies. Building full-stack applications with focus on performance and maintainability.",
      achievements: [
        "Designed and implemented RESTful APIs serving production traffic",
        "Built scalable microservices architecture with TypeScript and Node.js",
        "Implemented CI/CD pipelines for automated deployment",
        "Contributed to system design and architectural decisions",
      ],
    },
    {
      id: "2",
      title: "Software Developer",
      company: "code-BitLabs",
      location: "Remote",
      startDate: "2023-01",
      endDate: "Present",
      description:
        "Working on backend development and system design. Building enterprise-grade solutions with focus on scalability and clean code.",
      achievements: [
        "Developed backend services using Spring Boot and Node.js",
        "Implemented database optimization strategies that improved query performance",
        "Contributed to open-source projects with 724+ GitHub contributions",
        "Mentored junior developers on best practices and design patterns",
      ],
    },
  ],
  education: [
    {
      id: "1",
      degree: "Bachelor of Science in Computer Science & Engineering",
      institution: "United International University",
      location: "Dhaka, Bangladesh",
      startDate: "2020-09",
      endDate: "2026-12",
      description:
        "Focused on software development, system design, data structures, and algorithms. Active participation in competitive programming and open-source contributions.",
      courses: [
        "Data Structures & Algorithms",
        "Database Management Systems",
        "Software Engineering",
        "Operating Systems",
        "Computer Networks",
        "Object-Oriented Programming",
        "Web Technologies",
        "System Design",
      ],
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
      name: "Hands-On AI: Building Agents with the Google Agent Development Toolkit (ADK)",
      issuer: "LinkedIn Learning",
      date: "2025-11",
      description: "Practical course on building AI agents using Google's Agent Development Toolkit with hands-on projects.",
      url: "https://www.linkedin.com/learning/",
    },
    {
      id: "2",
      name: "Complete Guide to Java Design Patterns: Creational, Behavioral, and Structural",
      issuer: "LinkedIn Learning",
      date: "2025-10",
      description: "Comprehensive deep dive into fundamentals of software design patterns including creational, behavioral, and structural patterns.",
      url: "https://www.linkedin.com/learning/",
    },
  ],
  languages: [
    { name: "English", proficiency: "Native" },
    { name: "Spanish", proficiency: "Intermediate" },
  ],
  interests: ["Open Source Development", "System Architecture", "Cloud Computing", "Hiking", "Photography"],
  pdfUrl: "/Pranshu_Basak_Resume.pdf",
}

export const useResumeStore = create<ResumeStore>((set, get) => ({
  resumeData: defaultResumeData,
  isLoading: false,
  error: null,

  fetchResumeData: async () => {
    set({ isLoading: true, error: null })
    try {
      const supabase = createClient()

      // Fetch experiences
      const { data: experiences } = await supabase
        .from("experiences")
        .select("*")
        .order("start_date", { ascending: false })

      // Fetch education
      const { data: education } = await supabase
        .from("education")
        .select("*")
        .order("start_date", { ascending: false })

      // Fetch certifications
      const { data: certifications } = await supabase
        .from("certifications")
        .select("*")
        .order("date", { ascending: false })

      // Map to ResumeData format
      const resumeData: ResumeData = {
        experiences: experiences?.map((exp: any) => ({
          id: exp.id,
          title: exp.position,
          company: exp.company,
          location: exp.location || "",
          startDate: exp.start_date,
          endDate: exp.end_date || "Present",
          description: exp.description,
          achievements: exp.achievements || [],
        })) || defaultResumeData.experiences,
        education: education?.map((edu: any) => ({
          id: edu.id,
          degree: edu.degree,
          institution: edu.institution,
          location: edu.location || "",
          startDate: edu.start_date,
          endDate: edu.end_date,
          description: edu.description,
          courses: edu.courses || [],
        })) || defaultResumeData.education,
        skills: defaultResumeData.skills, // Keep from local data
        certifications: certifications?.map((cert: any) => ({
          id: cert.id,
          name: cert.name,
          issuer: cert.issuer,
          date: cert.date,
          description: cert.description,
          url: cert.url,
        })) || defaultResumeData.certifications,
        languages: defaultResumeData.languages,
        interests: defaultResumeData.interests,
        pdfUrl: defaultResumeData.pdfUrl,
      }

      set({ resumeData })
    } catch (error: any) {
      console.error("Failed to fetch resume data:", error)
      set({ error: error?.message || "Failed to fetch resume data" })
      set({ resumeData: defaultResumeData })
    } finally {
      set({ isLoading: false })
    }
  },

  updateResumeData: async (data) => {
    const currentData = get().resumeData
    // Optimistic update
    set({
      resumeData: { ...currentData, ...data },
      isLoading: true,
      error: null,
    })

    try {
      // For now, just update local state
      // Full Supabase update implementation would require separate endpoints for each section
      console.log("Resume data updated locally:", data)
    } catch (error: any) {
      console.error("Failed to update resume data:", error)
      set({ error: error?.message || "Failed to update resume data" })
      set({ resumeData: currentData })
    } finally {
      set({ isLoading: false })
    }
  },

  updateExperiences: (experiences) =>
    set((state) => ({
      resumeData: { ...state.resumeData, experiences },
    })),

  updateEducation: (education) =>
    set((state) => ({
      resumeData: { ...state.resumeData, education },
    })),

  updateSkills: (skills) =>
    set((state) => ({
      resumeData: { ...state.resumeData, skills },
    })),

  updateCertifications: (certifications) =>
    set((state) => ({
      resumeData: { ...state.resumeData, certifications },
    })),

  resetResume: () => set({ resumeData: defaultResumeData }),
}))
