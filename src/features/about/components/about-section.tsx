'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Compass, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CloudinaryImage from '@/components/ui/cloudinary-image';
import FlowFieldBackground from '@/components/ui/flow-field-background';
import { useAboutStore } from '@/lib/stores/about-store';
import { parseFocusAreas, truncateText } from '../lib/focus-areas';
import { AboutTechGrid } from './about-tech-grid';

export default function AboutSection() {
  const { aboutData } = useAboutStore();

  const focusAreas = parseFocusAreas(aboutData.focus || aboutData.tagline, 5);
  const shortBio = truncateText(aboutData.bio, 360);
  const journeyTeasers = aboutData.journey.slice(0, 2);
  const valueTeasers = aboutData.values.slice(0, 2);

  return (
    <section id="about" className="relative overflow-hidden py-24">
      <div className="pointer-events-none absolute inset-0 -z-20">
        <FlowFieldBackground className="h-full w-full opacity-30" particleCount={320} speed={0.68} trailOpacity={0.08} />
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-background/80 via-background/65 to-background" />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent via-primary/5 to-transparent" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="grid items-start gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.45 }}
            className="space-y-6"
          >
            <div className="space-y-3">
              <p className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                About Snapshot
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Engineering reliable systems with practical product impact.
              </h2>
              <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                {shortBio}
              </p>
            </div>

            {focusAreas.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Focus Areas
                </p>
                <div className="flex flex-wrap gap-2">
                  {focusAreas.map((area) => (
                    <span
                      key={area}
                      className="rounded-full border border-border bg-card/70 px-3 py-1 text-sm text-foreground/90"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border/70 bg-card/70 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Professional Journey</p>
                {journeyTeasers.length > 0 ? (
                  <div className="mt-2 space-y-2">
                    {journeyTeasers.map((item) => (
                      <div key={item.id} className="rounded-lg border border-border/60 bg-background/50 px-3 py-2">
                        <p className="text-sm font-medium text-foreground/95">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.company}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-foreground/90">Journey milestones available on full profile.</p>
                )}
              </div>
              <div className="rounded-xl border border-border/70 bg-card/70 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Core Values</p>
                {valueTeasers.length > 0 ? (
                  <div className="mt-2 space-y-2">
                    {valueTeasers.map((value) => (
                      <div key={value.id} className="rounded-lg border border-border/60 bg-background/50 px-3 py-2">
                        <p className="text-sm font-medium text-foreground/95">{value.title}</p>
                        <p className="text-xs text-muted-foreground">{truncateText(value.description, 70)}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-foreground/90">Core values section available on full profile.</p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/about">
                <Button className="group rounded-full">
                  Read Full Profile
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>

            <AboutTechGrid limit={12} className="pt-2" />
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4 rounded-2xl border border-border/70 bg-card/70 p-5 shadow-lg"
          >
            <div className="relative aspect-4/5 overflow-hidden rounded-xl border border-border/70 bg-muted/40">
              {aboutData.avatarUrl ? (
                <CloudinaryImage
                  src={aboutData.avatarUrl}
                  alt="Profile photo"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  No profile image configured
                </div>
              )}
              <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-background/85 via-transparent to-transparent" />
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-2 rounded-lg border border-primary/25 bg-primary/10 px-3 py-2 text-sm text-foreground">
                <Compass className="mt-0.5 h-5 w-5 text-primary" />
                <p>{truncateText(aboutData.mission, 130)}</p>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
