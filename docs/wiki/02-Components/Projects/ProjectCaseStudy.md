# ProjectCaseStudy Component

**Path**: `src/features/projects/components/project-case-study.tsx`

## Purpose
`ProjectCaseStudy` provides a detailed, modal-based view of a project. It goes beyond the summary card to show the "Challenge," "Solution," "Results," and a gallery of screenshots. It simulates a dedicated case study page without leaving the current context.

## Architecture Connection
-   **Interaction**: Triggered via a button (often placed alongside `ProjectCard` actions).
-   **UI Library**: Heavily relies on Shadcn `Dialog` and `Tabs`.
-   **Data**: Currently uses **mock data** for the detailed case study content, as the core `Project` type doesn't yet support these extended fields.

## Code Analysis

### 1. Modal State
```tsx
export default function ProjectCaseStudy({ project }: ProjectCaseStudyProps) {
  const [isOpen, setIsOpen] = useState(false);
```
-   **Local State**: Controls the visibility of the `Dialog`.

### 2. Mock Data Injection
```tsx
  // Mock case study data
  const caseStudy = {
    challenge: 'The client needed...',
    solution: 'Implemented a robust...',
    results: 'The new architecture resulted in...',
    process: [...],
    screenshots: [...]
  };
```
-   **Current Limitation**: This data is hardcoded for demonstration.
-   **Future Improvement**: Fetch this data from a `case_studies` table in Supabase, linked by `project_id`.

### 3. Tabbed Content
The modal is organized into four tabs:
1.  **Overview**: Challenge, Solution, Results (Card-based layout).
2.  **Process**: Numbered list of development steps.
3.  **Tech Stack**: Detailed grid of technologies used.
4.  **Gallery**: Horizontal scrollable list of screenshots.

```tsx
<Tabs defaultValue="overview" className="w-full">
  <TabsList className="grid grid-cols-4 mb-4">
    <TabsTrigger value="overview">Overview</TabsTrigger>
    {/* ... */}
  </TabsList>
  <TabsContent value="overview">
    {/* ... Content ... */}
  </TabsContent>
</Tabs>
```

### 4. Image Gallery
```tsx
<div className="flex overflow-x-auto space-x-4 pb-4">
  {caseStudy.screenshots.map((screenshot, index) => (
    <div className="flex-shrink-0 w-full max-w-md">
      <Image src={screenshot} ... />
    </div>
  ))}
</div>
```
-   **UX**: Uses native horizontal scrolling for simplicity on mobile.

## Usage Example

```tsx
<ProjectCaseStudy project={project} />
```
*Note: Currently, this component renders its own trigger button ("View Case Study").*

## Perks & Fallbacks
| Feature | Description |
| :--- | :--- |
| **Immersive** | Full-screen modal experience. |
| **Detailed** | Allows telling the "story" of the project. |
| **Fallback** | **Mock Data**: The content is static and identical for all projects. Needs backend integration. |
