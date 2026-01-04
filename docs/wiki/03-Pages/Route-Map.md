# Route Map

Visualizing the application's navigation structure.

```mermaid
graph TD
    Root[/] --> Home[Home /]
    Root --> About[About /about]
    Root --> Projects[Projects /projects]
    Root --> Blog[Blog /blog]
    Root --> Skills[Skills /skills]
    Root --> Resume[Resume /resume]
    
    subgraph Public
        Home
        About
        Projects
        Blog
        Skills
        Resume
    end

    Root --> Admin[Admin /admin]

    subgraph Admin_CMS
        Admin --> Dashboard[Dashboard /]
        Admin --> AdminProjects[Projects /projects]
        Admin --> AdminBlog[Blog /blog]
        Admin --> AdminSkills[Skills /skills]
        Admin --> AdminResume[Resume /resume]
        Admin --> AdminAbout[About /about]
        Admin --> AdminHero[Hero /hero]
        Admin --> AdminSettings[Settings /settings]
    end

    Blog --> BlogPost[Post /blog/:slug]
```

## Route Groups

- **`(home)`**: Logical grouping for the landing page components.
- **`admin`**: Protected routes for the CMS.
- **`api`**: Backend API routes.
