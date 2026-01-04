# TerminalSection Component

**Path**: `src/components/ui/terminal-section.tsx`

## Purpose
`TerminalSection` is a gamified "Easter Egg" component. It presents a functional command-line interface (CLI) where users can type commands (`help`, `about`, `projects`) to interact with the portfolio in a developer-native way.

## Architecture Connection
-   **Data**: Imports `CYBERPUNK_MESSAGES` for flavor text.
-   **UI**: Uses standard HTML `<input>` styled to look like a terminal prompt.

## Code Analysis

### 1. Command Parsing
```tsx
const handleCommand = (cmd: string) => {
  switch (cmd.trim().toLowerCase()) {
    case 'help':
      output = <ul>...</ul>;
      break;
    case 'clear':
      setHistory([]);
      return;
    // ...
  }
  setHistory(prev => [...prev, { input: cmd, output }]);
};
```
-   **Simple Parser**: Matches exact strings.
-   **History**: Stores previous commands and outputs to render the "scrollback" buffer.

### 2. Auto-Scroll
```tsx
useEffect(() => {
  bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
}, [history]);
```
-   **UX**: Ensures the latest output is always visible, mimicking a real terminal.

### 3. Focus Management
```tsx
<div onClick={() => inputRef.current?.focus()}>
  {/* ... */}
  <input autoFocus ... />
</div>
```
-   **Usability**: Clicking anywhere in the terminal window focuses the hidden input, so the user can just start typing.

## Usage Example

```tsx
// src/app/page.tsx
<TerminalSection />
```

## Perks & Fallbacks
| Feature | Description |
| :--- | :--- |
| **Fun** | engaging for developer audiences. |
| **Thematic** | Reinforces the "Hacker" brand. |
| **Fallback** | Limited command set. Does not actually execute code or interact with the real backend/OS. |
