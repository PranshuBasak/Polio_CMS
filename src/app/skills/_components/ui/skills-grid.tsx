import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skill } from '@/lib/stores';

interface SkillsGridProps {
  skills: Skill[];
}

function getLevelBadgeVariant(level: number) {
  if (level >= 80) return 'default';
  if (level >= 60) return 'secondary';
  return 'outline';
}

function getLevelLabel(level: number) {
  if (level >= 80) return 'Expert';
  if (level >= 60) return 'Intermediate';
  return 'Beginner';
}

export function SkillsGrid({ skills }: SkillsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {skills.map((skill) => (
        <Card key={skill.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold">{skill.name}</h3>
              <Badge variant={getLevelBadgeVariant(skill.level)}>
                {getLevelLabel(skill.level)}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
