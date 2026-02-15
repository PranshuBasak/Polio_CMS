"use client"

import React, { useEffect } from "react"
import { CliLoader } from "@/components/ui/cli-loader"

interface HomeClientProps {
  children: React.ReactNode
}

let hasHomeLoaderBeenSeenInRuntime = false
let hasHomeInitialScrollResetInRuntime = false

export default function HomeClient({ children }: HomeClientProps) {
  const shouldShowCliLoader = !hasHomeLoaderBeenSeenInRuntime

  useEffect(() => {
    if (!hasHomeInitialScrollResetInRuntime && typeof window !== "undefined") {
      hasHomeInitialScrollResetInRuntime = true
      const previousScrollRestoration = window.history.scrollRestoration
      window.history.scrollRestoration = "manual"
      window.scrollTo({ top: 0, left: 0, behavior: "auto" })
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" })
        window.history.scrollRestoration = previousScrollRestoration
      })
    }

    if (!shouldShowCliLoader) {
      return
    }

    // Mark loader as seen on first committed mount in this runtime.
    hasHomeLoaderBeenSeenInRuntime = true
    fetch("/api/health").catch((err) => console.error("Health check failed:", err))
  }, [shouldShowCliLoader])

  return (
    <>
      <div className="animate-in fade-in duration-1000">{children}</div>
      {shouldShowCliLoader ? <CliLoader onComplete={() => {}} /> : null}
    </>
  )
}
