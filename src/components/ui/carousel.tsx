"use client"

import * as React from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import CloudinaryImage from "./cloudinary-image"

interface CarouselProps {
  images: string[]
  className?: string
}

export function Carousel({ images, className }: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([])

  const scrollPrev = React.useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
  const scrollNext = React.useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])
  const scrollTo = React.useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi])

  const onSelect = React.useCallback((emblaApi: any) => {
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [])

  React.useEffect(() => {
    if (!emblaApi) return

    onSelect(emblaApi)
    setScrollSnaps(emblaApi.scrollSnapList())
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)
  }, [emblaApi, onSelect])

  if (!images.length) return null

  return (
    <div className={cn("relative group", className)}>
      <div className="overflow-hidden rounded-lg bg-muted aspect-video" ref={emblaRef}>
        <div className="flex touch-pan-y theme-transition">
          {images.map((src, index) => (
            <div className="flex-[0_0_100%] min-w-0 relative aspect-video" key={index}>
              <CloudinaryImage
                src={src}
                alt={`Slide ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/50 hover:bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity z-10"
            onClick={scrollPrev}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/50 hover:bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity z-10"
            onClick={scrollNext}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  index === selectedIndex ? "bg-primary w-4" : "bg-primary/30 hover:bg-primary/50"
                )}
                onClick={() => scrollTo(index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
