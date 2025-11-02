import type React from "react"
import { cn } from "../../../lib/utils"

interface SectionDescriptionProps {
  children: React.ReactNode
  className?: string
}

export function SectionDescription({ children, className }: SectionDescriptionProps) {
  return <p className={cn("text-lg text-muted-foreground max-w-2xl mx-auto text-pretty", className)}>{children}</p>
}
