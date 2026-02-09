"use client"

import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"
import * as THREE from "three"

export interface InteractiveNebulaShaderProps {
  hasActiveReminders?: boolean
  hasUpcomingReminders?: boolean
  disableCenterDimming?: boolean
  className?: string
  position?: "fixed" | "absolute"
}

export function InteractiveNebulaShader({
  hasActiveReminders = false,
  hasUpcomingReminders = false,
  disableCenterDimming = false,
  className = "",
  position = "absolute",
}: InteractiveNebulaShaderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const materialRef = useRef<THREE.ShaderMaterial | null>(null)
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const listener = (event: MediaQueryListEvent) => setReducedMotion(event.matches)
    media.addEventListener("change", listener)
    return () => media.removeEventListener("change", listener)
  }, [])

  useEffect(() => {
    const mat = materialRef.current
    if (mat) {
      mat.uniforms.hasActiveReminders.value = hasActiveReminders
      mat.uniforms.hasUpcomingReminders.value = hasUpcomingReminders
      mat.uniforms.disableCenterDimming.value = disableCenterDimming
    }
  }, [hasActiveReminders, hasUpcomingReminders, disableCenterDimming])

  useEffect(() => {
    if (reducedMotion) return

    const container = containerRef.current
    if (!container) return

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const clock = new THREE.Clock()

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `

    const fragmentShader = `
      precision mediump float;
      uniform vec2 iResolution;
      uniform float iTime;
      uniform vec2 iMouse;
      uniform bool hasActiveReminders;
      uniform bool hasUpcomingReminders;
      uniform bool disableCenterDimming;
      varying vec2 vUv;

      #define t iTime
      mat2 m(float a){ float c=cos(a), s=sin(a); return mat2(c,-s,s,c); }
      float map(vec3 p){
        p.xz *= m(t*0.4);
        p.xy *= m(t*0.3);
        vec3 q = p*2. + t;
        return length(p + vec3(sin(t*0.7))) * log(length(p)+1.0)
             + sin(q.x + sin(q.z + sin(q.y))) * 0.5 - 1.0;
      }

      void mainImage(out vec4 O, in vec2 fragCoord) {
        vec2 uv = fragCoord / min(iResolution.x, iResolution.y) - vec2(.9, .5);
        uv.x += .4;
        vec3 col = vec3(0.0);
        float d = 2.5;

        for (int i = 0; i <= 5; i++) {
          vec3 p = vec3(0,0,5.) + normalize(vec3(uv, -1.)) * d;
          float rz = map(p);
          float f  = clamp((rz - map(p + 0.1)) * 0.5, -0.1, 1.0);

          vec3 base = hasActiveReminders
            ? vec3(0.05,0.2,0.5) + vec3(4.0,2.0,5.0)*f
            : hasUpcomingReminders
            ? vec3(0.05,0.3,0.1) + vec3(2.0,5.0,1.0)*f
            : vec3(0.1,0.3,0.4) + vec3(5.0,2.5,3.0)*f;

          col = col * base + smoothstep(2.5, 0.0, rz) * 0.7 * base;
          d += min(rz, 1.0);
        }

        float dist   = distance(fragCoord, iResolution * 0.5);
        float radius = min(iResolution.x, iResolution.y) * 0.5;
        float dim    = disableCenterDimming ? 1.0 : smoothstep(radius*0.3, radius*0.5, dist);

        O = vec4(col, 1.0);
        if (!disableCenterDimming) {
          O.rgb = mix(O.rgb * 0.3, O.rgb, dim);
        }
      }

      void main() {
        mainImage(gl_FragColor, vUv * iResolution);
      }
    `

    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: new THREE.Vector2() },
      iMouse: { value: new THREE.Vector2() },
      hasActiveReminders: { value: hasActiveReminders },
      hasUpcomingReminders: { value: hasUpcomingReminders },
      disableCenterDimming: { value: disableCenterDimming },
    }

    const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms })
    materialRef.current = material

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material)
    scene.add(mesh)

    const onResize = () => {
      const width = container.clientWidth
      const height = container.clientHeight
      renderer.setSize(width, height)
      uniforms.iResolution.value.set(width, height)
    }

    const onMouseMove = (event: MouseEvent) => {
      uniforms.iMouse.value.set(event.clientX, window.innerHeight - event.clientY)
    }

    window.addEventListener("resize", onResize)
    window.addEventListener("mousemove", onMouseMove)
    onResize()

    renderer.setAnimationLoop(() => {
      uniforms.iTime.value = clock.getElapsedTime()
      renderer.render(scene, camera)
    })

    return () => {
      window.removeEventListener("resize", onResize)
      window.removeEventListener("mousemove", onMouseMove)
      renderer.setAnimationLoop(null)
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement)
      }
      material.dispose()
      mesh.geometry.dispose()
      renderer.dispose()
    }
  }, [disableCenterDimming, hasActiveReminders, hasUpcomingReminders, reducedMotion])

  if (reducedMotion) {
    return (
      <div
        className={cn(
          position === "fixed" ? "fixed inset-0" : "absolute inset-0",
          "pointer-events-none bg-background",
          className
        )}
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 20%, color-mix(in oklab, var(--primary) 18%, transparent), transparent 55%), radial-gradient(circle at 70% 70%, color-mix(in oklab, var(--accent) 16%, transparent), transparent 60%)",
        }}
        aria-hidden="true"
      />
    )
  }

  return (
    <div
      ref={containerRef}
      className={cn(position === "fixed" ? "fixed inset-0" : "absolute inset-0", "pointer-events-none", className)}
      aria-hidden="true"
    />
  )
}
