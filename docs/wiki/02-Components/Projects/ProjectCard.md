# ProjectCard Component

**Path**: `src/features/projects/components/project-card.tsx`

## Purpose
The `ProjectCard` is the primary UI unit for displaying a project in the portfolio gallery. It provides a snapshot of the project, including its title, description, tech stack, and links to code/live demos.

## Architecture Connection
-   **Parent**: Used by `ProjectsGrid` (and potentially `FeaturedProjects` on Home).
-   **Data Model**: Consumes the `Project` type from `@/lib/types`.
-   **UI Library**: Composed of Shadcn `Card`, `Badge`, and `Button` components.

## Code Analysis

### 1. Props Interface
```tsx
interface ProjectCardProps {
  project: Project;
}
```
-   **Simplicity**: Takes a single `project` object, making it easy to map over an array of projects.

### 2. Card Structure
```tsx
<Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
  <CardHeader>
    <CardTitle className="text-balance">{project.title}</CardTitle>
    <CardDescription className="text-pretty line-clamp-2">
      {project.description}
    </CardDescription>
  </CardHeader>
```
-   **Layout**: Uses `flex-col` and `h-full` to ensure all cards in a grid row have the same height.
-   **Typography**: Uses `text-balance` and `text-pretty` for optimal text rendering.
-   **Truncation**: `line-clamp-2` prevents long descriptions from breaking the layout.

### 3. Tech Stack Badges
```tsx
<CardContent className="grow">
  <div className="flex flex-wrap gap-2">
    {project.technologies?.map((tech) => (
      <Badge key={tech} variant="secondary">
        {tech}
      </Badge>
    ))}
  </div>
</CardContent>
```
-   **Flexibility**: `flex-wrap` handles variable numbers of technologies gracefully.
-   **Spacing**: `grow` pushes the footer to the bottom, ensuring alignment.

### 4. Action Buttons
```tsx
<CardFooter className="flex gap-2">
  {project.githubUrl && (
    <Button asChild variant="outline" size="sm">
      <a href={project.githubUrl} ...>
        <Github className="h-4 w-4" />
        <span>Code</span>
      </a>
    </Button>
  )}
  {/* Live Demo Button */}
</CardFooter>
```
-   **Conditional Rendering**: Buttons only appear if the URL exists in the data.
-   **Accessibility**: `asChild` allows the `Button` to render as an accessible `<a>` tag.

## Usage Example

```tsx
// Inside ProjectsGrid
{projects.map((project) => (
  <ProjectCard key={project.id} project={project} />
))}
```

## Perks & Fallbacks
| Feature | Description |
| :--- | :--- |
| **Responsive** | Flex layout adapts to any container width. |
| **Interactive** | Hover states and accessible links. |
| **Fallback** | No image support in the card itself (images are in the Case Study modal). |
