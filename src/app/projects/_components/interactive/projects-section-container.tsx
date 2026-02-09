'use client';

import { useHydration } from '@/lib/hooks/use-hydration';
import { ErrorBoundary } from '@/shared/components/ui-enhancements/error-boundary';
import { withSectionAnimation } from '@/shared/hoc/with-section-animation';
import { ScrollingFeatureShowcase } from '@/components/ui/interactive-scrolling-story-component';
import { useProjectsData } from '../../_hooks/use-projects-data';

/**
 * Container component for Projects Section (Homepage)
 * Handles data fetching and business logic
 */
function ProjectsSectionContainerBase() {
  const { featuredProjects } = useProjectsData();
  const isHydrated = useHydration();

  if (!isHydrated) return null;

  const slides = featuredProjects.map((project) => ({
    id: project.id,
    title: project.title,
    description: project.description,
    imageUrl: project.image || project.screenshots?.[0],
    ctaHref: '/projects',
    ctaLabel: 'Explore Project',
  }));

  return (
    <ErrorBoundary>
      <ScrollingFeatureShowcase
        slides={slides}
        sectionTitle="Priority Targets"
        sectionDescription="Stream through chrome-plated builds—scroll the dataflow to witness system architecture, compiled logic trees, and live-deployed operations."
        viewAllHref="/projects"
        viewAllLabel="View All Projects"
        className="bg-muted/15"
      />
    </ErrorBoundary>
  );
}

export const ProjectsSectionContainer = withSectionAnimation(
  ProjectsSectionContainerBase
);
