"use client"

import { motion } from "framer-motion"
import { Button } from "../../../../components/ui/button"
import { ProjectCard } from "./project-card"
import type { Project } from "../../../../lib/types"

type ProjectsGridProps = {
  projects: Project[]
  selectedTech?: string
  showCaseStudy?: boolean
  onCaseStudyClick?: (project: Project) => void
  onResetFilters?: () => void
  emptyMessage?: string
}

/**
 * Presentational component for projects grid
 * Handles layout and empty states
 */
export function ProjectsGrid({
  projects,
  selectedTech,
  showCaseStudy = false,
  onCaseStudyClick,
  onResetFilters,
  emptyMessage = "No projects found matching your criteria.",
}: ProjectsGridProps) {
  if (projects.length === 0) {
    return (
      <div className="col-span-full text-center py-12">
        <p className="text-muted-foreground mb-4">{emptyMessage}</p>
        {onResetFilters && (
          <Button variant="outline" onClick={onResetFilters}>
            Reset Filters
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project, index) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <ProjectCard
            project={project}
            selectedTech={selectedTech}
            showCaseStudy={showCaseStudy}
            onCaseStudyClick={onCaseStudyClick}
          />
        </motion.div>
      ))}
    </div>
  )
}
