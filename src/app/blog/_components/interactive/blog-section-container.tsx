'use client';

import { SectionHeader } from '@/app/projects/_components/ui/section-header';
import { useHydration } from '@/lib/hooks/use-hydration';
import { ErrorBoundary } from '@/shared/components/ui-enhancements/error-boundary';
import { withSectionAnimation } from '@/shared/hoc/with-section-animation';
import { useBlogData } from '../../_hooks/use-blog-data';
import { blogService } from '../../_services/blog-service';
import { BlogPostsGrid } from '../ui/blog-posts-grid';

/**
 * Container component for Blog Section (Homepage)
 * Handles data fetching and business logic
 */
function BlogSectionContainerBase() {
  const { latestExternalPosts } = useBlogData();
  const isHydrated = useHydration();

  if (!isHydrated) return null;

  return (
    <section id="blog" className="section-container bg-muted/30">
      <div className="container mx-auto">
        <SectionHeader
          title="Latest Blog Posts"
          description="Most recent external writing from my RSS-powered blog feed."
          showViewAll
          viewAllHref="/blog"
          viewAllText="View All Posts"
        />

        <ErrorBoundary>
          <BlogPostsGrid
            posts={latestExternalPosts}
            type="external"
            formatDate={blogService.formatDate}
          />
        </ErrorBoundary>
      </div>
    </section>
  );
}

export const BlogSectionContainer = withSectionAnimation(
  BlogSectionContainerBase
);
