# Zustand Architecture

DynamicFolio CMS uses **Zustand** for global state management.

## Why Zustand?

1.  **Simplicity**: No boilerplate (reducers, actions, types) like Redux.
2.  **Performance**: Components only re-render when the specific slice of state they select changes.
3.  **Persistence**: Built-in middleware to sync with `localStorage`.
4.  **TypeScript**: First-class support.

## Pattern

Each store follows this pattern:

```typescript
interface MyStore {
  data: DataType[];
  actions: {
    add: (item: DataType) => void;
    update: (id: string, item: Partial<DataType>) => void;
  }
}

export const useMyStore = create<MyStore>()(
  persist(
    (set) => ({
      data: [],
      actions: {
        add: (item) => set((state) => ({ data: [...state.data, item] })),
        // ...
      },
    }),
    { name: 'my-store-storage' }
  )
);
```

## Hydration Handling

Since Next.js uses Server Components, accessing `localStorage` directly causes hydration mismatches. We use a `useHydration` hook.

```typescript
// Component
const isHydrated = useHydration();
const { data } = useMyStore();

if (!isHydrated) return <Skeleton />;
return <div>{data}</div>;
```
