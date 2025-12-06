import type { AboutJourneyItem } from '@/lib/types';

/**
 * About Journey - Presentational Component
 *
 * Displays professional timeline
 */
interface AboutJourneyProps {
  journey: AboutJourneyItem[];
}

export function AboutJourney({ journey }: AboutJourneyProps) {
  return (
    <div className="space-y-8">
      {journey.map((item) => (
        <div
          key={item.id}
          className="relative pl-8 border-l-2 border-primary/30 pb-8 last:pb-0 last:border-0"
        >
          <div className="absolute w-4 h-4 bg-primary rounded-full -left-[9px] top-0 flex items-center justify-center overflow-hidden">
            {item.icon && (
              <img 
                src={item.icon} 
                alt={item.company || item.title} 
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <h3 className="text-xl font-bold">{item.title}</h3>
          {item.company && <p className="text-lg font-medium text-muted-foreground">{item.company}</p>}
          <p className="text-primary mb-2">{item.date}</p>
          <p className="text-muted-foreground">{item.description}</p>
        </div>
      ))}
    </div>
  );
}
