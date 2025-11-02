import { create } from "zustand"
import { persist } from "zustand/middleware"
import { nanoid } from "nanoid"

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

type BlogStore = {
  internalPosts: BlogPost[]
  externalPosts: ExternalBlogPost[]
  addBlogPost: (post: Omit<BlogPost, "id" | "slug">) => void
  updateBlogPost: (id: string, post: Partial<BlogPost>) => void
  deleteBlogPost: (id: string) => void
  getBlogPostBySlug: (slug: string) => BlogPost | undefined
  refreshExternalPosts: () => Promise<void>
  resetBlog: () => void
}

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .replace(/\s+/g, "-")
}

const defaultInternalPosts: BlogPost[] = [
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

export const useBlogStore = create<BlogStore>()(
  persist(
    (set, get) => ({
      internalPosts: defaultInternalPosts,
      externalPosts: defaultExternalPosts,
      addBlogPost: (post) => {
        const slug = generateSlug(post.title)
        set((state) => ({
          internalPosts: [...state.internalPosts, { ...post, id: nanoid(), slug }],
        }))
      },
      updateBlogPost: (id, post) =>
        set((state) => ({
          internalPosts: state.internalPosts.map((p) =>
            p.id === id
              ? {
                  ...p,
                  ...post,
                  slug: post.title ? generateSlug(post.title) : p.slug,
                }
              : p,
          ),
        })),
      deleteBlogPost: (id) =>
        set((state) => ({
          internalPosts: state.internalPosts.filter((p) => p.id !== id),
        })),
      getBlogPostBySlug: (slug) => get().internalPosts.find((p) => p.slug === slug),
      refreshExternalPosts: async () => {
        try {
          const timestamp = new Date().toISOString()
          set((state) => ({
            externalPosts: state.externalPosts.map((post) => ({
              ...post,
              title: post.title.includes("(Updated)")
                ? post.title
                : `${post.title} (Updated: ${new Date().toLocaleTimeString()})`,
            })),
          }))
        } catch (error) {
          console.error("Failed to refresh external posts:", error)
          throw error
        }
      },
      resetBlog: () =>
        set({
          internalPosts: defaultInternalPosts,
          externalPosts: defaultExternalPosts,
        }),
    }),
    {
      name: "blog-storage",
    },
  ),
)
