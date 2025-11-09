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
    date: "2024-10-03",
  },
  {
    id: "2",
    title: "Leaky Bucket Algorithm: A Comprehensive System Design Guide",
    slug: "leaky-bucket-algorithm-system-design",
    content:
      "# Leaky Bucket Algorithm for System Design\n\nUnderstanding the Leaky Bucket Algorithm is crucial for implementing effective rate limiting in distributed systems. This guide covers implementation details, trade-offs, and real-world use cases...",
    excerpt:
      "Understanding the Leaky Bucket Algorithm for System Design - a comprehensive guide to implementing rate limiting in distributed systems.",
    date: "2024-09-28",
  },
  {
    id: "3",
    title: "Understanding the Token Bucket Algorithm for Rate Limiting",
    slug: "token-bucket-algorithm-rate-limiting",
    content:
      "# Token Bucket Algorithm for Rate Limiting\n\nWhy rate limiting matters in modern applications and how the Token Bucket algorithm provides an elegant solution. Learn implementation strategies and best practices...",
    excerpt:
      "Why rate limiting matters and how the Token Bucket algorithm provides an elegant solution for controlling API request rates.",
    date: "2024-09-27",
  },
  {
    id: "4",
    title: "Exploring React Design Patterns: Recursive, Partial, and Composition",
    slug: "react-design-patterns-scalable-code",
    content:
      "# React Design Patterns\n\nMaster these three React design patterns to write scalable, reusable, and maintainable code. Detailed explanations and practical examples included...",
    excerpt:
      "Master recursive, partial, and composition patterns in React to write scalable, reusable, and maintainable code with detailed explanations.",
    date: "2024-04-18",
  },
  {
    id: "5",
    title: "Mastering React HOCs: A Practical Guide to Reusable Code",
    slug: "mastering-react-hocs",
    content:
      "# Higher-Order Components in React\n\nHigher-Order Components (HOCs) in React have been a game-changer for keeping code clean and reusable. Learn practical patterns and best practices...",
    excerpt:
      "Higher-Order Components (HOCs) in React help keep code clean and reusable. A practical guide with real-world examples.",
    date: "2024-04-15",
  },
  {
    id: "6",
    title: "Mastering Container Components for Smarter React Apps",
    slug: "react-container-components",
    content:
      "# Container Components in React\n\nReact's component-based approach is powerful, but as apps grow, mixing logic and UI can turn your code into a tangled mess. Container components provide the solution...",
    excerpt:
      "Learn how container components solve the problem of mixing logic and UI as React apps grow in complexity.",
    date: "2024-04-13",
  },
  {
    id: "7",
    title: "Splitting Prisma Schema into Multiple Files: A Simple Guide",
    slug: "splitting-prisma-schema-multiple-files",
    content:
      "# Splitting Prisma Schema\n\nBy default, Prisma uses just one file. As your project grows, this single file can become unwieldy. Here's how to split it effectively...",
    excerpt:
      "A solution for managing large Prisma schemas by splitting them into multiple files for better organization and maintainability.",
    date: "2024-03-03",
  },
  {
    id: "8",
    title: "Implementing Multiple Middleware in Next.js",
    slug: "nextjs-multiple-middleware",
    content:
      "# Multiple Middleware in Next.js\n\nCombining NextAuth and Internationalization in Next.js. Learn how to compose multiple middleware functions effectively...",
    excerpt:
      "Combining NextAuth and Internationalization in Next.js for powerful authentication and i18n support.",
    date: "2024-05-21",
  },
  {
    id: "9",
    title: "Why Data Structures Matter: Optimizing the Fibonacci Sequence",
    slug: "data-structures-fibonacci-optimization",
    content:
      "# Data Structures and Fibonacci\n\nThe Fibonacci sequence is a classic in computer science, not just for its mathematical charm but for what it teaches about efficiency...",
    excerpt:
      "The Fibonacci sequence teaches valuable lessons about efficiency, memoization, and algorithm optimization.",
    date: "2023-12-31",
  },
  {
    id: "10",
    title: "How to Fix the Copilot Sidebar in Microsoft Edge on Linux",
    slug: "fix-copilot-edge-linux",
    content:
      "# Fix Copilot on Linux\n\nA simple, two-command fix to get the AI assistant working on Ubuntu and other Linux distributions...",
    excerpt:
      "A simple, two-command fix to get the Copilot AI assistant working on Ubuntu and other Linux distros in Microsoft Edge.",
    date: "2024-10-29",
  },
]

const defaultExternalPosts: ExternalBlogPost[] = [
  {
    id: "e1",
    title: "Read more articles on Medium",
    excerpt:
      "Explore more technical articles on software development, system design, React patterns, and backend engineering on Medium.",
    url: "https://medium.com/@0xTanzim",
    date: "2024-11-09",
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
