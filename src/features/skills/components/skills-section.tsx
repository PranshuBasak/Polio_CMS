import { getSkillCategories, getSkills } from '@/services/portfolio-data';
import { SkillsClient } from './skills-client';

/**
 * Skills Section - Server Component
 *
 * Fetches skills and categories on server for SSR
 */
export default async function SkillsSection() {
  const skills = await getSkills();
  const categories = await getSkillCategories();

  return <SkillsClient skills={skills} categories={categories} />;
}
