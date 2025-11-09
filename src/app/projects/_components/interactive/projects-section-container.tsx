'use client';

import { useHydration } from '@/lib/hooks/use-hydration';
import { ErrorBoundary } from '@/shared/components/ui-enhancements/error-boundary';
import { withSectionAnimation } from '@/shared/hoc/with-section-animation';
import { useProjectsData } from '../../_hooks/use-projects-data';
import { ProjectsGrid } from '../ui/projects-grid';
import { SectionHeader } from '../ui/section-header';

/**
 * Container component for Projects Section (Homepage)
 * Handles data fetching and business logic
 */
function ProjectsSectionContainerBase() {
  const { featuredProjects } = useProjectsData();
  const isHydrated = useHydration();

  if (!isHydrated) return null;

  return (
    <section id="projects" className="section-container bg-muted/30">
      <div className="container mx-auto">
        <SectionHeader
          title="Featured Projects"
          description="A selection of my recent work in software architecture and backend development."
          showViewAll
        />

        <ErrorBoundary>
          <ProjectsGrid
            projects={featuredProjects}
            showCaseStudy={false}
          />
        </ErrorBoundary>
      </div>
    </section>
  );
}

export const ProjectsSectionContainer = withSectionAnimation(
  ProjectsSectionContainerBase
);
