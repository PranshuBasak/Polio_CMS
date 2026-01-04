# ProjectsClient Component

**Path**: `src/features/projects/components/projects-client.tsx`

## Purpose
`ProjectsClient` is the main entry point for the Projects section on the public site. It acts as a **Client Component Wrapper** that handles:
1.  **Internationalization**: Translating section titles and descriptions.
2.  **Animation**: Entry animations using `framer-motion`.
3.  **Layout**: Centering and spacing the content.

## Architecture Connection
-   **Page Wrapper**: Used by `src/app/projects/page.tsx` (or the Home page sections).
-   **Composition**: Wraps `ProjectsGrid` (which renders `ProjectCard`s).

## Code Analysis

### 1. Internationalization
```tsx
export function ProjectsClient({ projects }: ProjectsClientProps) {
  const { t } = useTranslations();
  
  return (
    // ...
    <h2 className="section-heading">{t('projects.title')}</h2>
    <p>{t('projects.description')}</p>
  )
}
```
-   **Context**: Consumes `TranslationsContext` to render text in the active language.

### 2. Animation Wrapper
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5 }}
>
```
-   **Effect**: The section fades in and slides up when it scrolls into view.
-   **Performance**: `viewport={{ once: true }}` ensures the animation only plays once, reducing layout thrashing.

### 3. Grid Composition
```tsx
<ProjectsGrid projects={projects} />
```
-   **Separation of Concerns**: `ProjectsClient` handles the *section layout*, while `ProjectsGrid` handles the *list rendering*.

## Usage Example

```tsx
// src/app/page.tsx
const projects = await getProjects(); // Server-side fetch
return <ProjectsClient projects={projects} />;
```

## Perks & Fallbacks
| Feature | Description |
| :--- | :--- |
| **Localized** | Fully supports multi-language content. |
| **Animated** | Polished entry experience. |
| **Fallback** | Does not currently implement client-side filtering (e.g., by category). This logic would live here or in `ProjectsGrid`. |
