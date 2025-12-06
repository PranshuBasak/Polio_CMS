"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Badge } from "../../../../components/ui/badge"
import { Button } from "../../../../components/ui/button"
import { ExternalLink, Github } from "lucide-react"
import type { Project } from "../../../../lib/types"
import { Carousel } from "../../../../components/ui/carousel"

type ProjectCardProps = {
  project: Project
  selectedTech?: string
  showCaseStudy?: boolean
  onCaseStudyClick?: (project: Project) => void
}

export function ProjectCard({ project, selectedTech, showCaseStudy = false, onCaseStudyClick }: ProjectCardProps) {
  const hasScreenshots = project.screenshots && project.screenshots.length > 0
  const displayImages = hasScreenshots ? project.screenshots : (project.image ? [project.image] : [])

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <div className="relative">
        {displayImages && displayImages.length > 0 && (
          <div className="w-full h-48 overflow-hidden rounded-t-lg">
             {hasScreenshots ? (
                <Carousel images={displayImages} className="w-full h-full" />
             ) : (
                <img
                  src={displayImages[0]}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
             )}
          </div>
        )}
        {project.icon && (
          <div className="absolute top-4 right-4 w-12 h-12 bg-background rounded-full p-2 shadow-md flex items-center justify-center">
            <img
              src={project.icon}
              alt={`${project.title} icon`}
              className="w-full h-full object-contain"
            />
          </div>
        )}
      </div>
      <CardHeader>
        <CardTitle className="text-balance flex items-center gap-2">
          {project.title}
        </CardTitle>
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

      <CardFooter className="flex justify-between gap-2 flex-wrap">
        <div className="flex gap-2">
          {showCaseStudy && project.caseStudy && onCaseStudyClick && (
            <Button variant="outline" size="sm" onClick={() => onCaseStudyClick(project)}>
              View Case Study
            </Button>
          )}

          {project.youtubeUrl && (
             <Button asChild variant="default" size="sm" className="bg-red-600 hover:bg-red-700 text-white">
               <a href={project.youtubeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                 <svg
                   xmlns="http://www.w3.org/2000/svg"
                   width="16"
                   height="16"
                   viewBox="0 0 24 24"
                   fill="none"
                   stroke="currentColor"
                   strokeWidth="2"
                   strokeLinecap="round"
                   strokeLinejoin="round"
                   className="lucide lucide-youtube"
                 >
                   <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1-1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                   <path d="m10 15 5-3-5-3z" />
                 </svg>
                 <span>Demo</span>
               </a>
             </Button>
           )}
        </div>

        <div className="flex gap-2">
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
        </div>
      </CardFooter>
    </Card>
  )
}
