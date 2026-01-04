# SmoothCursor Component

**Path**: `src/components/ui/smooth-cursor.tsx`

## Purpose
`SmoothCursor` replaces the default system mouse pointer with a custom, physics-based SVG cursor. It adds a "weighty" feel to interactions, with the cursor trailing slightly behind the actual mouse position and rotating based on velocity.

## Architecture Connection
-   **Library**: Built on `framer-motion` (`useSpring`, `motion.div`).
-   **Scope**: Global component, usually mounted once in the root layout.

## Code Analysis

### 1. Physics Engine
```tsx
const cursorX = useSpring(0, springConfig); // damping: 45, stiffness: 400
const cursorY = useSpring(0, springConfig);
```
-   **Spring Physics**: Instead of directly mapping x/y, the cursor "springs" to the target position. This creates the smooth trailing effect.

### 2. Velocity Calculation
```tsx
const updateVelocity = (currentPos) => {
  const deltaTime = currentTime - lastUpdateTime.current;
  velocity.current = {
    x: (currentPos.x - lastMousePos.current.x) / deltaTime,
    y: (currentPos.y - lastMousePos.current.y) / deltaTime,
  };
}
```
-   **Delta Time**: Calculates speed independent of frame rate.

### 3. Dynamic Rotation & Squash
```tsx
if (speed > 0.1) {
  const angle = Math.atan2(velocity.y, velocity.x) * (180 / Math.PI) + 90;
  rotation.set(angle);
  scale.set(0.95); // Slight "squash" effect when moving fast
}
```
-   **Game Feel**: The cursor points in the direction of movement, like a vehicle. The scale reduction adds a subtle "aerodynamic" feel.

### 4. System Cursor Hiding
```tsx
useEffect(() => {
  document.body.style.cursor = "none";
  return () => { document.body.style.cursor = "auto"; };
}, []);
```
-   **Override**: Globally hides the default pointer.
-   **Cleanup**: Restores the pointer if the component unmounts (crucial for accessibility/debugging).

## Usage Example

```tsx
// src/app/layout.tsx
<SmoothCursor />
```

## Perks & Fallbacks
| Feature | Description |
| :--- | :--- |
| **Premium Feel** | Makes the site feel like a native app or game. |
| **Performance** | Uses `requestAnimationFrame` and `will-change: transform` for 60fps. |
| **Fallback** | On touch devices, this component should ideally be disabled (logic not currently visible in snippet, but standard practice). |
