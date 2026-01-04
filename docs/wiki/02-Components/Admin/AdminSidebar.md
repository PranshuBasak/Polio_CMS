# AdminSidebar Component

**Path**: `src/features/admin/components/admin-sidebar.tsx`

## Purpose
The `AdminSidebar` is the primary navigation component for the Admin CMS. It provides access to all content management sections (Dashboard, Projects, Blog, etc.) and handles user authentication actions (Logout). It is designed to be responsive, functioning as a fixed sidebar on desktop and a collapsible drawer on mobile.

## Architecture Connection
-   **Layout**: Used exclusively in `src/app/admin/layout.tsx`.
-   **State**: Connects to `UIStore` for sidebar visibility (mobile) and `HeroStore` for user profile data.
-   **Auth**: Directly interacts with `Supabase` client for session management.

## Code Analysis

### 1. Imports & Setup
```tsx
'use client'; // Client Component (Interactive)

import { useHeroStore, useUIStore } from '@/lib/stores';
// ... imports from UI library and Lucide icons
import { createClient } from '@/lib/supabase/client';

export function AdminSidebar() {
  const pathname = usePathname(); // For active link highlighting
  const [mounted, setMounted] = useState(false); // Hydration fix
  
  // Zustand Selectors
  const heroData = useHeroStore((state) => state.heroData);
  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  
  const supabase = createClient(); // Supabase instance
```
-   **`useHeroStore`**: Fetches the admin's name and avatar image to display in the header.
-   **`useUIStore`**: Manages the open/close state of the sidebar on mobile devices.

### 2. Hydration Handling
```tsx
  useEffect(() => {
    const checkMobile = () => { setIsMobile(window.innerWidth < 768); };
    checkMobile();
    setMounted(true); // Only render after client-side mount
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!mounted) return null; // Prevent hydration mismatch
```
-   **Why?**: The sidebar's appearance depends on `window.innerWidth`. Rendering this on the server would cause a mismatch with the client's actual viewport. We force a client-only render.

### 3. Navigation Routes
```tsx
  const routes = [
    { title: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { title: 'Projects', href: '/admin/projects', icon: FolderKanban },
    // ... other routes
  ];
```
-   **Extensibility**: New admin pages should be added to this array to automatically appear in the menu.

### 4. Logout Logic
```tsx
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push('/login'); // Redirect to login
    } catch (error) {
      // Error handling with Toast
    }
  };
```
-   **Security**: Uses `supabase.auth.signOut()` to invalidate the session.

### 5. Rendering (Responsive)
```tsx
<aside
  className={cn(
    'fixed inset-y-0 left-0 z-50 ...',
    isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full', // Mobile toggle
    'md:translate-x-0 md:w-64 md:z-30' // Desktop always visible
  )}
>
```
-   **Mobile**: Uses CSS transforms (`translate-x`) controlled by `isSidebarOpen`.
-   **Desktop**: Overrides mobile styles to be always visible (`md:translate-x-0`).

## Usage Example

This component is plug-and-play within the Admin Layout.

```tsx
// src/app/admin/layout.tsx
export default function AdminLayout({ children }) {
  return (
    <div className="flex">
      <AdminSidebar /> {/* Handles its own state */}
      <main>{children}</main>
    </div>
  )
}
```

## Perks & Fallbacks
| Feature | Description |
| :--- | :--- |
| **Responsive** | Automatically adapts to mobile/desktop. |
| **Stateful** | Remembers scroll position and active route. |
| **Fallback** | If `HeroStore` is empty, shows initials in Avatar. |
