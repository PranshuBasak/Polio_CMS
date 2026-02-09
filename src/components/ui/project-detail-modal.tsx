"use client"

import { ExternalLink, Github, PlayCircle, X } from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { createPortal } from "react-dom"
import type { Project } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { InteractiveProductCard } from "@/components/ui/card-7"

type ProjectDetailModalProps = {
  project: Project | null
  open: boolean
  onOpenChange: (open: boolean) => void
  modalId: string
}

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1600"

export function ProjectDetailModal({ project, open, onOpenChange, modalId }: ProjectDetailModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  const images = useMemo(() => {
    if (!project) return [PLACEHOLDER_IMAGE]

    const merged = [project.image, ...(project.screenshots || [])].filter(Boolean) as string[]
    const deduped = Array.from(new Set(merged))
    return deduped.length > 0 ? deduped : [PLACEHOLDER_IMAGE]
  }, [project])

  const handleClose = useCallback(() => {
    setActiveImageIndex(0)
    onOpenChange(false)
  }, [onOpenChange])

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose()
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => {
      window.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [handleClose, open])

  if (typeof window === "undefined" || !open || !project) return null

  const activeImage = images[activeImageIndex] || PLACEHOLDER_IMAGE
  const categoryLabel = project.category || project.technologies?.[0] || "Uncategorized"

  return createPortal(
    <div
      className="fixed inset-0 z-90 flex items-center justify-center bg-background/70 p-3 backdrop-blur-lg md:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          handleClose()
        }
      }}
      aria-hidden={!open}
    >
      <div
        id={modalId}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${modalId}-title`}
        aria-describedby={`${modalId}-description`}
        className="relative h-[80vh] w-full max-w-6xl overflow-hidden rounded-2xl border border-border/70 bg-card/95 shadow-2xl shadow-primary/25"
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-3 top-3 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/70 bg-background/70 text-foreground transition-colors hover:bg-muted"
          aria-label="Close project details"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid h-full grid-cols-1 overflow-hidden lg:grid-cols-[360px_1fr]">
          <div className="border-b border-border/70 p-4 lg:border-b-0 lg:border-r lg:p-6">
            <InteractiveProductCard
              imageUrl={activeImage}
              logoUrl={project.icon}
              title={project.title}
              description={project.description}
              price={categoryLabel}
              className="mx-auto h-vh-60 max-w-none"
            />
          </div>

          <div className="flex h-full flex-col">
            <div className="flex-1 overflow-y-auto p-4 md:p-6">
              <div className="space-y-5">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="border border-primary/35 bg-primary/10 text-primary">
                      {categoryLabel}
                    </Badge>
                  </div>
                  <h2 id={`${modalId}-title`} className="text-2xl font-black tracking-tight text-foreground md:text-3xl">
                    {project.title}
                  </h2>
                  <p id={`${modalId}-description`} className="text-sm leading-relaxed text-muted-foreground md:text-base">
                    {project.description}
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="outline" className="border-border/70 bg-background/70">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Screenshots</h3>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {images.map((image, index) => (
                      <button
                        key={`${project.id}-shot-${index}`}
                        type="button"
                        onClick={() => setActiveImageIndex(index)}
                        className={cn(
                          "relative h-24 w-40 shrink-0 overflow-hidden rounded-lg border transition-all",
                          index === activeImageIndex
                            ? "border-primary shadow-lg shadow-primary/25"
                            : "border-border/70 opacity-80 hover:opacity-100"
                        )}
                      >
                        <img
                          src={image}
                          alt={`${project.title} screenshot ${index + 1}`}
                          className="h-full w-full object-cover"
                          onError={(event) => {
                            event.currentTarget.src = PLACEHOLDER_IMAGE
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 border-t border-border/70 bg-card/95 p-4 md:p-5">
              <div className="flex flex-wrap gap-2">
                {project.youtubeUrl ? (
                  <Button asChild size="sm" className="bg-red-600 text-white hover:bg-red-700">
                    <a href={project.youtubeUrl} target="_blank" rel="noopener noreferrer">
                      <PlayCircle className="mr-2 h-4 w-4" />
                      YouTube
                    </a>
                  </Button>
                ) : null}

                {project.githubUrl ? (
                  <Button asChild variant="outline" size="sm">
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" />
                      GitHub
                    </a>
                  </Button>
                ) : null}

                {project.liveUrl ? (
                  <Button asChild size="sm">
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Live Demo
                    </a>
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
