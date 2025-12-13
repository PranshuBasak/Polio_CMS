import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Badge } from "../../../../components/ui/badge"
import { Calendar, ExternalLink } from "lucide-react"
import type { BlogPost } from "../../../../lib/types"

type ExternalPostCardProps = {
  post: BlogPost
  formatDate?: (date: string) => string
}

/**
 * Presentational component for external blog post card
 */
export function ExternalPostCard({ post, formatDate }: ExternalPostCardProps) {
  const displayDate = formatDate ? formatDate(post.date) : new Date(post.date).toLocaleDateString()

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center text-sm text-muted-foreground mb-2 gap-2">
          <Calendar className="h-4 w-4" />
          <time dateTime={post.date}>{displayDate}</time>
          <Badge variant="secondary" className="text-xs">
            External
          </Badge>
        </div>
        <CardTitle className="line-clamp-2 text-balance">{post.title}</CardTitle>
      </CardHeader>

      <CardContent className="flex-grow">
        <CardDescription className="line-clamp-3 text-pretty">{post.excerpt}</CardDescription>
      </CardContent>

      <CardFooter>
        <Button asChild size="sm">
          <a href={post.externalUrl || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            <span>Read More</span>
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}
