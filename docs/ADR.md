
## Architecture Decision Records (ADR)

### ADR-001: State Management with Zustand
- **Status**: Accepted
- **Context**: Need a lightweight, persistent state manager without boilerplate.
- **Decision**: Use Zustand with `persist` middleware.
- **Consequences**: Fast development, but requires hydration handling for SSR.

### ADR-002: Next.js App Router
- **Status**: Accepted
- **Context**: Need modern React features (RSC) and SEO optimization.
- **Decision**: Use Next.js 16 App Router.
- **Consequences**: Learning curve for RSC data flow, but better performance.

### ADR-003: Tailwind CSS & Shadcn UI
- **Status**: Accepted
- **Context**: Need rapid UI development with accessible components.
- **Decision**: Use Tailwind CSS and Shadcn UI.
- **Consequences**: consistent design system, easy customization.
