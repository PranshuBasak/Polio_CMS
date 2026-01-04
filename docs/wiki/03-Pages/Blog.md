# Blog System

The blog system supports both **internal posts** (written in Markdown) and **external posts** (fetched from Medium).

- **Route**: `/blog`
- **Store**: `blog-store.ts`

## Architecture

```mermaid
sequenceDiagram
    participant User
    participant BlogPage
    participant BlogStore
    participant MediumAPI

    User->>BlogPage: Visit /blog
    BlogPage->>BlogStore: Get Posts
    
    par Internal
        BlogStore->>BlogStore: Filter Internal Posts
    and External
        BlogStore->>MediumAPI: Fetch RSS Feed
        MediumAPI-->>BlogStore: Return New Posts
        BlogStore->>BlogStore: Merge & Sort
    end
    
    BlogStore-->>BlogPage: Return Sorted List
    BlogPage-->>User: Render Post Grid
```

## Features

- **Markdown Support**: Internal posts support rich text via `react-markdown`.
- **RSS Integration**: Automatically syncs with a Medium profile.
- **Tagging**: Filter posts by tags.
- **Search**: Real-time search by title/content.

## Future Improvements

- **MDX Support**: Allow React components inside blog posts.
- **Comments**: Integrate Giscus or similar.
- **Likes/Views**: Track engagement via Supabase.
