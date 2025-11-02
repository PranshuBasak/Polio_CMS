'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslations } from '@/lib/i18n/translations-context';
import type { Skill, SkillCategory } from '@/lib/types';
import { motion } from 'framer-motion';
import { SkillsGrid } from './skills-grid';

/**
 * Skills Client - Client Component Wrapper
 */
interface SkillsClientProps {
  skills: Skill[];
  categories: SkillCategory[];
}

export function SkillsClient({ skills, categories }: SkillsClientProps) {
  const { t } = useTranslations();

  // Sort categories by order
  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

  return (
    <section id="skills" className="section-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-12">
          <h2 className="section-heading">{t('skills.title')}</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t('skills.description')}
          </p>
        </div>

        <Tabs
          defaultValue={sortedCategories[0]?.id || 'core'}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
            {sortedCategories.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {sortedCategories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <SkillsGrid
                skills={skills.filter(
                  (skill) => skill.category === category.id
                )}
              />
            </TabsContent>
          ))}
        </Tabs>
      </motion.div>
    </section>
  );
}
