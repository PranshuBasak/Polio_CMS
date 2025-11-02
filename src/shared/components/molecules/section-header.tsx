import type React from "react"
import { SectionTitle } from "../atoms/section-title"
import { SectionDescription } from "../atoms/section-description"
import { cn } from "../../../lib/utils"

interface SectionHeaderProps {
  title: string
  description?: string
  className?: string
  action?: React.ReactNode
}

export function SectionHeader({ title, description, className, action }: SectionHeaderProps) {
  return (
    <div className={cn("text-center space-y-4 mb-12", className)}>
      <SectionTitle>{title}</SectionTitle>
      {description && <SectionDescription>{description}</SectionDescription>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
