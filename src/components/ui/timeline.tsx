"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import type React from "react";
import { useEffect, useRef, useState } from "react";

export interface TimelineEntry {
  id?: string;
  title: string;
  subtitle?: string;
  meta?: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

interface TimelineProps {
  data: TimelineEntry[];
  heading?: string;
  description?: string;
  className?: string;
}

export function Timeline({
  data,
  heading = "Professional Journey",
  description = "A timeline of professional milestones and key memories.",
  className,
}: TimelineProps) {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setHeight(rect.height);
  }, [data.length]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 12%", "end 60%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.12], [0, 1]);

  return (
    <section className={className} ref={containerRef}>
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-8 lg:px-10">
        <h2 className="text-2xl md:text-4xl mb-3 text-foreground max-w-4xl font-semibold tracking-tight">
          {heading}
        </h2>
        <p className="text-muted-foreground text-sm md:text-base max-w-2xl">{description}</p>
      </div>

      <div ref={ref} className="relative mx-auto max-w-6xl pb-16 px-4 md:px-8 lg:px-10">
        {data.map((item, index) => (
          <article key={item.id || `${item.title}-${index}`} className="flex justify-start pt-8 md:pt-20 md:gap-8">
            <div className="sticky flex flex-col md:flex-row z-20 items-center top-28 self-start max-w-xs lg:max-w-sm md:w-full">
              <div className="h-9 absolute left-[9px] md:left-[9px] w-9 rounded-full bg-card border border-border flex items-center justify-center">
                <div className="h-6 w-6 rounded-full bg-primary/15 text-primary border border-primary/30 flex items-center justify-center">
                  {item.icon}
                </div>
              </div>
              <div className="hidden md:block md:pl-16">
                <h3 className="text-xl lg:text-3xl font-bold text-foreground">{item.title}</h3>
                {item.subtitle ? (
                  <p className="text-sm mt-1 text-muted-foreground">{item.subtitle}</p>
                ) : null}
                {item.meta ? (
                  <p className="text-xs mt-2 uppercase tracking-[0.18em] text-primary/90">{item.meta}</p>
                ) : null}
              </div>
            </div>

            <div className="relative pl-16 pr-0 md:pl-4 w-full">
              <h3 className="md:hidden block text-lg mb-1 font-bold text-foreground">{item.title}</h3>
              {item.subtitle ? (
                <p className="md:hidden mb-1 text-sm text-muted-foreground">{item.subtitle}</p>
              ) : null}
              {item.meta ? (
                <p className="md:hidden mb-3 text-xs uppercase tracking-[0.18em] text-primary/90">{item.meta}</p>
              ) : null}
              {item.content}
            </div>
          </article>
        ))}

        <div
          style={{ height: `${height}px` }}
          className="absolute left-[20px] md:left-[20px] top-0 overflow-hidden w-[2px] bg-gradient-to-b from-transparent via-border to-transparent [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          <motion.div
            style={{ height: heightTransform, opacity: opacityTransform }}
            className="absolute inset-x-0 top-0 w-[2px] rounded-full bg-gradient-to-t from-primary via-accent to-transparent"
          />
        </div>
      </div>
    </section>
  );
}

