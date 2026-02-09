'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

import { cn } from '@/lib/utils'

const vertexShader = `
  uniform float time;
  uniform float intensity;
  varying vec2 vUv;

  void main() {
    vUv = uv;

    vec3 pos = position;
    pos.y += sin(pos.x * 8.0 + time) * 0.08 * intensity;
    pos.x += cos(pos.y * 7.0 + time * 1.2) * 0.04 * intensity;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const fragmentShader = `
  uniform float time;
  uniform float intensity;
  uniform vec3 color1;
  uniform vec3 color2;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;

    float noise = sin(uv.x * 16.0 + time * 0.8) * cos(uv.y * 12.0 + time * 0.6);
    noise += sin(uv.x * 26.0 - time * 1.4) * cos(uv.y * 18.0 + time * 1.0) * 0.4;

    vec3 color = mix(color1, color2, noise * 0.5 + 0.5);
    color = mix(color, vec3(1.0), pow(abs(noise), 2.0) * intensity * 0.4);

    float glow = 1.0 - length(uv - 0.5) * 1.8;
    glow = pow(max(glow, 0.0), 2.0);

    gl_FragColor = vec4(color * glow, glow * 0.75);
  }
`

function cssColorToThreeColor(input: string, fallback: string) {
  const ctx = document.createElement('canvas').getContext('2d')
  if (!ctx) return new THREE.Color(fallback)

  ctx.fillStyle = fallback
  ctx.fillStyle = input

  try {
    return new THREE.Color(ctx.fillStyle)
  } catch {
    return new THREE.Color(fallback)
  }
}

function resolveTokenColor(token: string, fallback: string) {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(token).trim()
  if (!raw) return cssColorToThreeColor(fallback, fallback)
  return cssColorToThreeColor(raw, fallback)
}

function ShaderPlane({
  color1,
  color2,
  speed,
}: {
  color1: THREE.Color
  color2: THREE.Color
  speed: number
}) {
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const [uniforms] = useState(() => ({
      time: { value: 0 },
      intensity: { value: 1.0 },
      color1: { value: new THREE.Color('#7c3aed') },
      color2: { value: new THREE.Color('#ffffff') },
    }))

  useFrame((state) => {
    const material = materialRef.current
    if (!material) return
    const elapsed = state.clock.getElapsedTime()
    material.uniforms.time.value = elapsed * speed
    material.uniforms.intensity.value = 1.0 + Math.sin(elapsed * 1.6) * 0.25
    material.uniforms.color1.value = color1
    material.uniforms.color2.value = color2
    material.uniformsNeedUpdate = true
  })

  return (
    <mesh>
      <planeGeometry args={[2, 2, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

type BackgroundPaperShadersProps = {
  className?: string
  speed?: number
}

export function BackgroundPaperShaders({ className, speed = 1 }: BackgroundPaperShadersProps) {
  const [colors, setColors] = useState(() => ({
    color1: new THREE.Color('#7c3aed'),
    color2: new THREE.Color('#ffffff'),
  }))

  useEffect(() => {
    const syncColors = () => {
      const accent = resolveTokenColor('--accent', '#7c3aed')
      const primary = resolveTokenColor('--primary', '#3b82f6')
      setColors({
        color1: accent,
        color2: primary.lerp(new THREE.Color('#ffffff'), 0.25),
      })
    }

    syncColors()

    const observer = new MutationObserver(syncColors)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'style'],
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className={cn('pointer-events-none absolute inset-0 -z-10', className)} aria-hidden="true">
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        className="h-full w-full"
        camera={{ position: [0, 0, 1], fov: 50 }}
      >
        <ShaderPlane color1={colors.color1} color2={colors.color2} speed={speed} />
      </Canvas>
    </div>
  )
}
