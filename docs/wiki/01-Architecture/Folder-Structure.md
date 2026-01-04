# Folder Structure

An annotated guide to the project's file organization.

```
dynamicFolio_CMS/
├── .env.local                  # Environment variables (Git-ignored)
├── next.config.ts              # Next.js configuration
├── package.json                # Dependencies and scripts
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (home)/             # Route group for Home (optional organization)
│   │   ├── admin/              # [CMS] Admin Dashboard routes
│   │   ├── api/                # API Routes (Health, Blog)
│   │   ├── blog/               # Public Blog pages
│   │   ├── projects/           # Public Project pages
│   │   ├── globals.css         # Global styles & Tailwind v4 config
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Landing page
│   │
│   ├── components/             # React Components
│   │   ├── ui/                 # Shadcn UI (Base components)
│   │   ├── providers/          # Context Providers (Theme, Toast)
│   │   ├── hero/               # Hero section components
│   │   ├── about/              # About section components
│   │   ├── skills/             # Skills section components
│   │   └── ...                 # Other feature-specific folders
│   │
│   ├── lib/                    # Core Logic & Utilities
│   │   ├── stores/             # Zustand Stores (State Management)
│   │   ├── hooks/              # Custom React Hooks
│   │   ├── utils/              # Helper functions
│   │   ├── i18n/               # Internationalization logic
│   │   └── supabase/           # Supabase client (Future use)
│   │
│   └── types/                  # TypeScript definitions
│
├── docs/                       # Documentation
│   ├── wiki/                   # [You are here] Obsidian-style Wiki
│   └── ...                     # Standard docs (API.md, etc.)
└── public/                     # Static assets (images, fonts)
```

## Key Directories

### `src/app`
Follows the Next.js 13+ App Router conventions. Folders define routes. `page.tsx` is the UI for a route. `layout.tsx` wraps the route.

### `src/lib/stores`
Contains all **Zustand** stores. This is the "Database" of the current application version.
- `projects-store.ts`
- `ui-store.ts`
- `...`

### `src/components/ui`
Contains "dumb" UI components (Buttons, Inputs, Cards). These are mostly from **Shadcn UI** and are designed to be reusable and stateless.

### `src/components/[feature]`
Contains "smart" or feature-specific components. For example, `src/components/admin/AdminStats.tsx` would contain logic specific to the admin dashboard.
