import { BentoMonoBody, BentoMonoCard, BentoMonoFooter, BentoMonoHeader, BentoMonoStat } from "@/components/ui/bento-monochrome-1"
import type { ResumeCertification } from "../../../../lib/types"

type CertificationCardProps = {
  certification: ResumeCertification
  formatDate?: (date: string) => string
}

/**
 * Presentational component for certification card
 */
export function CertificationCard({ certification, formatDate }: CertificationCardProps) {
  const displayDate = formatDate ? formatDate(certification.date) : certification.date

  return (
    <BentoMonoCard>
      <BentoMonoHeader className="mb-5">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-xl font-bold text-balance text-foreground">{certification.name}</h3>
            <p className="text-primary font-medium">{certification.issuer}</p>
          </div>
          <p className="text-muted-foreground text-xs md:text-sm uppercase tracking-[0.18em]">{displayDate}</p>
        </div>
      </BentoMonoHeader>

      <BentoMonoBody>
        <p className="leading-relaxed text-foreground/90">{certification.description}</p>
        {certification.url && (
          <p className="mt-2">
            <a
              href={certification.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              View Certificate
            </a>
          </p>
        )}
      </BentoMonoBody>

      <BentoMonoFooter className="grid gap-2 sm:grid-cols-2">
        <BentoMonoStat label="Issuer" value={certification.issuer} />
        <BentoMonoStat label="Issued" value={displayDate} />
      </BentoMonoFooter>
    </BentoMonoCard>
  )
}
