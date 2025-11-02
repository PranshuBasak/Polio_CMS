import { useSkillsStore } from '@/lib/stores';
import { useMemo } from 'react';

/**
 * Custom hook for Skills data transformation
 */
export function useSkillsData() {
  const skills = useSkillsStore((state) => state.skills);
  const categories = useSkillsStore((state) => state.categories);

  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => a.order - b.order);
  }, [categories]);

  const skillsByCategory = useMemo(() => {
    const map = new Map<string, typeof skills>();
    sortedCategories.forEach((category) => {
      const categorySkills = skills.filter(
        (skill) => skill.category === category.id
      );
      map.set(category.id, categorySkills);
    });
    return map;
  }, [skills, sortedCategories]);

  const topSkills = useMemo(() => {
    return [...skills].sort((a, b) => b.level - a.level).slice(0, 6);
  }, [skills]);

  return {
    skills,
    categories: sortedCategories,
    skillsByCategory,
    topSkills,
    totalSkills: skills.length,
  };
}
