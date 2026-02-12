import { BentoMonoBody, BentoMonoCard, BentoMonoFooter, BentoMonoHeader, BentoMonoStat } from "@/components/ui/bento-monochrome-1"
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
    <BentoMonoCard>
      <BentoMonoHeader className="mb-5">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-xl font-bold text-balance text-foreground">{education.degree}</h3>
            <p className="text-primary font-medium">{education.institution}</p>
          </div>
          <p className="text-muted-foreground text-xs md:text-sm uppercase tracking-[0.18em]">{dateRange}</p>
        </div>
      </BentoMonoHeader>

      <BentoMonoBody>
        <p className="leading-relaxed text-foreground/90">{education.description}</p>
        <p className="text-sm text-muted-foreground">
          <strong className="text-foreground/90">Relevant Coursework:</strong> {education.courses.join(", ")}
        </p>
      </BentoMonoBody>

      <BentoMonoFooter className="grid gap-2 sm:grid-cols-2">
        <BentoMonoStat label="Institution" value={education.institution} />
        <BentoMonoStat label="Location" value={education.location || "N/A"} />
      </BentoMonoFooter>
    </BentoMonoCard>
  )
}
