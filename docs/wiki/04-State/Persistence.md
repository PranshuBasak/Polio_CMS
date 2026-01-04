# Persistence & Hydration

## Strategy

The application uses a **Client-First Persistence** strategy.
1.  **Write**: State changes are written to `localStorage` immediately.
2.  **Read**: On load, state is read from `localStorage`.

## The Hydration Problem

Next.js renders HTML on the server. The server doesn't have `localStorage`.
If the server renders "Light Mode" but the client has "Dark Mode" stored, the HTML will mismatch, causing a React Hydration Error.

## The Solution

We use a two-pass rendering approach for state-dependent components:

1.  **Server/Initial Client Render**: Render a "Loading" or "Default" state.
2.  **Effect Hook**: After mount, check `localStorage` and update state.

### `useHydration` Hook

```typescript
export const useHydration = () => {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    useStore.persist.rehydrate(); // Force rehydration
    setHydrated(true);
  }, []);

  return hydrated;
};
```

### `InitialDataFetcher`

A component in `src/app/layout.tsx` that triggers initial data checks (e.g., ensuring default settings exist if storage is empty).

```typescript
export function InitialDataFetcher() {
  const { initialize } = useSiteSettings();
  
  useEffect(() => {
    initialize();
  }, []);
  
  return null;
}
```
