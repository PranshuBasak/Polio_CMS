import { create } from "zustand"
import { persist } from "zustand/middleware"

export type AboutJourneyItem = {
  id: string
  title: string
  company: string
  date: string
  description: string
}

export type AboutValue = {
  id: string
  title: string
  description: string
  icon: string
}

export type AboutData = {
  bio: string
  focus: string
  journey: AboutJourneyItem[]
  values: AboutValue[]
  mission: string
}

type AboutStore = {
  aboutData: AboutData
  updateAboutData: (data: Partial<AboutData>) => void
  updateAboutJourney: (journeys: AboutJourneyItem[]) => void
  updateAboutValues: (values: AboutValue[]) => void
  resetAboutData: () => void
}

const defaultAboutData: AboutData = {
  bio: "I'm Tanzim Hossain, a passionate backend developer and system design enthusiast from Bangladesh. I'm dedicated to mastering software architecture, microservices, and building scalable, efficient applications. Proficient in TypeScript & Java, currently expanding expertise in C++. Strong advocate for clean code, industry best practices, and high-performance systems.",
  focus:
    "🎯 Specializing in database design, API development, and DevOps.\n\n🤖 Enthusiastic about AI, blockchain, and system scalability.\n\n🔍 Passionate about emerging technologies and their impact on industries.\n\n🧠 Applying psychology & creative problem-solving to software engineering.\n\n🛠️ Active in open-source collaboration and tech community.\n\n⚡ Believe in working smarter, not just harder!",
  journey: [
    {
      id: "1",
      title: "Backend Developer",
      company: "code-BitLabs",
      date: "2023 - Present",
      description:
        "Actively contributing to open-source projects and collaborating on innovative solutions. Developed Aquila WordPress Theme with modern JavaScript architecture. Focused on building scalable backend systems and database optimization.",
    },
    {
      id: "2",
      title: "Software Developer",
      company: "Softsasi",
      date: "2025 - Present",
      description:
        "Working on Next.js and TypeScript projects, building modern web applications with focus on performance and user experience. Contributing to team's technical growth and code quality standards.",
    },
    {
      id: "3",
      title: "Active Open Source Contributor",
      company: "GitHub Community",
      date: "2020 - Present",
      description:
        "724 contributions in the past year. Contributed to react-hook-form and multiple repositories. GitHub PRO member with achievements including Pull Shark x2, Galaxy Brain, Quickdraw, YOLO, and Arctic Code Vault Contributor. Active in EclipseFdn community.",
    },
  ],
  values: [
    {
      id: "1",
      title: "Clean Code Advocate",
      description: "Strong believer in industry best practices, maintainable architecture, and writing code that speaks for itself.",
      icon: "Code",
    },
    {
      id: "2",
      title: "Work Smarter",
      description: "⚡ I strongly believe in working smarter, not just harder! Efficiency and intelligent problem-solving over brute force.",
      icon: "Zap",
    },
    {
      id: "3",
      title: "Continuous Learning",
      description: "Always exploring emerging technologies - from blockchain and AI to creative applications of psychology in software engineering.",
      icon: "BookOpen",
    },
  ],
  mission:
    "To master software architecture and build scalable, efficient applications that solve real-world problems. Contributing to open-source, exploring cutting-edge technologies, and continuously honing my skills to make meaningful impact in the tech community. Working smarter to innovate and learn together! 🚀",
}

export const useAboutStore = create<AboutStore>()(
  persist(
    (set) => ({
      aboutData: defaultAboutData,
      updateAboutData: (data) =>
        set((state) => ({
          aboutData: { ...state.aboutData, ...data },
        })),
      updateAboutJourney: (journeys) =>
        set((state) => ({
          aboutData: { ...state.aboutData, journey: journeys },
        })),
      updateAboutValues: (values) =>
        set((state) => ({
          aboutData: { ...state.aboutData, values },
        })),
      resetAboutData: () => set({ aboutData: defaultAboutData }),
    }),
    {
      name: "about-storage",
    },
  ),
)
