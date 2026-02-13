# Nextra Docs App Master Plan (`docs/NEXTRA_PLAN.md`)

## Summary
Create a separate Nextra documentation app inside `docs/` for this portfolio project, without touching app code in `src/**`.

Allowed change scope:
- `docs/**`
- root `package.json`
- `tsconfig*.json` (if required)

## Locked Decisions
1. Plan file: `docs/NEXTRA_PLAN.md`
2. Docs app: standalone inside `docs/`
3. Theme: `nextra-theme-docs`
4. Routing: `content` directory + catch-all MDX page
5. Bundler: Turbopack (`next dev --turbopack`)
6. Safety: no edits outside allowed paths

## Target Docs App Structure
```txt
docs/
├─ NEXTRA_PLAN.md
├─ package.json
├─ next.config.ts
├─ tsconfig.json
├─ theme.config.tsx
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx
│  │  └─ [[...mdxPath]]/page.tsx
│  ├─ content/
│  │  ├─ index.mdx
│  │  ├─ _meta.ts
│  │  ├─ architecture/
│  │  ├─ pages/
│  │  ├─ components/
│  │  ├─ state/
│  │  ├─ stores/
│  │  ├─ api/
│  │  ├─ schema/
│  │  ├─ config/
│  │  ├─ data/
│  │  ├─ hooks/
│  │  ├─ styles/
│  │  ├─ types/
│  │  ├─ roadmap/
│  │  └─ nextra-lab/
│  └─ mdx-components.tsx
└─ public/
```

## Source Mapping
- `src/app/**` → `content/pages/*`
- `src/components/**`, `src/features/**`, `src/shared/**` → `content/components/*`
- `src/lib/stores/**` + state docs → `content/state/*`, `content/stores/*`
- `src/app/api/**` + existing API docs → `content/api/*`
- `docs/schema/**` + SQL docs → `content/schema/*`
- `src/config/**` + existing config docs → `content/config/*`
- `src/data/**` → `content/data/*`
- `src/hooks/**` + `src/lib/hooks/**` → `content/hooks/*`
- `src/styles/**` + style conventions → `content/styles/*`
- `src/types/**` + `src/lib/types/**` → `content/types/*`
- roadmap material → `content/roadmap/*`

## Full Project Map Sections in Docs
1. Root overview
2. `src/app` route map
3. `src/components` + `src/features` + `src/shared`
4. `src/lib` modules
5. `src/config`
6. `src/data`
7. `src/hooks`
8. `src/styles`
9. `src/types`

## Nextra Feature-Coverage Plan
Add `content/nextra-lab/*` pages covering:
- `_meta`, `page.mdx`, `mdx-components`
- `Callout`, `Cards`, `FileTree`, `Steps`, `Table`, `Tabs`, `Bleed`, `Banner`, `Head`, `Search`, `Playground`
- GFM + GitHub alerts + syntax highlighting
- Mermaid, npm2yarn, Twoslash, `MDXRemote`, `TSDoc`
- Turbopack constraints, CSS, links/images, static rendering
- optional: Pagefind + Inkeep (documented, not forced)

## Scripts / Interfaces
- Root `package.json`:
  - `docs:dev`
  - `docs:build`
  - `docs:start`
- Docs `package.json`:
  - `dev`
  - `build`
  - `start`

## Validation
1. Docs app boots on Turbopack.
2. All mapped sections render and link correctly.
3. Sidebar/nav ordering via `_meta.ts`.
4. Nextra lab pages render targeted components/features.
5. No modified files outside allowed scope.

## Assumptions
- Docs remains fully isolated from portfolio runtime.
- Optional external/paid integrations remain opt-in.
- i18n remains out of initial scope unless added later.
