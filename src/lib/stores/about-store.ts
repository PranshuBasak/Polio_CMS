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
