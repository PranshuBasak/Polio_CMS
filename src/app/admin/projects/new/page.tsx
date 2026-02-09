"use client"

import { useProjectForm } from "../_hooks/use-project-form"
import AdminHeader from "@/features/admin/components/admin-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Input } from "../../../../components/ui/input"
import { Label } from "../../../../components/ui/label"
import { Textarea } from "../../../../components/ui/textarea"
import { Button } from "../../../../components/ui/button"
import { Checkbox } from "../../../../components/ui/checkbox"
import { useRouter } from "next/navigation"
import { Controller } from "react-hook-form"
import CloudinaryUpload from "@/components/ui/cloudinary-upload"
import { Loader2 } from "lucide-react"

export default function NewProjectPage() {
  const router = useRouter()
  const { form, onSubmit, isSubmitting } = useProjectForm()
  const {
    register,
    formState: { errors },
  } = form

  return (
    <div className="space-y-6">
      <AdminHeader title="Add New Project" description="Create a new project for your portfolio" />

      <form onSubmit={onSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
            <CardDescription>Fill in the details about your project.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" placeholder="Project title" {...register("title")} disabled={isSubmitting} />
              {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the project"
                rows={3}
                {...register("description")}
                disabled={isSubmitting}
              />
              {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="technologies">Technologies *</Label>
              <Input
                id="technologies"
                placeholder="React, TypeScript, Next.js (comma separated)"
                {...register("technologies")}
                disabled={isSubmitting}
              />
              <p className="text-sm text-muted-foreground">Separate technologies with commas</p>
              {errors.technologies && <p className="text-sm text-destructive">{errors.technologies.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="githubUrl">GitHub URL</Label>
              <Input
                id="githubUrl"
                placeholder="https://github.com/username/repo"
                {...register("githubUrl")}
                disabled={isSubmitting}
              />
              {errors.githubUrl && <p className="text-sm text-destructive">{errors.githubUrl.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="liveUrl">Live URL</Label>
              <Input
                id="liveUrl"
                placeholder="https://your-project.com"
                {...register("liveUrl")}
                disabled={isSubmitting}
              />
              {errors.liveUrl && <p className="text-sm text-destructive">{errors.liveUrl.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Controller
                control={form.control}
                name="image"
                render={({ field }) => (
                  <CloudinaryUpload
                    value={field.value || ""}
                    onChange={field.onChange}
                    disabled={isSubmitting}
                  />
                )}
              />
              {errors.image && <p className="text-sm text-destructive">{errors.image.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon">Icon URL</Label>
              <Controller
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <CloudinaryUpload
                    value={field.value || ""}
                    onChange={field.onChange}
                    disabled={isSubmitting}
                  />
                )}
              />
              {errors.icon && <p className="text-sm text-destructive">{errors.icon.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="youtubeUrl">YouTube Demo URL</Label>
              <Input
                id="youtubeUrl"
                placeholder="https://youtube.com/watch?v=..."
                {...register("youtubeUrl")}
                disabled={isSubmitting}
              />
              {errors.youtubeUrl && <p className="text-sm text-destructive">{errors.youtubeUrl.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="screenshots">Screenshots</Label>
              <Controller
                control={form.control}
                name="screenshots"
                render={({ field }) => (
                  <CloudinaryUpload
                    value={field.value || []}
                    onChange={field.onChange}
                    disabled={isSubmitting}
                    multiple
                  />
                )}
              />
              {errors.screenshots && <p className="text-sm text-destructive">{errors.screenshots.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                placeholder="Web Development, Mobile App, etc."
                {...register("category")}
                disabled={isSubmitting}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="featured" {...register("featured")} disabled={isSubmitting} />
              <Label htmlFor="featured" className="cursor-pointer">
                Featured project (show on homepage)
              </Label>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/projects")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Project"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
