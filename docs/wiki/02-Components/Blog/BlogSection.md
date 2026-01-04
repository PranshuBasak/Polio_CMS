# BlogSection Component

**Path**: `src/features/blog/components/blog-section.tsx`

## Purpose
`BlogSection` is a **Smart Component** (Container) that connects the UI to the `BlogStore`. It is specifically designed for the **Homepage**, where it filters and displays a subset of posts (e.g., "Latest 6 Internal Posts").

## Architecture Connection
-   **Store**: Subscribes to `useBlogStore`.
-   **Hydration**: Uses `useHydration` to prevent server/client mismatches.
-   **Optimization**: Uses `useMemo` to filter posts efficiently.

## Code Analysis

### 1. Store Subscription
```tsx
export default function BlogSection() {
  const allPosts = useBlogStore((state) => state.posts);
  const isHydrated = useHydration();
```
-   **Source of Truth**: Fetches from the global Zustand store, ensuring that if the admin updates a post, the homepage reflects it immediately (client-side).

### 2. Data Filtering (Memoized)
```tsx
  const posts = useMemo(() => {
    // Filter out external posts (Medium) for the homepage
    const internal = allPosts?.filter(p => !p.externalUrl) || [];
    // Limit to 6
    return internal.slice(0, 6);
  }, [allPosts]);
```
-   **Logic**: The homepage focuses on *internal* content. External posts are likely shown on a dedicated `/blog` or `/writing` page.

### 3. Hydration Guard
```tsx
  if (!isHydrated) return null;
  return <BlogClient posts={posts} />;
```
-   **Why?**: `localStorage` persistence means the initial server render (empty/default) differs from the client render (stored data). Returning `null` until hydration completes avoids the "Text content does not match" error.

## Usage Example

```tsx
// src/app/page.tsx
<BlogSection />
```

## Perks & Fallbacks
| Feature | Description |
| :--- | :--- |
| **Connected** | Auto-updates with store changes. |
| **Safe** | Handles hydration edge cases. |
| **Fallback** | Hardcoded limit (6 posts). Should ideally be a prop or config setting. |
