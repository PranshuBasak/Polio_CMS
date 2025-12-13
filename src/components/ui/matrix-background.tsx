"use client"

import React, { useEffect, useRef } from 'react'

interface MatrixBackgroundProps {
  color?: string
  opacity?: number
}

export const MatrixBackground: React.FC<MatrixBackgroundProps> = ({ 
  color = '#0F0', 
  opacity = 0.1 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = window.innerWidth
    let height = window.innerHeight
    
    canvas.width = width
    canvas.height = height

    const fontSize = 14
    const columns = Math.floor(width / fontSize)
    const drops: number[] = []

    // Initialize drops
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100 // Start above screen randomly
    }

    const chars = "0123456789ABCDEF"

    const draw = () => {
      // Semi-transparent black to create trail effect
      ctx.fillStyle = `rgba(0, 0, 0, 0.05)`
      ctx.fillRect(0, 0, width, height)

      ctx.fillStyle = color
      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)]
        const x = i * fontSize
        const y = drops[i] * fontSize

        ctx.globalAlpha = Math.random() * 0.5 + 0.5 // Random opacity for flickering effect
        ctx.fillText(text, x, y)
        ctx.globalAlpha = 1.0

        // Reset drop to top randomly after it crosses screen
        if (y > height && Math.random() > 0.975) {
          drops[i] = 0
        }

        drops[i]++
      }
    }

    let animationFrameId: number
    const render = () => {
      draw()
      animationFrameId = requestAnimationFrame(render)
    }

    render()

    const handleResize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
    }

    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
    }
  }, [color])

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ opacity }}
    />
  )
}
