"use client"

import type React from "react"

import { useBlogForm } from "../_hooks/use-blog-form"
import AdminHeader from "@/features/admin/components/admin-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Input } from "../../../../components/ui/input"
import { Label } from "../../../../components/ui/label"
import { Textarea } from "../../../../components/ui/textarea"
import { Button } from "../../../../components/ui/button"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function NewBlogPostPage() {
  const router = useRouter()
  const { form, onSubmit, isSubmitting } = useBlogForm()
  const {
    register,
    formState: { errors },
    watch,
  } = form

  // Auto-generate slug from title
  const title = watch("title")
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const slug = value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
    form.setValue("slug", slug)
  }

  return (
    <div className="space-y-6">
      <AdminHeader title="Write New Blog Post" description="Create a new blog post for your portfolio" />

      <form onSubmit={onSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Blog Post Details</CardTitle>
            <CardDescription>Fill in the details for your new blog post.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Blog post title"
                {...register("title")}
                onChange={(e) => {
                  register("title").onChange(e)
                  handleTitleChange(e)
                }}
                disabled={isSubmitting}
              />
              {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input id="slug" placeholder="blog-post-slug" {...register("slug")} disabled={isSubmitting} />
              <p className="text-sm text-muted-foreground">URL-friendly version of the title</p>
              {errors.slug && <p className="text-sm text-destructive">{errors.slug.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt *</Label>
              <Textarea
                id="excerpt"
                placeholder="A brief summary of your blog post"
                rows={2}
                {...register("excerpt")}
                disabled={isSubmitting}
              />
              {errors.excerpt && <p className="text-sm text-destructive">{errors.excerpt.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                placeholder="Write your blog post content here (supports Markdown)"
                rows={15}
                {...register("content")}
                disabled={isSubmitting}
              />
              <p className="text-xs text-muted-foreground">Supports Markdown formatting</p>
              {errors.content && <p className="text-sm text-destructive">{errors.content.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input id="author" placeholder="Your name" {...register("author")} disabled={isSubmitting} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                placeholder="React, TypeScript, Web Development (comma separated)"
                {...register("tags")}
                disabled={isSubmitting}
              />
              <p className="text-sm text-muted-foreground">Separate tags with commas</p>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/blog")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  "Publish Post"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
