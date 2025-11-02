"use client"

import type React from "react"
import { useEffect } from "react"
import { useUIStore } from "../../lib/stores/ui-store"

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const { closeSidebar, openSidebar } = useUIStore()

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        closeSidebar()
      } else {
        openSidebar()
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [closeSidebar, openSidebar])

  return <>{children}</>
}
