'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { Skill } from '@/lib/types';

/**
 * Skill Card - Client Component
 *
 * Individual skill card with progress bar
 */
interface SkillCardProps {
  skill: Skill;
}

export function SkillCard({ skill }: SkillCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex justify-between">
          <span>{skill.name}</span>
          <span className="text-muted-foreground">{skill.level}%</span>
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
  );
}
