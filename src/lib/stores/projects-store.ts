import { createClient } from "@/lib/supabase/client"
// import { Database } from "@/lib/types/supabase"
// import { SupabaseClient } from "@supabase/supabase-js"
import { create } from "zustand"

export type Project = {
  id: string
  title: string
  description: string
  technologies: string[]
  githubUrl?: string
  liveUrl?: string
  image?: string
  icon?: string
  youtubeUrl?: string
  screenshots?: string[]
  caseStudy?: {
    challenge: string
    solution: string
    results: string
    process: string[]
    screenshots: string[]
  }
}

type ProjectsStore = {
  projects: Project[]
  isLoading: boolean
  error: string | null
  fetchProjects: () => Promise<void>
  addProject: (project: Omit<Project, "id">) => Promise<void>
  updateProject: (id: string, project: Partial<Project>) => Promise<void>
  deleteProject: (id: string) => Promise<void>
  getProjectById: (id: string) => Project | undefined
  resetProjects: () => void
}

const defaultProjects: Project[] = []

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .replace(/\s+/g, "-")
}

export const useProjectsStore = create<ProjectsStore>((set, get) => ({
  projects: defaultProjects,
  isLoading: false,
  error: null,

  fetchProjects: async () => {
    set({ isLoading: true, error: null })
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("order_index", { ascending: true })

      if (error) throw error

      if (data) {
        const mappedProjects: Project[] = data.map((p: any) => {
          let caseStudy = undefined
          if (p.content) {
            try {
              // Try to parse content as JSON case study
              const parsed = JSON.parse(p.content)
              if (parsed.challenge) {
                caseStudy = parsed
              }
            } catch {
              // Content is likely markdown or plain text, ignore for caseStudy structure
            }
          }

          return {
            id: p.id,
            title: p.title,
            description: p.description,
            technologies: p.tech_stack || [],
            githubUrl: p.github_url || undefined,
            liveUrl: p.live_url || undefined,
            image: p.image_url || undefined,
            icon: p.icon || undefined,
            youtubeUrl: p.youtube_url || undefined,
            screenshots: p.screenshots || [],
            caseStudy: caseStudy || (p.screenshots ? {
              challenge: "",
              solution: "",
              results: "",
              process: [],
              screenshots: p.screenshots
            } : undefined)
          }
        })
        set({ projects: mappedProjects })
      }
    } catch (error: any) {
      console.error("Failed to fetch projects:", error)
      set({ error: error?.message || "Failed to fetch projects" })
    } finally {
      set({ isLoading: false })
    }
  },

  addProject: async (project) => {
    set({ isLoading: true, error: null })
    try {
      const supabase = createClient()
      const slug = generateSlug(project.title)
      
      const dbProject = {
        title: project.title,
        slug: slug, // Simple slug generation
        description: project.description,
        tech_stack: project.technologies,
        github_url: project.githubUrl,
        live_url: project.liveUrl,
        image_url: project.image,
        icon: project.icon,
        youtube_url: project.youtubeUrl,
        content: project.caseStudy ? JSON.stringify(project.caseStudy) : null,
        screenshots: project.screenshots || project.caseStudy?.screenshots || [],
        published: true,
      }

      const { error } = await supabase
        .from("projects")
        .insert(dbProject)

      if (error) throw error

      await get().fetchProjects()
    } catch (error: any) {
      console.error("Failed to add project:", error)
      set({ error: error?.message || "Failed to add project" })
    } finally {
      set({ isLoading: false })
    }
  },

  updateProject: async (id, project) => {
    set({ isLoading: true, error: null })
    try {
      const supabase = createClient()
      
      const updates: any = {}
      if (project.title) {
        updates.title = project.title
        updates.slug = generateSlug(project.title)
      }
      if (project.description) updates.description = project.description
      if (project.technologies) updates.tech_stack = project.technologies
      if (project.githubUrl !== undefined) updates.github_url = project.githubUrl
      if (project.liveUrl !== undefined) updates.live_url = project.liveUrl
      if (project.image !== undefined) updates.image_url = project.image
      if (project.icon !== undefined) updates.icon = project.icon
      if (project.youtubeUrl !== undefined) updates.youtube_url = project.youtubeUrl
      if (project.screenshots !== undefined) updates.screenshots = project.screenshots
      if (project.caseStudy) {
        updates.content = JSON.stringify(project.caseStudy)
        // Sync screenshots if updated via caseStudy (legacy support)
        if (project.caseStudy.screenshots) updates.screenshots = project.caseStudy.screenshots
      }

      const { error } = await supabase
        .from("projects")
        .update(updates)
        .eq("id", id)

      if (error) throw error

      await get().fetchProjects()
    } catch (error: any) {
      console.error("Failed to update project:", error)
      set({ error: error?.message || "Failed to update project" })
    } finally {
      set({ isLoading: false })
    }
  },

  deleteProject: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const supabase = createClient()
      const { error } = await supabase.from("projects").delete().eq("id", id)

      if (error) throw error

      set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
      }))
    } catch (error) {
      console.error("Failed to delete project:", error)
      set({ error: (error as Error).message })
    } finally {
      set({ isLoading: false })
    }
  },

  getProjectById: (id) => get().projects.find((p) => p.id === id),
  resetProjects: () => set({ projects: defaultProjects }),
}))
