# Projects Gallery

The portfolio showcase.

- **Route**: `/projects`
- **Store**: `projects-store.ts`

## Features

- **Filtering**: Filter by Tech Stack (e.g., "React", "Node.js").
- **Featured**: Highlight top projects on the Home page.
- **Links**: GitHub and Live Demo links.
- **Gallery**: Screenshots carousel (in Project Details).

## Data Model

```typescript
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

## Implementation Details

- **Masonry Layout**: Uses a responsive grid that adapts to image aspect ratios.
- **Animations**: `Framer Motion` for layout transitions when filtering.
