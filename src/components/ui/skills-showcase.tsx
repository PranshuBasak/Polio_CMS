"use client"

import { useState, useSyncExternalStore } from "react"
import CloudinaryImage from "@/components/ui/cloudinary-image"
import { cn } from "@/lib/utils"

export type SkillShowcaseItem = {
  id: string
  name: string
  level: number
  icon?: string
}

type SkillsShowcaseProps = {
  skills: SkillShowcaseItem[]
  title?: string
  compact?: boolean
  className?: string
}

export function SkillsShowcase({
  skills,
  title = "Expertise",
  compact = false,
  className,
}: SkillsShowcaseProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const isTouchDevice = useSyncExternalStore(
    (callback) => {
      if (typeof window === "undefined") return () => {}
      const media = window.matchMedia("(hover: none), (pointer: coarse)")
      media.addEventListener("change", callback)
      return () => media.removeEventListener("change", callback)
    },
    () => {
      if (typeof window === "undefined") return false
      return window.matchMedia("(hover: none), (pointer: coarse)").matches
    },
    () => false,
  )

  if (skills.length === 0) {
    return (
      <div className={cn("rounded-xl border border-border/60 bg-card/60 p-5 text-sm text-muted-foreground", className)}>
        No skills configured yet.
      </div>
    )
  }

  return (
    <div className={cn("flex w-full flex-col", compact ? "max-w-xl" : "max-w-2xl", className)}>
      <div className={cn("mb-8 flex items-center gap-4", compact && "mb-6")}>
        <div className="h-px w-12 bg-foreground/20" />
        <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">{title}</span>
      </div>

      <ul className="flex flex-col gap-1" role="list">
        {skills.map((skill, index) => {
          const isActive = hoveredIndex === index || isTouchDevice
          const level = Math.max(0, Math.min(100, skill.level))

          return (
            <li
              key={skill.id}
              className="group relative"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                className={cn(
                  "relative -mx-4 flex cursor-pointer items-center justify-between rounded-lg px-4 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  compact ? "py-3.5" : "py-5",
                  isActive ? "bg-foreground/[0.03]" : "bg-transparent"
                )}
              >
                <div className="relative flex items-center gap-3.5">
                  <div
                    className={cn(
                      "h-5 w-0.5 rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                      isActive ? "scale-y-100 bg-accent opacity-100" : "scale-y-50 bg-border opacity-0"
                    )}
                  />

                  {skill.icon ? (
                    <span className="relative h-5 w-5 shrink-0 overflow-hidden rounded-sm">
                      <CloudinaryImage src={skill.icon} alt={`${skill.name} icon`} fill className="object-contain" />
                    </span>
                  ) : null}

                  <span
                    className={cn(
                      "tracking-tight transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                      compact ? "text-sm font-medium" : "text-base font-medium",
                      isActive ? "translate-x-0 text-foreground" : "-translate-x-1 text-muted-foreground"
                    )}
                  >
                    {skill.name}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className={cn("relative h-1 overflow-hidden rounded-full bg-border/50", compact ? "w-20" : "w-24")}>
                    <div className="absolute inset-0 bg-muted/50" />
                    <div
                      className="absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-accent/80 to-accent transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                      style={{
                        width: isActive ? `${level}%` : isTouchDevice ? `${level}%` : "0%",
                        transitionDelay: isActive ? "100ms" : "0ms",
                      }}
                    />
                    <div
                      className={cn(
                        "absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out",
                        isActive ? "translate-x-full" : "-translate-x-full"
                      )}
                      style={{ transitionDelay: isActive ? "250ms" : "0ms" }}
                    />
                  </div>

                  <div className="relative w-10 overflow-hidden">
                    <span
                      className={cn(
                        "block text-right font-mono text-sm tabular-nums transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                        isActive
                          ? "translate-y-0 text-foreground opacity-100 blur-0"
                          : isTouchDevice
                            ? "translate-y-0 text-foreground/90 opacity-100 blur-0"
                            : "translate-y-3 text-muted-foreground/40 opacity-0 blur-sm"
                      )}
                    >
                      {level}%
                    </span>
                  </div>
                </div>
              </div>

              {index < skills.length - 1 && (
                <div
                  className={cn(
                    "mx-4 h-px transition-all duration-500",
                    hoveredIndex === index || hoveredIndex === index + 1 ? "bg-transparent" : "bg-border/30"
                  )}
                />
              )}
            </li>
          )
        })}
      </ul>

      <div className={cn("mt-8 flex items-center gap-3 border-t border-border/30 pt-5", compact && "mt-6 pt-4")}>
        <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent/60" />
        <p className="text-[11px] tracking-wide text-muted-foreground">
          {isTouchDevice ? "Tap categories to explore" : "Hover to explore"}
        </p>
      </div>
    </div>
  )
}
