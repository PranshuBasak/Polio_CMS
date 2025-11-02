import { Card, CardContent } from "../../../../components/ui/card"
import type { ResumeSkillCategory } from "../../../../lib/types"

type SkillsGridProps = {
  skillGroups: ResumeSkillCategory[]
}

/**
 * Presentational component for skills grid
 */
export function SkillsGrid({ skillGroups }: SkillsGridProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skillGroups.map((skillGroup, index) => (
            <div key={index}>
              <h3 className="text-lg font-bold mb-4">{skillGroup.category}</h3>
              <ul className="space-y-2">
                {skillGroup.items.map((skill, idx) => (
                  <li key={idx} className="flex items-center justify-between gap-4">
                    <span className="text-sm">{skill.name}</span>
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden flex-shrink-0">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${skill.level}%` }}
                        role="progressbar"
                        aria-valuenow={skill.level}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
