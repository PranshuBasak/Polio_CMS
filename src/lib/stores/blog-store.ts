import { fetchMediumPosts } from "@/lib/rss-fetcher"
import { nanoid } from "nanoid"
import { create } from "zustand"
import { persist } from "zustand/middleware"

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
    title: "TypeScript Decorators: Legacy vs. New in Everyday Use",
    slug: "typescript-decorators-legacy-vs-new",
    content:
      "# TypeScript Decorators: Legacy vs. New\n\nDecorators let you attach extra behavior to classes or methods with a simple @name tag. They're great for logging calls, validating inputs, and more. In this article, we'll explore the differences between legacy and new decorator syntax and their practical applications...",
    excerpt:
      "Decorators let you attach extra behavior to classes or methods with a simple @name tag. Great for logging calls, validating inputs, and understanding both legacy and new syntax.",
    date: "2025-10-03",
  },
  {
    id: "2",
    title: "Leaky Bucket Algorithm: A Comprehensive System Design Guide",
    slug: "leaky-bucket-algorithm-system-design",
    content:
      "# Leaky Bucket Algorithm for System Design\n\nUnderstanding the Leaky Bucket Algorithm is crucial for implementing effective rate limiting in distributed systems. This guide covers implementation details, trade-offs, and real-world use cases...",
    excerpt:
      "Understanding the Leaky Bucket Algorithm for System Design - a comprehensive guide to implementing rate limiting in distributed systems.",
    date: "2025-09-28",
  },
  {
    id: "3",
    title: "Understanding the Token Bucket Algorithm for Rate Limiting",
    slug: "token-bucket-algorithm-rate-limiting",
    content:
      "# Token Bucket Algorithm for Rate Limiting\n\nWhy rate limiting matters in modern applications and how the Token Bucket algorithm provides an elegant solution. Learn implementation strategies and best practices...",
    excerpt:
      "Why rate limiting matters and how the Token Bucket algorithm provides an elegant solution for controlling API request rates.",
    date: "2025-09-27",
  },
  {
    id: "4",
    title: "Exploring React Design Patterns: Recursive, Partial, and Composition",
    slug: "react-design-patterns-scalable-code",
    content:
      "# React Design Patterns\n\nMaster these three React design patterns to write scalable, reusable, and maintainable code. Detailed explanations and practical examples included...",
    excerpt:
      "Master recursive, partial, and composition patterns in React to write scalable, reusable, and maintainable code with detailed explanations.",
    date: "2025-04-18",
  }
]

const defaultExternalPosts: ExternalBlogPost[] = [
  {
    id: "e1",
    title: "Read more articles on Medium",
    excerpt:
      "Explore more technical articles on software development, system design, React patterns, and backend engineering on Medium.",
    url: "https://medium.com/@0xTanzim",
    date: "2025-11-09",
    source: "Medium",
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
          // Fetch real Medium posts
          const mediumPosts = await fetchMediumPosts("0xTanzim", 10)

          if (mediumPosts.length > 0) {
            set({
              externalPosts: mediumPosts,
            })
          } else {
            // Keep existing posts if fetch fails
            console.warn("No Medium posts fetched, keeping existing posts")
          }
        } catch (error) {
          console.error("Failed to refresh external posts:", error)
          // Don't throw - keep existing posts on error
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
