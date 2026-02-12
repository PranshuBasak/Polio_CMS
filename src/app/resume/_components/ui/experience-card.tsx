import { BentoMonoBody, BentoMonoCard, BentoMonoFooter, BentoMonoHeader, BentoMonoStat } from "@/components/ui/bento-monochrome-1"
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
    <BentoMonoCard>
      <BentoMonoHeader className="mb-5">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-xl font-bold text-balance text-foreground">{experience.title}</h3>
            <p className="text-primary font-medium">{experience.company}</p>
          </div>
          <p className="text-muted-foreground text-xs md:text-sm uppercase tracking-[0.18em]">{dateRange}</p>
        </div>
      </BentoMonoHeader>

      <BentoMonoBody>
        <p className="leading-relaxed text-foreground/90">{experience.description}</p>
        <div>
          <h4 className="font-semibold mb-2 text-sm uppercase tracking-[0.16em] text-muted-foreground">Key Achievements</h4>
          <ul className="list-disc pl-5 space-y-1">
            {experience.achievements.map((achievement, index) => (
              <li key={index} className="text-sm leading-relaxed text-foreground/90">
                {achievement}
              </li>
            ))}
          </ul>
        </div>
      </BentoMonoBody>

      <BentoMonoFooter className="grid gap-2 sm:grid-cols-2">
        <BentoMonoStat label="Company" value={experience.company} />
        <BentoMonoStat label="Location" value={experience.location || "Remote"} />
      </BentoMonoFooter>
    </BentoMonoCard>
  )
}
