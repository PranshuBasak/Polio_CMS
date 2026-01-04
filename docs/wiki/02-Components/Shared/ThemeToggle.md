# ThemeToggle Component

**Path**: `src/shared/components/layout/mode-toggle.tsx`

## Purpose
The `ThemeToggle` (exported as `ModeToggle`) allows users to switch between Light, Dark, and System color schemes. It uses a compact dropdown menu to save space.

## Architecture Connection
-   **Library**: Wraps `next-themes` (`useTheme` hook).
-   **UI**: Uses Shadcn `DropdownMenu` and `Button`.

## Code Analysis

### 1. Icon Transition
```tsx
<Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
<Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
```
-   **CSS Magic**: Both icons are rendered simultaneously. Tailwind classes (`dark:`) control their rotation and scale, creating a smooth morphing animation when the theme changes.

### 2. Theme Provider Interaction
```tsx
const { setTheme } = useTheme();
// ...
onClick={() => setTheme('dark')}
```
-   **Logic**: Updates the `class` attribute on the `<html>` tag (e.g., adding `dark`), which triggers Tailwind's dark mode styles.

## Usage Example

```tsx
// Inside Navbar or Sidebar
<ModeToggle />
```

## Perks & Fallbacks
| Feature | Description |
| :--- | :--- |
| **Smooth** | Best-in-class icon animation. |
| **Accessible** | Fully keyboard navigable via DropdownMenu. |
| **Fallback** | Requires `next-themes` provider to be present in the root layout. |
