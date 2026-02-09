'use client';

import FolderExplorer, { type ProjectFolder } from '@/components/ui/3d-folder';
import { ProjectDetailModal } from '@/components/ui/project-detail-modal';
import { InteractiveNebulaShader } from '@/components/ui/liquid-shader';
import { ErrorBoundary } from '@/shared/components/ui-enhancements/error-boundary';
import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { useHydration } from '../../../../lib/hooks/use-hydration';
import type { Project } from '../../../../lib/types';
import { Button } from '@/components/ui/button';
import { useProjectFilters } from '../../_hooks/use-project-filters';
import { useProjectsData } from '../../_hooks/use-projects-data';
import { ProjectFilters } from '../ui/project-filters';

/**
 * Container component for Projects Page
 * Handles filtering logic and state management
 */
export function ProjectsPageContainer() {
  const { projects, allTechnologies } = useProjectsData();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const {
    searchTerm,
    setSearchTerm,
    selectedTech,
    setSelectedTech,
    filteredProjects,
    resetFilters,
  } = useProjectFilters(projects);
  const isHydrated = useHydration();

  const groupedFolders = useMemo<ProjectFolder[]>(() => {
    const map = new Map<string, Project[]>();

    for (const project of filteredProjects) {
      const key = project.category?.trim() || project.technologies[0] || 'Uncategorized';
      const existing = map.get(key) ?? [];
      existing.push(project);
      map.set(key, existing);
    }

    const gradients = [
      'linear-gradient(135deg, var(--primary), var(--accent))',
      'linear-gradient(135deg, var(--accent), var(--chart-3))',
      'linear-gradient(135deg, var(--chart-2), var(--primary))',
      'linear-gradient(135deg, var(--chart-4), var(--accent))',
    ];

    return Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([title, groupProjects], index) => ({
        id: `${title.toLowerCase().replace(/\s+/g, '-')}-${index}`,
        title,
        projects: groupProjects,
        gradientToken: gradients[index % gradients.length],
      }));
  }, [filteredProjects]);

  if (!isHydrated) return null;

  return (
    <div className="relative min-h-screen overflow-hidden">
      <InteractiveNebulaShader position="absolute" className="opacity-100" />
      <div className="pointer-events-none absolute inset-0 bg-background/18" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,color-mix(in_oklab,var(--primary)_22%,transparent),transparent_45%),radial-gradient(circle_at_85%_70%,color-mix(in_oklab,var(--accent)_20%,transparent),transparent_50%)]" />

      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="mb-5 text-center text-4xl font-black tracking-tight text-balance md:text-6xl">
              <span className="bg-linear-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Projects Matrix
              </span>
            </h1>
            <p className="mx-auto mb-8 max-w-3xl text-center text-pretty leading-relaxed text-muted-foreground md:text-lg">
              Jack into the archive: traverse neon-lit project directories, crack open any data shard to reveal full intel, holo-snapshots, and live system links
            </p>

            <div className="mb-8 rounded-2xl border border-border/55 bg-card/20 p-4 shadow-xl shadow-primary/12 backdrop-blur-[2px]">
              <ProjectFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedTech={selectedTech}
                onTechChange={setSelectedTech}
                technologies={allTechnologies}
              />
            </div>

            <ErrorBoundary>
              {filteredProjects.length > 0 ? (
                <FolderExplorer folders={groupedFolders} onProjectSelect={setSelectedProject} />
              ) : (
                <div className="rounded-2xl border border-border/55 bg-card/20 p-10 text-center backdrop-blur-[2px]">
                  <p className="mb-4 text-muted-foreground">No projects found matching your criteria.</p>
                  <Button variant="outline" onClick={resetFilters}>
                    Reset Filters
                  </Button>
                </div>
              )}
            </ErrorBoundary>
          </motion.div>
        </div>
      </div>

      <ProjectDetailModal
        key={selectedProject?.id ?? 'project-modal'}
        project={selectedProject}
        open={selectedProject !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedProject(null);
          }
        }}
        modalId={selectedProject ? `project-modal-${selectedProject.id}` : 'project-modal'}
      />
    </div>
  );
}
