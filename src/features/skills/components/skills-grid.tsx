'use client';

import type { Skill } from '@/lib/types';
import { motion } from 'framer-motion';
import { SkillCard } from './skill-card';

/**
 * Skills Grid - Presentational Component
 */
interface SkillsGridProps {
  skills: Skill[];
}

export function SkillsGrid({ skills }: SkillsGridProps) {
  if (skills.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No skills in this category yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {skills.map((skill, index) => (
        <motion.div
          key={skill.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <SkillCard skill={skill} />
        </motion.div>
      ))}
    </div>
  );
}
