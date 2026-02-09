"use client"

import { cn } from "@/lib/utils"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"

export type StorySlide = {
  id: string
  title: string
  description: string
  imageUrl?: string
  ctaHref?: string
  ctaLabel?: string
}

type ScrollingFeatureShowcaseProps = {
  slides: StorySlide[]
  sectionTitle?: string
  sectionDescription?: string
  viewAllHref?: string
  viewAllLabel?: string
  className?: string
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1600"

export function ScrollingFeatureShowcase({
  slides,
  sectionTitle = "Featured Projects",
  sectionDescription = "A scrollable story of selected project highlights.",
  viewAllHref = "/projects",
  viewAllLabel = "View All Projects",
  className,
}: ScrollingFeatureShowcaseProps) {
  const safeSlides = useMemo(() => slides.filter((slide) => slide.title && slide.description), [slides])
  const [activeIndex, setActiveIndex] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container || safeSlides.length <= 1) return

    const handleScroll = () => {
      const scrollableHeight = Math.max(1, container.scrollHeight - container.clientHeight)
      const ratio = container.scrollTop / scrollableHeight
      const next = Math.min(safeSlides.length - 1, Math.floor(ratio * safeSlides.length))
      setActiveIndex(next)
    }

    container.addEventListener("scroll", handleScroll, { passive: true })
    return () => container.removeEventListener("scroll", handleScroll)
  }, [safeSlides.length])

  if (safeSlides.length === 0) {
    return (
      <section id="projects" className={cn("section-container", className)}>
        <div className="container mx-auto px-4">
          <div className="rounded-2xl border border-border/70 bg-card/70 p-8 text-center">
            <h2 className="text-2xl font-bold text-foreground">Projects</h2>
            <p className="mt-2 text-muted-foreground">No featured projects available yet.</p>
          </div>
        </div>
      </section>
    )
  }

  const activeSlide = safeSlides[activeIndex] ?? safeSlides[0]

  const scrollToSlide = (index: number) => {
    const container = scrollContainerRef.current
    if (!container || safeSlides.length <= 1) return

    const step = (container.scrollHeight - container.clientHeight) / (safeSlides.length - 1)
    container.scrollTo({ top: step * index, behavior: "smooth" })
  }

  return (
    <section id="projects" className={cn("section-container", className)}>
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="section-heading mb-3">{sectionTitle}</h2>
            <p className="max-w-2xl text-muted-foreground">{sectionDescription}</p>
          </div>
          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/20"
          >
            {viewAllLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div
          ref={scrollContainerRef}
          className="relative h-[78vh] overflow-y-auto rounded-3xl border border-border/60 bg-card/70 shadow-xl shadow-primary/10 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          <div style={{ height: `${safeSlides.length * 70}vh` }}>
            <div className="sticky top-0 grid h-[78vh] grid-cols-1 md:grid-cols-2">
              <div className="relative flex flex-col justify-between border-b border-border/60 p-6 md:border-b-0 md:border-r md:p-10">
                <div className="flex gap-2">
                  {safeSlides.map((slide, index) => (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => scrollToSlide(index)}
                      className={cn(
                        "h-1.5 rounded-full transition-all",
                        index === activeIndex ? "w-10 bg-primary" : "w-4 bg-muted-foreground/40 hover:bg-muted-foreground/70"
                      )}
                      aria-label={`Go to ${slide.title}`}
                    />
                  ))}
                </div>

                <div className="my-8">
                  <h3 className="text-3xl font-black tracking-tight text-foreground md:text-5xl">{activeSlide.title}</h3>
                  <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">{activeSlide.description}</p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href={activeSlide.ctaHref || "/projects"}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
                  >
                    {activeSlide.ctaLabel || "Explore"}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="relative hidden overflow-hidden md:block">
                <div className="absolute inset-0 bg-grid-pattern opacity-40" />
                <div
                  className="absolute inset-0 transition-transform duration-500 ease-out"
                  style={{ transform: `translateY(-${activeIndex * 100}%)` }}
                >
                  {safeSlides.map((slide) => (
                    <div key={slide.id} className="h-[78vh] w-full p-8">
                      <div className="relative h-full w-full overflow-hidden rounded-2xl border border-border/60">
                        <img
                          src={slide.imageUrl || FALLBACK_IMAGE}
                          alt={slide.title}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-background/70 via-background/5 to-transparent" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
