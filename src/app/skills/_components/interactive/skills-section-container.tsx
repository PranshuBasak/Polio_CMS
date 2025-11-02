'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useSkillsData } from '../../_hooks/use-skills-data';
import { SkillsGrid } from '../ui/skills-grid';

export function SkillsSectionContainer() {
  const { skillsByCategory, allSkills } = useSkillsData();

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Skills & Expertise
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A comprehensive overview of my technical skills and areas of expertise
        </p>
      </div>

      {Object.entries(skillsByCategory).map(([category, skills]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="text-2xl">{category}</CardTitle>
            <CardDescription>
              {skills.length} {skills.length === 1 ? 'skill' : 'skills'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SkillsGrid skills={skills} />
          </CardContent>
        </Card>
      ))}

      {allSkills.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No skills added yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
