"use client"

import { type Ref, forwardRef, useMemo, useState } from "react"
import type { Project } from "@/lib/types"
import { cn } from "@/lib/utils"

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?auto=format&fit=crop&q=80&w=1200"

export type ProjectFolder = {
  id: string
  title: string
  projects: Project[]
  gradientToken?: string
}

type FolderExplorerProps = {
  folders: ProjectFolder[]
  className?: string
  emptyMessage?: string
  onProjectSelect?: (project: Project) => void
}

type PreviewCardProps = {
  image: string
  title: string
  delay: number
  isVisible: boolean
  index: number
  totalCount: number
  onClick: () => void
  isSelected: boolean
}

const PreviewCard = forwardRef(function PreviewCard(
  { image, title, delay, isVisible, index, totalCount, onClick, isSelected }: PreviewCardProps,
  ref: Ref<HTMLDivElement>
) {
  const middleIndex = (totalCount - 1) / 2
  const factor = totalCount > 1 ? (index - middleIndex) / middleIndex : 0

  const rotation = factor * 25
  const translationX = factor * 85
  const translationY = Math.abs(factor) * 12

  return (
    <div
      ref={ref}
      className={cn("absolute h-28 w-20 cursor-pointer group/card", isSelected && "opacity-0")}
      style={{
        transform: isVisible
          ? `translateY(calc(-100px + ${translationY}px)) translateX(${translationX}px) rotate(${rotation}deg) scale(1)`
          : "translateY(0px) translateX(0px) rotate(0deg) scale(0.4)",
        opacity: isSelected ? 0 : isVisible ? 1 : 0,
        transition: `all 700ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        zIndex: 10 + index,
        left: "-40px",
        top: "-56px",
      }}
      onClick={(event) => {
        event.stopPropagation()
        onClick()
      }}
    >
      <div
        className={cn(
          "relative h-full w-full overflow-hidden rounded-lg border border-white/10 bg-card shadow-xl",
          "transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          "group-hover/card:-translate-y-6 group-hover/card:scale-125 group-hover/card:ring-2 group-hover/card:ring-accent group-hover/card:shadow-2xl group-hover/card:shadow-accent/40"
        )}
      >
        <img
          src={image || PLACEHOLDER_IMAGE}
          alt={title}
          className="h-full w-full object-cover"
          onError={(event) => {
            event.currentTarget.src = PLACEHOLDER_IMAGE
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        <p className="absolute bottom-1.5 left-1.5 right-1.5 truncate text-[9px] font-black uppercase tracking-tighter text-white drop-shadow-md">
          {title}
        </p>
      </div>
    </div>
  )
})

export default function FolderExplorer({
  folders,
  className,
  emptyMessage = "No projects found for the selected filters.",
  onProjectSelect,
}: FolderExplorerProps) {
  if (folders.length === 0) {
    return (
      <div className={cn("rounded-2xl border border-border/60 bg-card/30 p-10 text-center backdrop-blur-sm", className)}>
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className={cn("grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-3", className)}>
      {folders.map((folder, index) => (
        <div
          key={folder.id}
          className="w-full animate-in fade-in slide-in-from-bottom-8 duration-700"
          style={{ animationDelay: `${180 + index * 80}ms` }}
        >
          <FolderCard folder={folder} onProjectSelect={onProjectSelect} />
        </div>
      ))}
    </div>
  )
}

function FolderCard({
  folder,
  onProjectSelect,
}: {
  folder: ProjectFolder
  onProjectSelect?: (project: Project) => void
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [hiddenCardId, setHiddenCardId] = useState<string | null>(null)
  const previewProjects = useMemo(() => folder.projects.slice(0, 5), [folder.projects])

  const gradient = folder.gradientToken || "linear-gradient(135deg, var(--primary), var(--accent))"
  const backBg = gradient
  const tabBg = gradient
  const frontBg = gradient

  return (
    <article
      className="group relative flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-border/55 bg-card/30 p-8 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-accent/45 hover:shadow-2xl hover:shadow-accent/20"
      style={{ perspective: "1200px" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="absolute inset-0 rounded-2xl transition-opacity duration-700"
        style={{
          background: `radial-gradient(circle at 50% 70%, color-mix(in oklab, var(--accent) 45%, transparent) 0%, transparent 70%)`,
          opacity: isHovered ? 0.12 : 0,
        }}
      />

      <div className="relative mb-4 flex h-[160px] w-[200px] items-center justify-center">
        <div
          className="absolute h-24 w-32 rounded-lg border border-white/10 shadow-md"
          style={{
            background: backBg,
            filter: "brightness(0.9)",
            transformOrigin: "bottom center",
            transform: isHovered ? "rotateX(-20deg) scaleY(1.05)" : "rotateX(0deg) scaleY(1)",
            transition: "transform 700ms cubic-bezier(0.16, 1, 0.3, 1)",
            zIndex: 10,
          }}
        />

        <div
          className="absolute h-4 w-12 rounded-t-md border-x border-t border-white/10"
          style={{
            background: tabBg,
            filter: "brightness(0.85)",
            top: "calc(50% - 48px - 12px)",
            left: "calc(50% - 64px + 16px)",
            transformOrigin: "bottom center",
            transform: isHovered ? "rotateX(-30deg) translateY(-3px)" : "rotateX(0deg) translateY(0)",
            transition: "transform 700ms cubic-bezier(0.16, 1, 0.3, 1)",
            zIndex: 10,
          }}
        />

        <div className="absolute" style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 20 }}>
          {previewProjects.map((project, index) => {
            const image = project.image || project.screenshots?.[0] || PLACEHOLDER_IMAGE

            return (
              <PreviewCard
                key={project.id}
                image={image}
                title={project.title}
                delay={index * 50}
                isVisible={isHovered}
                index={index}
                totalCount={previewProjects.length}
                isSelected={hiddenCardId === project.id}
                onClick={() => {
                  setHiddenCardId(project.id)
                  onProjectSelect?.(project)
                  setTimeout(() => setHiddenCardId(null), 300)
                }}
              />
            )
          })}
        </div>

        <div
          className="absolute h-24 w-32 rounded-lg border border-white/20 shadow-lg"
          style={{
            background: frontBg,
            top: "calc(50% - 48px + 4px)",
            transformOrigin: "bottom center",
            transform: isHovered ? "rotateX(35deg) translateY(12px)" : "rotateX(0deg) translateY(0)",
            transition: "transform 700ms cubic-bezier(0.16, 1, 0.3, 1)",
            zIndex: 30,
          }}
        />
        <div
          className="pointer-events-none absolute h-24 w-32 overflow-hidden rounded-lg"
          style={{
            top: "calc(50% - 48px + 4px)",
            background: "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 60%)",
            transformOrigin: "bottom center",
            transform: isHovered ? "rotateX(35deg) translateY(12px)" : "rotateX(0deg) translateY(0)",
            transition: "transform 700ms cubic-bezier(0.16, 1, 0.3, 1)",
            zIndex: 31,
          }}
        />
      </div>

      <div className="text-center">
        <h3 className="mt-4 text-lg font-bold text-foreground transition-all duration-500">{folder.title}</h3>
        <p className="text-sm font-medium text-muted-foreground transition-all duration-500">
          {folder.projects.length} {folder.projects.length === 1 ? "project" : "projects"}
        </p>
      </div>

      <div
        className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground/55 transition-all duration-500"
        style={{
          opacity: isHovered ? 0 : 1,
          transform: isHovered ? "translate(-50%, 10px)" : "translate(-50%, 0)",
        }}
      >
        <span>Hover</span>
      </div>
    </article>
  )
}
