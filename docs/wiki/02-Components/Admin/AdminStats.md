# AdminStats Component

**Path**: `src/features/admin/components/admin-stats.tsx`

## Purpose
`AdminStats` provides a high-level summary of the portfolio's content and performance. It aggregates data from multiple sources (Projects, Blog, Skills) to display key metrics like "Total Projects", "Total Views", and "Active Skills" on the dashboard.

## Architecture Connection
-   **Multi-Store Subscription**: Connects to `ProjectsStore`, `BlogStore`, `SkillsStore`, and `ResumeStore`.
-   **Dashboard**: The first component seen on `/admin`.

## Code Analysis

### 1. Data Aggregation
```tsx
export function AdminStats() {
  // Subscribe to multiple stores
  const projects = useProjectsStore((state) => state.projects);
  const blogPosts = useBlogStore((state) => state.posts);
  const skills = useSkillsStore((state) => state.skills);
  
  // Calculate Metrics
  const totalProjects = projects.length;
  const featuredProjects = projects.filter(p => p.featured).length;
  const totalPosts = blogPosts.length;
  const totalSkills = skills.length;
}
```
-   **Performance**: Since Zustand selectors are efficient, subscribing to multiple stores here is acceptable. It triggers a re-render only when the *selected* state changes (though here we select the whole arrays, so any add/remove triggers update).

### 2. UI Rendering
Uses a grid of `Card` components.
```tsx
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
      <FolderKanban className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{totalProjects}</div>
      <p className="text-xs text-muted-foreground">
        {featuredProjects} featured
      </p>
    </CardContent>
  </Card>
  {/* ... other cards */}
</div>
```

### 3. Growth Metrics (Mock vs Real)
Currently, the "growth" indicators (e.g., "+20.1% from last month") are often placeholders or calculated based on simple logic (e.g., items added in the last 30 days).

```tsx
// Example logic for real growth
const lastMonthProjects = projects.filter(p => 
  new Date(p.createdAt) > subDays(new Date(), 30)
).length;
```

## Usage Example

Used in the `AdminDashboardContainer`.

```tsx
// src/app/admin/_components/interactive/admin-dashboard-container.tsx
export function AdminDashboardContainer() {
  return (
    <div className="space-y-6">
      <AdminStats />
      {/* Charts... */}
    </div>
  );
}
```

## Perks & Fallbacks
| Feature | Description |
| :--- | :--- |
| **Aggregated** | Single view for all content metrics. |
| **Visuals** | Uses Lucide icons for quick recognition. |
| **Fallback** | "Total Views" is currently a mock or local counter; needs Supabase Analytics for real data. |
