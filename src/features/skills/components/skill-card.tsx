'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import CloudinaryImage from '@/components/ui/cloudinary-image';
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
        <CardTitle className="text-lg flex justify-between items-center">
          <div className="flex items-center gap-2">
            {skill.icon && (
              <div className="relative w-6 h-6">
                <CloudinaryImage
                  src={skill.icon}
                  alt={skill.name}
                  fill
                  className="object-contain"
                />
              </div>
            )}
            <span>{skill.name}</span>
          </div>
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
