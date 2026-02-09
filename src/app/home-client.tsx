"use client"
// Force recompile

import React, { useEffect, useRef, useState } from "react"
import { CliLoader } from "@/components/ui/cli-loader"
import { useAppStore } from "@/lib/stores/app-store"
import { TextGif } from "@/components/ui/text-gif"

interface HomeClientProps {
  children: React.ReactNode
}

export default function HomeClient({ children }: HomeClientProps) {
  const hasInitialLoadCompleted = useAppStore((state) => state.hasInitialLoadCompleted)
  const setHasInitialLoadCompleted = useAppStore((state) => state.setHasInitialLoadCompleted)
  const incrementHomePageLoadCount = useAppStore((state) => state.incrementHomePageLoadCount)
  
  // Local state for loading phase
  const [isLoading, setIsLoading] = useState(true)
  const hasInitializedRef = useRef(false)

  useEffect(() => {
    if (hasInitializedRef.current) {
      return
    }
    hasInitializedRef.current = true

    incrementHomePageLoadCount()

    if (!hasInitialLoadCompleted) {
      // First time load in this session (or since storage cleared)
      // Call health check
      fetch('/api/health').catch(err => console.error("Health check failed:", err))
    } else {
      // Subsequent loads - show fallback briefly then content
      // We can keep isLoading true for a short delay if we want to show the TextGif
      // or set it to false immediately if we want instant load.
      // Let's show it for a short duration to be visible as a "fallback loader"
      const timer = setTimeout(() => setIsLoading(false), 1500)
      
      return () => clearTimeout(timer)
    }
  }, [hasInitialLoadCompleted, incrementHomePageLoadCount])

  const handleCliComplete = () => {
    setHasInitialLoadCompleted(false)
    setIsLoading(false)
  }

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
          {!hasInitialLoadCompleted ? (
            <CliLoader onComplete={handleCliComplete} />
          ) : (
            <TextGif 
                text="LOADING..." 
                gifUrl="https://media.giphy.com/media/3zvbrvbRe7wxBofOBI/giphy.gif"
                size="xxl"
                weight="bold"
                className="uppercase"
            />
          )}
        </div>
      )}
      
      {!isLoading && (
        <div className="animate-in fade-in duration-1000">
          {children}
        </div>
      )}
    </>
  )
}
