# HeroContent Component

**Path**: `src/features/hero/components/hero-content.tsx`

## Purpose
`HeroContent` is a **Presentational Component** that displays the hero data in a simpler layout than the main `HeroSection`. It is often used as a fallback or alternative design variant.

> [!NOTE]
> In the current codebase, `HeroSection` seems to be the primary implementation with "Cyberpunk" styling, while `HeroContent` offers a cleaner, more traditional layout.

## Architecture Connection
-   **Props**: Receives `HeroData` directly (pure component).
-   **Composition**: Renders `HeroActions` and `HeroSocials`.

## Code Analysis

### 1. Layout
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
  <motion.div ...>
    {/* Text Content */}
  </motion.div>
  
  <div className="flex justify-center">
    <GlowingAvatar ... />
  </div>
</div>
```
-   **Structure**: Standard 2-column layout (Text Left, Image Right).

### 2. Glowing Avatar
```tsx
<GlowingAvatar
  src={heroData.image}
  size={280}
/>
```
-   **Reusability**: Uses a shared UI enhancement component (`GlowingAvatar`) instead of the custom inline styles seen in `HeroSection`.

## Usage Example

```tsx
// Alternative usage in a different page layout
<HeroContent heroData={data} />
```

## Perks & Fallbacks
| Feature | Description |
| :--- | :--- |
| **Clean** | Less visual noise than `HeroSection`. |
| **Pure** | Easier to test as it relies on props, not stores. |
| **Fallback** | Less "wow factor" than the main Hero implementation. |
