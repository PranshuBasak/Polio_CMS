import type { Project } from "../../../lib/types"

/**
 * Service for project-related business logic
 * Facade pattern for project operations
 */
export const projectService = {
  /**
   * Get featured projects (first N projects)
   */
  getFeaturedProjects(projects: Project[], count = 3): Project[] {
    return projects.slice(0, count)
  },

  /**
   * Extract unique technologies from projects
   */
  getUniqueTechnologies(projects: Project[]): string[] {
    return Array.from(new Set(projects.flatMap((p) => p.technologies))).sort()
  },

  /**
   * Filter projects by search term
   */
  filterBySearch(projects: Project[], searchTerm: string): Project[] {
    const term = searchTerm.toLowerCase()
    return projects.filter(
      (project) =>
        project.title.toLowerCase().includes(term) ||
        project.description.toLowerCase().includes(term) ||
        project.technologies.some((tech) => tech.toLowerCase().includes(term)),
    )
  },

  /**
   * Filter projects by technology
   */
  filterByTechnology(projects: Project[], technology: string): Project[] {
    if (technology === "all") return projects
    return projects.filter((project) => project.technologies.includes(technology))
  },

  /**
   * Check if project has case study
   */
  hasCaseStudy(project: Project): boolean {
    return !!project.caseStudy
  },

  /**
   * Get project by ID
   */
  getProjectById(projects: Project[], id: string): Project | undefined {
    return projects.find((p) => p.id === id)
  },
}
