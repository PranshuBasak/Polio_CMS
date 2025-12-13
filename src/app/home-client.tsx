"use client"

import React, { useState } from "react"
import { CliLoader } from "@/components/ui/cli-loader"

interface HomeClientProps {
  children: React.ReactNode
}

export default function HomeClient({ children }: HomeClientProps) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <>
      {isLoading && <CliLoader onComplete={() => setIsLoading(false)} />}
      
      {/* 
        We render the children but hide them while loading. 
        This ensures they are mounted and ready (e.g., if they have their own effects),
        but visually the user only sees the loader.
        Alternatively, we could conditionally render { !isLoading && children } 
        if we want to prevent them from mounting until ready.
        Given the "boot" metaphor, mounting them after is cleaner.
      */}
      {!isLoading && (
        <div className="animate-in fade-in duration-1000">
          {children}
        </div>
      )}
    </>
  )
}
