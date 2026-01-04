# DynamicFolio CMS - Knowledge Base

Welcome to the comprehensive documentation for **DynamicFolio CMS**. This wiki serves as the central source of truth for the project's architecture, components, and development workflows.

## 🗺️ Map of Content

### [[01-Architecture]]
High-level overview of the system design.
- [System Overview](./01-Architecture/System-Overview.md) - Context & Container diagrams.
- [Tech Stack](./01-Architecture/Tech-Stack.md) - Detailed breakdown of technologies.
- [Data Flow](./01-Architecture/Data-Flow.md) - How data moves through the app.
- [Folder Structure](./01-Architecture/Folder-Structure.md) - Annotated project tree.

### [[02-Components]]
Deep dive into the UI library and feature components.
- [Component Map](./02-Components/Component-Map.md) - Visual tree of components.
- [UI Library](./02-Components/UI-Library.md) - Base components (Shadcn UI).
- [Feature Components](./02-Components/Feature-Components.md) - Business logic components.
- [Layouts](./02-Components/Layouts.md) - Navbar, Sidebar, Footer.

### [[03-Pages]]
Documentation for application routes and pages.
- [Route Map](./03-Pages/Route-Map.md) - Navigation flow.
- [Home](./03-Pages/Home.md) - Landing page analysis.
- [Admin CMS](./03-Pages/Admin-CMS.md) - **Core CMS functionality**.
- [Blog](./03-Pages/Blog.md) - Blog system architecture.
- [Projects](./03-Pages/Projects.md) - Portfolio gallery.

### [[04-State]]
State management patterns and store analysis.
- [Zustand Architecture](./04-State/Zustand-Architecture.md) - Why and how we use Zustand.
- [Store Analysis](./04-State/Store-Analysis.md) - Deep dive into each store.
- [Persistence](./04-State/Persistence.md) - LocalStorage sync & hydration.

### [[05-Config]]
Configuration and environment details.
- [Environment Variables](./05-Config/Environment-Variables.md) - `.env` reference.
- [Tailwind Config](./05-Config/Tailwind-Config.md) - Theme & design system (v4).
- [Next Config](./05-Config/Next-Config.md) - Build & runtime settings.

### [[06-Roadmap]]
Future plans and technical debt.
- [Refinements](./06-Roadmap/Refinements.md) - Proposed improvements.
- [Supabase Migration](./06-Roadmap/Supabase-Migration.md) - Database integration plan.

---

> [!TIP]
> Use the links above to navigate. This wiki is designed to be explored non-linearly.

> [!NOTE]
> This project uses **Next.js 16** and **React 19**. Ensure your environment matches the [Tech Stack](./01-Architecture/Tech-Stack.md).
