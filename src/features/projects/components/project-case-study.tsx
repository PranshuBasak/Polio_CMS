'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel } from '@/components/ui/carousel';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProjectsStore } from '@/lib/stores/projects-store';
import type { Project } from '@/lib/stores/projects-store';
import { ExternalLink, Github } from 'lucide-react';
import { useState } from 'react';

interface ProjectCaseStudyProps {
  project: Project;
}

export default function ProjectCaseStudy({ project }: ProjectCaseStudyProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Use project data directly
  const caseStudy = project.caseStudy;
  const screenshots = project.screenshots || [];

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
        View Case Study
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{project.title}</DialogTitle>
            <DialogDescription>{project.description}</DialogDescription>
          </DialogHeader>

          <div className="flex flex-wrap gap-2 my-4">
            {project.technologies.map((tech) => (
              <Badge key={tech} variant="secondary">
                {tech}
              </Badge>
            ))}
          </div>

          <Tabs defaultValue={caseStudy ? "overview" : "gallery"} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-4">
              <TabsTrigger value="overview" disabled={!caseStudy}>Overview</TabsTrigger>
              <TabsTrigger value="process" disabled={!caseStudy}>Process</TabsTrigger>
              <TabsTrigger value="tech">Tech Stack</TabsTrigger>
              <TabsTrigger value="gallery" disabled={screenshots.length === 0}>Gallery</TabsTrigger>
            </TabsList>

            {caseStudy && (
              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Challenge</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{caseStudy.challenge}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Solution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{caseStudy.solution}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{caseStudy.results}</p>
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {caseStudy && (
              <TabsContent value="process" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Development Process</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="space-y-4 list-decimal pl-5">
                      {caseStudy.process.map((step, index) => (
                        <li key={index} className="pl-2">
                          {step}
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            <TabsContent value="tech" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Technologies Used</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {project.technologies.map((tech) => (
                      <div
                        key={tech}
                        className="flex items-center p-4 bg-muted rounded-lg"
                      >
                        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mr-3">
                          <span className="text-primary font-bold">
                            {tech.charAt(0)}
                          </span>
                        </div>
                        <span>{tech}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="gallery" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Project Gallery</CardTitle>
                </CardHeader>
                <CardContent>
                  <Carousel images={screenshots} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-between mt-6">
            {project.githubUrl && (
              <Button asChild variant="outline">
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Github className="h-4 w-4" />
                  View Code
                </a>
              </Button>
            )}
            {project.liveUrl && (
              <Button asChild>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Live Demo
                </a>
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
