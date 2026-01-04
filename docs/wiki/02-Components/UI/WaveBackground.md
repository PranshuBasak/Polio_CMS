# WaveBackground Component

**Path**: `src/components/ui/wave-background.tsx`

## Purpose
`WaveBackground` renders a mesmerizing, organic mesh of lines that undulate like liquid. It serves as the primary visual background for the `HeroSection`, reacting to mouse movement to create a sense of depth and interactivity.

## Architecture Connection
-   **Technology**: Raw SVG manipulation via React Refs (no heavy canvas libraries).
-   **Math**: Uses `simplex-noise` for organic randomness.

## Code Analysis

### 1. Grid Generation
```tsx
const setLines = () => {
  // ... calculates total lines based on width ...
  for (let i = 0; i < totalLines; i++) {
    // Create points for each line
    const points = []; 
    // ...
    // Create SVG Path element
    const path = document.createElementNS(..., 'path');
    svgRef.current.appendChild(path);
  }
}
```
-   **Dynamic Density**: The number of lines adapts to the screen size (`window.innerWidth`).

### 2. The Animation Loop
```tsx
const tick = (time) => {
  movePoints(time); // Update point coordinates
  drawLines();      // Update SVG path 'd' attributes
  requestAnimationFrame(tick);
}
```
-   **Performance**: Directly manipulates DOM attributes (`setAttribute('d', ...)`) rather than using React state, which would be too slow for this many elements at 60fps.

### 3. Noise & Interaction
```tsx
const move = noise(
  (p.x + time * 0.008) * 0.003, 
  (p.y + time * 0.003) * 0.002
) * 8;
```
-   **Simplex Noise**: Creates smooth, non-repetitive wave patterns.
-   **Mouse Repulsion**: Points calculate their distance to the mouse (`Math.hypot`) and are pushed away (`p.cursor.vx += ...`), creating a ripple effect.

## Usage Example

```tsx
<div className="absolute inset-0 z-0">
  <Waves strokeColor="#00ff00" />
</div>
```

## Perks & Fallbacks
| Feature | Description |
| :--- | :--- |
| **Lightweight** | Uses SVG paths instead of a heavy WebGL context. |
| **Reactive** | Responds to screen resize and mouse input. |
| **Fallback** | High CPU usage on very large screens or low-end devices due to the number of point calculations per frame. |
