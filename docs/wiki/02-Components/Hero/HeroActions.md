# HeroActions Component

**Path**: `src/features/hero/components/hero-actions.tsx`

## Purpose
`HeroActions` encapsulates the primary Call-to-Action (CTA) buttons in the Hero section. It handles navigation ("View Projects") and resource access ("Download Resume"), often with enhanced hover effects.

## Architecture Connection
-   **Parent**: Used by `HeroSection` (and potentially `HeroContent`).
-   **I18n**: Uses `useTranslations` for button labels.

## Code Analysis

### 1. Button Styling
```tsx
<Button asChild size="lg" className="btn-gradient group">
  <a href="#projects" className="flex items-center gap-2">
    {t('hero.viewProjects')}
    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
  </a>
</Button>
```
-   **`btn-gradient`**: A custom utility class (likely defined in `globals.css`) for the primary action.
-   **Micro-interaction**: The arrow icon slides right (`translate-x-1`) on hover.

### 2. Resume Download
```tsx
<Button asChild variant="outline" ...>
  <a href="/resume">
    <Download className="..." />
    {t('hero.downloadResume')}
  </a>
</Button>
```
-   **Semantics**: Links to the `/resume` page (which might auto-trigger a download or show a PDF viewer).

## Usage Example

```tsx
<div className="flex flex-wrap gap-4">
  <HeroActions />
</div>
```

## Perks & Fallbacks
| Feature | Description |
| :--- | :--- |
| **Interactive** | Subtle animations improve click-through rate. |
| **Localized** | Text adapts to user language. |
| **Fallback** | Hardcoded anchor link (`#projects`) assumes the Projects section exists on the same page. |
