# Home Page

The landing page of the portfolio.

- **Route**: `/`
- **File**: `src/app/page.tsx`
- **Type**: Server Component (RSC)

## Structure

The Home page is a composition of several feature sections:

1.  **Hero Section**: Introduction, avatar, CTA.
2.  **About Preview**: Short bio and "Read More" link.
3.  **Featured Projects**: A subset of projects marked as `featured`.
4.  **Skills Preview**: Top skills.
5.  **Latest Posts**: Recent blog posts.
6.  **Contact CTA**: Link to email/socials.

## Data Fetching

As a Server Component, the Home page fetches data directly from the **Zustand stores** (via `get()` or initial state) or **Supabase** (future).

> [!NOTE]
> Since we currently use `localStorage` persistence, the Server Component renders a "skeleton" or initial state, and the client hydrates the actual data. This is handled by `InitialDataFetcher`.
