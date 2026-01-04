# HeroSection Component

**Path**: `src/features/hero/components/hero-section.tsx`

## Purpose
`HeroSection` is the high-impact landing component of the portfolio. It combines dynamic data (name, title, status) with visual flair (Typewriter, Wave Background, Glowing Avatar) to create a strong first impression.

## Architecture Connection
-   **Store**: Connects to `HeroStore` for profile data and `SiteSettingsStore` for theming (primary color).
-   **UI Library**: Integrates `Typewriter`, `Waves`, and `Button`.
-   **Animation**: Heavily uses `framer-motion` for entrance effects.

## Code Analysis

### 1. Dynamic Theming
```tsx
export default function HeroSection() {
  const { settings } = useSiteSettingsStore();
  
  // Pass dynamic primary color to the Wave background
  <Waves 
    strokeColor={settings.appearance.primaryColor || "#00ff00"} 
    backgroundColor="transparent"
  />
```
-   **Integration**: The background effect reacts instantly to theme changes in the Admin panel.

### 2. Status Badge (Cyberpunk Style)
```tsx
<motion.div className="... border-primary/30 bg-primary/10 ...">
  <span className="animate-ping ... bg-primary opacity-75"></span>
  {heroData.status || "STATUS: AVAILABLE FOR HIRE"}
</motion.div>
```
-   **Visuals**: Uses Tailwind's `animate-ping` for a pulsing "live" effect.
-   **Data**: Displays the custom status set in the Admin Dashboard.

### 3. Typewriter Effect
```tsx
<Typewriter 
  text={heroData.description} 
  speed={20} 
  delay={0.5}
  cursorClassName="bg-primary"
/>
```
-   **Engagement**: Draws the eye to the bio text.
-   **Customization**: The cursor color matches the global theme.

### 4. Avatar Frame
```tsx
<div className="relative w-[300px] h-[300px] ...">
  {/* Cyberpunk Borders */}
  <div className="absolute inset-0 border-2 border-primary/30 rounded-[2rem]" />
  <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-primary ..." />
  
  <Image src={heroData.avatarUrl} ... />
</div>
```
-   **Design**: A custom "Cyberpunk" frame built with absolute positioned divs and border hacks.
-   **Fallback**: Shows `[NO_IMAGE_DATA]` if no avatar is uploaded.

## Usage Example

```tsx
// src/app/page.tsx
<HeroSection />
```

## Perks & Fallbacks
| Feature | Description |
| :--- | :--- |
| **Wow Factor** | High-end visual effects (Waves, Typewriter, Motion). |
| **Dynamic** | Fully data-driven from the CMS. |
| **Fallback** | Complex DOM structure might be heavy on older mobile devices (though `framer-motion` handles this well). |
