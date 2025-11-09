import { create } from "zustand"
import { persist } from "zustand/middleware"

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
  updateResumeData: (data: Partial<ResumeData>) => void
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
      startDate: "2024-01",
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
      startDate: "2019-09",
      endDate: "2023-12",
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
    {
      id: "3",
      name: "Getting Started In Spring Development",
      issuer: "LinkedIn Learning",
      date: "2025-10",
      description: "Introduction to Spring Framework covering Spring Boot, Spring Security, and enterprise application development.",
      url: "https://www.linkedin.com/learning/",
    },
    {
      id: "4",
      name: "Reactive Accelerator",
      issuer: "Learn with Sumit - LWS",
      date: "2024-06",
      description: "Advanced React.js and Node.js development course focusing on reactive programming patterns.",
      url: "https://learnwithsumit.com/",
    },
    {
      id: "5",
      name: "Introduction to Back-End Development",
      issuer: "Coursera",
      date: "2023-08",
      description: "Foundational course covering Object-Oriented Programming (OOP) and backend development principles.",
      url: "https://www.coursera.org/",
    },
    {
      id: "6",
      name: "Introduction to Front-End Development",
      issuer: "Coursera",
      date: "2023-08",
      description: "Introduction to modern frontend development including HTML, CSS, JavaScript, and responsive design.",
      url: "https://www.coursera.org/",
    },
    {
      id: "7",
      name: "Back End Development and APIs",
      issuer: "freeCodeCamp",
      date: "2023-07",
      description: "Certification demonstrating proficiency in REST APIs, backend architecture, and server-side development.",
      url: "https://www.freecodecamp.org/certification/",
    },
    {
      id: "8",
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
  pdfUrl: "/Tanzim_Hossain_Resume.pdf",
}

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set) => ({
      resumeData: defaultResumeData,
      updateResumeData: (data) =>
        set((state) => ({
          resumeData: { ...state.resumeData, ...data },
        })),
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
    }),
    {
      name: "resume-storage",
    },
  ),
)
