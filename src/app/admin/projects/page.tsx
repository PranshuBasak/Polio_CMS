"use client"

import { useState } from "react"
import { useProjectsStore } from "../../../lib/stores"
import AdminHeader from "@/features/admin/components/admin-header"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Pencil, Trash2, Plus } from "lucide-react"
import { Badge } from "../../../components/ui/badge"
import Link from "next/link"
import { useHydration } from "../../../lib/hooks"
import { Spinner } from "../../../components/ui/spinner"

export default function ProjectsPage() {
  const isHydrated = useHydration()
  const projects = useProjectsStore((state) => state.projects)
  const deleteProject = useProjectsStore((state) => state.deleteProject)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleDelete = (id: string) => {
    setIsDeleting(id)
    setTimeout(() => {
      deleteProject(id)
      setIsDeleting(null)
    }, 500)
  }

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Projects"
        description="Manage your portfolio projects"
        action={{
          label: "Add Project",
          href: "/admin/projects/new",
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{project.title}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.map((tech) => (
                  <Badge key={tech} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
              <div className="text-sm">
                {project.githubUrl && (
                  <div className="mb-1">
                    <span className="font-medium">GitHub: </span>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {project.githubUrl}
                    </a>
                  </div>
                )}
                {project.liveUrl && (
                  <div>
                    <span className="font-medium">Live URL: </span>
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {project.liveUrl}
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <Button asChild variant="outline" size="sm">
                <Link href={`/admin/projects/edit/${project.id}`}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Link>
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(project.id)}
                disabled={isDeleting === project.id}
              >
                {isDeleting === project.id ? (
                  "Deleting..."
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}

        <Card className="flex flex-col items-center justify-center p-6 border-dashed">
          <Link href="/admin/projects/new">
            <Button variant="outline" className="mb-2 bg-transparent">
              <Plus className="h-4 w-4 mr-2" />
              Add New Project
            </Button>
          </Link>
          <p className="text-sm text-muted-foreground text-center">Showcase your work by adding a new project</p>
        </Card>
      </div>
    </div>
  )
}
