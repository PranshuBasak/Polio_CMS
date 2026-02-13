import { Button } from "../../../../components/ui/button"
import { Calendar } from "lucide-react"
import Link from "next/link"
import type { BlogPost } from "../../../../lib/types"
import {
  BentoMonoBody,
  BentoMonoCard,
  BentoMonoFooter,
  BentoMonoHeader,
} from "@/components/ui/bento-monochrome-1"

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
    <BentoMonoCard className="h-full flex flex-col">
      <BentoMonoHeader>
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <Calendar className="h-4 w-4 mr-1" />
          <time dateTime={post.date}>{displayDate}</time>
        </div>
        <h3 className="line-clamp-2 text-balance text-lg font-semibold text-foreground">{post.title}</h3>
      </BentoMonoHeader>

      <BentoMonoBody className="flex-grow">
        <p className="line-clamp-3 text-pretty text-sm text-muted-foreground">{post.excerpt}</p>
      </BentoMonoBody>

      <BentoMonoFooter>
        <Button asChild size="sm">
          <Link href={`/blog/${post.slug}`}>Read More</Link>
        </Button>
      </BentoMonoFooter>
    </BentoMonoCard>
  )
}
