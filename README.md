# DynamicFolio CMS

DynamicFolio CMS is a full-stack portfolio platform built with Next.js 16, React 19, Supabase, and Tailwind CSS.

It includes a public portfolio experience, a protected admin dashboard, an interactive terminal with AI mode, and content workflows for projects, skills, blog, resume, and site settings.

## Live Feature Set (Currently Implemented)

### Public Portfolio
- Home page with Hero, Terminal, About, Projects, Skills, Experience timeline, Blog, and Contact sections.
- Dedicated pages for `about`, `projects`, `skills`, `blog`, `resume`, `resume/print`, `privacy-policy`, and `terms-and-conditions`.
- Project explorer with search/filtering, category grouping, and project detail modal.
- Blog experience with internal posts and external posts.
- Resume experience with section switching and print-optimized export page.
- Multi-language UI support: `en`, `es`, `fr`, `zh`, `ar`, `bn` with RTL support for Arabic.

### Interactive Terminal
- Command-driven terminal section with multiple modes.
- AI Agent mode powered by `/api/chat`.
- Utility commands: weather, news, joke, contact, and system diagnostics.
- Interactive experiences: matrix story mode and snake game mode.

### Admin Dashboard (Protected)
- Supabase-auth gated admin routes (`/admin/*`) with login flow.
- Content management for:
  - Hero
  - About (bio, journey, values)
  - Projects
  - Skills and skill categories
  - Blog (internal posts + RSS import)
  - Resume (general, experience, education, skills, certifications)
  - Site settings and language settings
  - AI assistant runtime/settings
- Dashboard widgets with content and analytics summaries.

### Backend/API
- Supabase-backed stores for core content entities.
- Contact submission pipeline:
  - Input validation with Zod
  - Database write to `contact_submissions`
  - Owner notification + auto-reply via Nodemailer/Gmail SMTP
- AI chat API (`/api/chat`) with streaming responses and tool-based portfolio DB querying.
- RSS integrations:
  - Medium feed endpoint
  - Admin RSS import action
- Terminal APIs for weather, news, joke, and contact.
- Cloudinary upload signature endpoint.
- Health check endpoint for runtime/system pings.

### SEO, Analytics, and UX
- Runtime metadata and SEO settings from Supabase with safe fallbacks.
- JSON-LD structured data for person/website/blog schemas.
- Dynamic `robots` and `sitemap` generation.
- Page-view tracking into Supabase.
- Theme support (light/dark/system) plus dynamic primary color from settings.

## Tech Stack

- Framework: Next.js 16 (App Router), React 19, TypeScript
- Styling/UI: Tailwind CSS v4, Radix UI, custom UI components, Framer Motion, GSAP
- State: Zustand
- Backend/Data: Supabase (Auth + Postgres)
- Media: Cloudinary (`next-cloudinary`)
- AI: Vercel AI SDK + Google provider
- Validation: Zod
- Email: Nodemailer
- Analytics: Vercel Analytics + custom page view tracking

## Route Map

### Public Routes
- `/`
- `/about`
- `/projects`
- `/skills`
- `/blog`
- `/blog/[slug]`
- `/resume`
- `/resume/print`
- `/privacy-policy`
- `/terms-and-conditions`
- `/login`

### Admin Routes
- `/admin`
- `/admin/hero`
- `/admin/about`
- `/admin/projects`
- `/admin/projects/new`
- `/admin/projects/edit/[id]`
- `/admin/skills`
- `/admin/skills/new`
- `/admin/skills/edit/[id]`
- `/admin/skills/categories`
- `/admin/blog`
- `/admin/blog/new`
- `/admin/blog/edit/[id]`
- `/admin/resume`
- `/admin/settings`

## API Endpoints

- `POST /api/chat`
- `POST /api/contact`
- `POST /api/terminal/contact`
- `GET  /api/terminal/news`
- `GET  /api/terminal/weather`
- `GET  /api/terminal/joke`
- `GET  /api/blog/fetch-medium`
- `POST /api/sign-cloudinary-params`
- `GET  /api/health`

## Local Setup

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment

Create `.env.local` from `.env.example` and set required values:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
CONTACT_SMTP_USER=
CONTACT_SMTP_PASS=
CONTACT_NOTIFICATION_EMAIL=
CONTACT_AUTOREPLY_FROM_NAME=
```

### 3. Run development server

```bash
pnpm dev
```

### 4. Optional docs app

```bash
pnpm docs:dev
```

## Scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm docs:dev
pnpm docs:build
pnpm docs:start
```

## Data + Schema

- Supabase types: `src/lib/types/supabase.ts`
- SQL schema: `docs/schema/postgresql.sql`
- Migrations: `docs/schema/migrations/`

## Notes

- The admin area is protected via Supabase session checks and middleware/proxy guards.
- If environment variables are missing, several runtime features will gracefully degrade to defaults.
- Rotate secrets immediately if credentials were ever exposed in logs, commits, or screenshots.

## License

MIT
