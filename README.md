# 🚀 DynamicFolio CMS

> **Your portfolio, your way — no backend required.**

A dynamic portfolio CMS built with Next.js 16 that empowers developers to manage their entire portfolio content through an intuitive admin dashboard. Features real-time Medium blog integration, multi-language support (6 languages), and localStorage persistence—no database required.

[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Quick Start

### Prerequisites
- **Node.js** 18.17 or later
- **pnpm** 8.0 or later (recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/PranshuBasak/dynamicFolio_CMS
cd dynamicFolio_CMS

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local

# Run development server
pnpm dev
```

Visit `http://localhost:3000` to see your portfolio.

## Features

- **🎨 Portfolio Sections**: Hero, About, Projects, Skills, Blog, Resume, Testimonials.
- **️ Admin Dashboard**: Drag & drop, form validation, real-time preview.
- **🌍 Internationalization**: 6 languages supported (English, Spanish, French, Chinese, Arabic, Bengali).
- **🚀 Performance**: Next.js 15 App Router, Lazy Loading, Dynamic Sitemap.
- **🎯 Developer Experience**: TypeScript, Tailwind CSS, Shadcn UI, Framer Motion.

## Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_SITE_URL` | Your site URL | `http://localhost:3000` |
| `NEXT_PUBLIC_SITE_NAME` | Site title | "Your Portfolio" |
| `LOG_LEVEL` | Logging level | `debug` |
| `DATABASE_URL` | Supabase connection string | - |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase URL | - |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anon Key | - |

See [.env.example](./.env.example) for all options.

## Documentation

- [API Reference](./docs/API.md)
- [Architecture](./docs/ARCHITECTURE.md)
- [Components](./docs/COMPONENTS.md)
- [Database](./docs/DATABASE.md)
- [Deployment](./docs/DEPLOYMENT.md)
- [Contributing](./docs/CONTRIBUTING.md)

## License

MIT
