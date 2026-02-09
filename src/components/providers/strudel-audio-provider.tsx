"use client"

import { createContext, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import clientLogger from "@/lib/logger/client-logger"
import { getStrudelEngine } from "@/lib/audio/strudel-engine"

const STRUDEL_VOLUME_KEY = "strudel_audio_volume"

type StrudelAudioContextValue = {
  isReady: boolean
  isLoading: boolean
  isPlaying: boolean
  volume: number
  error: string | null
  play: () => Promise<void>
  stop: () => Promise<void>
  toggle: () => Promise<void>
  setVolume: (value: number) => void
  getSpectrumFrame: () => number[] | null
}

export const StrudelAudioContext = createContext<StrudelAudioContextValue | null>(null)

const clampVolume = (value: number) => Math.min(100, Math.max(0, Math.round(value)))

const getInitialVolume = () => {
  if (typeof window === "undefined") {
    return 37
  }

  try {
    const raw = window.localStorage.getItem(STRUDEL_VOLUME_KEY)
    if (!raw) {
      return 37
    }
    const parsed = Number(raw)
    return Number.isFinite(parsed) ? clampVolume(parsed) : 37
  } catch {
    return 37
  }
}

export function StrudelAudioProvider({ children }: { children: ReactNode }) {
  const engineRef = useRef(getStrudelEngine())
  const [isReady, setIsReady] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolumeState] = useState(37)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setVolumeState(getInitialVolume())
  }, [])

  const play = useCallback(async () => {
    if (isLoading) {
      return
    }

    setIsLoading(true)
    setError(null)
    clientLogger.info("Strudel play requested", { volume })

    try {
      await engineRef.current.play(volume)
      setIsReady(true)
      setIsPlaying(true)
      clientLogger.info("Strudel playback started", { volume })
    } catch (playError) {
      clientLogger.error("Strudel playback failed", playError, { volume })
      setError(playError instanceof Error ? playError.message : "Unable to start music playback.")
      setIsPlaying(false)
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, volume])

  const stop = useCallback(async () => {
    setError(null)

    try {
      await engineRef.current.stop()
      setIsPlaying(false)
      clientLogger.info("Strudel playback stopped")
    } catch (stopError) {
      clientLogger.error("Strudel stop failed", stopError)
      setError(stopError instanceof Error ? stopError.message : "Unable to stop music playback.")
    }
  }, [])

  const toggle = useCallback(async () => {
    if (isPlaying) {
      await stop()
      return
    }

    await play()
  }, [isPlaying, play, stop])

  const setVolume = useCallback((value: number) => {
    const next = clampVolume(value)
    setVolumeState(next)

    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(STRUDEL_VOLUME_KEY, String(next))
      } catch {
        // Ignore localStorage failures.
      }
    }
  }, [])

  useEffect(() => {
    if (!isPlaying) {
      return
    }

    const timeout = window.setTimeout(() => {
      engineRef.current.setVolume(volume).catch((volumeError) => {
        clientLogger.error("Strudel volume update failed", volumeError, { volume })
        setError(volumeError instanceof Error ? volumeError.message : "Unable to update volume.")
      })
    }, 120)

    return () => {
      window.clearTimeout(timeout)
    }
  }, [isPlaying, volume])

  const getSpectrumFrame = useCallback(() => {
    return engineRef.current.getSpectrumFrame()
  }, [])

  const contextValue = useMemo<StrudelAudioContextValue>(
    () => ({
      isReady,
      isLoading,
      isPlaying,
      volume,
      error,
      play,
      stop,
      toggle,
      setVolume,
      getSpectrumFrame,
    }),
    [isReady, isLoading, isPlaying, volume, error, play, stop, toggle, setVolume, getSpectrumFrame]
  )

  return <StrudelAudioContext.Provider value={contextValue}>{children}</StrudelAudioContext.Provider>
}
