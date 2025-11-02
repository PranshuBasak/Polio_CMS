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

  // If the custom cursor is disabled, don't render anything
  if (!enabled) return null

  return (
    <motion.div
      className="fixed top-0 left-0 z-50 rounded-full pointer-events-none mix-blend-difference"
      animate={{
        x: position.x - (linkHovered ? 24 : 16),
        y: position.y - (linkHovered ? 24 : 16),
        height: linkHovered ? 48 : clicked ? 28 : 32,
        width: linkHovered ? 48 : clicked ? 28 : 32,
        opacity: visible ? 0.5 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 28,
        mass: 0.5, // Lower mass for faster response
      }}
      style={{
        backgroundColor: "white",
      }}
    />
  )
}
