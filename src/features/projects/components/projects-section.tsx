import { getFeaturedProjects } from '@/services/portfolio-data';
import { ProjectsClient } from './projects-client';

/**
 * Projects Section - Server Component
 *
 * Fetches featured projects on the server for SSR
 */
export default async function ProjectsSection() {
  const projects = await getFeaturedProjects(6);

  return <ProjectsClient projects={projects} />;
}
