import { createClient } from "@/lib/supabase/client"
import { create } from "zustand"

export type BlogPost = {
  id: string
  title: string
  slug: string
  content: string | null
  excerpt: string
  date: string
  externalUrl?: string | null
}

type BlogStore = {
  posts: BlogPost[]
  isLoading: boolean
  error: string | null
  fetchPosts: () => Promise<void>
  addBlogPost: (post: Omit<BlogPost, "id" | "slug">) => Promise<void>
  updateBlogPost: (id: string, post: Partial<BlogPost>) => Promise<void>
  deleteBlogPost: (id: string) => Promise<void>
  getBlogPostBySlug: (slug: string) => BlogPost | undefined
  resetBlog: () => void
}

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .replace(/\s+/g, "-")
}

const defaultPosts: BlogPost[] = []

export const useBlogStore = create<BlogStore>((set, get) => ({
  posts: defaultPosts,
  isLoading: false,
  error: null,

  fetchPosts: async () => {
    set({ isLoading: true, error: null })
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("published_at", { ascending: false })

      if (error) throw error

      if (data) {
        const mappedPosts: BlogPost[] = data.map((p: any) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          content: p.content,
          excerpt: p.excerpt || "",
          date: p.published_at ? new Date(p.published_at).toISOString().split('T')[0] : (p.created_at ? new Date(p.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]),
          externalUrl: p.external_url,
        }))
        set({ posts: mappedPosts })
      }
    } catch (error: any) {
      console.error("Failed to fetch posts:", error)
      set({ error: error?.message || "Failed to fetch posts" })
    } finally {
      set({ isLoading: false })
    }
  },

  addBlogPost: async (post) => {
    set({ isLoading: true, error: null })
    try {
      const supabase = createClient()
      const slug = generateSlug(post.title)
      
      const dbPost = {
        title: post.title,
        slug: slug,
        content: post.content,
        excerpt: post.excerpt,
        external_url: post.externalUrl,
        published_at: new Date().toISOString(),
        published: true,
      }

      const { error } = await supabase
        .from("blog_posts")
        .insert(dbPost)

      if (error) throw error

      await get().fetchPosts()
    } catch (error: any) {
      console.error("Failed to add blog post:", error)
      set({ error: error?.message || "Failed to add blog post" })
    } finally {
      set({ isLoading: false })
    }
  },

  updateBlogPost: async (id, post) => {
    set({ isLoading: true, error: null })
    try {
      const supabase = createClient()
      
      const updates: any = {}
      if (post.title) {
        updates.title = post.title
        updates.slug = generateSlug(post.title)
      }
      if (post.content !== undefined) updates.content = post.content
      if (post.excerpt !== undefined) updates.excerpt = post.excerpt
      if (post.externalUrl !== undefined) updates.external_url = post.externalUrl
      if (post.date) updates.published_at = new Date(post.date).toISOString()

      const { error } = await supabase
        .from("blog_posts")
        .update(updates)
        .eq("id", id)

      if (error) throw error

      await get().fetchPosts()
    } catch (error: any) {
      console.error("Failed to update blog post:", error)
      set({ error: error?.message || "Failed to update blog post" })
    } finally {
      set({ isLoading: false })
    }
  },

  deleteBlogPost: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("blog_posts")
        .delete()
        .eq("id", id)

      if (error) throw error

      set((state) => ({
        posts: state.posts.filter((p) => p.id !== id),
      }))
    } catch (error: any) {
      console.error("Failed to delete blog post:", error)
      set({ error: error?.message || "Failed to delete blog post" })
    } finally {
      set({ isLoading: false })
    }
  },

  getBlogPostBySlug: (slug) => get().posts.find((p) => p.slug === slug),

  resetBlog: () =>
    set({
      posts: defaultPosts,
    }),
}))
