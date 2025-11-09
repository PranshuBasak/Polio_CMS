'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Project } from '@/lib/types';
import { ExternalLink, Github } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface ProjectCaseStudyProps {
  project: Project;
}

export default function ProjectCaseStudy({ project }: ProjectCaseStudyProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Mock case study data - in a real implementation, this would come from your data provider
  const caseStudy = {
    challenge:
      'The client needed a scalable microservice architecture that could handle high traffic loads while maintaining data consistency across services.',
    solution:
      'Implemented a robust microservice architecture using Spring Boot for core services and Node.js for lightweight services. Used Kafka for event-driven communication between services.',
    results:
      'The new architecture resulted in a 40% improvement in response times and enabled the system to handle 3x the previous traffic load without performance degradation.',
    process: [
      'Analyzed the existing monolithic architecture and identified service boundaries',
      'Designed the new microservice architecture with clear domain boundaries',
      'Implemented core services using Spring Boot with domain-driven design principles',
      'Set up Kafka for event-driven communication between services',
      'Deployed the solution using Docker and Kubernetes for scalability',
    ],
    screenshots: [
      '/project-placeholder.svg',
      '/project-placeholder.svg',
      '/project-placeholder.svg',
    ],
  };

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

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="process">Process</TabsTrigger>
              <TabsTrigger value="tech">Tech Stack</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
            </TabsList>

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
                  <div className="relative">
                    <div className="flex overflow-x-auto space-x-4 pb-4">
                      {caseStudy.screenshots.map((screenshot, index) => (
                        <div
                          key={index}
                          className="flex-shrink-0 w-full max-w-md"
                        >
                          <div className="relative h-64 w-full rounded-lg overflow-hidden border">
                            <Image
                              src={screenshot || '/placeholder.svg'}
                              alt={`${project.title} screenshot ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <p className="text-center text-sm text-muted-foreground mt-2">
                            Screenshot {index + 1}: {project.title}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
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
