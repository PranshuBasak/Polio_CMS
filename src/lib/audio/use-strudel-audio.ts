"use client"

import { useContext } from "react"
import { StrudelAudioContext } from "@/components/providers/strudel-audio-provider"

export const useStrudelAudio = () => {
  const context = useContext(StrudelAudioContext)

  if (!context) {
    throw new Error("useStrudelAudio must be used within StrudelAudioProvider")
  }

  return context
}
