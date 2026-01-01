'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { useSiteSettingsStore } from '@/lib/stores/site-settings-store';
// import { hexToHsl } from '@/lib/utils'; // Removed as we use local helper

function hexToOklch(hex: string) {
  // This is a simplified conversion or placeholder. 
  // Ideally, we'd use a library like 'culori' or 'color' for accurate conversion to OKLCH.
  // For now, let's assume we are sticking to HSL variables in globals.css or we need a proper converter.
  // Given the globals.css uses OKLCH, we should try to support it, but OKLCH conversion is complex manually.
  // Let's fallback to HSL for simplicity if the CSS supports it, OR we can try to find a library.
  // Wait, globals.css uses OKLCH. 
  // Let's try to inject HSL values and update globals.css to use HSL if possible, OR stick to OKLCH if we can convert.
  
  // Actually, let's look at globals.css again. It uses `oklch(...)`.
  // If we want to be dynamic, we might need to change globals.css to accept HSL or RGB, or we implement a converter.
  
  // Let's stick to HSL for the dynamic parts for now, as it's easier to manipulate for lighter/darker shades.
  // We will update globals.css to use `hsl(var(--primary))` style if we switch.
  // BUT, the user wants "premium", and OKLCH is better for that.
  
  // Let's implement a basic Hex -> HSL converter for now and update globals.css to use HSL for the dynamic parts,
  // OR we can use a library if available. I'll implement a helper here.
  
  // Actually, let's just use HSL for the dynamic primary color to ensure it works easily.
  return null; 
}

// Helper to convert Hex to HSL string "h s% l%"
function getHslFromHex(hex: string): string {
  let c = hex.substring(1).split('');
  if (c.length === 3) {
    c = [c[0], c[0], c[1], c[1], c[2], c[2]];
  }
  const r = parseInt(c[0] + c[1], 16) / 255;
  const g = parseInt(c[2] + c[3], 16) / 255;
  const b = parseInt(c[4] + c[5], 16) / 255;
  
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  
  // Round to 1 decimal place
  h = Math.round(h * 360 * 10) / 10;
  s = Math.round(s * 100 * 10) / 10;
  l = Math.round(l * 100 * 10) / 10;

  return `${h} ${s}% ${l}%`;
}

export function DynamicThemeProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useSiteSettingsStore();
  const { theme } = useTheme();
  
  React.useEffect(() => {
    const primaryColor = settings.appearance.primaryColor;
    if (!primaryColor) return;

    const root = document.documentElement;
    const hsl = getHslFromHex(primaryColor);
    
    // We will update the CSS variables to use HSL values.
    // We inject the FULL color string so it can be used directly.
    
    root.style.setProperty('--primary', `hsl(${hsl})`);
    root.style.setProperty('--ring', `hsl(${hsl})`);
    
    // Generate accent from primary (Monochromatic)
    // We use the same hue and saturation, but adjust lightness if needed.
    // For a "premium" feel, accent can be just a slightly different shade or exactly the same.
    // Let's make it match the primary to ensure "dynamic color" is used everywhere.
    root.style.setProperty('--accent', `hsl(${hsl})`);
    
  }, [settings.appearance.primaryColor, theme]);

  return <>{children}</>;
}
