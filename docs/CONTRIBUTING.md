# Contributing Guidelines

Thank you for your interest in contributing to DynamicFolio CMS! This guide will help you get started.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Project Structure](#project-structure)

---

## Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please:

- Be respectful and considerate
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Accept differing viewpoints gracefully

---

## Getting Started

### Prerequisites

- **Node.js** 18.17 or later
- **pnpm** 8.0 or later (recommended)
- **Git** for version control

### Setup

1. **Fork the repository** on GitHub

2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/dynamicFolio_CMS.git
   cd dynamicFolio_CMS
   ```

3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/PranshuBasak/dynamicFolio_CMS.git
   ```

4. **Install dependencies**:
   ```bash
   pnpm install
   ```

5. **Create environment file**:
   ```bash
   cp .env.example .env.local
   ```

6. **Start development server**:
   ```bash
   pnpm dev
   ```

---

## Development Workflow

### Branching Strategy

```
main           ← Production-ready code
├── develop    ← Integration branch
├── feature/*  ← New features
├── fix/*      ← Bug fixes
└── docs/*     ← Documentation updates
```

### Creating a Branch

```bash
# Sync with upstream
git fetch upstream
git checkout main
git merge upstream/main

# Create feature branch
git checkout -b feature/your-feature-name
```

### Making Changes

1. Make your changes in small, focused commits
2. Test your changes locally
3. Ensure code passes linting: `pnpm lint`
4. Run type check: `pnpm run type-check` (if available)

### Syncing with Upstream

```bash
git fetch upstream
git rebase upstream/main
```

---

## Code Standards

### TypeScript

- **Strict mode enabled** - No `any` types unless absolutely necessary
- **Explicit return types** for functions
- **Type all props** for React components

```typescript
// ✅ Good
interface ProjectCardProps {
  project: Project;
  onEdit: (id: string) => void;
}

function ProjectCard({ project, onEdit }: ProjectCardProps): JSX.Element {
  // ...
}

// ❌ Bad
function ProjectCard(props: any) {
  // ...
}
```

### React Components

- **Server Components by default** - Add `"use client"` only when needed
- **Functional components** - No class components
- **Custom hooks** for reusable logic

```typescript
// ✅ Prefer Server Components
export default function ProjectsPage() {
  return <ProjectsList />
}

// ✅ Client only when necessary
'use client';
export function InteractiveForm() {
  const [state, setState] = useState();
  // ...
}
```

### File Naming

- **kebab-case** for files: `use-hydration.ts`, `project-card.tsx`
- **PascalCase** for components: `ProjectCard`
- **camelCase** for functions/variables: `handleSubmit`, `isLoading`

### Imports

Order imports logically:
1. React/Next.js imports
2. Third-party libraries
3. Internal modules (absolute paths)
4. Relative imports
5. Types

```typescript
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { useProjectsStore } from '@/lib/stores/projects-store';

import { ProjectCard } from './project-card';

import type { Project } from '@/lib/stores/projects-store';
```

### Styling

- **Tailwind CSS** for styling
- Use `cn()` utility for conditional classes
- Follow mobile-first responsive design

```typescript
import { cn } from '@/lib/utils';

<div className={cn(
  "base-classes",
  isActive && "active-classes",
  className
)} />
```

---

## Commit Guidelines

### Commit Message Format

```
type(scope): short description

[optional body]

[optional footer]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no code change |
| `refactor` | Code change that neither fixes nor adds |
| `perf` | Performance improvement |
| `test` | Adding tests |
| `chore` | Maintenance tasks |

### Examples

```bash
feat(projects): add drag-and-drop reordering

fix(i18n): correct Arabic RTL layout

docs(readme): update installation instructions

refactor(stores): simplify project store actions
```

### Rules

- Use present tense: "add feature" not "added feature"
- Use lowercase
- Keep first line under 72 characters
- Reference issues: `Fixes #123`

---

## Pull Request Process

### Before Submitting

1. ✅ Code follows style guide
2. ✅ All tests pass (if applicable)
3. ✅ Linting passes: `pnpm lint`
4. ✅ Types check: `pnpm run type-check`
5. ✅ Documentation updated (if needed)
6. ✅ Meaningful commit messages

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Fixes #(issue number)

## Screenshots (if applicable)

## Testing
Describe how you tested your changes

## Checklist
- [ ] Code follows project style
- [ ] Self-reviewed code
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] No new warnings
```

### Review Process

1. Submit PR to `main` branch
2. Maintainer reviews within 48 hours
3. Address feedback if requested
4. PR merged after approval

---

## Issue Guidelines

### Bug Reports

Include:
- **Environment**: OS, browser, Node version
- **Steps to reproduce**
- **Expected behavior**
- **Actual behavior**
- **Screenshots/logs** if applicable

### Feature Requests

Include:
- **Problem description**: What problem does this solve?
- **Proposed solution**: How should it work?
- **Alternatives considered**
- **Additional context**

### Issue Labels

| Label | Description |
|-------|-------------|
| `bug` | Something isn't working |
| `enhancement` | New feature request |
| `documentation` | Docs improvement |
| `good first issue` | Great for newcomers |
| `help wanted` | Extra attention needed |
| `question` | Further info requested |

---

## Project Structure

```
dynamicFolio_CMS/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── (home)/          # Homepage sections
│   │   ├── admin/           # Admin dashboard
│   │   ├── api/             # API routes
│   │   └── [page]/          # Public pages
│   ├── components/          # Reusable components
│   │   ├── ui/              # Base UI components
│   │   └── providers/       # Context providers
│   ├── features/            # Feature-specific components
│   ├── lib/                 # Utilities
│   │   ├── stores/          # Zustand stores
│   │   ├── i18n/            # Translations
│   │   ├── hooks/           # Custom hooks
│   │   └── utils/           # Helper functions
│   └── data/                # Mock data
├── docs/                    # Documentation
├── public/                  # Static assets
└── package.json
```

### Key Files

| File | Purpose |
|------|---------|
| `src/app/layout.tsx` | Root layout with providers |
| `src/lib/stores/*.ts` | Zustand state stores |
| `src/lib/i18n/translations-context.tsx` | i18n system |
| `src/components/ui/*.tsx` | Shadcn UI components |

---

## Getting Help

- **Documentation**: Check the [docs](./README.md) folder
- **Issues**: Search existing issues first
- **Discussions**: Use GitHub Discussions for questions
- **Contact**: [pranshubasak@gmail.com](mailto:pranshubasak@gmail.com)

---

## Recognition

Contributors are recognized in:
- README.md contributors section
- Release notes
- GitHub contributors page

---

Thank you for contributing! 🎉
