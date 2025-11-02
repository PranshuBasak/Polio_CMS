import { Button } from "../../../../components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

type SectionHeaderProps = {
  title: string
  description: string
  showViewAll?: boolean
  viewAllHref?: string
  viewAllText?: string
}

/**
 * Reusable section header component
 * Compound component pattern
 */
export function SectionHeader({
  title,
  description,
  showViewAll = false,
  viewAllHref = "/projects",
  viewAllText = "View All Projects",
}: SectionHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
      <div>
        <h2 className="section-heading text-balance">{title}</h2>
        <p className="text-muted-foreground max-w-2xl text-pretty leading-relaxed">{description}</p>
      </div>

      {showViewAll && (
        <Link href={viewAllHref} className="mt-4 md:mt-0">
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            {viewAllText}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      )}
    </div>
  )
}
