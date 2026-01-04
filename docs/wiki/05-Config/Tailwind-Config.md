# Tailwind Config (v4)

This project uses **Tailwind CSS v4**.

## No `tailwind.config.ts`?

In v4, configuration is handled directly in CSS using the `@theme` directive.
See `src/app/globals.css`.

## Theme Configuration

```css
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  /* ... maps CSS variables to Tailwind utility classes */
  
  --radius-sm: calc(var(--radius) - 4px);
}
```

## CSS Variables

We define the actual color values in `:root` (for light mode) and `.dark` (for dark mode).

```css
:root {
  --primary: oklch(0.55 0.22 264); /* Oklch color space for vibrancy */
  /* ... */
}
```

## Animations

Custom animations are defined in `globals.css` and mapped to utilities.

```css
.animate-fade-in {
  animation: fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
```
