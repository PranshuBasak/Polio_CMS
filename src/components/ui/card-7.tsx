"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface InteractiveProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
  imageUrl: string
  logoUrl?: string
  title: string
  description: string
  price: string
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1200"

export function InteractiveProductCard({
  className,
  imageUrl,
  logoUrl,
  title,
  description,
  price,
  ...props
}: InteractiveProductCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null)
  const [style, setStyle] = React.useState<React.CSSProperties>({})
  const [reducedMotion, setReducedMotion] = React.useState(false)

  React.useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReducedMotion(media.matches)
    const listener = (event: MediaQueryListEvent) => setReducedMotion(event.matches)
    media.addEventListener("change", listener)
    return () => media.removeEventListener("change", listener)
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || reducedMotion) return

    const { left, top, width, height } = cardRef.current.getBoundingClientRect()
    const x = e.clientX - left
    const y = e.clientY - top

    const rotateX = ((y - height / 2) / (height / 2)) * -8
    const rotateY = ((x - width / 2) / (width / 2)) * 8

    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`,
      transition: "transform 0.1s ease-out",
    })
  }

  const handleMouseLeave = () => {
    setStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
      transition: "transform 0.35s ease-in-out",
    })
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={style}
      className={cn(
        "relative w-full max-w-[360px] overflow-hidden rounded-3xl border border-border/70 bg-card shadow-2xl shadow-primary/10",
        className
      )}
      {...props}
    >
      <img
        src={imageUrl || FALLBACK_IMAGE}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover"
        onError={(event) => {
          event.currentTarget.src = FALLBACK_IMAGE
        }}
      />
      <div className="absolute inset-0 bg-linear-to-t from-background/90 via-background/35 to-transparent" />

      <div className="relative z-10 flex min-h-[420px] flex-col p-5">
        <div className="flex items-start justify-between rounded-xl border border-border/60 bg-background/40 p-4 backdrop-blur-md">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-bold text-foreground">{title}</h3>
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{description}</p>
          </div>
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={`${title} logo`}
              className="ml-3 h-8 w-8 rounded-md border border-border/60 bg-card object-cover"
              onError={(event) => {
                event.currentTarget.style.display = "none"
              }}
            />
          ) : null}
        </div>

        <div className="mt-4 inline-flex w-fit rounded-full border border-primary/40 bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
          {price}
        </div>

        <div className="mt-auto flex w-full justify-center gap-2 pt-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <span
              key={index}
              className={cn("h-1.5 w-1.5 rounded-full", index === 0 ? "bg-primary" : "bg-muted-foreground/40")}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
