import { Card, CardContent } from "../../../../components/ui/card"
import type { ResumeExperience } from "../../../../lib/types"

type ExperienceCardProps = {
  experience: ResumeExperience
  formatDateRange?: (start: string, end: string) => string
}

/**
 * Presentational component for experience card
 */
export function ExperienceCard({ experience, formatDateRange }: ExperienceCardProps) {
  const dateRange = formatDateRange
    ? formatDateRange(experience.startDate, experience.endDate)
    : `${experience.startDate} - ${experience.endDate}`

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
          <div>
            <h3 className="text-xl font-bold text-balance">{experience.title}</h3>
            <p className="text-primary">{experience.company}</p>
          </div>
          <p className="text-muted-foreground text-sm md:text-base">{dateRange}</p>
        </div>
        <p className="mb-4 leading-relaxed">{experience.description}</p>
        <div>
          <h4 className="font-semibold mb-2">Key Achievements:</h4>
          <ul className="list-disc pl-5 space-y-1">
            {experience.achievements.map((achievement, index) => (
              <li key={index} className="text-sm leading-relaxed">
                {achievement}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
