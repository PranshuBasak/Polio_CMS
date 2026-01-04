# BlogCard Component

**Path**: `src/features/blog/components/blog-card.tsx`

## Purpose
`BlogCard` is the standard display unit for blog posts. It handles both **internal** posts (rendered via Next.js routing) and **external** posts (e.g., Medium RSS feeds), providing a unified UI with distinct visual cues.

## Architecture Connection
-   **Parent**: Used by `BlogGrid`.
-   **Data Model**: Consumes `BlogPost` type.
-   **Routing**: Links to `/blog/[slug]` for internal posts, or `target="_blank"` for external URLs.

## Code Analysis

### 1. Props & Date Formatting
```tsx
interface BlogCardProps {
  post: BlogPost;
  isExternal?: boolean;
}

export function BlogCard({ post }: BlogCardProps) {
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', { ... });
```
-   **Formatting**: Handles date localization on the client.
-   **External Flag**: Determines link behavior.

### 2. Visual Distinction
```tsx
<div className="flex justify-between items-start gap-2">
  <CardTitle>{post.title}</CardTitle>
  {isExternal && (
    <span className="bg-primary/10 text-primary ...">External</span>
  )}
</div>
```
-   **Badge**: Immediately informs the user if clicking will take them off-site.

### 3. Conditional Linking
```tsx
<Button asChild className="w-full">
  {isExternal ? (
    <a href={post.externalUrl} target="_blank" ...>Read on External Site</a>
  ) : (
    <Link href={`/blog/${post.slug}`}>Read More</Link>
  )}
</Button>
```
-   **UX**: "Read on External Site" vs "Read More" sets clear expectations.
-   **Security**: External links use `rel="noopener noreferrer"`.

## Usage Example

```tsx
<BlogCard post={mediumPost} isExternal={true} />
```

## Perks & Fallbacks
| Feature | Description |
| :--- | :--- |
| **Hybrid** | Seamlessly mixes internal and external content. |
| **Accessible** | Semantic HTML structure. |
| **Fallback** | No image preview support in the card (text-heavy design). |
