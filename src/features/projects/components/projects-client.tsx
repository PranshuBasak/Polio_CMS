'use client';

import { useTranslations } from '@/lib/i18n/translations-context';
import type { Project } from '@/lib/types';
import { motion } from 'framer-motion';
import { ProjectsGrid } from './projects-grid';

/**
 * Projects Client - Client Component Wrapper
 */
interface ProjectsClientProps {
  projects: Project[];
}

export function ProjectsClient({ projects }: ProjectsClientProps) {
  const { t } = useTranslations();

  return (
    <section id="projects" className="section-container bg-muted/30">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-12">
          <h2 className="section-heading">{t('projects.title')}</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t('projects.description')}
          </p>
        </div>

        <ProjectsGrid projects={projects} />
      </motion.div>
    </section>
  );
}
