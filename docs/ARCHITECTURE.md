# System Architecture

Comprehensive overview of the Portfolio CMS architecture, design patterns, and technical decisions.

## Table of Contents
- [High-Level Architecture](#high-level-architecture)
- [Technology Stack](#technology-stack)
- [Application Layers](#application-layers)
- [Data Flow](#data-flow)
- [State Management](#state-management)
- [Component Architecture](#component-architecture)
- [Routing Structure](#routing-structure)
- [Internationalization](#internationalization)
- [Performance Strategy](#performance-strategy)
- [Security Model](#security-model)
- [Scalability Considerations](#scalability-considerations)

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser (Client)                      │
├─────────────────────────────────────────────────────────────┤
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐ │
│  │  Public Pages  │  │  Admin Panel   │  │  Client Store  │ │
│  │  (Server RSC)  │  │  (Client JS)   │  │  (Zustand +    │ │
│  │                │  │                │  │  localStorage)  │ │
│  └────────────────┘  └────────────────┘  └────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Next.js 16 App Router                     │
├─────────────────────────────────────────────────────────────┤
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐ │
│  │ Server         │  │ API Routes     │  │ Middleware     │ │
│  │ Components     │  │ (Future)       │  │ (i18n, auth)   │ │
│  └────────────────┘  └────────────────┘  └────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     Data Layer (Current)                     │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐ │
│  │             localStorage (Browser Storage)              │ │
│  │  - projects-storage                                     │ │
│  │  - blog-storage                                         │ │
│  │  - skills-storage                                       │ │
│  │  - resume-storage                                       │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  Future: Database Layer                      │
├─────────────────────────────────────────────────────────────┤
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐ │
│  │   Supabase     │  │ Vercel Postgres│  │   MongoDB      │ │
│  │  (PostgreSQL)  │  │  (PostgreSQL)  │  │    Atlas       │ │
│  └────────────────┘  └────────────────┘  └────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Current Architecture (v1.0)
- **Client-Side State**: All data stored in localStorage via Zustand stores
- **No Backend**: Pure static site deployment
- **No Authentication**: Admin panel publicly accessible
- **Single User**: Data unique per browser

### Future Architecture (v2.0 - Database Integration)
- **Server-Side State**: Data persisted in PostgreSQL/MongoDB
- **API Layer**: REST/GraphQL endpoints for CRUD operations
- **Authentication**: Supabase Auth or NextAuth.js
- **Multi-User**: Shared data across devices and users

---

## Technology Stack

### Core Framework
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.0.1 | React framework with App Router |
| **React** | 19.0.0 | UI library with Server Components |
| **TypeScript** | 5.7.3 | Type safety and developer experience |

### State Management
| Technology | Purpose |
|------------|---------|
| **Zustand** | Lightweight state management (~1KB) |
| **localStorage** | Client-side persistence (current) |
| **React Server Components** | Server-side state (no client JS) |

### Styling & UI
| Technology | Purpose |
|------------|---------|
| **Tailwind CSS** | Utility-first CSS framework |
| **Shadcn UI** | Accessible component library (Radix UI) |
| **Framer Motion** | Animation and transitions |
| **Lucide React** | Icon system |

### Forms & Validation
| Technology | Purpose |
|------------|---------|
| **Zod** | Runtime schema validation |
| **React Hook Form** | Form state management (pattern) |

### Drag & Drop
| Technology | Purpose |
|------------|---------|
| **@hello-pangea/dnd** | Drag-and-drop reordering (fork of react-beautiful-dnd) |

### Logging & Monitoring
| Technology | Purpose |
|------------|---------|
| **Pino** | Production-grade structured logging |
| **Vercel Analytics** | Web analytics and performance monitoring |

### Future Technologies
| Technology | Purpose |
|------------|---------|
| **Supabase** | PostgreSQL database + auth + storage |
| **NextAuth.js** | Authentication library (alternative) |
| **React Query** | Server state management (for API data) |
| **Sentry** | Error tracking and monitoring |

---

## Application Layers

### 1. Presentation Layer (Client)

**Server Components** (default):
- `app/page.tsx` - Homepage
- `app/about/page.tsx` - About page
- `app/projects/page.tsx` - Projects listing
- `app/blog/page.tsx` - Blog listing

**Client Components** (`"use client"`):
- `app/admin/**` - Admin dashboard
- Interactive forms and buttons
- Drag-and-drop interfaces
- Theme toggles and modals

### 2. Business Logic Layer

**Custom Hooks** (`/src/lib/hooks/`, `/src/app/**/_hooks/`):
- `useHydration()` - Wait for client-side store hydration
- `useDebounce()` - Debounce user input
- `useIntersectionObserver()` - Lazy load on scroll
- `useOptimisticUpdate()` - Optimistic UI updates

**Services** (`/src/app/**/_services/`):
- `admin-service.ts` - Admin operations (validate, transform)
- `portfolio-data.ts` - Data aggregation and transformation
- `rss-fetcher.ts` - External blog RSS feed integration

### 3. Data Layer

**Zustand Stores** (`/src/lib/stores/`):
- `hero-store.ts` - Hero section content
- `about-store.ts` - About page data, journey, values
- `projects-store.ts` - Portfolio projects
- `skills-store.ts` - Skills with categories and proficiency
- `blog-store.ts` - Internal and external blog posts
- `resume-store.ts` - Work experience, education, certifications
- `testimonials-store.ts` - Client testimonials
- `ui-store.ts` - UI state (sidebar open, theme)

**Persistence**:
Each store uses Zustand's `persist` middleware:
```typescript
export const useProjectsStore = create<ProjectsStore>()(
  persist(
    (set, get) => ({
      projects: [],
      addProject: (project) => set(state => ({
        projects: [...state.projects, project]
      })),
    }),
    { name: 'projects-storage' } // localStorage key
  )
);
```

### 4. Utility Layer

**Helpers** (`/src/lib/utils/`, `/src/lib/`):
- `utils.ts` - General utilities (cn, formatDate, etc.)
- `logger/` - Logging infrastructure (Pino)
- `seo/` - SEO utilities (metadata, structured data)
- `i18n/` - Internationalization context and translations

---

## Data Flow

### Current Flow (localStorage)

```
User Action (Admin Panel)
    ↓
Zustand Store Action (addProject, updateProject)
    ↓
Update In-Memory State
    ↓
Persist to localStorage (automatic via middleware)
    ↓
React Re-render (affected components)
    ↓
UI Updates
```

### Read Flow

```
Component Mount
    ↓
useHydration() Hook (wait for client-side hydration)
    ↓
Read from Zustand Store
    ↓
Store reads from localStorage (on first access)
    ↓
Display Data
```

### Future Flow (Database)

```
User Action (Admin Panel)
    ↓
API Route Call (POST /api/projects)
    ↓
Validate Input (Zod schema)
    ↓
Insert to Database (Supabase)
    ↓
Return Response
    ↓
Update Client State (React Query cache)
    ↓
UI Updates
```

---

## State Management

### Zustand Store Pattern

**Why Zustand?**
- ✅ Simple API (no boilerplate like Redux)
- ✅ Small bundle size (~1KB)
- ✅ Built-in persistence
- ✅ TypeScript-first
- ✅ No Context Provider needed

**Store Structure**:
```typescript
type ProjectsStore = {
  // State
  projects: Project[];

  // Actions
  addProject: (project: Project) => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  reorderProjects: (projects: Project[]) => void;
};
```

### Hydration Pattern

**Problem**: Server-rendered components don't have access to localStorage.

**Solution**: `useHydration()` hook waits for client-side hydration:

```typescript
export function useHydration() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated;
}

// Usage in components
function ProjectsList() {
  const isHydrated = useHydration();
  const projects = useProjectsStore(state => state.projects);

  if (!isHydrated) return <Skeleton />;

  return <div>{projects.map(...)}</div>;
}
```

---

## Component Architecture

### Design Patterns

**1. Server Components (Default)**
```typescript
// app/projects/page.tsx
export default async function ProjectsPage() {
  // Can fetch data server-side (future)
  return (
    <main>
      <ProjectsHeader />
      <ProjectsListContainer />  {/* Client component */}
    </main>
  );
}
```

**2. Client Components (Interactive)**
```typescript
// app/admin/projects/page.tsx
'use client';
export default function AdminProjectsPage() {
  const projects = useProjectsStore(state => state.projects);
  const addProject = useProjectsStore(state => state.addProject);

  return <ProjectsEditor projects={projects} onAdd={addProject} />;
}
```

**3. Compound Components**
```typescript
<Card>
  <CardHeader>
    <CardTitle>Project Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Description</p>
  </CardContent>
  <CardFooter>
    <Button>View Project</Button>
  </CardFooter>
</Card>
```

**4. Composition**
```typescript
<DashboardLayout>
  <DashboardHeader>
    <UserGreeting />
    <NotificationBell />
  </DashboardHeader>
  <DashboardContent>
    <StatsGrid />
    <RecentActivity />
  </DashboardContent>
</DashboardLayout>
```

### Component Structure

```
Component/
├── index.ts              # Barrel export
├── ComponentName.tsx     # Main component
├── ComponentName.types.ts # TypeScript types
├── ComponentName.test.tsx # Unit tests
└── subcomponents/        # Child components
    └── SubComponent.tsx
```

### Feature Co-location

```
app/(feature)/
├── page.tsx              # Route page
├── layout.tsx            # Feature layout
├── loading.tsx           # Loading state
├── error.tsx             # Error boundary
├── not-found.tsx         # 404 page
├── _components/          # Feature-specific components
│   ├── ui/               # Pure UI components
│   └── interactive/      # Interactive components
├── _hooks/               # Custom hooks
├── _services/            # Business logic
├── _data/                # Mock data
└── _types/               # TypeScript types
```

---

## Routing Structure

Next.js 16 App Router with route groups:

```
app/
├── layout.tsx              # Root layout (global)
├── page.tsx                # Homepage (/)
├── (home)/                 # Route group (no URL segment)
│   └── _components/        # Homepage components
├── about/
│   └── page.tsx            # /about
├── projects/
│   └── page.tsx            # /projects
├── blog/
│   ├── page.tsx            # /blog
│   └── [slug]/
│       └── page.tsx        # /blog/my-post
├── skills/
│   └── page.tsx            # /skills
├── resume/
│   └── page.tsx            # /resume
└── admin/                  # /admin
    ├── layout.tsx          # Admin layout (sidebar)
    ├── page.tsx            # /admin (dashboard)
    ├── projects/
    │   └── page.tsx        # /admin/projects
    ├── blog/
    │   └── page.tsx        # /admin/blog
    └── skills/
        └── page.tsx        # /admin/skills
```

### Special Files

- `layout.tsx` - Shared layout (persists between navigations)
- `page.tsx` - Route page component
- `loading.tsx` - Loading UI (automatic Suspense boundary)
- `error.tsx` - Error boundary
- `not-found.tsx` - 404 fallback

---

## Internationalization

### Architecture

**Context Provider** (`/src/lib/i18n/translations-context.tsx`):
```typescript
<TranslationsProvider>
  {children}
</TranslationsProvider>
```

**Supported Languages**:
- `en` - English (default)
- `es` - Spanish
- `fr` - French
- `zh` - Chinese
- `ar` - Arabic (RTL support)
- `bn` - Bengali

**Translation Hook**:
```typescript
const { t, language, setLanguage, dir } = useTranslations();

// Usage
<h1>{t('hero.title')}</h1>
<div dir={dir}>{/* RTL-aware layout */}</div>
```

**Translation Key Structure**:
```
feature.component.element
```

Examples:
- `nav.home` - Navigation home link
- `hero.title` - Hero section title
- `about.tab.bio` - About page bio tab
- `projects.filter.all` - Projects filter all button

### RTL Support

Arabic language automatically switches to right-to-left layout:
```typescript
if (language === 'ar') {
  document.documentElement.dir = 'rtl';
} else {
  document.documentElement.dir = 'ltr';
}
```

---

## Performance Strategy

### 1. Code Splitting

**Lazy Loading** with `React.lazy()`:
```typescript
const Charts = lazy(() => import('@/components/Charts'));

<Suspense fallback={<ChartsSkeleton />}>
  <Charts data={data} />
</Suspense>
```

**Dynamic Imports** for Client Components:
```typescript
const CustomCursor = dynamic(
  () => import('@/components/CustomCursor'),
  { ssr: false }
);
```

### 2. Server Components

- **Default to RSC**: No JavaScript sent to client
- **Data fetching**: Server-side (no loading spinners)
- **SEO friendly**: Content rendered on server

### 3. Image Optimization

Use `next/image` with automatic optimization:
```typescript
<Image
  src="/project-screenshot.png"
  alt="Project"
  width={800}
  height={600}
  loading="lazy"
  placeholder="blur"
/>
```

### 4. Caching

**Current**: In-memory via Zustand (instant)

**Future** (with database):
- **React Cache**: Deduplicate requests
- **SWR/React Query**: Stale-while-revalidate
- **Redis**: Server-side caching

### 5. Bundle Size

- **Turbopack**: Fast builds (Next.js 16 default)
- **Tree shaking**: Remove unused code
- **Minimal dependencies**: Keep bundle small

**Current bundle analysis**:
```bash
pnpm build
# Shows page sizes and shared chunks
```

---

## Security Model

### Current Security (v1.0)

⚠️ **Warning**: Admin panel is **publicly accessible** with no authentication.

**Client-Side Only**:
- No sensitive data (all public portfolio content)
- localStorage can be cleared/inspected
- No API secrets or keys exposed

### Future Security (v2.0 - Database)

**Authentication**:
- Supabase Auth or NextAuth.js
- Email/password + OAuth providers
- Session management with HTTP-only cookies

**Authorization**:
- Row Level Security (RLS) in Supabase
- Protect API routes with middleware
- Admin role checks

**Input Validation**:
- Zod schemas on all forms
- Sanitize user inputs (prevent XSS)
- Rate limiting on API routes

**Environment Variables**:
- Never expose secrets in client code
- Use `NEXT_PUBLIC_` prefix only for public values
- Store sensitive keys in Vercel/server environment

---

## Scalability Considerations

### Current Limitations

- ❌ Single-user only (localStorage per browser)
- ❌ No data backup or recovery
- ❌ Limited to ~5-10MB storage
- ❌ No cross-device synchronization
- ❌ No collaboration features

### Scaling to Database

**Phase 1: Add Database**
- Migrate localStorage to PostgreSQL/MongoDB
- Add API routes for CRUD operations
- Implement authentication

**Phase 2: Performance**
- Add caching layer (Redis)
- Implement pagination
- Optimize database queries (indexes)

**Phase 3: Multi-Tenancy** (if needed)
- Support multiple portfolios
- Separate data by user/tenant
- Admin dashboard for multiple sites

### Infrastructure Scaling

**Horizontal Scaling**:
- Next.js deployed to Vercel Edge Network (automatic)
- Database replicas for read scaling
- CDN for static assets

**Vertical Scaling**:
- Increase server resources (RAM, CPU)
- Database performance tuning
- Connection pooling

---

## Architecture Decisions

### Why Next.js 16 App Router?

- ✅ Server Components reduce client JavaScript
- ✅ Streaming and Suspense for better UX
- ✅ File-system based routing (intuitive)
- ✅ Built-in SEO optimization
- ✅ Best-in-class developer experience

### Why Zustand over Redux?

- ✅ 97% smaller bundle size
- ✅ No boilerplate (no actions/reducers/types)
- ✅ Better TypeScript inference
- ✅ Built-in persistence middleware
- ✅ No Context Provider needed

### Why Tailwind CSS?

- ✅ Utility-first (fast development)
- ✅ Small production bundle (purges unused)
- ✅ Consistent design system
- ✅ Mobile-first responsive design
- ✅ Great ecosystem (Shadcn UI)

### Why localStorage (Current)?

- ✅ Zero backend infrastructure
- ✅ Fast performance (no network latency)
- ✅ Simple deployment (static hosting)
- ✅ Perfect for single-user portfolios

**Tradeoff**: Not suitable for production multi-user apps. See [DATABASE.md](./DATABASE.md) for migration guide.

---

## Future Architecture Roadmap

### v2.0: Database Integration
- Add Supabase PostgreSQL
- Implement authentication
- Create API routes
- Migrate data from localStorage

### v2.1: Advanced Features
- Comments system on blog posts
- Contact form with email notifications
- File uploads to Supabase Storage
- Admin dashboard analytics

### v3.0: Multi-Tenancy
- Support multiple portfolios
- Subscription billing (Stripe)
- Custom domain per portfolio
- White-label admin panel

---

## Diagrams

### Component Hierarchy

```
App Layout
├── ThemeProvider
├── TranslationsProvider
├── DataProvider
└── Page
    ├── Header
    │   ├── Navigation
    │   └── LanguageSwitcher
    ├── Main Content
    │   └── Feature Components
    │       ├── Server Components (static)
    │       └── Client Components (interactive)
    └── Footer
```

### Data Flow (Current)

```
Admin Panel (Client)
    ↓
Zustand Action
    ↓
Update Store State
    ↓
Persist to localStorage
    ↓
React Re-render
    ↓
Public Pages (Client)
```

### Data Flow (Future - Database)

```
Admin Panel (Client)
    ↓
API Route (Server)
    ↓
Validate with Zod
    ↓
Database (Supabase)
    ↓
Return Response
    ↓
Update Cache (React Query)
    ↓
Public Pages (Server Components)
```

---

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Server Components](https://react.dev/reference/rsc/server-components)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Shadcn UI Components](https://ui.shadcn.com/)

---

**For migration to database architecture, see [DATABASE.md](./DATABASE.md)**

**For deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)**
