# Footer Component

**Path**: `src/shared/components/layout/footer.tsx`

## Purpose
The `Footer` serves as the site's closure, providing secondary navigation, social links, and copyright information. It matches the "Cyberpunk" aesthetic with animated background effects and "System Status" text.

## Architecture Connection
-   **Store**: Connects to `HeroStore` (Name) and `SiteSettingsStore` (Social Links).
-   **I18n**: Uses `useTranslations` for labels like "Quick Links".

## Code Analysis

### 1. Admin Exclusion
```tsx
const isAdmin = pathname.startsWith('/admin');
if (isAdmin) return null;
```
-   **Consistency**: Like the Navbar, it hides itself on Admin pages to maximize screen real estate for data management.

### 2. Animated Background
```tsx
<div className="absolute inset-0 pointer-events-none">
  <div className="absolute top-0 left-1/4 w-1 h-1 bg-primary rounded-full animate-ping" />
  {/* ... more particles */}
</div>
```
-   **Visuals**: Pure CSS animations (`animate-ping`) create a subtle "digital dust" effect without heavy JS overhead.

### 3. Dynamic Social Links
```tsx
<Link href={settings.social.github} ...>
  <Github className="h-5 w-5" />
</Link>
```
-   **Data-Driven**: Links are not hardcoded; they come from the `SiteSettingsStore`, allowing the admin to update URLs without deploying code.

### 4. Cyberpunk Flavor Text
```tsx
<p className="mt-2 opacity-50">
  SYSTEM_STATUS: ONLINE | ENCRYPTION: 256-BIT | LOCATION: UNKNOWN
</p>
```
-   **Theme**: Adds to the immersive experience.

## Usage Example

```tsx
// src/app/layout.tsx
<Footer />
```

## Perks & Fallbacks
| Feature | Description |
| :--- | :--- |
| **Thematic** | Strong visual identity. |
| **Dynamic** | Updates with global settings. |
| **Fallback** | "Buy me a coffee" link is currently hardcoded; should be moved to settings. |
