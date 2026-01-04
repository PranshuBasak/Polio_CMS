# UI Library

Base components located in `src/components/ui`. Most are built on **Radix UI** and styled with **Tailwind CSS**.

## Core Components

### `Button`
Standard button component with variants.
- **Perks**: Supports `variant` (default, destructive, outline, secondary, ghost, link) and `size`.
- **Fallbacks**: Customizing inner loading state requires manual handling (or use `LoadingButton`).

### `Card`
Container for content with header, content, and footer sections.
- **Perks**: Composable parts (`CardHeader`, `CardTitle`, `CardContent`).
- **Usage**: Used heavily in Admin Dashboard and Project Cards.

### `Input` / `Textarea`
Form input fields.
- **Perks**: Styled consistently with the theme. Supports `disabled` and `error` states via `cn()`.

### `MatrixBackground` / `WaveBackground`
Canvas-based animated backgrounds.
- **Perks**: High visual impact, performant (Canvas API).
- **Fallbacks**: Can be CPU intensive on low-end devices.

### `SmoothCursor`
Custom cursor follower.
- **Perks**: Adds a premium feel.
- **Fallbacks**: Disabled on touch devices.

---

> [!TIP]
> All UI components use `cn()` for class merging, allowing you to override styles easily: `<Button className="bg-red-500">`
