import { createClient } from "@/lib/supabase/client"
import { nanoid } from "nanoid"
import { create } from "zustand"

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
  isLoading: boolean
  error: string | null
  fetchTestimonials: () => Promise<void>
  addTestimonial: (testimonial: Omit<Testimonial, "id">) => Promise<void>
  updateTestimonial: (id: string, testimonial: Partial<Testimonial>) => Promise<void>
  deleteTestimonial: (id: string) => Promise<void>
  resetTestimonials: () => void
}

const defaultTestimonials: Testimonial[] = [
  {
    id: "1",
    content:
      "Pranshu's expertise in backend architecture transformed our system. His solutions are not only efficient but also highly scalable and maintainable.",
    author: "Sarah Johnson",
    position: "CTO",
    company: "TechInnovate",
    avatar: "/avatar-placeholder.svg",
    rating: 5,
  },
  {
    id: "2",
    content:
      "Working with Pranshu was a game-changer for our startup. His deep knowledge of microservices and system design helped us build a robust foundation for growth.",
    author: "Michael Chen",
    position: "Founder",
    company: "DataFlow Systems",
    avatar: "/avatar-placeholder.svg",
    rating: 5,
  },
  {
    id: "3",
    content:
      "Pranshu delivered exceptional results on our API gateway project. His attention to detail and commitment to best practices resulted in a secure and high-performance solution.",
    author: "Priya Patel",
    position: "Lead Developer",
    company: "CloudScale",
    avatar: "/avatar-placeholder.svg",
    rating: 5,
  },
]

export const useTestimonialsStore = create<TestimonialsStore>((set, get) => ({
  testimonials: defaultTestimonials,
  isLoading: false,
  error: null,

  fetchTestimonials: async () => {
    set({ isLoading: true, error: null })
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error

      if (data) {
        const mappedTestimonials: Testimonial[] = data.map((t: any) => ({
          id: t.id,
          content: t.content,
          author: t.client_name,
          position: t.client_role,
          company: t.client_company,
          avatar: t.client_avatar,
          rating: t.rating,
        }))
        set({ testimonials: mappedTestimonials })
      }
    } catch (error: any) {
      console.error("Failed to fetch testimonials:", error)
      set({ error: error?.message || "Failed to fetch testimonials" })
      set({ testimonials: defaultTestimonials })
    } finally {
      set({ isLoading: false })
    }
  },

  addTestimonial: async (testimonial) => {
    set({ isLoading: true, error: null })
    try {
      const supabase = createClient()

      const dbTestimonial = {
        content: testimonial.content,
        client_name: testimonial.author,
        client_role: testimonial.position,
        client_company: testimonial.company,
        client_avatar: testimonial.avatar,
        rating: testimonial.rating,
        featured: false,
      }

      const { error } = await supabase
        .from("testimonials")
        .insert(dbTestimonial)

      if (error) throw error

      await get().fetchTestimonials()
    } catch (error: any) {
      console.error("Failed to add testimonial:", error)
      set({ error: error?.message || "Failed to add testimonial" })
    } finally {
      set({ isLoading: false })
    }
  },

  updateTestimonial: async (id, testimonial) => {
    set({ isLoading: true, error: null })
    try {
      const supabase = createClient()

      const updates: any = {}
      if (testimonial.content) updates.content = testimonial.content
      if (testimonial.author) updates.client_name = testimonial.author
      if (testimonial.position) updates.client_role = testimonial.position
      if (testimonial.company) updates.client_company = testimonial.company
      if (testimonial.avatar) updates.client_avatar = testimonial.avatar
      if (testimonial.rating !== undefined) updates.rating = testimonial.rating

      const { error } = await supabase
        .from("testimonials")
        .update(updates)
        .eq("id", id)

      if (error) throw error

      await get().fetchTestimonials()
    } catch (error: any) {
      console.error("Failed to update testimonial:", error)
      set({ error: error?.message || "Failed to update testimonial" })
    } finally {
      set({ isLoading: false })
    }
  },

  deleteTestimonial: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("testimonials")
        .delete()
        .eq("id", id)

      if (error) throw error

      set((state) => ({
        testimonials: state.testimonials.filter((t) => t.id !== id),
      }))
    } catch (error: any) {
      console.error("Failed to delete testimonial:", error)
      set({ error: error?.message || "Failed to delete testimonial" })
    } finally {
      set({ isLoading: false })
    }
  },

  resetTestimonials: () => set({ testimonials: defaultTestimonials }),
}))
