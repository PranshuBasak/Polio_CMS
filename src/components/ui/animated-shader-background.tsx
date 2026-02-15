'use client';

import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

type AnimatedShaderBackgroundProps = {
  className?: string;
  intensity?: number;
};

const vertexShader = `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float iTime;
  uniform vec2 iResolution;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  uniform float uIntensity;

  #define NUM_OCTAVES 3

  float rand(vec2 n) {
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 ip = floor(p);
    vec2 u = fract(p);
    u = u * u * (3.0 - 2.0 * u);

    float res = mix(
      mix(rand(ip), rand(ip + vec2(1.0, 0.0)), u.x),
      mix(rand(ip + vec2(0.0, 1.0)), rand(ip + vec2(1.0, 1.0)), u.x), u.y
    );

    return res * res;
  }

  float fbm(vec2 x) {
    float v = 0.0;
    float a = 0.3;
    vec2 shift = vec2(100.0);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));

    for (int i = 0; i < NUM_OCTAVES; ++i) {
      v += a * noise(x);
      x = rot * x * 2.0 + shift;
      a *= 0.4;
    }

    return v;
  }

  void main() {
    vec2 shake = vec2(sin(iTime * 1.2) * 0.005, cos(iTime * 2.1) * 0.005);
    vec2 p = ((gl_FragCoord.xy + shake * iResolution.xy) - iResolution.xy * 0.5) / iResolution.y * mat2(6.0, -4.0, 4.0, 6.0);

    vec4 o = vec4(0.0);
    float f = 2.0 + fbm(p + vec2(iTime * 5.0, 0.0)) * 0.5;

    for (float i = 0.0; i < 35.0; i++) {
      vec2 v = p + cos(i * i + (iTime + p.x * 0.08) * 0.025 + i * vec2(13.0, 11.0)) * 3.5 + vec2(sin(iTime * 3.0 + i) * 0.003, cos(iTime * 3.5 - i) * 0.003);
      float tailNoise = fbm(v + vec2(iTime * 0.5, i)) * 0.3 * (1.0 - (i / 35.0));

      float gradientA = 0.5 + 0.5 * sin(i * 0.25 + iTime * 0.35);
      float gradientB = 0.5 + 0.5 * cos(i * 0.20 + iTime * 0.45);
      vec3 aurora = mix(uColorA, uColorB, gradientA);
      aurora = mix(aurora, uColorC, gradientB * 0.35);

      vec4 currentContribution = vec4(aurora, 1.0) * exp(sin(i * i + iTime * 0.8)) / length(max(v, vec2(v.x * f * 0.015, v.y * 1.5)));
      float thinnessFactor = smoothstep(0.0, 1.0, i / 35.0) * 0.6;
      o += currentContribution * (1.0 + tailNoise * 0.8) * thinnessFactor;
    }

    o = tanh(pow(o / 100.0, vec4(1.6)));
    gl_FragColor = vec4(o.rgb * 1.45 * uIntensity, o.a);
  }
`;

const lightPalette = ['#6d28d9', '#2563eb', '#0ea5e9'] as const;
const darkPalette = ['#a78bfa', '#60a5fa', '#22d3ee'] as const;

export function AnimatedShaderBackground({
  className,
  intensity = 1,
}: AnimatedShaderBackgroundProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.className = 'h-full w-full';
    container.appendChild(renderer.domElement);

    const palette = resolvedTheme === 'dark' ? darkPalette : lightPalette;
    const material = new THREE.ShaderMaterial({
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector2(1, 1) },
        uColorA: { value: new THREE.Color(palette[0]) },
        uColorB: { value: new THREE.Color(palette[1]) },
        uColorC: { value: new THREE.Color(palette[2]) },
        uIntensity: { value: intensity },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));
      renderer.setSize(width, height, false);
      material.uniforms.iResolution.value.set(width, height);
    };

    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(container);
    updateSize();

    let frameId = 0;
    const clock = new THREE.Clock();
    const animate = () => {
      material.uniforms.iTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      scene.remove(mesh);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, [intensity, resolvedTheme]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden',
        className
      )}
      aria-hidden="true"
    />
  );
}

export default AnimatedShaderBackground;
