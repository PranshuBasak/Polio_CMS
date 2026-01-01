# State Management - Zustand Stores

Complete reference for all Zustand stores used in DynamicFolio CMS.

## Table of Contents
- [Overview](#overview)
- [Store Architecture](#store-architecture)
- [Available Stores](#available-stores)
- [Usage Patterns](#usage-patterns)
- [Hydration Handling](#hydration-handling)
- [Type Definitions](#type-definitions)

---

## Overview

DynamicFolio CMS uses **Zustand** for state management with localStorage persistence. This architecture enables:

- ✅ Client-side data persistence without a backend
- ✅ Real-time updates across components
- ✅ Type-safe state management with TypeScript
- ✅ Zero-config deployment (static hosting compatible)

### Why Zustand?

| Feature | Zustand | Redux | Context API |
|---------|---------|-------|-------------|
| Bundle Size | ~1KB | ~5KB | 0 (built-in) |
| Boilerplate | Minimal | High | Medium |
| Persistence | Built-in | Addon | Manual |
| TypeScript | Excellent | Good | Good |
| Provider Required | No | Yes | Yes |

---

## Store Architecture

All stores follow a consistent pattern:

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type StoreState = {
  // Data
  items: Item[];
  
  // Actions
  addItem: (item: Item) => void;
  updateItem: (id: string, data: Partial<Item>) => void;
  deleteItem: (id: string) => void;
  reorderItems: (items: Item[]) => void;
};

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => set(state => ({
        items: [...state.items, item]
      })),
      // ... other actions
    }),
    { name: 'store-key' }
  )
);
```

---

## Available Stores

### 1. `useHeroStore`
**File**: `src/lib/stores/hero-store.ts`  
**localStorage Key**: `hero-storage`

Manages hero section content.

```typescript
interface HeroStore {
  name: string;
  title: string;
  description: string;
  avatarUrl: string;
  primaryButtonText: string;
  primaryButtonUrl: string;
  secondaryButtonText: string;
  secondaryButtonUrl: string;
  
  updateHero: (data: Partial<HeroData>) => void;
}
```

**Usage**:
```typescript
const { name, title, updateHero } = useHeroStore();
```

---

### 2. `useAboutStore`
**File**: `src/lib/stores/about-store.ts`  
**localStorage Key**: `about-storage`

Manages about page data including bio, journey, and values.

```typescript
interface AboutStore {
  bio: string;
  mission: string;
  journey: JourneyItem[];
  values: Value[];
  
  updateBio: (bio: string) => void;
  updateMission: (mission: string) => void;
  addJourneyItem: (item: JourneyItem) => void;
  updateJourneyItem: (id: string, data: Partial<JourneyItem>) => void;
  deleteJourneyItem: (id: string) => void;
  addValue: (value: Value) => void;
  updateValue: (id: string, data: Partial<Value>) => void;
  deleteValue: (id: string) => void;
}
```

---

### 3. `useProjectsStore`
**File**: `src/lib/stores/projects-store.ts`  
**localStorage Key**: `projects-storage`

Manages portfolio projects.

```typescript
interface ProjectsStore {
  projects: Project[];
  
  addProject: (project: Project) => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  reorderProjects: (projects: Project[]) => void;
  toggleFeatured: (id: string) => void;
}

interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  imageUrl?: string;
  featured: boolean;
  orderIndex: number;
  createdAt: string;
}
```

---

### 4. `useSkillsStore`
**File**: `src/lib/stores/skills-store.ts`  
**localStorage Key**: `skills-storage`

Manages skills with categories.

```typescript
interface SkillsStore {
  skills: Skill[];
  categories: SkillCategory[];
  
  addSkill: (skill: Skill) => void;
  updateSkill: (id: string, data: Partial<Skill>) => void;
  deleteSkill: (id: string) => void;
  reorderSkills: (skills: Skill[]) => void;
  addCategory: (category: SkillCategory) => void;
  updateCategory: (id: string, data: Partial<SkillCategory>) => void;
  deleteCategory: (id: string) => void;
}

interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number; // 0-100
  icon?: string;
  orderIndex: number;
}
```

---

### 5. `useBlogStore`
**File**: `src/lib/stores/blog-store.ts`  
**localStorage Key**: `blog-storage`

Manages internal blog posts.

```typescript
interface BlogStore {
  posts: BlogPost[];
  
  addPost: (post: BlogPost) => void;
  updatePost: (id: string, data: Partial<BlogPost>) => void;
  deletePost: (id: string) => void;
  togglePublished: (id: string) => void;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  tags: string[];
  published: boolean;
  publishedAt?: string;
  createdAt: string;
}
```

---

### 6. `useResumeStore`
**File**: `src/lib/stores/resume-store.ts`  
**localStorage Key**: `resume-storage`

Manages resume data: experiences, education, certifications.

```typescript
interface ResumeStore {
  experiences: Experience[];
  education: Education[];
  certifications: Certification[];
  
  // Experience actions
  addExperience: (exp: Experience) => void;
  updateExperience: (id: string, data: Partial<Experience>) => void;
  deleteExperience: (id: string) => void;
  
  // Education actions
  addEducation: (edu: Education) => void;
  updateEducation: (id: string, data: Partial<Education>) => void;
  deleteEducation: (id: string) => void;
  
  // Certification actions
  addCertification: (cert: Certification) => void;
  updateCertification: (id: string, data: Partial<Certification>) => void;
  deleteCertification: (id: string) => void;
}
```

---

### 7. `useTestimonialsStore`
**File**: `src/lib/stores/testimonials-store.ts`  
**localStorage Key**: `testimonials-storage`

Manages client testimonials.

```typescript
interface TestimonialsStore {
  testimonials: Testimonial[];
  
  addTestimonial: (testimonial: Testimonial) => void;
  updateTestimonial: (id: string, data: Partial<Testimonial>) => void;
  deleteTestimonial: (id: string) => void;
  toggleFeatured: (id: string) => void;
}

interface Testimonial {
  id: string;
  clientName: string;
  clientRole: string;
  clientCompany: string;
  clientAvatar?: string;
  content: string;
  rating: number; // 1-5
  featured: boolean;
  createdAt: string;
}
```

---

### 8. `useSiteSettingsStore`
**File**: `src/lib/stores/site-settings-store.ts`  
**localStorage Key**: `site-settings-storage`

Manages global site configuration.

```typescript
interface SiteSettingsStore {
  siteName: string;
  siteDescription: string;
  primaryColor: string;
  logoUrl?: string;
  faviconUrl?: string;
  socialLinks: SocialLink[];
  
  updateSettings: (settings: Partial<SiteSettings>) => void;
  addSocialLink: (link: SocialLink) => void;
  updateSocialLink: (id: string, data: Partial<SocialLink>) => void;
  deleteSocialLink: (id: string) => void;
}
```

---

### 9. `useUIStore`
**File**: `src/lib/stores/ui-store.ts`  
**localStorage Key**: `ui-storage`

Manages UI state and preferences.

```typescript
interface UIStore {
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}
```

---

## Usage Patterns

### Reading State

```typescript
// Select specific values (recommended)
const name = useHeroStore(state => state.name);
const projects = useProjectsStore(state => state.projects);

// Select multiple values
const { name, title } = useHeroStore(state => ({
  name: state.name,
  title: state.title
}));
```

### Calling Actions

```typescript
// Get action directly
const addProject = useProjectsStore(state => state.addProject);

// Call action
const handleAdd = () => {
  addProject({
    id: nanoid(),
    title: 'New Project',
    // ...
  });
};
```

### With Computed Values

```typescript
// Filter/transform in selector
const featuredProjects = useProjectsStore(
  state => state.projects.filter(p => p.featured)
);

const publishedPosts = useBlogStore(
  state => state.posts.filter(p => p.published)
);
```

---

## Hydration Handling

Since stores persist to localStorage, Server Components cannot access the data. Use the hydration pattern:

```typescript
import { useHydration } from '@/lib/hooks/use-hydration';

function ProjectsList() {
  const isHydrated = useHydration();
  const projects = useProjectsStore(state => state.projects);
  
  // Show skeleton until hydrated
  if (!isHydrated) {
    return <ProjectsSkeleton />;
  }
  
  return (
    <div>
      {projects.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
```

### The `useHydration` Hook

```typescript
// src/lib/hooks/use-hydration.ts
import { useState, useEffect } from 'react';

export function useHydration() {
  const [hydrated, setHydrated] = useState(false);
  
  useEffect(() => {
    setHydrated(true);
  }, []);
  
  return hydrated;
}
```

---

## Type Definitions

All store types are exported from their respective files:

```typescript
import type { Project } from '@/lib/stores/projects-store';
import type { BlogPost } from '@/lib/stores/blog-store';
import type { Skill, SkillCategory } from '@/lib/stores/skills-store';
import type { Experience, Education } from '@/lib/stores/resume-store';
import type { Testimonial } from '@/lib/stores/testimonials-store';
```

---

## Migration to Database

When migrating to a database backend:

1. Replace localStorage persistence with API calls
2. Keep the same store interface for backward compatibility
3. Add loading and error states
4. See [DATABASE.md](./DATABASE.md) for complete migration guide

```typescript
// Future pattern with API
addProject: async (project) => {
  const response = await fetch('/api/projects', {
    method: 'POST',
    body: JSON.stringify(project),
  });
  const data = await response.json();
  set(state => ({ projects: [...state.projects, data] }));
}
```

---

## Additional Resources

- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [Architecture Overview](./ARCHITECTURE.md)
- [Database Migration](./DATABASE.md)
