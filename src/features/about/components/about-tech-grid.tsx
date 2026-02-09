"use client"

import { cn } from "@/lib/utils"
import { technologyStack, type TechnologyItem } from "@/lib/data/technology-stack"
import Image from "next/image"

type AboutTechGridProps = {
  className?: string
  limit?: number
  showCategories?: boolean
}

const categoryTitleMap: Record<TechnologyItem["category"], string> = {
  language: "Programming Languages",
  frontend: "Frontend",
  backend: "Backend",
  database: "Database",
  cloud: "Cloud & Infra",
  tooling: "Tooling",
  ai: "AI & Machine Learning",
  crm: "CRM & Low-Code",
  integration: "Integration & APIs",
}

const categoryOrder: TechnologyItem["category"][] = [
  "language",
  "frontend",
  "backend",
  "database",
  "ai",
  "crm",
  "integration",
  "cloud",
  "tooling",
]

export function AboutTechGrid({ className, limit, showCategories = false }: AboutTechGridProps) {
  const items = typeof limit === "number" ? technologyStack.slice(0, limit) : technologyStack

  if (!showCategories) {
    return (
      <div className={cn("grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6", className)}>
        {items.map((item) => {
          return (
            <div
              key={item.name}
              className="group flex items-center gap-3 rounded-xl border border-border/60 bg-card/65 px-3 py-2 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-card"
            >
              <TechBadge item={item} />
              <span className="text-xs font-medium text-foreground/90">{item.name}</span>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className={cn("space-y-6", className)}>
      {categoryOrder.map((category) => {
        const grouped = items.filter((item) => item.category === category)
        if (grouped.length === 0) {
          return null
        }

        return (
          <section key={category} className="space-y-3 ">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {categoryTitleMap[category]}
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {grouped.map((item) => {
                return (
                  <div
                    key={item.name}
                    className="group flex items-center gap-3 rounded-xl border border-border/60 bg-card/65 px-3 py-2 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-card"
                  >
                    <TechBadge item={item} />
                    <span className="text-xs font-medium text-foreground/90">{item.name}</span>
                  </div>
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}

function TechBadge({ item }: { item: TechnologyItem }) {
  const Icon = item.icon

  return (
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
      {Icon ? (
        <Icon className="h-4.5 w-4.5" />
      ) : item.slug ? (
        <Image
          src={`https://cdn.simpleicons.org/${item.slug}?viewbox=auto`}
          alt={`${item.name} icon`}
          width={18}
          height={18}
          className="h-[18px] w-[18px]"
        />
      ) : (
        <span className="text-[11px] font-semibold">{item.name.charAt(0)}</span>
      )}
    </span>
  )
}
