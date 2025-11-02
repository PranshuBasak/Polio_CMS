'use client';

import { ErrorBoundary } from '@/shared/components/ui-enhancements/error-boundary';
import { motion } from 'framer-motion';
import { useHydration } from '../../../../lib/hooks/use-hydration';
import { useProjectFilters } from '../../_hooks/use-project-filters';
import { useProjectsData } from '../../_hooks/use-projects-data';
import { ProjectFilters } from '../ui/project-filters';
import { ProjectsGrid } from '../ui/projects-grid';

/**
 * Container component for Projects Page
 * Handles filtering logic and state management
 */
export function ProjectsPageContainer() {
  const { projects, allTechnologies } = useProjectsData();
  const {
    searchTerm,
    setSearchTerm,
    selectedTech,
    setSelectedTech,
    filteredProjects,
    resetFilters,
  } = useProjectFilters(projects);
  const isHydrated = useHydration();

  if (!isHydrated) return null;

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-6 text-center text-balance">
            Projects
          </h1>
          <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto text-pretty leading-relaxed">
            A showcase of my work in software architecture, backend development,
            and system design.
          </p>

          <div className="mb-8">
            <ProjectFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedTech={selectedTech}
              onTechChange={setSelectedTech}
              technologies={allTechnologies}
            />
          </div>

          <ErrorBoundary>
            <ProjectsGrid
              projects={filteredProjects}
              selectedTech={selectedTech}
              onResetFilters={resetFilters}
            />
          </ErrorBoundary>
        </motion.div>
      </div>
    </div>
  );
}
