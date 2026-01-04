# Component Map

Visualizing the component hierarchy of DynamicFolio CMS.

```mermaid
graph TD
    Root[RootLayout] --> Providers
    Providers --> Navbar
    Providers --> MainContent
    Providers --> Footer

    subgraph Layout
        Navbar
        Footer
        Sidebar[Sidebar (Mobile)]
    end

    subgraph Pages
        MainContent --> Home[Home Page]
        MainContent --> Admin[Admin Dashboard]
        MainContent --> Blog[Blog Page]
        MainContent --> Projects[Projects Page]
    end

    subgraph Features
        Home --> HeroSection
        Home --> AboutSection
        Home --> SkillsSection
        
        Admin --> AdminStats
        Admin --> AdminSidebar
        Admin --> CMSEditor
        Admin --> SiteSettings
    end

    subgraph UI_Library
        HeroSection --> Button
        HeroSection --> Typewriter
        CMSEditor --> Input
        CMSEditor --> Select
        CMSEditor --> Tabs
        AdminStats --> Card
    end
```

## Directory Structure

- **`src/components/ui`**: Base UI components (Shadcn). See [[UI-Library]].
- **`src/shared/components`**: Shared layout and utility components. See [[Layouts]].
- **`src/features`**: Feature-specific business logic. See [[Feature-Components]].
