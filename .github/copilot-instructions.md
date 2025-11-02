# Copilot Instructions for Portfolio CMS

This document guides AI agents working on this Next.js 16 portfolio website with admin CMS functionality. Follow these patterns to stay productive and consistent with the codebase.

## 🏗️ Architecture Overview

**Portfolio Structure:**

- **Frontend**: Static marketing pages (home, about, projects, blog, skills, resume)
- **Admin CMS**: Protected dashboard for editing all portfolio content
- **State Management**: Zustand stores with localStorage persistence
- **Internationalization**: 6 languages (en, es, fr, zh, ar, bn) with RTL support
- **UI Framework**: Shadcn UI components + Radix UI + Framer Motion animations

**Key Entry Points:**

- `/src/app/page.tsx` → Main portfolio homepage (lazy-loaded sections with Suspense)
- `/src/app/admin/` → Admin dashboard (protected pages for each content type)
- `/src/lib/stores/` → All Zustand store definitions
- `/src/lib/i18n/` → Language and direction context providers
- `/src/components/` → Reusable components and admin editors

---

## 📊 State Management: Zustand Stores

This codebase uses **Zustand with localStorage persistence**. Every store follows this pattern:

```typescript
// Example: src/lib/stores/projects-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';

type ProjectsStore = {
  projects: Project[];
  addProject: (project: Project) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
};

export const useProjectsStore = create<ProjectsStore>()(
  persist(
    (set, get) => ({
      projects: [],
      addProject: (project) =>
        set((state) => ({
          projects: [...state.projects, { ...project, id: nanoid() }],
        })),
      updateProject: (id, project) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...project } : p
          ),
        })),
      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        })),
    }),
    { name: 'projects-storage' } // localStorage key
  )
);
```

**When adding a new store:**

1. Define types clearly (use discriminated unions for complex data)
2. Always use `nanoid()` for new IDs
3. Export store hooks via `/src/lib/stores/index.ts`
4. Add type exports to `/src/lib/types/index.ts`
5. Use `persist` middleware for localStorage with consistent naming

**Available stores:**

- `useHeroStore` - Hero section editing
- `useAboutStore` - About page with journey timeline and values
- `useProjectsStore` - Portfolio projects with screenshots
- `useSkillsStore` - Skills with categories and proficiency levels
- `useBlogStore` - Internal and external blog posts
- `useResumeStore` - Resume with experience, education, certifications
- `useTestimonialsStore` - Client testimonials
- `useUIStore` - Sidebar and theme toggles

---

## 🌍 Internationalization Pattern

**Language Context** (`/src/lib/i18n/translations-context.tsx`):

- Supports: `en | es | fr | zh | ar | bn`
- RTL languages: `ar` (Arabic)
- Use hook: `useTranslations()` to get `t(key)` function and `dir` value

```typescript
const { t, language, dir } = useTranslations();

<h1>{t("about.title")}</h1>
<div dir={dir}>{/* RTL-aware layout */}</div>
```

**Translation keys structure:** `feature.component.element`

- `nav.home`, `nav.about` → Navigation
- `hero.viewProjects`, `hero.downloadResume` → Hero section
- `about.title`, `about.tab.bio` → About page
- Add new keys to `translations` object in context file (600+ lines)

---

## 🎨 Component Organization

**Layout hierarchy:**

```
/src/app/                      # Route structure (Next.js App Router)
  /page.tsx                    # Homepage (lazy loads all sections)
  /(home)/                     # Route group for home-related features
    /_components/              # Home-specific components
    /_hooks/                   # Home-specific hooks
  /admin/                      # Protected admin pages
    /skills/ /blog/ /resume/   # Content management pages
/src/components/               # Global reusable components
  /admin/                      # Admin-specific editors and components
  /ui/                         # Shadcn UI components (auto-generated)
  /providers/                  # Context providers
```

**Component patterns:**

- **Presentational**: `ProductCard.tsx` (pure UI, receives props)
- **Container**: `ProjectsSection.tsx` (fetches from store, lazy-loaded)
- **Editor**: `ResumeExperienceEditor.tsx` (admin UI for editing)
- **Hook**: `useBlogData.ts` (computed values, data transformation)

---

## 🔧 Common Development Workflows

### Adding a New Portfolio Content Type

1. **Create Zustand store** (`/src/lib/stores/your-store.ts`):

   - Define types with required fields
   - Implement CRUD actions
   - Add persist middleware with storage key

2. **Export store** in `/src/lib/stores/index.ts` and types in `/src/lib/types/index.ts`

3. **Create admin page** (`/src/app/admin/yourfeature/page.tsx`):

   - Use `"use client"` directive
   - Hook into store with `useYourStore((state) => state.data)`
   - Show list with edit/delete buttons

4. **Create editor component** (`/src/components/admin/your-editor.tsx`):

   - Implement form with Zod validation
   - Use drag-drop from `@hello-pangea/dnd` for reordering
   - Update store on form submit
   - Show `useToast()` feedback

5. **Add to public frontend** (`/src/components/your-section.tsx`):
   - Lazy-load with `lazy(() => import(...))`
   - Wrap in `<Suspense>` and `<ErrorBoundary>`
   - Transform store data into display format

### Fixing Hydration Issues

**Problem**: Store data not available on first render (SSR mismatch)

**Solution**: Use `useHydration()` hook:

```typescript
const isHydrated = useHydration();

if (!isHydrated) return <Spinner />;
// Safe to use store data now
const data = useProjectsStore((state) => state.projects);
```

The `useHydration()` hook waits for client-side hydration before component renders.

### Adding Drag-Drop Reordering

Use `@hello-pangea/dnd` (fork of react-beautiful-dnd):

```typescript
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from '@hello-pangea/dnd';

const handleDragEnd = (result: DropResult) => {
  const { source, destination, draggableId } = result;
  if (!destination) return;

  const reordered = Array.from(items);
  reordered.splice(source.index, 1);
  reordered.splice(destination.index, 0, items[source.index]);

  updateStore(reordered);
};

<DragDropContext onDragEnd={handleDragEnd}>
  <Droppable droppableId="items">
    {(provided) => (
      <div {...provided.droppableProps} ref={provided.innerRef}>
        {items.map((item, index) => (
          <Draggable key={item.id} draggableId={item.id} index={index}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
              >
                {item.name}
              </div>
            )}
          </Draggable>
        ))}
      </div>
    )}
  </Droppable>
</DragDropContext>;
```

---

## ✅ Build & Deployment

**Development:**

```bash
pnpm dev          # Start local server on http://localhost:3000
pnpm lint         # Check ESLint (0 errors enforced)
```

**Production:**

```bash
pnpm build        # Next.js Turbopack compile + TypeScript check
pnpm start        # Run production server
```

**Important notes:**

- Turbopack compiler enabled (fast builds)
- TypeScript strict mode enforced
- React Compiler enabled (automatic memoization)
- All lint errors must be fixed before build passes

---

## 🔒 State Persistence & Hydration

**How persistence works:**

1. Zustand stores wrap components with `persist` middleware
2. Data auto-saves to localStorage with key from `persist` config
3. On page reload, data restores from localStorage
4. SSR pages show nothing until client hydration completes

**Critical pattern for admin pages:**

```typescript
'use client';
import { useHydration } from '@/lib/hooks';

export default function AdminPage() {
  const isHydrated = useHydration(); // Wait for store hydration
  const data = useYourStore((state) => state.data);

  if (!isHydrated) return <Skeleton />;
  return <YourComponent />;
}
```

**Why this matters:** Zustand doesn't have data until client hydration finishes. Without waiting, you get empty arrays/objects on initial render causing hydration mismatches.

---

## 📝 Form Validation

Use **Zod** for runtime schema validation:

```typescript
import { z } from 'zod';

const projectSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10),
  tags: z.array(z.string()).min(1, 'Add at least one tag'),
});

type Project = z.infer<typeof projectSchema>;

const handleSubmit = (formData: FormData) => {
  try {
    const validated = projectSchema.parse(Object.fromEntries(formData));
    addProject(validated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.issues.forEach((issue) => {
        // Handle error.issues[0].message, .path, etc.
      });
    }
  }
};
```

---

## 🎯 Key Files Reference

| File                                    | Purpose                            |
| --------------------------------------- | ---------------------------------- |
| `src/lib/stores/index.ts`               | Central store exports (550+ lines) |
| `src/lib/i18n/translations-context.tsx` | All 600+ translation keys          |
| `src/lib/types/index.ts`                | Type re-exports from stores        |
| `src/components/error-boundary.tsx`     | Error fallback wrapper             |
| `src/app/admin/`                        | All admin CRUD pages               |
| `src/components/admin/`                 | All editor components              |
| `next.config.ts`                        | React Compiler + Turbopack config  |

---

## ⚠️ Common Pitfalls

1. **Accessing store in server components** → Use `"use client"` directive
2. **No hydration check** → Use `useHydration()` before accessing store data
3. **Missing Zod validation** → Always parse user input with Zod schemas
4. **Mutation instead of spread** → Always use immutable updates: `[...arr, item]`
5. **No persist middleware** → Add `persist(reducer, { name: "key" })` to stores
6. **Type `any` in forms** → Use `unknown` or specific types with type guards
7. **setState in effect without cleanup** → Wrap in `requestAnimationFrame` or add dependencies

---

## 🚀 Quick Start for New Features

1. Define Zustand store with types and actions
2. Create admin CRUD page using `useHydration()`
3. Add editor component with form validation
4. Create public display component (lazy-loaded)
5. Add translation keys to i18n context
6. Test: `pnpm lint` → `pnpm build` → `pnpm dev`

**Remember:** This is a portfolio CMS, not a production app backend. All data persists locally via localStorage. Focus on UX and clean code.
