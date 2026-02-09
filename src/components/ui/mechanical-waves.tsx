'use client'

import { cn } from '@/lib/utils'
import { useEffect, useRef } from 'react'

interface MechanicalWavesProps {
  className?: string
  fullBleed?: boolean
  backgroundColor?: string
  foregroundColor?: string
  speed?: number
  amplitude?: number
  peakHeight?: number
}

type PeakPoint = { x: number; y: number }

function resolveCssColor(color: string) {
  if (!color.startsWith('var(')) return color
  const rawVariable = color.slice(4, -1).trim()
  const computed = getComputedStyle(document.documentElement).getPropertyValue(rawVariable).trim()
  return computed || color
}

class SimplexNoise {
  p: Uint8Array
  perm: Uint8Array
  permMod12: Uint8Array
  grad3: Float32Array

  constructor(random?: () => number) {
    const rng = random || Math.random
    this.p = new Uint8Array(256)
    this.perm = new Uint8Array(512)
    this.permMod12 = new Uint8Array(512)

    for (let i = 0; i < 256; i += 1) {
      this.p[i] = Math.floor(rng() * 256)
    }

    for (let i = 0; i < 512; i += 1) {
      this.perm[i] = this.p[i & 255]
      this.permMod12[i] = this.perm[i] % 12
    }

    this.grad3 = new Float32Array([
      1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0, 1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, -1, 0, 1, 1, 0, -1, 1, 0, 1, -1,
      0, -1, -1,
    ])
  }

  noise3D(xin: number, yin: number, zin: number): number {
    const F3 = 1 / 3
    const G3 = 1 / 6
    const s = (xin + yin + zin) * F3
    const i = Math.floor(xin + s)
    const j = Math.floor(yin + s)
    const k = Math.floor(zin + s)
    const t = (i + j + k) * G3
    const X0 = i - t
    const Y0 = j - t
    const Z0 = k - t
    const x0 = xin - X0
    const y0 = yin - Y0
    const z0 = zin - Z0

    let i1 = 0
    let j1 = 0
    let k1 = 0
    let i2 = 0
    let j2 = 0
    let k2 = 0

    if (x0 >= y0) {
      if (y0 >= z0) {
        i1 = 1
        i2 = 1
        j2 = 1
      } else if (x0 >= z0) {
        i1 = 1
        i2 = 1
        k2 = 1
      } else {
        k1 = 1
        i2 = 1
        k2 = 1
      }
    } else if (z0 > y0) {
      k1 = 1
      j2 = 1
      k2 = 1
    } else if (z0 > x0) {
      j1 = 1
      j2 = 1
      k2 = 1
    } else {
      j1 = 1
      i2 = 1
      j2 = 1
    }

    const x1 = x0 - i1 + G3
    const y1 = y0 - j1 + G3
    const z1 = z0 - k1 + G3
    const x2 = x0 - i2 + 2 * G3
    const y2 = y0 - j2 + 2 * G3
    const z2 = z0 - k2 + 2 * G3
    const x3 = x0 - 1 + 3 * G3
    const y3 = y0 - 1 + 3 * G3
    const z3 = z0 - 1 + 3 * G3
    const ii = i & 255
    const jj = j & 255
    const kk = k & 255

    let n0 = 0
    let n1 = 0
    let n2 = 0
    let n3 = 0

    let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0
    if (t0 > 0) {
      const gi0 = (this.permMod12[ii + this.perm[jj + this.perm[kk]]] * 3) % 12
      t0 *= t0
      n0 = t0 * t0 * (this.grad3[gi0] * x0 + this.grad3[gi0 + 1] * y0 + this.grad3[gi0 + 2] * z0)
    }

    let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1
    if (t1 > 0) {
      const gi1 = (this.permMod12[ii + i1 + this.perm[jj + j1 + this.perm[kk + k1]]] * 3) % 12
      t1 *= t1
      n1 = t1 * t1 * (this.grad3[gi1] * x1 + this.grad3[gi1 + 1] * y1 + this.grad3[gi1 + 2] * z1)
    }

    let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2
    if (t2 > 0) {
      const gi2 = (this.permMod12[ii + i2 + this.perm[jj + j2 + this.perm[kk + k2]]] * 3) % 12
      t2 *= t2
      n2 = t2 * t2 * (this.grad3[gi2] * x2 + this.grad3[gi2 + 1] * y2 + this.grad3[gi2 + 2] * z2)
    }

    let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3
    if (t3 > 0) {
      const gi3 = (this.permMod12[ii + 1 + this.perm[jj + 1 + this.perm[kk + 1]]] * 3) % 12
      t3 *= t3
      n3 = t3 * t3 * (this.grad3[gi3] * x3 + this.grad3[gi3 + 1] * y3 + this.grad3[gi3 + 2] * z3)
    }

    return 32 * (n0 + n1 + n2 + n3)
  }
}

export function MechanicalWaves({
  className,
  fullBleed = true,
  backgroundColor = 'transparent',
  foregroundColor = 'var(--accent)',
  speed = 1,
  amplitude = 0,
  peakHeight = 50,
}: MechanicalWavesProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const reducedMotion = media.matches
    const effectiveSpeed = reducedMotion ? speed * 0.35 : speed
    const effectiveAmplitude = reducedMotion ? amplitude * 0.3 : amplitude
    const effectivePeakHeight = reducedMotion ? peakHeight * 0.45 : peakHeight

    const LINE_WIDTH = 1
    const PEAK_AGE = 20
    const DECAY_LENGTH_FACTOR = 20
    const DECAY_WIDTH_FACTOR = 1 / 25
    const WOBBLE_SPEED = 1 / 300
    const LINE_SPACING_PX = 10
    const NODE_SPACING_PX = 12
    const NEIGHBOR_GAP = 3

    const simplex = new SimplexNoise()
    let frameId = 0
    let width = 1
    let height = 1
    let baselineOffset = 0
    let phase = 0
    let tick = 0
    let peak: PeakPoint = { x: 0, y: 0 }
    let lines: Int16Array[] = []
    let linePeaks: Uint16Array[] = []
    let numNodes = 0
    let numLines = 0
    let hTotal = 0

    const mod = (a: number, b: number) => ((a % b) + b) % b

    const gaussian2d = (a: number, x: number, y: number, x0: number, y0: number, sigmaX: number, sigmaY: number) =>
      a *
      Math.exp(
        -(Math.pow(x - x0, 2) / (2 * Math.pow(sigmaX, 2))) - Math.pow(y - y0, 2) / (2 * Math.pow(sigmaY, 2)),
      )

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      width = Math.max(1, container.clientWidth)
      height = Math.max(1, container.clientHeight)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(dpr, 0, 0, dpr, 0, 0)

      numNodes = Math.floor(width / NODE_SPACING_PX) + 1
      numLines = Math.floor(height / LINE_SPACING_PX) + 1 + Math.ceil(effectivePeakHeight / LINE_SPACING_PX)
      hTotal = numLines * LINE_SPACING_PX
      lines = Array.from({ length: numLines }, () => new Int16Array(numNodes))
      linePeaks = Array.from({ length: numLines }, () => new Uint16Array(numNodes))
      peak = { x: width / 2, y: height / 2 }
      phase = 0
      baselineOffset = 0
    }

    const updateMouse = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      peak = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      }
    }

    const draw = () => {
      const resolvedBackground = resolveCssColor(backgroundColor)
      const resolvedForeground = resolveCssColor(foregroundColor)
      context.strokeStyle = resolvedForeground
      context.fillStyle = resolvedForeground
      context.lineWidth = LINE_WIDTH

      if (resolvedBackground === 'transparent') {
        context.clearRect(0, 0, width, height)
      } else {
        context.fillStyle = resolvedBackground
        context.fillRect(0, 0, width, height)
        context.fillStyle = resolvedForeground
      }

      const peakNode = {
        x: mod(Math.ceil(peak.x / NODE_SPACING_PX), numNodes),
        y: mod(Math.ceil(peak.y / LINE_SPACING_PX) + 1, numLines),
      }

      baselineOffset += 1
      if (tick % LINE_SPACING_PX === 0) {
        lines.unshift(lines.pop() as Int16Array)
        phase = mod(phase + 1, numLines)
        linePeaks[phase].fill(0)
        baselineOffset = 0
      }

      for (let lineIdx = 0; lineIdx < numLines; lineIdx += 1) {
        const adjustedLineIdx = mod(lineIdx + phase, numLines)
        const nodes = lines[adjustedLineIdx]
        const peakNodes = linePeaks[adjustedLineIdx]
        const isHighlighted = peakNode.y === lineIdx

        if (isHighlighted && !peakNodes[peakNode.x]) {
          let newAge = 1
          for (let i = peakNode.x - NEIGHBOR_GAP; i < peakNode.x + NEIGHBOR_GAP; i += 1) {
            if (peakNodes[i]) {
              newAge = 0
              break
            }
          }
          peakNodes[peakNode.x] = newAge
        }

        for (let nodeIdx = 0; nodeIdx < numNodes; nodeIdx += 1) {
          const noise = simplex.noise3D(adjustedLineIdx, nodeIdx, tick * effectiveSpeed * WOBBLE_SPEED)
          let peaksValue = 0

          for (let peakNodeIdx = 0; peakNodeIdx < numNodes; peakNodeIdx += 1) {
            const age = peakNodes[peakNodeIdx] * effectiveSpeed
            if (!age) continue
            const ageDiff = age - PEAK_AGE
            const rising = ageDiff <= 0
            peaksValue +=
              ((noise + 1) / 2) *
              gaussian2d(
                effectivePeakHeight,
                age,
                nodeIdx - peakNodeIdx,
                PEAK_AGE,
                0,
                10 * effectiveSpeed * (rising ? 1 : 1 + DECAY_LENGTH_FACTOR),
                (0.5 / Math.max(effectiveSpeed, 0.001)) * (rising ? 1 : 1 + ageDiff * DECAY_WIDTH_FACTOR * 2),
              )
          }

          peaksValue = Math.max(Math.min(peaksValue, effectivePeakHeight * 3), 0)
          nodes[nodeIdx] = noise * effectiveAmplitude + peaksValue
        }

        const baseline = mod(lineIdx * LINE_SPACING_PX - baselineOffset, hTotal)
        context.beginPath()
        context.moveTo(0, baseline)
        context.lineTo(0, baseline - nodes[0])

        for (let x = 1; x < numNodes - 1; x += 1) {
          const y = nodes[x]
          const midX = x + 0.5
          const midY = (y + nodes[x + 1]) / 2
          context.quadraticCurveTo(x * NODE_SPACING_PX, baseline - y, midX * NODE_SPACING_PX, baseline - midY)
        }

        context.lineTo(width, baseline)
        context.stroke()

        for (let peakNodeIdx = 0; peakNodeIdx < numNodes; peakNodeIdx += 1) {
          if (peakNodes[peakNodeIdx]) peakNodes[peakNodeIdx] += 1
        }
      }

      tick += 1
      frameId = requestAnimationFrame(draw)
    }

    const observer = new ResizeObserver(resize)
    observer.observe(container)
    window.addEventListener('mousemove', updateMouse)
    resize()
    draw()

    return () => {
      observer.disconnect()
      window.removeEventListener('mousemove', updateMouse)
      cancelAnimationFrame(frameId)
    }
  }, [amplitude, backgroundColor, foregroundColor, peakHeight, speed])

  return (
    <div
      ref={containerRef}
      className={cn(
        'pointer-events-none',
        fullBleed ? 'absolute inset-0 h-full w-full' : 'relative h-full w-full',
        className,
      )}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  )
}
