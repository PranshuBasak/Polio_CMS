"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useBlogStore } from "../../../../../lib/stores"
import { useBlogForm } from "../../_hooks/use-blog-form"
import AdminHeader from "@/features/admin/components/admin-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../../components/ui/card"
import { Input } from "../../../../../components/ui/input"
import { Label } from "../../../../../components/ui/label"
import { Textarea } from "../../../../../components/ui/textarea"
import { Button } from "../../../../../components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../../components/ui/tabs"
import { Eye, Loader2 } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { Spinner } from "../../../../../components/ui/spinner"
import { useHydration } from "../../../../../lib/hooks"

export default function EditBlogPostPage() {
  const params = useParams()
  const router = useRouter()
  const isHydrated = useHydration()
  const blogPosts = useBlogStore((state) => state.blogPosts)
  const post = blogPosts.find((p) => p.id === params.id)

  const { form, onSubmit, isSubmitting } = useBlogForm(post)
  const {
    register,
    formState: { errors },
    watch,
  } = form

  useEffect(() => {
    if (isHydrated && !post) {
      router.push("/admin/blog")
    }
  }, [isHydrated, post, router])

  if (!isHydrated || !post) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  const contentValue = watch("content")

  return (
    <div className="space-y-6">
      <AdminHeader title="Edit Blog Post" description={`Update ${post.title}`} />
      <form onSubmit={onSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Blog Post Details</CardTitle>
            <CardDescription>Update the details of your blog post.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" placeholder="Blog post title" {...register("title")} disabled={isSubmitting} />
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
              <Label>Content *</Label>
              <Tabs defaultValue="edit" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="edit">Edit</TabsTrigger>
                  <TabsTrigger value="preview" className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>Preview</span>
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="edit">
                  <Textarea
                    id="content"
                    placeholder="Write your blog post content here (supports Markdown)"
                    rows={15}
                    className="font-mono"
                    {...register("content")}
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-muted-foreground mt-2">Supports Markdown formatting</p>
                  {errors.content && <p className="text-sm text-destructive">{errors.content.message}</p>}
                </TabsContent>
                <TabsContent value="preview">
                  <div className="border rounded-md p-4 min-h-[300px] prose dark:prose-invert max-w-none">
                    <ReactMarkdown>{contentValue || "No content to preview"}</ReactMarkdown>
                  </div>
                </TabsContent>
              </Tabs>
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
                    Updating...
                  </>
                ) : (
                  "Update Post"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
