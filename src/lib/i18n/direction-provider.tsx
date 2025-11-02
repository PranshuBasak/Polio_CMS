"use client"

import type React from "react"
import { createContext, useContext, useEffect } from "react"
import { useTranslations } from "./translations-context"

type DirectionContextType = {
  dir: "ltr" | "rtl"
}

const DirectionContext = createContext<DirectionContextType | undefined>(undefined)

export function DirectionProvider({ children }: { children: React.ReactNode }) {
  const { dir } = useTranslations()

  // Update the HTML dir attribute when the direction changes
  useEffect(() => {
    document.documentElement.dir = dir
  }, [dir])

  return <DirectionContext.Provider value={{ dir }}>{children}</DirectionContext.Provider>
}

export function useDirection() {
  const context = useContext(DirectionContext)
  if (context === undefined) {
    throw new Error("useDirection must be used within a DirectionProvider")
  }
  return context
}
