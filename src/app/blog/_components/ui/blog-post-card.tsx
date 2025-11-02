import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Calendar } from "lucide-react"
import Link from "next/link"
import type { BlogPost } from "../../../../lib/types"

type BlogPostCardProps = {
  post: BlogPost
  formatDate?: (date: string) => string
}

/**
 * Presentational component for internal blog post card
 */
export function BlogPostCard({ post, formatDate }: BlogPostCardProps) {
  const displayDate = formatDate ? formatDate(post.date) : new Date(post.date).toLocaleDateString()

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <Calendar className="h-4 w-4 mr-1" />
          <time dateTime={post.date}>{displayDate}</time>
        </div>
        <CardTitle className="line-clamp-2 text-balance">{post.title}</CardTitle>
      </CardHeader>

      <CardContent className="flex-grow">
        <CardDescription className="line-clamp-3 text-pretty">{post.excerpt}</CardDescription>
      </CardContent>

      <CardFooter>
        <Button asChild size="sm">
          <Link href={`/blog/${post.slug}`}>Read More</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
