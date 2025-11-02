"use client"

import { useState } from "react"
import { useBlogStore } from "../../../lib/stores"
import AdminHeader from "@/features/admin/components/admin-header"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { Pencil, Trash2, Plus, RefreshCw } from "lucide-react"
import { useToast } from "../../../hooks/use-toast"
import Link from "next/link"
import { useHydration } from "../../../lib/hooks"
import { Spinner } from "../../../components/ui/spinner"

export default function BlogPage() {
  const isHydrated = useHydration()
  const posts = useBlogStore((state) => state.posts ?? [])
  const externalPosts = useBlogStore((state) => state.externalPosts ?? [])
  const deletePost = useBlogStore((state) => state.deletePost)
  const setExternalPosts = useBlogStore((state) => state.setExternalPosts)

  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleDelete = (id: string) => {
    setIsDeleting(id)
    setTimeout(() => {
      deletePost(id)
      toast({
        title: "Blog post deleted",
        description: "The blog post has been deleted successfully.",
      })
      setIsDeleting(null)
    }, 500)
  }

  const handleRefreshExternalPosts = async () => {
    setIsRefreshing(true)
    try {
      // Simulate RSS feed fetch
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "External posts refreshed",
        description: "Your external blog posts have been refreshed successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh external posts. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsRefreshing(false)
    }
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
          <TabsTrigger value="internal">My Posts ({posts?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="external">External Posts ({externalPosts?.length ?? 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="internal">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts && posts.length > 0 ? (
              posts.map((post) => (
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

            {posts && posts.length > 0 && (
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
            <h3 className="text-lg font-medium">RSS Feed Posts</h3>
            <Button variant="outline" size="sm" onClick={handleRefreshExternalPosts} disabled={isRefreshing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              {isRefreshing ? "Refreshing..." : "Refresh Feeds"}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {externalPosts && externalPosts.length > 0 ? (
              externalPosts.map((post, index) => (
                <Card key={`${post.url}-${index}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                      <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs">{post.source}</span>
                    </div>
                    <CardTitle className="line-clamp-1">{post.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{post.excerpt}</CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-end border-t pt-4">
                    <Button asChild size="sm">
                      <a href={post.url} target="_blank" rel="noopener noreferrer">
                        View Post
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <Card className="col-span-full flex flex-col items-center justify-center p-12 border-dashed">
                <p className="text-muted-foreground text-center mb-4">No external posts found</p>
                <Button variant="outline" onClick={handleRefreshExternalPosts} disabled={isRefreshing}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                  Refresh Feeds
                </Button>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
