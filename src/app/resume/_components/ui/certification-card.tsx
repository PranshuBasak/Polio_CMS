import { Card, CardContent } from "../../../../components/ui/card"
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
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
          <div>
            <h3 className="text-xl font-bold text-balance">{certification.name}</h3>
            <p className="text-primary">{certification.issuer}</p>
          </div>
          <p className="text-muted-foreground text-sm md:text-base">{displayDate}</p>
        </div>
        <p className="leading-relaxed">{certification.description}</p>
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
      </CardContent>
    </Card>
  )
}
