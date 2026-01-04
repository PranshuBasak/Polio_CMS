# Navbar Component

**Path**: `src/shared/components/layout/navbar.tsx`

## Purpose
The `Navbar` is the primary navigation controller for the public site. It features a unique **dual-mode layout**:
1.  **Desktop**: A floating "dock" style bar fixed to the bottom-center of the screen.
2.  **Mobile**: A traditional top-right hamburger menu that expands into a glassmorphism overlay.

## Architecture Connection
-   **Layout**: Rendered in the root layout (except on Admin pages).
-   **Routing**: Uses `usePathname` for active link highlighting.
-   **UI Library**: Wraps `LiquidGlass` for the visual effect.

## Code Analysis

### 1. Dual-Mode Positioning
```tsx
<header className={cn(
  "fixed z-40 transition-all duration-300",
  // Desktop: Bottom Center
  "md:bottom-8 md:left-1/2 md:-translate-x-1/2 ...",
  // Mobile: Top Right
  "top-20 right-4 ..."
)}>
```
-   **Responsive Design**: Uses Tailwind's `md:` prefix to completely change the positioning strategy based on screen size.

### 2. Scroll Detection (Throttled)
```tsx
useEffect(() => {
  let ticking = false;
  const throttledScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  };
  window.addEventListener('scroll', throttledScroll);
}, []);
```
-   **Performance**: Uses `requestAnimationFrame` to prevent layout thrashing during scroll events.

### 3. Admin Exclusion
```tsx
const isAdmin = pathname.startsWith('/admin');
if (isAdmin) return null;
```
-   **Logic**: The Admin panel has its own sidebar, so the public navbar is hidden to prevent UI clutter.

### 4. Liquid Glass Effect
```tsx
<LiquidGlass className="p-2">
  {/* Nav Items */}
</LiquidGlass>
```
-   **Aesthetics**: Wraps the content in a custom component that provides a frosted glass blur and border.

## Usage Example

```tsx
// src/app/layout.tsx
<body>
  <Navbar />
  {children}
  <Footer />
</body>
```

## Perks & Fallbacks
| Feature | Description |
| :--- | :--- |
| **Unique UX** | Bottom-dock on desktop is ergonomic and distinctive. |
| **Performance** | Optimized scroll listeners. |
| **Fallback** | Mobile menu relies on JS state (`isOpen`). If JS fails, the menu won't open (critical for navigation). |
