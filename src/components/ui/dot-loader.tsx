"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { cn } from "@/lib/utils"

interface DotLoaderProps {
  frames?: number[][]
  dotClass?: string
  duration?: number
  play?: boolean
  repeatCount?: number
}

// Default animation frames (7x7 grid)
const defaultFrames = [
  [24], [23, 25], [22, 24, 26], [21, 23, 25, 27], [22, 24, 26], [23, 25], [24],
  [17, 24, 31], [16, 23, 25, 32], [15, 22, 24, 26, 33], [16, 23, 25, 32], [17, 24, 31],
  [10, 17, 24, 31, 38], [9, 16, 23, 25, 32, 39], [10, 17, 24, 31, 38],
  [3, 10, 17, 24, 31, 38, 45], [10, 17, 24, 31, 38],
  [17, 24, 31], [24]
]

const game = [
    [14, 7, 0, 8, 6, 13, 20],
    [14, 7, 13, 20, 16, 27, 21],
    [14, 20, 27, 21, 34, 24, 28],
    [27, 21, 34, 28, 41, 32, 35],
    [34, 28, 41, 35, 48, 40, 42],
    [34, 28, 41, 35, 48, 42, 46],
    [34, 28, 41, 35, 48, 42, 38],
    [34, 28, 41, 35, 48, 30, 21],
    [34, 28, 41, 48, 21, 22, 14],
    [34, 28, 41, 21, 14, 16, 27],
    [34, 28, 21, 14, 10, 20, 27],
    [28, 21, 14, 4, 13, 20, 27],
    [28, 21, 14, 12, 6, 13, 20],
    [28, 21, 14, 6, 13, 20, 11],
    [28, 21, 14, 6, 13, 20, 10],
    [14, 6, 13, 20, 9, 7, 21],
];

export function DotLoader({
  frames =  game,
  dotClass = "",
  duration = 100,
  play = true,
  repeatCount = -1,
}: DotLoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const dotsRef = useRef<HTMLDivElement[]>([])

  useGSAP(() => {
    if (!play || !containerRef.current) return

    const timeline = gsap.timeline({ repeat: repeatCount })

    frames.forEach((frame, index) => {
      timeline.to(
        dotsRef.current,
        {
          backgroundColor: (i) => (frame.includes(i) ? "currentColor" : "transparent"),
          duration: duration / 1000,
        },
        index * (duration / 1000)
      )
    })

    return () => {
      timeline.kill()
    }
  }, [frames, duration, play, repeatCount])

  return (
    <div
      ref={containerRef}
      className="inline-grid grid-cols-7 gap-1 p-2"
      aria-label="Loading"
    >
      {Array.from({ length: 49 }).map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) dotsRef.current[i] = el
          }}
          className={cn(
            "h-2 w-2 rounded-full bg-transparent transition-colors",
            dotClass
          )}
        />
      ))}
    </div>
  )
}
