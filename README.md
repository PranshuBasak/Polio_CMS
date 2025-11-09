# Portfolio CMS - Modern Next.js Portfolio Website

A feature-rich, multi-language portfolio CMS built with Next.js 16, React 19, and TypeScript. This project provides a complete portfolio website with an admin dashboard for content management, internationalization support for 6 languages, and production-ready features.

## ✨ Features

### 🎨 Portfolio Sections
- **Hero Section** - Animated introduction with glowing avatar and call-to-action buttons
- **About Page** - Personal bio, journey timeline, and core values
- **Projects** - Showcase portfolio projects with images, tech stack, and live/GitHub links
- **Skills** - Categorized skill display with proficiency levels and visual progress bars
- **Blog** - Internal blog posts + external RSS feed integration (DEV.to, Medium, Hashnode)
- **Resume** - Complete work experience, education, and certifications
- **Testimonials** - Client testimonials with ratings and photos

### 🛠️ Admin Dashboard
- **Content Management** - Edit all portfolio content through intuitive admin UI
- **Drag & Drop** - Reorder items with `@hello-pangea/dnd`
- **Form Validation** - Zod schemas for data integrity
- **Image Management** - Upload and organize portfolio images
- **Real-time Preview** - See changes immediately with Zustand state management

### 🌍 Internationalization
- **6 Languages Supported**: English, Spanish, French, Chinese, Arabic, Bengali
- **RTL Support** - Automatic right-to-left layout for Arabic
- **600+ Translation Keys** - Comprehensive language coverage
- **Language Switcher** - Easy language selection in navigation

### 🚀 Performance & SEO
- **Server Components** - Next.js 15 App Router with React Server Components
- **Lazy Loading** - Code splitting with `React.lazy()` and `Suspense`
- **Dynamic Sitemap** - Auto-generated XML sitemap from content
- **Structured Data** - JSON-LD for rich snippets (Person, Website, BlogPosting)
- **OpenGraph & Twitter Cards** - Social media preview optimization
- **Vercel Analytics** - Integrated web analytics

### 🎯 Developer Experience
- **TypeScript** - Full type safety with strict mode
- **Tailwind CSS** - Utility-first styling with custom theme
- **Shadcn UI** - Beautiful, accessible component library
- **Framer Motion** - Smooth animations and transitions
- **Pino Logger** - Production-grade structured logging
- **ESLint & Prettier** - Code quality enforcement

## 📦 Tech Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | Next.js 16, React 19, TypeScript |
| **State Management** | Zustand with localStorage persistence |
| **Styling** | Tailwind CSS, Shadcn UI, Framer Motion |
| **Forms** | Zod validation, React Hook Form patterns |
| **Internationalization** | Custom i18n context with 6 languages |
| **Icons** | Lucide React |
| **Animations** | Framer Motion, CSS animations |
| **Analytics** | Vercel Analytics |
| **Logging** | Pino (server), custom client logger |
| **Data Storage** | localStorage (development), Supabase-ready (production) |

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18.17 or later
- **pnpm** 8.0 or later (recommended) or npm/yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd sec

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local

# Run development server
pnpm dev
```

Visit `http://localhost:3000` to see your portfolio.

### Development Commands

```bash
# Development
pnpm dev          # Start dev server on http://localhost:3000

# Production
pnpm build        # Build for production
pnpm start        # Start production server

# Code Quality
pnpm lint         # Run ESLint
pnpm lint:fix     # Fix ESLint errors
pnpm type-check   # Run TypeScript check
```

## 📂 Project Structure

```
sec/
├── public/               # Static assets (images, fonts)
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── (home)/       # Homepage sections
│   │   ├── admin/        # Admin dashboard pages
│   │   ├── about/        # About page
│   │   ├── blog/         # Blog pages
│   │   ├── projects/     # Projects page
│   │   ├── resume/       # Resume page
│   │   └── skills/       # Skills page
│   ├── components/       # Reusable components
│   │   ├── ui/           # Shadcn UI components
│   │   └── providers/    # Context providers
│   ├── features/         # Feature-specific components
│   ├── lib/              # Utilities and configurations
│   │   ├── stores/       # Zustand state stores
│   │   ├── i18n/         # Internationalization
│   │   ├── logger/       # Logging utilities
│   │   └── seo/          # SEO utilities
│   ├── data/             # Mock data and constants
│   └── hooks/            # Custom React hooks
├── docs/                 # Documentation
│   ├── DATABASE.md       # Database setup guide
│   ├── DEPLOYMENT.md     # Deployment instructions
│   └── ARCHITECTURE.md   # System architecture
└── .env.example          # Environment variables template
```

## 🗄️ Current Architecture

### State Management
This project uses **Zustand** with **localStorage persistence** for client-side state management. All portfolio data is stored in the browser's localStorage, making it perfect for:
- ✅ Single-user portfolios
- ✅ Static site deployment
- ✅ No backend required
- ✅ Fast performance

**Available Stores:**
- `useHeroStore` - Hero section content
- `useAboutStore` - About page data, journey, values
- `useProjectsStore` - Portfolio projects
- `useSkillsStore` - Skills with categories
- `useBlogStore` - Internal and external blog posts
- `useResumeStore` - Work experience, education, certifications
- `useTestimonialsStore` - Client testimonials
- `useUIStore` - UI state (sidebar, theme)

### Limitations
❌ **Not suitable for:**
- Multi-user scenarios (data shared across browsers)
- Production apps with real authentication
- Dynamic content that needs server persistence

### Upgrading to Database
See [docs/DATABASE.md](./docs/DATABASE.md) for migration guide to Supabase or other databases.

## 🔑 Environment Variables

Create a `.env.local` file in the project root:

```bash
# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME="Your Portfolio"

# Logging
LOG_LEVEL=debug

# Database (optional - for production upgrade)
DATABASE_URL=

# Supabase (optional)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Contact Form (optional)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
CONTACT_EMAIL=

# Analytics (optional)
NEXT_PUBLIC_GA_ID=
```

See [.env.example](./.env.example) for complete reference.

## 🎨 Customization

### Editing Content
Navigate to `http://localhost:3000/admin` to access the admin dashboard. From there you can:
- Edit hero section text and buttons
- Manage projects with images and links
- Add/edit blog posts
- Update skills with proficiency levels
- Modify resume experiences
- Manage testimonials

### Styling
- **Theme Colors**: Edit `tailwind.config.ts`
- **Global Styles**: Edit `src/app/globals.css`
- **Component Styles**: Use Tailwind classes or Shadcn UI variants

### Translations
Add or modify translations in:
```
src/lib/i18n/translations-context.tsx
```

### Logging
```typescript
// Server Components / API Routes
import { serverLogger } from '@/lib/logger';

serverLogger.info('User created', { userId: '123' });
serverLogger.error('Database error', error, { query: 'SELECT...' });

// Client Components
import { clientLogger } from '@/lib/logger';

clientLogger.info('Button clicked');
clientLogger.error('Form submission failed', error);
clientLogger.trackEvent('Purchase', { amount: 99 });
```

## 📦 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in [Vercel Dashboard](https://vercel.com)
3. Add environment variables
4. Deploy automatically

See [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) for detailed deployment guide including:
- Custom domain setup
- Environment configuration
- Performance optimization
- Docker deployment

## 🗄️ Adding Database (Production)

The current architecture uses localStorage for simplicity. For production with multi-user support:

1. **Read the migration guide**: [docs/DATABASE.md](./docs/DATABASE.md)
2. **Choose a database**: Supabase (recommended), Vercel Postgres, MongoDB
3. **Run migration scripts**: Convert localStorage data to database format
4. **Add API routes**: Replace direct store access with API calls
5. **Implement authentication**: Add NextAuth.js or Supabase Auth

**Quick Migration Path:**
```bash
# Install Supabase client
pnpm add @supabase/supabase-js

# Run database schema
psql -f docs/schema/postgresql.sql

# Update environment variables
# See docs/DATABASE.md for step-by-step guide
```

## 🛠️ Troubleshooting

### Hydration Errors
If you see "Hydration failed" errors:
- Use `useHydration()` hook before accessing Zustand stores
- Check for server/client mismatch in components
- Ensure `"use client"` directive on interactive components

### Empty Data on Admin Pages
- Clear browser localStorage: `localStorage.clear()`
- Check DataProvider wrapper in admin layout
- Verify store initialization in `/src/lib/stores/index.ts`

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Type check
pnpm run type-check
```

## 📚 Documentation

- **[DATABASE.md](./docs/DATABASE.md)** - Database setup and migration guide
- **[DEPLOYMENT.md](./docs/DEPLOYMENT.md)** - Deployment instructions
- **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - System architecture overview
- **[Copilot Instructions](./.github/copilot-instructions.md)** - AI agent development guide

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Standards
- Follow existing code style
- Write TypeScript types for all functions
- Use Server Components by default, `"use client"` only when needed
- Add comments for complex logic
- Run `pnpm lint` before committing

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Shadcn UI](https://ui.shadcn.com/) - Component library
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Zustand](https://zustand-demo.pmnd.rs/) - State management
- [Pino](https://getpino.io/) - Logging
- [Framer Motion](https://www.framer.com/motion/) - Animations

## 📧 Support

For questions or issues:
- Open an issue on GitHub
- Contact: [your-email@example.com]
- Documentation: [docs/](./docs/)

---

**Built with ❤️ using Next.js 16 and React 19**
