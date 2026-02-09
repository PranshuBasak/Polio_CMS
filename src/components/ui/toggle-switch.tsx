"use client"

import { cn } from "@/lib/utils"
import React, { useState } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"

interface ToggleSwitchProps {
  className?: string
  initialValue?: boolean
  checked?: boolean
  onToggle?: (value: boolean) => void
  label?: string
  offLabel?: string
  onLabel?: string
  disabled?: boolean
}

const MAX_TRAVEL = 80

export default function ToggleSwitch({
  className,
  initialValue = true,
  checked,
  onToggle,
  label = "Service Link",
  offLabel = "Standby",
  onLabel = "Online",
  disabled = false,
}: ToggleSwitchProps) {
  const [isOn, setIsOn] = useState(initialValue)
  const resolvedState = checked ?? isOn

  const y = useMotionValue(resolvedState ? MAX_TRAVEL : 0)
  const springY = useSpring(y, {
    stiffness: 520,
    damping: 32,
    mass: 1.1,
  })

  const ledOpacity = useTransform(springY, [0, MAX_TRAVEL], [0.25, 0.85])
  const textOpacityOff = useTransform(springY, [0, MAX_TRAVEL * 0.4], [1, 0])
  const textOpacityOn = useTransform(springY, [MAX_TRAVEL * 0.4, MAX_TRAVEL], [0, 1])

  const commit = (nextState: boolean) => {
    if (disabled) {
      return
    }

    if (checked === undefined) {
      setIsOn(nextState)
    }
    y.set(nextState ? MAX_TRAVEL : 0)
    onToggle?.(nextState)
  }

  const handleDragEnd = () => {
    if (disabled) {
      return
    }

    const currentY = y.get()
    commit(currentY > MAX_TRAVEL / 2)
  }

  React.useEffect(() => {
    y.set(resolvedState ? MAX_TRAVEL : 0)
  }, [resolvedState, y])

  return (
    <div
      className={cn(
        "relative rounded-2xl border border-border/60 bg-card/80 p-6 shadow-lg backdrop-blur",
        className
      )}
    >
      <p className="mb-4 text-center text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</p>

      <div className="relative mx-auto w-28 rounded-3xl border-2 border-border/70 bg-gradient-to-b from-card to-muted p-2 shadow-[0_24px_42px_rgba(0,0,0,0.24)]">
        <motion.div
          className="absolute -top-3 left-1/2 h-2.5 w-16 -translate-x-1/2 rounded-full"
          style={{
            opacity: ledOpacity,
            backgroundColor: "var(--primary)",
            boxShadow: "0 0 16px color-mix(in oklab, var(--primary) 60%, transparent)",
          }}
        />

        <div className="absolute bottom-6 top-6 left-1/2 w-6 -translate-x-1/2 rounded-full border-x border-border/60 bg-background/60 shadow-inner" />

        <motion.div
          className={cn(
            "relative z-10 h-32 w-24 touch-none",
            disabled ? "cursor-not-allowed opacity-70" : "cursor-grab active:cursor-grabbing"
          )}
          style={{ y: springY }}
          drag={disabled ? false : "y"}
          dragConstraints={{ top: 0, bottom: MAX_TRAVEL }}
          dragElastic={0.06}
          dragMomentum={false}
          onDragEnd={handleDragEnd}
          onClick={() => commit(!resolvedState)}
          whileTap={{ scale: 0.985 }}
        >
          <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-border/70 bg-gradient-to-b from-card to-muted shadow-[0_12px_26px_rgba(0,0,0,0.28)]">
            <div className="absolute top-3 flex w-16 flex-col gap-1 opacity-45">
              <div className="h-0.5 w-full rounded-full bg-foreground/30" />
              <div className="h-0.5 w-full rounded-full bg-foreground/30" />
            </div>

            <div className="relative mt-5 h-6 w-full text-center">
              <motion.span
                style={{ opacity: textOpacityOff }}
                className="absolute inset-0 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground"
              >
                {offLabel}
              </motion.span>
              <motion.span
                style={{ opacity: textOpacityOn }}
                className="absolute inset-0 text-[11px] font-bold uppercase tracking-[0.2em] text-primary"
              >
                {onLabel}
              </motion.span>
            </div>
          </div>
        </motion.div>

        <div className="pointer-events-none absolute right-1 top-8 origin-left rotate-90 text-[8px] uppercase tracking-widest text-muted-foreground/80">
          Off
        </div>
        <div className="pointer-events-none absolute right-1 bottom-8 origin-left rotate-90 text-[8px] uppercase tracking-widest text-primary/80">
          On
        </div>
      </div>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Current state:{" "}
        <span className={cn("font-semibold", resolvedState ? "text-primary" : "text-muted-foreground")}>
          {resolvedState ? onLabel : offLabel}
        </span>
      </p>
    </div>
  )
}
