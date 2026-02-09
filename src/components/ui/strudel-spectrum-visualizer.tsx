"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

type StrudelSpectrumVisualizerProps = {
  className?: string
  isPlaying: boolean
  isLoading: boolean
  getSpectrumFrame: () => number[] | null
}

const BAR_COUNT = 56

export default function StrudelSpectrumVisualizer({
  className,
  isPlaying,
  isLoading,
  getSpectrumFrame,
}: StrudelSpectrumVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reducedMotionRef = useRef(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    reducedMotionRef.current = mediaQuery.matches

    const onChange = (event: MediaQueryListEvent) => {
      reducedMotionRef.current = event.matches
    }

    mediaQuery.addEventListener("change", onChange)

    return () => {
      mediaQuery.removeEventListener("change", onChange)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    const ctx = canvas.getContext("2d")
    if (!ctx) {
      return
    }

    let frameId = 0
    let intervalId = 0

    const draw = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      const width = Math.max(1, Math.floor(rect.width))
      const height = Math.max(1, Math.floor(rect.height))

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr
        canvas.height = height * dpr
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, width, height)

      const frame = getSpectrumFrame()
      const bars = toBars(frame, BAR_COUNT, isPlaying, performance.now())
      const barWidth = width / BAR_COUNT
      const gradient = ctx.createLinearGradient(0, 0, 0, height)
      const styles = getComputedStyle(document.documentElement)
      const primary = styles.getPropertyValue("--primary").trim()
      const accent = styles.getPropertyValue("--accent").trim()
      const primaryColor = resolveCanvasColor(primary, "rgb(59 130 246)")
      const accentColor = resolveCanvasColor(accent, "rgb(236 72 153)")

      gradient.addColorStop(0, primaryColor)
      gradient.addColorStop(1, accentColor)
      ctx.fillStyle = gradient

      for (let index = 0; index < BAR_COUNT; index += 1) {
        const value = bars[index] ?? 0
        const activity = isLoading ? Math.max(value, 0.2) : value
        const barHeight = Math.max(2, Math.floor(activity * (height - 4)))
        const x = Math.floor(index * barWidth) + 1
        const y = height - barHeight
        const w = Math.max(1, Math.floor(barWidth - 2))
        ctx.fillRect(x, y, w, barHeight)
      }
    }

    const animate = () => {
      draw()
      frameId = window.requestAnimationFrame(animate)
    }

    if (reducedMotionRef.current) {
      draw()
      intervalId = window.setInterval(draw, 250)
    } else {
      animate()
    }

    return () => {
      window.cancelAnimationFrame(frameId)
      window.clearInterval(intervalId)
    }
  }, [getSpectrumFrame, isLoading, isPlaying])

  return (
    <div className={cn("rounded-xl border border-border/70 bg-background/75 p-3", className)}>
      <canvas ref={canvasRef} className="h-44 w-full rounded-md bg-background/70" />
      <p className="mt-3 text-xs text-muted-foreground">
        {isLoading
          ? "Loading sample packs and preparing synths..."
          : isPlaying
            ? "Visualizer active."
            : "Playback stopped."}
      </p>
    </div>
  )
}

function toBars(frame: number[] | null, barCount: number, isPlaying: boolean, nowMs: number) {
  if (!frame || frame.length === 0) {
    return buildFallbackBars(barCount, isPlaying, nowMs)
  }

  const bars: number[] = []
  const stride = Math.max(1, Math.floor(frame.length / barCount))

  for (let i = 0; i < frame.length && bars.length < barCount; i += stride) {
    const slice = frame.slice(i, i + stride)
    const average = slice.reduce((sum, value) => sum + value, 0) / Math.max(1, slice.length)
    bars.push(normalizeFrequencyValue(average))
  }

  while (bars.length < barCount) {
    bars.push(0.04)
  }

  const hasMeaningfulSignal = bars.some((value) => value > 0.08)
  if (!hasMeaningfulSignal) {
    return buildFallbackBars(barCount, isPlaying, nowMs)
  }

  return bars
}

function normalizeFrequencyValue(value: number) {
  if (value <= 0 && value >= -200) {
    return Math.min(1, Math.max(0, (value + 140) / 140))
  }

  if (value >= 0 && value <= 255) {
    return Math.min(1, Math.max(0, value / 255))
  }

  return Math.min(1, Math.max(0, value))
}

function resolveCanvasColor(token: string, fallback: string) {
  if (!token) {
    return fallback
  }

  const normalized = token.trim()
  const candidates = [normalized]

  if (!looksLikeColorFunction(normalized) && !normalized.startsWith("#")) {
    candidates.push(`oklch(${normalized})`)
  }

  return firstRenderableColor(candidates, fallback)
}

function looksLikeColorFunction(value: string) {
  return (
    value.startsWith("rgb(") ||
    value.startsWith("rgba(") ||
    value.startsWith("hsl(") ||
    value.startsWith("hsla(") ||
    value.startsWith("oklch(") ||
    value.startsWith("oklab(") ||
    value.startsWith("lab(") ||
    value.startsWith("lch(") ||
    value.startsWith("hwb(") ||
    value.startsWith("color(") ||
    value.startsWith("var(")
  )
}

function firstRenderableColor(candidates: string[], fallback: string) {
  if (typeof document === "undefined") {
    return fallback
  }

  const swatch = document.createElement("span")
  swatch.style.position = "absolute"
  swatch.style.left = "-9999px"
  swatch.style.pointerEvents = "none"
  document.body.appendChild(swatch)

  try {
    for (const candidate of [...candidates, fallback]) {
      swatch.style.color = ""
      swatch.style.color = candidate

      if (!swatch.style.color) {
        continue
      }

      const resolved = getComputedStyle(swatch).color
      if (resolved) {
        return resolved
      }
    }
  } finally {
    swatch.remove()
  }

  return fallback
}

function buildFallbackBars(barCount: number, isPlaying: boolean, nowMs: number) {
  const base = isPlaying ? 0.08 : 0.04

  if (!isPlaying) {
    return Array.from({ length: barCount }, () => base)
  }

  return Array.from({ length: barCount }, (_, index) => {
    const travel = Math.sin(nowMs / 240 + index * 0.38) * 0.5 + 0.5
    const pulse = Math.sin(nowMs / 860) * 0.5 + 0.5
    return Math.min(1, Math.max(0, base + travel * 0.22 + pulse * 0.14))
  })
}
