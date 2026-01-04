# BlogGrid Component

**Path**: `src/features/blog/components/blog-grid.tsx`

## Purpose
`BlogGrid` is a presentational component responsible for laying out `BlogCard`s in a responsive grid. It also orchestrates the **staggered entry animation** for the cards.

## Architecture Connection
-   **Parent**: Used by `BlogClient` (public page) and potentially `AdminBlog` (though admin usually uses a table).
-   **Animation**: Uses `framer-motion` for visual polish.

## Code Analysis

### 1. Responsive Layout
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
```
-   **Breakpoints**:
    -   Mobile: 1 column.
    -   Tablet: 2 columns.
    -   Desktop: 3 columns.

### 2. Staggered Animation
```tsx
{posts.map((post, index) => (
  <motion.div
    key={post.id}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }} // Stagger logic
  >
    <BlogCard post={post} ... />
  </motion.div>
))}
```
-   **Logic**: `delay: index * 0.1` creates a waterfall effect where cards appear one after another.

## Usage Example

```tsx
<BlogGrid posts={allPosts} />
```

## Perks & Fallbacks
| Feature | Description |
| :--- | :--- |
| **Polished** | Staggered animations feel premium. |
| **Responsive** | Standard Tailwind grid. |
| **Fallback** | No virtualization. If rendering 100+ posts, performance might degrade (pagination recommended). |
