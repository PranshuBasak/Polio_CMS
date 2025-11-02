import type { AboutJourneyItem } from "../../../../lib/types"

type AboutJourneyTabProps = {
  journey: AboutJourneyItem[]
}

/**
 * Presentational component for About Journey tab
 */
export function AboutJourneyTab({ journey }: AboutJourneyTabProps) {
  return (
    <div className="space-y-8">
      {journey.map((item, index) => (
        <div key={item.id} className="relative pl-8 border-l-2 border-primary/30 pb-8 last:pb-0 last:border-0">
          <div className="absolute w-4 h-4 bg-primary rounded-full -left-[9px] top-0" />
          <h3 className="text-xl font-bold text-balance">{item.title}</h3>
          <p className="text-sm text-primary mb-2">{item.company}</p>
          <p className="text-sm text-muted-foreground mb-2">{item.date}</p>
          <p className="text-muted-foreground leading-relaxed">{item.description}</p>
        </div>
      ))}
    </div>
  )
}
