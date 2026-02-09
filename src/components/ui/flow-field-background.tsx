"use client"

import React, { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface FlowFieldBackgroundProps {
  className?: string
  color?: string
  trailOpacity?: number
  particleCount?: number
  speed?: number
}

type MouseState = {
  x: number
  y: number
}

class FlowParticle {
  x = 0
  y = 0
  vx = 0
  vy = 0
  age = 0
  life = 0

  constructor(width: number, height: number) {
    this.reset(width, height)
  }

  reset(width: number, height: number) {
    this.x = Math.random() * width
    this.y = Math.random() * height
    this.vx = 0
    this.vy = 0
    this.age = 0
    this.life = Math.random() * 220 + 120
  }

  update({
    width,
    height,
    speed,
    mouse,
  }: {
    width: number
    height: number
    speed: number
    mouse: MouseState
  }) {
    const angle = (Math.cos(this.x * 0.0048) + Math.sin(this.y * 0.0048)) * Math.PI

    this.vx += Math.cos(angle) * 0.2 * speed
    this.vy += Math.sin(angle) * 0.2 * speed

    const dx = mouse.x - this.x
    const dy = mouse.y - this.y
    const distance = Math.hypot(dx, dy)
    const interactionRadius = 140

    if (distance < interactionRadius) {
      const force = (interactionRadius - distance) / interactionRadius
      this.vx -= dx * force * 0.045
      this.vy -= dy * force * 0.045
    }

    this.x += this.vx
    this.y += this.vy
    this.vx *= 0.95
    this.vy *= 0.95

    this.age += 1
    if (this.age > this.life) {
      this.reset(width, height)
    }

    if (this.x < 0) {
      this.x = width
    }
    if (this.x > width) {
      this.x = 0
    }
    if (this.y < 0) {
      this.y = height
    }
    if (this.y > height) {
      this.y = 0
    }
  }

  draw(context: CanvasRenderingContext2D, color: string) {
    const alpha = 1 - Math.abs(this.age / this.life - 0.5) * 2
    context.globalAlpha = alpha
    context.fillStyle = color
    context.fillRect(this.x, this.y, 1.4, 1.4)
  }
}

const resolveCssVariableColor = (input: string, root: HTMLElement) => {
  if (!input.startsWith("var(")) {
    return input
  }

  const match = input.match(/var\((--[^\),\s]+)/)
  if (!match) {
    return input
  }

  const value = getComputedStyle(root).getPropertyValue(match[1]).trim()
  return value || input
}

export default function FlowFieldBackground({
  className,
  color = "var(--primary)",
  trailOpacity = 0.12,
  particleCount = 520,
  speed = 1,
}: FlowFieldBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current

    if (!canvas || !container) {
      return
    }

    const ctx = canvas.getContext("2d")
    if (!ctx) {
      return
    }

    let width = container.clientWidth
    let height = container.clientHeight
    let animationFrameId = 0
    let particles: FlowParticle[] = []
    const mouse: MouseState = { x: -1000, y: -1000 }
    let prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const docRoot = document.documentElement
    const particleColor = resolveCssVariableColor(color, docRoot)

    const getEffectiveSettings = () => {
      const isMobile = window.innerWidth < 768
      const countFactor = prefersReducedMotion ? 0.35 : isMobile ? 0.6 : 1
      const speedFactor = prefersReducedMotion ? 0.5 : isMobile ? 0.85 : 1

      return {
        effectiveParticleCount: Math.max(80, Math.round(particleCount * countFactor)),
        effectiveSpeed: speed * speedFactor,
      }
    }

    const init = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`

      const { effectiveParticleCount } = getEffectiveSettings()
      particles = Array.from({ length: effectiveParticleCount }, () => new FlowParticle(width, height))
    }

    const animate = () => {
      const { effectiveSpeed } = getEffectiveSettings()
      const isDark = document.documentElement.classList.contains("dark")
      const fadeColor = isDark
        ? `rgba(2, 6, 23, ${trailOpacity})`
        : `rgba(248, 250, 252, ${trailOpacity})`

      ctx.fillStyle = fadeColor
      ctx.fillRect(0, 0, width, height)

      for (const particle of particles) {
        particle.update({ width, height, speed: effectiveSpeed, mouse })
        particle.draw(ctx, particleColor)
      }

      animationFrameId = window.requestAnimationFrame(animate)
    }

    const handleResize = () => {
      width = container.clientWidth
      height = container.clientHeight
      init()
    }

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      mouse.x = event.clientX - rect.left
      mouse.y = event.clientY - rect.top
    }

    const handleMouseLeave = () => {
      mouse.x = -1000
      mouse.y = -1000
    }

    const motionMediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const handleReducedMotionChange = (event: MediaQueryListEvent) => {
      prefersReducedMotion = event.matches
      init()
    }

    init()
    animate()

    window.addEventListener("resize", handleResize)
    container.addEventListener("mousemove", handleMouseMove)
    container.addEventListener("mouseleave", handleMouseLeave)
    motionMediaQuery.addEventListener("change", handleReducedMotionChange)

    return () => {
      window.removeEventListener("resize", handleResize)
      container.removeEventListener("mousemove", handleMouseMove)
      container.removeEventListener("mouseleave", handleMouseLeave)
      motionMediaQuery.removeEventListener("change", handleReducedMotionChange)
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [color, particleCount, speed, trailOpacity])

  return (
    <div ref={containerRef} className={cn("relative h-full w-full overflow-hidden", className)}>
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  )
}
