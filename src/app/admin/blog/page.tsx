"use client"

import AdminHeader from "@/features/admin/components/admin-header"
import { Pencil, Plus, Trash2, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "../../../components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card"
import { Spinner } from "../../../components/ui/spinner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { useToast } from "../../../hooks/use-toast"
import { useHydration } from "../../../lib/hooks"
import { useBlogStore } from "../../../lib/stores"
import { RssImportDialog } from "@/features/admin/components/rss-import-dialog"

export default function BlogPage() {
  const isHydrated = useHydration()
  const posts = useBlogStore((state) => state.posts ?? [])
  const fetchPosts = useBlogStore((state) => state.fetchPosts)
  const deleteBlogPost = useBlogStore((state) => state.deleteBlogPost)

  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const internalPosts = posts.filter(p => !p.externalUrl)
  const externalPosts = posts.filter(p => !!p.externalUrl)

  const handleDelete = (id: string) => {
    setIsDeleting(id)
    setTimeout(() => {
      deleteBlogPost(id)
      toast({
        title: "Blog post deleted",
        description: "The blog post has been deleted successfully.",
      })
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
        title="Blog"
        description="Manage your blog posts"
        action={{
          label: "New Post",
          href: "/admin/blog/new",
        }}
      />

      <Tabs defaultValue="internal" className="w-full">
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="internal">My Posts ({internalPosts.length})</TabsTrigger>
          <TabsTrigger value="external">External Posts ({externalPosts.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="internal">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {internalPosts.length > 0 ? (
              internalPosts.map((post) => (
                <Card key={post.id}>
                  <CardHeader>
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      {new Date(post.date).toLocaleDateString()}
                    </div>
                    <CardTitle className="line-clamp-1">{post.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{post.excerpt}</CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/blog/edit/${post.id}`}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </Link>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(post.id)}
                      disabled={isDeleting === post.id}
                    >
                      {isDeleting === post.id ? (
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
              ))
            ) : (
              <Card className="col-span-full flex flex-col items-center justify-center p-12 border-dashed">
                <p className="text-muted-foreground text-center mb-4">No blog posts yet</p>
                <Link href="/admin/blog/new">
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Write Your First Post
                  </Button>
                </Link>
              </Card>
            )}

            {internalPosts.length > 0 && (
              <Card className="flex flex-col items-center justify-center p-6 border-dashed">
                <Link href="/admin/blog/new">
                  <Button variant="outline" className="mb-2 bg-transparent">
                    <Plus className="h-4 w-4 mr-2" />
                    Write New Post
                  </Button>
                </Link>
                <p className="text-sm text-muted-foreground text-center">Share your thoughts and ideas</p>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="external">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">External / RSS Posts</h3>
            <RssImportDialog onImportSuccess={() => fetchPosts()} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {externalPosts.length > 0 ? (
              externalPosts.map((post) => (
                <Card key={post.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                      <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs flex items-center">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        External
                      </span>
                    </div>
                    <CardTitle className="line-clamp-1">{post.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{post.excerpt}</CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <Button asChild variant="outline" size="sm">
                      <a href={post.externalUrl || '#'} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View
                      </a>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(post.id)}
                      disabled={isDeleting === post.id}
                    >
                       {isDeleting === post.id ? (
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
              ))
            ) : (
              <Card className="col-span-full flex flex-col items-center justify-center p-12 border-dashed">
                <p className="text-muted-foreground text-center mb-4">No external posts found</p>
                <RssImportDialog onImportSuccess={() => fetchPosts()} />
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
