"use client";

import { Briefcase } from "lucide-react";
import { useEffect, useMemo } from "react";
import CloudinaryImage from "@/components/ui/cloudinary-image";
import { Timeline, type TimelineEntry } from "@/components/ui/timeline";
import { useAboutStore } from "@/lib/stores/about-store";

interface ExperienceTimelineSectionProps {
  context?: "home" | "resume";
  className?: string;
}

function JourneyIcon({ icon, label }: { icon?: string | null; label: string }) {
  if (!icon) {
    return <Briefcase className="h-3.5 w-3.5" />;
  }

  return (
    <CloudinaryImage
      src={icon}
      alt={`${label} icon`}
      width={20}
      height={20}
      className="h-5 w-5 rounded-full object-cover"
    />
  );
}

export default function ExperienceTimelineSection({
  context = "home",
  className,
}: ExperienceTimelineSectionProps) {
  const { aboutData, fetchAboutData } = useAboutStore();

  useEffect(() => {
    void fetchAboutData();
  }, [fetchAboutData]);

  const entries = useMemo<TimelineEntry[]>(() => {
    const sortedJourney = [...aboutData.journey].sort((a, b) => {
      const left = a.order ?? Number.MAX_SAFE_INTEGER;
      const right = b.order ?? Number.MAX_SAFE_INTEGER;
      return left - right;
    });

    return sortedJourney.map((item) => ({
      id: item.id,
      title: item.title,
      subtitle: item.company,
      meta: item.date,
      icon: <JourneyIcon icon={item.icon} label={item.company || item.title} />,
      content: (
        <div className="space-y-4 rounded-2xl border border-border/70 bg-card/70 p-4 md:p-5">
          <p className="text-sm md:text-base leading-relaxed text-foreground/90 whitespace-pre-line">
            {item.description}
          </p>
          {item.images && item.images.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {item.images.map((imageUrl, imageIndex) => (
                <div
                  key={`${item.id}-memory-${imageIndex}`}
                  className="relative overflow-hidden rounded-lg border border-border/60 bg-muted/40"
                >
                  <CloudinaryImage
                    src={imageUrl}
                    alt={`${item.company || item.title} memory ${imageIndex + 1}`}
                    width={420}
                    height={300}
                    className="h-24 w-full object-cover md:h-28"
                  />
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ),
    }));
  }, [aboutData.journey]);

  if (entries.length === 0) {
    return (
      <section className={className}>
        <div className="mx-auto max-w-6xl px-4 py-14 md:px-8 lg:px-10">
          <div className="rounded-2xl border border-dashed border-border bg-card/60 p-6 text-sm text-muted-foreground">
            Professional journey is empty. Add entries in Admin &gt; About &gt; Professional Journey.
          </div>
        </div>
      </section>
    );
  }

  return (
    <Timeline
      className={className}
      data={entries}
      heading={context === "home" ? "Experience Timeline" : "Professional Journey"}
      description={
        context === "home"
          ? "A quick walkthrough of major professional milestones."
          : "A detailed timeline of roles, milestones, and moments across the journey."
      }
    />
  );
}

