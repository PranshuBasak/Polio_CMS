# Admin Components

Specialized components used exclusively within the Admin CMS.

## Core Components

### `AdminSidebar`
The main navigation component.
-   **Path**: `src/features/admin/components/admin-sidebar.tsx`
-   **Features**:
    -   **Responsive**: Drawer on mobile, fixed on desktop.
    -   **User Info**: Displays Avatar and Name from `HeroStore`.
    -   **Logout**: Handles Supabase sign-out.

### `CMSEditor`
A generic, configuration-driven form builder.
-   **Path**: `src/features/admin/components/cms-editor.tsx`
-   **Props**:
    -   `title`: Form title.
    -   `initialData`: Object containing default values.
    -   `fields`: Array of field definitions (`name`, `label`, `type`, `required`, etc.).
    -   `onSave`: Callback function when form is submitted.
-   **Supported Types**:
    -   `text`, `textarea`, `number`, `date`, `toggle`, `image`.
    -   `markdown`: Includes a tabbed editor (Edit/Preview).

**Usage Example:**
```tsx
<CMSEditor
  title="Edit Project"
  initialData={project}
  onSave={(data) => updateProject(id, data)}
  fields={[
    { name: 'title', label: 'Title', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'markdown' },
    { name: 'featured', label: 'Featured', type: 'toggle' }
  ]}
/>
```

### `AdminStats`
Displays summary cards for key metrics.
-   **Path**: `src/features/admin/components/admin-stats.tsx`
-   **Logic**: Subscribes to multiple stores (`projects`, `blog`, `skills`) to count items.

## Specialized Editors

### `SiteSettings`
Complex form for managing global configuration.
-   **Path**: `src/features/admin/components/site-settings.tsx`
-   **Features**:
    -   **Live Theme Update**: Changing "Primary Color" updates the CSS variable immediately.
    -   **Tabbed Interface**: Organizes settings into logical groups.

### `ResumeEditors`
A collection of editors for the Resume section.
-   **Files**:
    -   `resume-experience-editor.tsx`
    -   `resume-education-editor.tsx`
    -   `resume-skills-editor.tsx`
-   **Logic**: Each handles a specific array in the `ResumeStore`.

## Charts & Visualizations

### `AdminActivityChart`
Visualizes page views over time.
-   **Library**: `recharts`
-   **Data**: Mock data (currently) or Analytics Store.

### `AdminProjectsChart`
Pie chart showing project distribution by category/tech stack.
