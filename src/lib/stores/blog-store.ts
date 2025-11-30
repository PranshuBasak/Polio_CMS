import { fetchMediumPosts } from "@/lib/rss-fetcher"
import { createClient } from "@/lib/supabase/client"
// import { Database } from "@/lib/types/supabase"
// import { SupabaseClient } from "@supabase/supabase-js"
// import { nanoid } from "nanoid"
import { create } from "zustand"

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
  isLoading: boolean
  error: string | null
  fetchInternalPosts: () => Promise<void>
  addBlogPost: (post: Omit<BlogPost, "id" | "slug">) => Promise<void>
  updateBlogPost: (id: string, post: Partial<BlogPost>) => Promise<void>
  deleteBlogPost: (id: string) => Promise<void>
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

const defaultInternalPosts: BlogPost[] = []
const defaultExternalPosts: ExternalBlogPost[] = []

export const useBlogStore = create<BlogStore>((set, get) => ({
  internalPosts: defaultInternalPosts,
  externalPosts: defaultExternalPosts,
  isLoading: false,
  error: null,

  fetchInternalPosts: async () => {
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
        }))
        set({ internalPosts: mappedPosts })
      }
    } catch (error: any) {
      console.error("Failed to fetch internal posts:", error)
      set({ error: error?.message || "Failed to fetch internal posts" })
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
        published_at: new Date().toISOString(),
        published: true,
      }

      const { error } = await supabase
        .from("blog_posts")
        .insert(dbPost)

      if (error) throw error

      await get().fetchInternalPosts()
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
      if (post.content) updates.content = post.content
      if (post.excerpt) updates.excerpt = post.excerpt
      if (post.date) updates.published_at = new Date(post.date).toISOString()

      const { error } = await supabase
        .from("blog_posts")
        .update(updates)
        .eq("id", id)

      if (error) throw error

      await get().fetchInternalPosts()
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
        internalPosts: state.internalPosts.filter((p) => p.id !== id),
      }))
    } catch (error: any) {
      console.error("Failed to delete blog post:", error)
      set({ error: error?.message || "Failed to delete blog post" })
    } finally {
      set({ isLoading: false })
    }
  },

  getBlogPostBySlug: (slug) => get().internalPosts.find((p) => p.slug === slug),

  refreshExternalPosts: async () => {
    try {
      // Fetch real Medium posts
      const mediumPosts = await fetchMediumPosts("0xPranshu", 10)

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
}))
