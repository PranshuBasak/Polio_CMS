"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [clicked, setClicked] = useState(false)
  const [linkHovered, setLinkHovered] = useState(false)
  const [visible, setVisible] = useState(false)

  // Add a state to completely disable the custom cursor
  const [enabled, setEnabled] = useState(false) // Disabled by default

  useEffect(() => {
    // Check if we should enable the custom cursor (e.g., based on device or user preference)
    const checkIfShouldEnable = () => {
      // Only enable on non-touch devices and larger screens
      const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0
      const isLargeScreen = window.innerWidth >= 1024

      // Disable on touch devices or small screens
      setEnabled(!isTouchDevice && isLargeScreen)
    }

    checkIfShouldEnable()
    window.addEventListener("resize", checkIfShouldEnable)

    // If not enabled, don't add any event listeners
    if (!enabled) return () => window.removeEventListener("resize", checkIfShouldEnable)

    const addEventListeners = () => {
      document.addEventListener("mousemove", onMouseMove)
      document.addEventListener("mouseenter", onMouseEnter)
      document.addEventListener("mouseleave", onMouseLeave)
      document.addEventListener("mousedown", onMouseDown)
      document.addEventListener("mouseup", onMouseUp)
    }

    const removeEventListeners = () => {
      document.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mouseenter", onMouseEnter)
      document.removeEventListener("mouseleave", onMouseLeave)
      document.removeEventListener("mousedown", onMouseDown)
      document.removeEventListener("mouseup", onMouseUp)
    }

    const onMouseMove = (e: MouseEvent) => {
      // Use requestAnimationFrame for smoother performance
      requestAnimationFrame(() => {
        setPosition({ x: e.clientX, y: e.clientY })
      })
    }

    const onMouseEnter = () => {
      setVisible(true)
    }

    const onMouseLeave = () => {
      setVisible(false)
    }

    const onMouseDown = () => {
      setClicked(true)
    }

    const onMouseUp = () => {
      setClicked(false)
    }

    const handleLinkHoverEvents = () => {
      const elements = document.querySelectorAll("a, button, [role='button']")

      elements.forEach((el) => {
        el.addEventListener("mouseenter", () => setLinkHovered(true))
        el.addEventListener("mouseleave", () => setLinkHovered(false))
      })
    }

    addEventListeners()
    handleLinkHoverEvents()

    return () => {
      removeEventListeners()
      window.removeEventListener("resize", checkIfShouldEnable)
    }
  }, [enabled])

  // Effect to handle cursor visibility based on enabled state
  useEffect(() => {
    if (!enabled) {
      document.body.style.cursor = 'auto';
    }
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [enabled]);

  // If the custom cursor is disabled, don't render anything
  if (!enabled) return null

  return (
    <>
      <style jsx global>{`
        body, a, button, [role='button'], input, textarea, select {
          cursor: none !important;
        }
      `}</style>
      
      {/* Main Cursor (The "Shadow" that follows) */}
      <motion.div
        className="fixed top-0 left-0 z-[100] rounded-full pointer-events-none mix-blend-screen"
        animate={{
          x: position.x - (linkHovered ? 32 : 16),
          y: position.y - (linkHovered ? 32 : 16),
          height: linkHovered ? 64 : 32,
          width: linkHovered ? 64 : 32,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 150, // Reduced stiffness for "lazy" follow
          damping: 15,    // Adjusted damping
          mass: 0.8,      // Higher mass = more inertia/delay
        }}
        style={{
          backgroundColor: linkHovered ? "transparent" : "var(--primary)",
          border: linkHovered ? "2px solid var(--primary)" : "none",
          mixBlendMode: "normal",
        }}
      />
      
      {/* Tiny center dot for precision (optional, but good for UX) */}
      <div 
        className="fixed top-0 left-0 z-[101] w-1 h-1 bg-primary rounded-full pointer-events-none"
        style={{
          transform: `translate(${position.x - 2}px, ${position.y - 2}px)`,
          opacity: visible ? 1 : 0,
        }}
      />
    </>
  )
}
