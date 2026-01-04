# CliLoader Component

**Path**: `src/components/ui/cli-loader.tsx`

## Purpose
The `CliLoader` is the application's initial boot sequence. It replaces a traditional loading spinner with an immersive, terminal-style "system initialization" animation. It serves two purposes:
1.  **Aesthetic**: Sets the "Cyberpunk/Hacker" tone immediately.
2.  **Functional**: Pre-fetches critical data (`Settings`, `Hero`, `About`) while entertaining the user.

## Architecture Connection
-   **Entry Point**: Likely mounted in the root `layout.tsx` or a dedicated `ClientLayout` wrapper.
-   **Stores**: Triggers fetch actions for `useSiteSettingsStore`, `useHeroStore`, and `useAboutStore`.
-   **Dependencies**: Uses `react-type-animation` for text effects and `MatrixBackground` for visuals.

## Code Analysis

### 1. State Machine
The loader operates on a strict state machine:
```tsx
type Status = "booting" | "connecting" | "fetching" | "ready" | "error" | "access_denied";
const [status, setStatus] = useState<Status>("booting");
```
-   **booting**: Initial static log sequence.
-   **connecting**: Simulates network handshake.
-   **fetching**: Real data fetching happens here.
-   **ready**: All data loaded, final success sequence.
-   **error**: Data fetch failed (triggers retry).
-   **access_denied**: Max retries reached (critical failure UI).

### 2. The Boot Sequence
The sequence is defined as an array of `BootStep` objects:
```tsx
const BOOT_SEQUENCE_START: BootStep[] = [
  { message: "INITIALIZING NEURAL INTERFACE", delay: 800 },
  { message: "ESTABLISHING SECURE CONNECTION...", status: "connecting", progress: 10 },
  // ...
];
```
-   **Async Runner**: The `runSequence` function iterates through these steps, awaiting delays and updating state/progress bars.

### 3. Data Fetching Strategy
```tsx
// Start Data Fetching
const dataPromise = Promise.all([
    fetchSettings(),
    fetchAboutData(),
    fetchHeroData()
]);

// Race against timeout
await Promise.race([dataPromise, timeoutPromise]);
```
-   **Parallel Execution**: Fetches all data simultaneously to minimize wait time.
-   **Timeout**: If data takes >15s, it throws an error to prevent infinite hanging.
-   **Visual Masking**: The "middle sequence" (`BOOT_SEQUENCE_END`) runs *while* data is fetching, making the wait feel intentional.

### 4. Error Handling & Retries
```tsx
if (retryCount < 3) {
    addLog("RETRYING CONNECTION SEQUENCE...", "#ef4444");
    setTimeout(() => setRetryCount(prev => prev + 1), 3000);
} else {
    setStatus("access_denied"); // Permanent lockout UI
}
```
-   **Resilience**: Automatically retries failed requests up to 3 times.

## Usage Example

```tsx
// src/app/layout.tsx
{isLoading ? (
  <CliLoader onComplete={() => setIsLoading(false)} />
) : (
  children
)}
```

## Perks & Fallbacks
| Feature | Description |
| :--- | :--- |
| **Immersive** | "Hides" loading times behind engaging visuals. |
| **Robust** | Handles network failures and slow connections gracefully. |
| **Fallback** | If JS is disabled, this component won't render, and the app might show a blank screen (Next.js requires JS for client components). |
