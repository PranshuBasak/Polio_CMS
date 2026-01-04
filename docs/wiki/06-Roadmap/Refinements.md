# Refinements & Technical Debt

A list of proposed improvements and known technical debt.

## High Priority

- [ ] **Authentication**: Implement Supabase Auth to secure the Admin CMS. Currently, it is security-by-obscurity.
- [ ] **Environment Validation**: Add `t3-env` or similar to validate `.env` variables at build time.
- [ ] **Image Optimization**: Re-enable `next/image` optimization once deployed to a platform that supports it (or configure a loader). Currently `unoptimized: true`.

## Medium Priority

- [ ] **MDX Support**: Upgrade the Blog system to support MDX for richer content (interactive components in posts).
- [ ] **Virtualization**: Use `react-window` for the Project and Skill lists in the Admin panel if they grow large.
- [ ] **Testing**: Add E2E tests (Playwright) for the Admin flows.

## Low Priority

- [ ] **Internationalization**: Expand translation coverage (currently partial).
- [ ] **Theme Builder**: Allow Admin to customize the primary color palette via a UI picker (partially implemented).
