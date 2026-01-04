# Getting Started Guide

Complete step-by-step guide to set up and customize your DynamicFolio CMS portfolio.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Overview](#project-overview)
- [Quick Customization](#quick-customization)
- [Admin Dashboard](#admin-dashboard)
- [Theming](#theming)
- [Adding Content](#adding-content)
- [Local Development](#local-development)
- [Deployment](#deployment)
- [Next Steps](#next-steps)

---

## Prerequisites

Before starting, ensure you have:

| Requirement | Version | Check Command |
|-------------|---------|---------------|
| Node.js | 18.17+ | `node --version` |
| pnpm | 8.0+ | `pnpm --version` |
| Git | Any | `git --version` |

### Install pnpm (if needed)

```bash
npm install -g pnpm
```

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/PranshuBasak/dynamicFolio_CMS.git
cd dynamicFolio_CMS
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Environment

```bash
# Copy example environment file
cp .env.example .env.local
```

Edit `.env.local` with your settings:

```bash
# Required
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME="Your Portfolio"

# Optional - for logging
LOG_LEVEL=debug
```

### 4. Start Development Server

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your portfolio!

---

## Project Overview

### File Structure

```
dynamicFolio_CMS/
├── src/
│   ├── app/              # Pages and routes
│   │   ├── page.tsx      # Homepage
│   │   ├── about/        # About page
│   │   ├── projects/     # Projects page
│   │   ├── blog/         # Blog pages
│   │   ├── skills/       # Skills page
│   │   ├── resume/       # Resume page
│   │   └── admin/        # Admin dashboard
│   ├── components/       # UI components
│   ├── lib/             # Utilities & stores
│   └── features/        # Feature components
├── docs/                # Documentation
└── public/              # Static assets
```

### Key URLs

| Route | Description |
|-------|-------------|
| `/` | Homepage with hero, about preview, projects |
| `/about` | Full about page with bio, journey, values |
| `/projects` | Portfolio projects gallery |
| `/skills` | Skills with categories and proficiency |
| `/blog` | Blog posts (internal + Medium RSS) |
| `/resume` | Work experience, education, certifications |
| `/admin` | Content management dashboard |

---

## Quick Customization

### 1. Update Your Info

Navigate to **`/admin`** and update:

1. **Hero Section**: Your name, title, avatar, CTA buttons
2. **About**: Bio, mission statement, values
3. **Projects**: Add your projects with images and links
4. **Skills**: Add your skills with proficiency levels
5. **Resume**: Work experience and education

### 2. Change Site Branding

Edit `.env.local`:

```bash
NEXT_PUBLIC_SITE_NAME="John Doe - Developer"
NEXT_PUBLIC_SITE_URL=https://johndoe.dev
```

### 3. Update Metadata

Edit `src/app/layout.tsx` for SEO:

```typescript
export const metadata: Metadata = {
  title: 'John Doe - Full Stack Developer',
  description: 'Portfolio showcasing my work in web development',
  // ...
};
```

---

## Admin Dashboard

Access at: [http://localhost:3000/admin](http://localhost:3000/admin)

### Features

| Section | What You Can Do |
|---------|-----------------|
| **Dashboard** | View stats, quick actions |
| **Hero** | Edit name, title, avatar, buttons |
| **About** | Update bio, journey, values |
| **Projects** | Add/edit/reorder projects |
| **Skills** | Manage skills and categories |
| **Blog** | Create and publish posts |
| **Resume** | Add experience, education, certs |
| **Testimonials** | Manage client testimonials |
| **Settings** | Site configuration |

### How Data Works

- **Current**: Data stored in browser `localStorage`
- **Meaning**: Data is unique to your browser/device
- **For production**: See [DATABASE.md](./DATABASE.md) for Supabase setup

---

## Theming

### Dark/Light Mode

Theme toggle is in the navigation. Theme preference is saved automatically.

### Customize Colors

Edit `src/app/globals.css`:

```css
:root {
  --primary: 222.2 47.4% 11.2%;
  --secondary: 210 40% 96%;
  --accent: 210 40% 96%;
  /* ... */
}

.dark {
  --primary: 210 40% 98%;
  --secondary: 217.2 32.6% 17.5%;
  /* ... */
}
```

### Dynamic Primary Color

The admin settings allow changing the primary accent color dynamically.

---

## Adding Content

### Adding a Project

1. Go to `/admin/projects`
2. Click "Add Project"
3. Fill in details:
   - Title
   - Description
   - Tech stack (comma-separated)
   - Live URL
   - GitHub URL
   - Cover image
4. Toggle "Featured" for homepage display
5. Click "Save"

### Adding a Blog Post

1. Go to `/admin/blog`
2. Click "New Post"
3. Write your post in Markdown
4. Add tags and cover image
5. Toggle "Published" when ready
6. Click "Save"

### Adding a Skill

1. Go to `/admin/skills`
2. Click "Add Skill"
3. Enter:
   - Name
   - Category
   - Proficiency (0-100)
   - Icon (optional)
4. Click "Save"

---

## Local Development

### Available Commands

```bash
# Development server (hot reload)
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint
```

### Debugging

- **React DevTools**: Install browser extension
- **Console logs**: Check browser developer console
- **Network tab**: Monitor API requests

### Common Issues

#### Hydration Errors

If you see "Hydration failed" errors:

```typescript
// Use hydration hook before accessing stores
import { useHydration } from '@/lib/hooks/use-hydration';

function MyComponent() {
  const isHydrated = useHydration();
  if (!isHydrated) return <Skeleton />;
  // ...
}
```

#### Empty Data

Clear localStorage and refresh:

```javascript
// In browser console
localStorage.clear();
location.reload();
```

---

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables
5. Deploy!

```bash
# Or use Vercel CLI
npx vercel
```

### Environment Variables for Production

```bash
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_NAME="Your Portfolio"
LOG_LEVEL=info
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

---

## Next Steps

### Personalization

1. ✅ Update all content via admin dashboard
2. ✅ Customize colors and theme
3. ✅ Add your projects and skills
4. ✅ Connect external blog (Medium RSS)

### Production Setup

1. 📦 Set up Supabase for database persistence - [DATABASE.md](./DATABASE.md)
2. 🔐 Add authentication for admin panel
3. 🚀 Deploy to Vercel - [DEPLOYMENT.md](./DEPLOYMENT.md)
4. 📊 Set up analytics

### Documentation

- [Architecture Overview](./ARCHITECTURE.md)
- [State Management](./STORES.md)
- [UI Components](./COMPONENTS.md)
- [Internationalization](./I18N.md)
- [API Reference](./API.md)
- [Contributing](./CONTRIBUTING.md)

---

## Getting Help

- **GitHub Issues**: [Report bugs or request features](https://github.com/PranshuBasak/dynamicFolio_CMS/issues)
- **Documentation**: Browse the `/docs` folder
- **Email**: [pranshubasak@gmail.com](mailto:pranshubasak@gmail.com)

---

**Happy coding! 🚀**
