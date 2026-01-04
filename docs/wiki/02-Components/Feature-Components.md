# Feature Components

Business logic components located in `src/features` (and some in `src/components`).

## Admin Features

### `AdminStats`
Displays dashboard metrics (Views, Projects, etc.).
- **Path**: `src/features/admin/components/admin-stats.tsx` (hypothetical path based on pattern)
- **Logic**: Aggregates data from all stores to calculate totals.

### `ProjectForm`
Form to add/edit projects.
- **Logic**: Uses `react-hook-form` + `zod` for validation. Handles image uploads (currently URL inputs).

---

> [!IMPORTANT]
> Feature components are often "Smart Components" that connect directly to Zustand stores to fetch their data.
