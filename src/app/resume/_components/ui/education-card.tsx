import { Card, CardContent } from "../../../../components/ui/card"
import type { ResumeEducation } from "../../../../lib/types"

type EducationCardProps = {
  education: ResumeEducation
  formatDateRange?: (start: string, end: string) => string
}

/**
 * Presentational component for education card
 */
export function EducationCard({ education, formatDateRange }: EducationCardProps) {
  const dateRange = formatDateRange
    ? formatDateRange(education.startDate, education.endDate)
    : `${education.startDate} - ${education.endDate}`

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
          <div>
            <h3 className="text-xl font-bold text-balance">{education.degree}</h3>
            <p className="text-primary">{education.institution}</p>
          </div>
          <p className="text-muted-foreground text-sm md:text-base">{dateRange}</p>
        </div>
        <p className="mb-4 leading-relaxed">{education.description}</p>
        <p className="text-sm text-muted-foreground">
          <strong>Relevant Coursework:</strong> {education.courses.join(", ")}
        </p>
      </CardContent>
    </Card>
  )
}
