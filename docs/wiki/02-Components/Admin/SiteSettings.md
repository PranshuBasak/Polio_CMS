# SiteSettings Component

**Path**: `src/features/admin/components/site-settings.tsx`

## Purpose
The `SiteSettings` component is a comprehensive control panel for global application configuration. It allows the admin to modify the site's branding, SEO metadata, social links, and visual theme (including the primary color) without touching the codebase.

## Architecture Connection
-   **Store**: Heavily integrated with `SiteSettingsStore` (`src/lib/stores/site-settings-store.ts`).
-   **Persistence**: Changes are saved to `localStorage` (key: `site-settings-storage`) and hydrated on app load.
-   **Theme System**: Directly manipulates CSS variables via `updateAppearance` to change the site's primary color in real-time.

## Code Analysis

### 1. State Integration
```tsx
export default function SiteSettings() {
  const { 
    settings, 
    updateSettings, 
    updateSocial, 
    updateSEO, 
    updateAppearance 
  } = useSiteSettingsStore();
```
-   **Granular Actions**: The store provides specific actions for different sections (`updateSEO`, `updateSocial`) to avoid overwriting unrelated state.

### 2. Tabbed Layout
The component uses `Tabs` to organize complexity:
```tsx
<Tabs defaultValue="general">
  <TabsList>
    <TabsTrigger value="general">General</TabsTrigger>
    <TabsTrigger value="social">Social</TabsTrigger>
    <TabsTrigger value="appearance">Appearance</TabsTrigger>
    {/* ... */}
  </TabsList>
```

### 3. Live Theme Customization
This is a standout feature.
```tsx
<div className="space-y-2">
  <Label>Primary Color</Label>
  <div className="flex gap-4">
    {/* HTML Color Picker */}
    <input
      type="color"
      value={settings.appearance.primaryColor}
      onChange={(e) => updateAppearance({ primaryColor: e.target.value })}
    />
    {/* Hex Input */}
    <Input 
      value={settings.appearance.primaryColor} 
      onChange={(e) => updateAppearance({ primaryColor: e.target.value })} 
    />
  </div>
</div>
```
-   **Mechanism**: When `updateAppearance` is called, the store updates the state. The `DynamicThemeProvider` (wrapping the app) listens to this state and updates the CSS variable `--primary` on the `<html>` element.

### 4. SEO Management
```tsx
<Input
  value={settings.seo.keywords.join(', ')}
  onChange={(e) => updateSEO({
    keywords: e.target.value.split(',').map((k) => k.trim())
  })}
/>
```
-   **Logic**: Converts the comma-separated string from the input back into an array of strings for the store.

### 5. Advanced Actions
```tsx
<Button variant="destructive" onClick={resetSettings}>
  Reset All Settings
</Button>
```
-   **Danger Zone**: Allows reverting to the hardcoded defaults defined in the store.

## Usage Example

This component is a singleton page at `/admin/settings`.

```tsx
// src/app/admin/settings/page.tsx
export default function SettingsPage() {
  return <SiteSettings />;
}
```

## Perks & Fallbacks
| Feature | Description |
| :--- | :--- |
| **Real-time** | Theme changes are reflected instantly across the app. |
| **Comprehensive** | Covers almost every aspect of the site configuration. |
| **Fallback** | "Export Data" button is currently a placeholder (UI only). |
