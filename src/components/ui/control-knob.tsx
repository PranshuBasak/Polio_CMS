"use client"

import { cn } from "@/lib/utils"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion"

interface ControlKnobProps {
  className?: string
  initialValue?: number
  value?: number
  onChange?: (value: number) => void
  label?: string
  disabled?: boolean
}

const MIN_DEG = -135
const MAX_DEG = 135
const TOTAL_TICKS = 40
const DEGREES_PER_TICK = (MAX_DEG - MIN_DEG) / TOTAL_TICKS

const clampPercent = (value: number) => Math.min(100, Math.max(0, value))
const percentToDeg = (value: number) => MIN_DEG + (clampPercent(value) / 100) * (MAX_DEG - MIN_DEG)

export default function ControlKnob({
  className,
  initialValue = 37,
  value,
  onChange,
  label = "Output Level",
  disabled = false,
}: ControlKnobProps) {
  const [isDragging, setIsDragging] = useState(false)
  const knobRef = useRef<HTMLDivElement>(null)
  const isControlled = value !== undefined

  const initialPercent = useMemo(
    () => clampPercent(isControlled ? value : initialValue),
    [initialValue, isControlled, value]
  )
  const initialDeg = useMemo(() => percentToDeg(initialPercent), [initialPercent])

  const rawRotation = useMotionValue(initialDeg)
  const snappedRotation = useMotionValue(initialDeg)
  const smoothRotation = useSpring(snappedRotation, {
    stiffness: 420,
    damping: 36,
    mass: 0.82,
  })

  const displayValue = useTransform(smoothRotation, [MIN_DEG, MAX_DEG], [0, 100])
  const glowOpacity = useTransform(rawRotation, [MIN_DEG, MAX_DEG], [0.12, 0.45])

  const [display, setDisplay] = useState(Math.round(initialPercent))

  useEffect(() => {
    if (!isControlled || value === undefined || isDragging) {
      return
    }

    const clamped = clampPercent(value)
    const deg = percentToDeg(clamped)
    rawRotation.set(deg)
    snappedRotation.set(deg)
  }, [isControlled, isDragging, rawRotation, snappedRotation, value])

  useMotionValueEvent(displayValue, "change", (latest) => {
    const nextValue = Math.round(clampPercent(latest))
    setDisplay(nextValue)
    onChange?.(nextValue)
  })

  const handlePointerDown = useCallback(() => {
    if (disabled) {
      return
    }

    setIsDragging(true)
    document.body.style.cursor = "grabbing"
    document.body.style.userSelect = "none"
  }, [disabled])

  useEffect(() => {
    if (!isDragging) {
      return
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (!knobRef.current) {
        return
      }

      const rect = knobRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const x = event.clientX - centerX
      const y = event.clientY - centerY

      let deg = Math.atan2(y, x) * (180 / Math.PI) + 90
      if (deg > 180) {
        deg -= 360
      }

      if (deg < MIN_DEG && deg > -180) {
        deg = MIN_DEG
      }

      if (deg > MAX_DEG) {
        deg = MAX_DEG
      }

      rawRotation.set(deg)
      const snapped = Math.round(deg / DEGREES_PER_TICK) * DEGREES_PER_TICK
      snappedRotation.set(snapped)
    }

    const handlePointerUp = () => {
      setIsDragging(false)
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
    }

    window.addEventListener("pointermove", handlePointerMove)
    window.addEventListener("pointerup", handlePointerUp)

    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerup", handlePointerUp)
    }
  }, [isDragging, rawRotation, snappedRotation])

  const ticks = useMemo(() => Array.from({ length: TOTAL_TICKS + 1 }), [])

  return (
    <div
      className={cn(
        "relative rounded-2xl border border-border/60 bg-card/80 p-6 shadow-lg backdrop-blur",
        className
      )}
    >
      <div className="relative mx-auto aspect-square w-full max-w-[260px] select-none">
        <motion.div
          className="absolute inset-6 rounded-full blur-2xl"
          style={{
            opacity: glowOpacity,
            background:
              "radial-gradient(circle at center, color-mix(in oklab, var(--primary) 72%, transparent), transparent 70%)",
          }}
        />

        <div className="absolute inset-0 pointer-events-none">
          {ticks.map((_, index) => {
            const angle = (index / TOTAL_TICKS) * (MAX_DEG - MIN_DEG) + MIN_DEG
            return (
              <div
                key={angle}
                className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2"
                style={{ transform: `rotate(${angle}deg)` }}
              >
                <TickMark currentRotation={smoothRotation} angle={angle} />
              </div>
            )
          })}
        </div>

        <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2">
          <motion.div
            ref={knobRef}
            className={cn(
              "relative h-full w-full rounded-full touch-none",
              disabled ? "cursor-not-allowed opacity-70" : isDragging ? "cursor-grabbing" : "cursor-grab"
            )}
            style={{ rotate: smoothRotation }}
            onPointerDown={handlePointerDown}
            whileHover={disabled ? undefined : { scale: 1.02 }}
            whileTap={disabled ? undefined : { scale: 0.985 }}
          >
            <div className="relative flex h-full w-full items-center justify-center rounded-full border border-border/70 bg-gradient-to-b from-card via-card to-muted shadow-[0_16px_40px_rgba(0,0,0,0.22)]">
              <div className="absolute inset-1 rounded-full border border-border/40" />

              <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-border/70 bg-background/85 shadow-inner">
                <motion.div
                  className="absolute top-3 h-5 w-1.5 rounded-full"
                  style={{
                    backgroundColor: "var(--primary)",
                    boxShadow: "0 0 14px color-mix(in oklab, var(--primary) 65%, transparent)",
                  }}
                />
                <span className="mt-7 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Level
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
        <p className="font-mono text-3xl font-bold tracking-wider text-primary">
          {display.toString().padStart(3, "0")}
          <span className="ml-1 text-sm text-muted-foreground">%</span>
        </p>
      </div>
    </div>
  )
}

function TickMark({
  currentRotation,
  angle,
}: {
  currentRotation: MotionValue<number>
  angle: number
}) {
  const opacity = useTransform(currentRotation, (rotation) => (rotation >= angle ? 1 : 0.25))
  const backgroundColor = useTransform(currentRotation, (rotation) =>
    rotation >= angle ? "var(--primary)" : "var(--muted-foreground)"
  )

  return (
    <motion.div
      style={{ opacity, backgroundColor }}
      className="mx-auto h-2.5 w-1 rounded-full transition-colors"
    />
  )
}
