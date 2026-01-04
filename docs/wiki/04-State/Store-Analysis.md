# Store Analysis

A breakdown of all 10 Zustand stores in `src/lib/stores`.

| Store File | Storage Key | Purpose |
| :--- | :--- | :--- |
| `about-store.ts` | `about-storage` | Bio, Journey, Values. |
| `blog-store.ts` | `blog-storage` | Internal blog posts. |
| `hero-store.ts` | `hero-storage` | Hero section content (Avatar, Title). |
| `projects-store.ts` | `projects-storage` | Portfolio projects. |
| `resume-store.ts` | `resume-storage` | Experience, Education, Certs. |
| `site-settings-store.ts`| `site-settings-storage` | Global config (Name, SEO). |
| `skills-store.ts` | `skills-storage` | Skills & Categories. |
| `testimonials-store.ts` | `testimonials-storage` | Client reviews. |
| `ui-store.ts` | `ui-storage` | Sidebar state, Theme preference. |
| `contact-store.ts` | `contact-storage` | Form submissions (local only). |

## Key Stores

### `projects-store.ts`
- **State**: `projects: Project[]`
- **Actions**: `addProject`, `updateProject`, `deleteProject`, `reorderProjects`.
- **Logic**: Handles reordering via `orderIndex`.

### `site-settings-store.ts`
- **State**: `settings: SiteSettings`
- **Actions**: `updateSettings`, `resetSettings`.
- **Importance**: Controls the entire site's branding and SEO. Defaults are loaded if storage is empty.

### `ui-store.ts`
- **State**: `sidebarOpen: boolean`, `theme: 'light' | 'dark' | 'system'`.
- **Actions**: `toggleSidebar`, `setTheme`.
- **Note**: Theme is also managed by `next-themes`, this store syncs with it.
