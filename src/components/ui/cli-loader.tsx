"use client"

import React, { useState, useEffect, useRef } from "react"
import { TypeAnimation } from 'react-type-animation'
import { useSiteSettingsStore } from "@/lib/stores/site-settings-store"
import { useAboutStore } from "@/lib/stores/about-store"
import { useHeroStore } from "@/lib/stores/hero-store"
import { MatrixBackground } from "./matrix-background"

// --- Types ---

type LogEntry = {
  id: string
  message: string
  timestamp: string
  color?: string
}

type BootStep = {
  message?: string
  delay?: number
  progress?: number
  status?: "booting" | "connecting" | "fetching" | "ready" | "error"
  action?: () => Promise<void>
}

interface CliLoaderProps {
  onComplete: () => void
}

// --- Reusable Components ---

const CliStatusHeader = ({ 
  status, 
  progress, 
  primaryColor 
}: { 
  status: string, 
  progress: number, 
  primaryColor: string 
}) => {
  const getStatusText = () => {
    switch (status) {
      case "booting": return "SYSTEM BOOT"
      case "connecting": return "NEURAL LINK"
      case "fetching": return "DATA UPLINK"
      case "ready": return "ACCESS GRANTED"
      case "error": return "SYSTEM FAILURE"
      case "access_denied": return "ACCESS DENIED"
      default: return "UNKNOWN"
    }
  }

  return (
    <div className="text-center space-y-4">
      <div className="flex items-center justify-center gap-3">
        {status !== "ready" && status !== "error" && status !== "access_denied" && (
          <div 
            className="w-4 h-4 border-2 rounded-full animate-spin"
            style={{ 
              borderTopColor: "transparent",
              borderRightColor: primaryColor,
              borderBottomColor: primaryColor,
              borderLeftColor: primaryColor
            }}
          />
        )}
        <h2 
          className="text-2xl md:text-4xl font-bold tracking-wider uppercase"
          style={{ color: primaryColor }}
        >
          {getStatusText()}
        </h2>
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between text-xs font-mono opacity-80" style={{ color: primaryColor }}>
          <span>PROGRESS</span>
          <span>[{progress}%]</span>
        </div>
        <div className="h-1 w-full bg-gray-900/50 rounded-full overflow-hidden border border-gray-800/30">
          <div 
            className="h-full transition-all duration-200 ease-out"
            style={{ 
              backgroundColor: primaryColor,
              width: `${progress}%`
            }}
          />
        </div>
      </div>
    </div>
  )
}

const CliLogMessage = ({ 
  log, 
  primaryColor 
}: { 
  log: LogEntry, 
  primaryColor: string 
}) => {
  const getMessageColor = () => {
    if (log.color) return log.color
    if (log.message.includes("ACCESS GRANTED") || log.message.includes("IDENTITY CONFIRMED")) return primaryColor
    if (log.message.includes("ERROR") || log.message.includes("FAILURE") || log.message.includes("DENIED")) return "#ef4444"
    return "inherit"
  }

  return (
    <div className="mb-1 flex items-start">
      <span className="text-gray-600 dark:text-gray-500 mr-3 text-xs select-none shrink-0 pt-1">
        {log.timestamp}
      </span>
      <span className="mr-2 text-gray-500 shrink-0 pt-1">{">"}</span>
      <div style={{ color: getMessageColor() }}>
        <TypeAnimation
          sequence={[log.message]}
          wrapper="span"
          cursor={false}
          speed={75}
          style={{ display: 'inline-block' }}
        />
      </div>
    </div>
  )
}

// --- Main Component ---

export const CliLoader: React.FC<CliLoaderProps> = ({ onComplete }) => {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<"booting" | "connecting" | "fetching" | "ready" | "error" | "access_denied">("booting")
  const [retryCount, setRetryCount] = useState(0)
  const [showWarning, setShowWarning] = useState(false)
  
  const { fetchSettings, settings } = useSiteSettingsStore()
  const { fetchAboutData } = useAboutStore()
  const { fetchHeroData, heroData } = useHeroStore()
  
  const logsEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [logs])

  const addLog = (message: string, color?: string) => {
    const timestamp = new Date().toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: "2-digit", 
      minute: "2-digit", 
      second: "2-digit" 
    })
    setLogs((prev) => [...prev, { 
      id: Math.random().toString(36).substr(2, 9), 
      message, 
      timestamp,
      color
    }])
  }

  // Define the static parts of the boot sequence
  const BOOT_SEQUENCE_START: BootStep[] = [
    { message: "INITIALIZING NEURAL INTERFACE", delay: 800 },
    { message: "ESTABLISHING SECURE CONNECTION TO THE GRID", status: "connecting", progress: 10, delay: 1000 },
    { message: "SYNCING BIOMETRIC DATA IDENTITY CONFIRMED", progress: 30, delay: 800 },
    { message: "DECRYPTING FIREWALL PROTOCOLS", progress: 45, delay: 1200 },
    { message: "UPLOADING CONSCIOUSNESS [████████░░] 80%", status: "fetching", delay: 800 },
  ]

  const BOOT_SEQUENCE_END: BootStep[] = [
    { message: "BYPASSING CORPORATE ICE ACCESS GRANTED", progress: 70, delay: 600 },
    { message: "RENDERING DIGITAL CONSTRUCT", progress: 85, delay: 600 },
    { message: "CALIBRATING AUGMENTED REALITY OVERLAY", delay: 600 },
  ]

  const BOOT_SEQUENCE_FINAL: BootStep[] = [
    { message: "COMPILING GHOST IN THE SHELL", progress: 95, delay: 500 },
    { message: "JACKING INTO THE MAINFRAME", status: "ready", progress: 100, delay: 800 },
    { message: `INITIALIZING USER: ${heroData?.name?.toUpperCase() || "USER"}`, status: "ready", progress: 100, delay: 800 },
    { message: "ACCESS GRANTED", status: "ready", progress: 100, delay: 800 },
    { message: "WELCOME TO YOUR DIGITAL CONSTRUCT", status: "ready", progress: 100, delay: 800 },
  ]

  const runSequence = async (sequence: BootStep[]) => {
    for (const step of sequence) {
      if (step.message) addLog(step.message)
      if (step.status) setStatus(step.status)
      if (step.progress) setProgress(step.progress)
      if (step.delay) await new Promise((r) => setTimeout(r, step.delay))
      if (step.action) await step.action()
    }
  }

  useEffect(() => {
    let mounted = true
    setShowWarning(false)

    const bootSequence = async () => {
      try {
        if (retryCount > 0) {
            setLogs([])
            addLog(`SYSTEM REBOOT INITIATED... (ATTEMPT ${retryCount}/3)`)
            await new Promise((r) => setTimeout(r, 800))
        }

        // Run initial sequence
        await runSequence(BOOT_SEQUENCE_START)
        
        // Start Data Fetching
        const dataPromise = Promise.all([
            fetchSettings(),
            fetchAboutData(),
            fetchHeroData()
        ])

        // Force timeout after 15 seconds
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error("Connection timed out")), 15000)
        )

        // Slow connection warning race
        const slowConnectionTimer = setTimeout(() => {
            if (mounted) setShowWarning(true)
        }, 4000)
      
        // Run middle sequence (visuals while fetching)
        await runSequence(BOOT_SEQUENCE_END)

        try {
            // Race data fetch against timeout
            await Promise.race([dataPromise, timeoutPromise])
            clearTimeout(slowConnectionTimer)
            if (mounted) setShowWarning(false)
        } catch (e) {
            clearTimeout(slowConnectionTimer)
            if (mounted) setShowWarning(false)
            throw e 
        }

        // Run final sequence
        await runSequence(BOOT_SEQUENCE_FINAL)
        
        if (mounted) {
          onComplete()
        }

      } catch (error) {
        setStatus("error")
        addLog("ERROR: NEURAL LINK SEVERED.", "#ef4444")
        
        if (retryCount < 3) {
            addLog("RETRYING CONNECTION SEQUENCE...", "#ef4444")
            setTimeout(() => {
                if (mounted) {
                    setRetryCount(prev => prev + 1)
                    setStatus("booting")
                    // Note: useEffect will trigger re-run when retryCount changes
                }
            }, 3000)
        } else {
            setStatus("access_denied")
            addLog("CRITICAL SYSTEM FAILURE. ACCESS DENIED.", "#ef4444")
        }
      }
    }

    bootSequence()

    return () => {
      mounted = false
    }
  }, [retryCount]) 

  const primaryColor = settings?.appearance?.primaryColor || "#3b82f6" 

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-black text-sm md:text-base font-mono p-4 overflow-hidden transition-colors duration-300">
      
      <MatrixBackground color={primaryColor} opacity={0.15} />

      <div className="w-full max-w-3xl space-y-8 relative z-10">
        
        <CliStatusHeader 
          status={status} 
          progress={progress} 
          primaryColor={primaryColor} 
        />

        {/* Warning Popup */}
        {showWarning && status !== "access_denied" && (
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 border border-red-500 bg-red-950/80 text-red-500 rounded shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse z-50 w-[90vw] max-w-xs md:max-w-sm text-center">
                <div className="font-bold text-xs md:text-sm mb-1">⚠ NETWORK INSTABILITY DETECTED</div>
                <div className="text-xs opacity-80">Rerouting through proxy nodes...</div>
            </div>
        )}

        {/* Access Denied Popup */}
        {status === "access_denied" && (
             <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 border-2 border-red-600 bg-black text-red-600 rounded-lg shadow-[0_0_50px_rgba(220,38,38,0.8)] z-50 w-[90vw] max-w-md text-center">
                <div className="text-4xl md:text-6xl font-black mb-4 tracking-widest glitch-text">ACCESS DENIED</div>
                <div className="text-sm md:text-base font-bold uppercase tracking-widest mb-2">System Lockout Initiated</div>
                <div className="text-xs md:text-sm opacity-80 font-mono">
                    Security protocols have detected unauthorized network latency. 
                    <br/>
                    Connection terminated to protect the mainframe.
                </div>
            </div>
        )}

        <div className="h-64 md:h-96 w-full p-2 overflow-y-auto font-mono text-gray-700 dark:text-gray-300">
            <div className="flex flex-col justify-end min-h-full">
                {logs.map((log) => (
                    <CliLogMessage 
                      key={log.id} 
                      log={log} 
                      primaryColor={primaryColor} 
                    />
                ))}
                <div ref={logsEndRef} />
            </div>
        </div>

      </div>
    </div>
  )
}
