import { create } from "zustand"
import { persist } from "zustand/middleware"
import { nanoid } from "nanoid"

export type Testimonial = {
  id: string
  content: string
  author: string
  position: string
  company: string
  avatar?: string
  rating?: number
}

type TestimonialsStore = {
  testimonials: Testimonial[]
  addTestimonial: (testimonial: Omit<Testimonial, "id">) => void
  updateTestimonial: (id: string, testimonial: Partial<Testimonial>) => void
  deleteTestimonial: (id: string) => void
  resetTestimonials: () => void
}

const defaultTestimonials: Testimonial[] = [
  {
    id: "1",
    content:
      "Tanzim's expertise in backend architecture transformed our system. His solutions are not only efficient but also highly scalable and maintainable.",
    author: "Sarah Johnson",
    position: "CTO",
    company: "TechInnovate",
    avatar: "/placeholder.svg?height=80&width=80",
    rating: 5,
  },
  {
    id: "2",
    content:
      "Working with Tanzim was a game-changer for our startup. His deep knowledge of microservices and system design helped us build a robust foundation for growth.",
    author: "Michael Chen",
    position: "Founder",
    company: "DataFlow Systems",
    avatar: "/placeholder.svg?height=80&width=80",
    rating: 5,
  },
  {
    id: "3",
    content:
      "Tanzim delivered exceptional results on our API gateway project. His attention to detail and commitment to best practices resulted in a secure and high-performance solution.",
    author: "Priya Patel",
    position: "Lead Developer",
    company: "CloudScale",
    avatar: "/placeholder.svg?height=80&width=80",
    rating: 5,
  },
]

export const useTestimonialsStore = create<TestimonialsStore>()(
  persist(
    (set) => ({
      testimonials: defaultTestimonials,
      addTestimonial: (testimonial) =>
        set((state) => ({
          testimonials: [...state.testimonials, { ...testimonial, id: nanoid() }],
        })),
      updateTestimonial: (id, testimonial) =>
        set((state) => ({
          testimonials: state.testimonials.map((t) => (t.id === id ? { ...t, ...testimonial } : t)),
        })),
      deleteTestimonial: (id) =>
        set((state) => ({
          testimonials: state.testimonials.filter((t) => t.id !== id),
        })),
      resetTestimonials: () => set({ testimonials: defaultTestimonials }),
    }),
    {
      name: "testimonials-storage",
    },
  ),
)
