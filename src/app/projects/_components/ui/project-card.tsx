"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Badge } from "../../../../components/ui/badge"
import { Button } from "../../../../components/ui/button"
import { ExternalLink, Github } from "lucide-react"
import type { Project } from "../../../../lib/types"

type ProjectCardProps = {
  project: Project
  selectedTech?: string
  showCaseStudy?: boolean
  onCaseStudyClick?: (project: Project) => void
}

/**
 * Presentational component for project card
 * Pure UI component with no business logic
 */
export function ProjectCard({ project, selectedTech, showCaseStudy = false, onCaseStudyClick }: ProjectCardProps) {
  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-balance">{project.title}</CardTitle>
        <CardDescription className="text-pretty">{project.description}</CardDescription>
      </CardHeader>

      <CardContent className="flex-grow">
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <Badge
              key={tech}
              variant="secondary"
              className={selectedTech === tech ? "bg-primary text-primary-foreground" : ""}
            >
              {tech}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between gap-2">
        {showCaseStudy && project.caseStudy && onCaseStudyClick && (
          <Button variant="outline" size="sm" onClick={() => onCaseStudyClick(project)}>
            View Case Study
          </Button>
        )}

        {project.githubUrl && (
          <Button asChild variant="outline" size="sm">
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              <Github className="h-4 w-4" />
              <span>Code</span>
            </a>
          </Button>
        )}

        {project.liveUrl && (
          <Button asChild size="sm">
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              <span>Live Demo</span>
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
