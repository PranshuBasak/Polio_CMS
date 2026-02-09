'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import CloudinaryImage from '@/components/ui/cloudinary-image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { Project } from '@/lib/stores/projects-store';
import { ExternalLink, Github } from 'lucide-react';

/**
 * Project Card - Client Component
 *
 * Individual project card with interactions
 */
interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader>
        {project.image && (
          <div className="mb-4 relative h-48 w-full overflow-hidden rounded-md border">
            <CloudinaryImage
              src={project.image}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        )}
        <CardTitle className="text-balance">{project.title}</CardTitle>
        <CardDescription className="text-pretty line-clamp-2">
          {project.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="grow">
        <div className="flex flex-wrap gap-2">
          {project.technologies?.map((tech) => (
            <Badge key={tech} variant="secondary">
              {tech}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        {project.githubUrl && (
          <Button asChild variant="outline" size="sm">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Github className="h-4 w-4" />
              <span>Code</span>
            </a>
          </Button>
        )}

        {project.liveUrl && (
          <Button asChild size="sm">
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Live Demo</span>
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
