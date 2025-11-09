'use client';

import { useSkillsStore } from '@/lib/stores';
import { ErrorBoundary } from '@/shared/components/ui-enhancements/error-boundary';
import { withSectionAnimation } from '@/shared/hoc/with-section-animation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

function SkillsSectionBase() {
  const skills = useSkillsStore((state) => state.skills);
  const categories = useSkillsStore((state) => state.categories);

  // Sort categories by order
  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

  return (
    <section id="skills" className="section-container">
      <div className="container mx-auto">
        <h2 className="section-heading text-center">Skills</h2>

        <Tabs
          defaultValue={sortedCategories[0]?.id || 'core'}
          className="w-full"
        >
          <TabsList className="flex flex-wrap justify-center gap-2 mb-8 h-auto p-2">
            {sortedCategories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="flex-shrink-0 text-xs sm:text-sm px-3 py-2">
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {sortedCategories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <ErrorBoundary>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {skills
                    .filter((skill) => skill.category === category.id)
                    .map((skill, index) => (
                      <motion.div
                        key={skill.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex justify-between">
                              <span>{skill.name}</span>
                              <span className="text-muted-foreground">
                                {skill.level}%
                              </span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <Progress
                              value={skill.level}
                              className="h-2"
                              aria-label={`${skill.name} proficiency: ${skill.level}%`}
                            />
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                </div>
              </ErrorBoundary>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}

// Apply HOC for animation
const SkillsSection = withSectionAnimation(SkillsSectionBase);
export default SkillsSection;
