# Technology Stack

A detailed breakdown of the technologies driving **DynamicFolio CMS**.

## Core Framework

| Technology | Version | Description | Perks |
| :--- | :--- | :--- | :--- |
| **Next.js** | `16.0.8` | The React Framework for the Web. | App Router, Server Actions, RSC, Optimization. |
| **React** | `19.2.1` | UI Library. | Concurrent features, Server Components, Hooks. |
| **TypeScript** | `5.x` | Static Type Checker. | Type safety, better DX, catch errors early. |

## State Management

| Technology | Version | Description | Perks |
| :--- | :--- | :--- | :--- |
| **Zustand** | `^5.0.8` | Bear necessities state management. | Minimal boilerplate, unopinionated, transient updates. |
| **Immer** | `^10.2.0` | Immutable state helper. | Write immutable updates with mutable syntax. |

## Styling & UI

| Technology | Version | Description | Perks |
| :--- | :--- | :--- | :--- |
| **Tailwind CSS** | `v4` | Utility-first CSS framework. | Rapid UI development, small bundle size (JIT). |
| **Shadcn UI** | - | Reusable component collection. | Accessible, customizable, copy-paste (not a dependency). |
| **Framer Motion** | `^12.0` | Animation library. | Declarative animations, layout transitions. |
| **Lucide React** | `^0.552` | Icon library. | Consistent, lightweight SVG icons. |

## Utilities & Helpers

- **`date-fns`**: Lightweight date manipulation.
- **`zod`**: Schema validation (used for form validation).
- **`react-hook-form`**: Performant, flexible forms.
- **`rss-parser`**: Parse RSS feeds (for Medium integration).
- **`@hello-pangea/dnd`**: Accessible drag-and-drop (fork of `react-beautiful-dnd`).
- **`pino`**: Structured logging.

## Dev Tools

- **`eslint`**: Linter.
- **`prettier`**: Code formatter (implied).
- **`postcss`**: CSS transformation tool.

---

> [!NOTE]
> **Tailwind v4** is a significant shift from v3. Configuration is primarily handled in CSS variables rather than a JS config file. See [[Tailwind Config]](../05-Config/Tailwind-Config.md).
