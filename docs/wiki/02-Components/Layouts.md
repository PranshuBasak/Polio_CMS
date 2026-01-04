# Layout Components

Located in `src/shared/components/layout`.

    -   Copyright notice.
    -   Dynamic "Built with" tech stack icons.

## Theme Toggle
Switch between Light, Dark, and System themes.
- **Path**: `src/shared/components/layout/mode-toggle.tsx`
- **Logic**: Uses `next-themes`.

## Language Switcher
Dropdown to change application language.
- **Path**: `src/shared/components/layout/language-switcher.tsx`
- **Logic**: Updates `TranslationsContext`.

---

> [!NOTE]
> The `RootLayout` in `src/app/layout.tsx` wraps the entire app with these components, ensuring they persist across page navigations.
