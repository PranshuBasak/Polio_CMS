import type React from "react"
import { cn } from "../../../lib/utils"

interface SectionTitleProps {
  children: React.ReactNode
  className?: string
  as?: "h1" | "h2" | "h3" | "h4"
}

export function SectionTitle({ children, className, as: Component = "h2" }: SectionTitleProps) {
  return (
    <Component className={cn("text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-balance", className)}>
      {children}
    </Component>
  )
}
