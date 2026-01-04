# Data Flow

Understanding how data moves through DynamicFolio CMS.

## 1. Store Hydration (Read)

When the application loads, Zustand stores rehydrate their state from `localStorage`.

```mermaid
sequenceDiagram
    participant Browser
    participant App as Next.js App
    participant Store as Zustand Store
    participant Storage as localStorage

    Browser->>App: Load Page
    App->>Store: Initialize
    Store->>Storage: Check for persisted state
    
    alt State exists
        Storage-->>Store: Return JSON string
        Store->>Store: Rehydrate (JSON.parse)
    else No state
        Store->>Store: Use default initial state
    end

    Store-->>App: Provide State
    App-->>Browser: Render UI
```

## 2. Admin Update (Write)

When an admin updates content (e.g., adds a project).

```mermaid
sequenceDiagram
    participant Admin as Admin User
    participant UI as Admin Panel
    participant Store as Projects Store
    participant Storage as localStorage

    Admin->>UI: Fill Form & Click Save
    UI->>Store: dispatch(addProject(data))
    
    rect rgb(240, 248, 255)
        note right of Store: Optimistic Update
        Store->>Store: Update in-memory state
    end

    Store->>Storage: Persist new state (Sync)
    Store-->>UI: State Updated
    UI-->>Admin: Show Success Toast
```

## 3. External Data Fetch (Medium RSS)

Fetching blog posts from Medium.

```mermaid
sequenceDiagram
    participant Client
    participant API as /api/blog/fetch-medium
    participant Medium as Medium.com

    Client->>API: GET /api/blog/fetch-medium?username=...
    API->>Medium: Fetch RSS Feed (XML)
    Medium-->>API: Return RSS XML
    
    rect rgb(255, 250, 240)
        note right of API: Parsing
        API->>API: Parse XML to JSON
        API->>API: Extract Excerpts
    end

    API-->>Client: Return JSON { posts: [...] }
```

---

> [!WARNING]
> **Hydration Mismatch**: Since `localStorage` is client-only, Server Components (RSC) cannot access this data directly during initial render. We use a `useHydration` hook to delay rendering of storage-dependent UI until the client has mounted.
