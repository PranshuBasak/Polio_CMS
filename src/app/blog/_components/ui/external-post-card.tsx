import { Button } from "../../../../components/ui/button"
import { Badge } from "../../../../components/ui/badge"
import { Calendar, ExternalLink } from "lucide-react"
import type { BlogPost } from "../../../../lib/types"
import {
  BentoMonoBody,
  BentoMonoCard,
  BentoMonoFooter,
  BentoMonoHeader,
} from "@/components/ui/bento-monochrome-1"

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
    <BentoMonoCard className="h-full flex flex-col">
      <BentoMonoHeader>
        <div className="flex items-center text-sm text-muted-foreground mb-2 gap-2">
          <Calendar className="h-4 w-4" />
          <time dateTime={post.date}>{displayDate}</time>
          <Badge variant="secondary" className="text-xs">
            External
          </Badge>
        </div>
        <h3 className="line-clamp-2 text-balance text-lg font-semibold text-foreground">{post.title}</h3>
      </BentoMonoHeader>

      <BentoMonoBody className="flex-grow">
        <p className="line-clamp-3 text-pretty text-sm text-muted-foreground">{post.excerpt}</p>
      </BentoMonoBody>

      <BentoMonoFooter>
        <Button asChild size="sm">
          <a href={post.externalUrl || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            <span>Read More</span>
          </a>
        </Button>
      </BentoMonoFooter>
    </BentoMonoCard>
  )
}
