'use client';

import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  Compass,
  Heart,
  Lightbulb,
  Rocket,
  Shield,
  Sparkles,
  Target,
} from 'lucide-react';
import Link from 'next/link';
import CloudinaryImage from '@/components/ui/cloudinary-image';
import ControlKnob from '@/components/ui/control-knob';
import ToggleSwitch from '@/components/ui/toggle-switch';
import FlowFieldBackground from '@/components/ui/flow-field-background';
import StrudelSpectrumVisualizer from '@/components/ui/strudel-spectrum-visualizer';
import { useAboutStore } from '@/lib/stores/about-store';
import { useStrudelAudio } from '@/lib/audio/use-strudel-audio';
import { parseFocusAreas } from '../lib/focus-areas';
import { AboutTechGrid } from './about-tech-grid';

const valueIconMap = {
  heart: Heart,
  target: Target,
  lightbulb: Lightbulb,
  rocket: Rocket,
  shield: Shield,
  compass: Compass,
} as const;

const getValueIcon = (iconName: string | undefined) => {
  if (!iconName) {
    return Heart;
  }

  const normalized = iconName.toLowerCase().trim();
  return valueIconMap[normalized as keyof typeof valueIconMap] || Heart;
};

export function AboutPageContent() {
  const { aboutData, fetchAboutData } = useAboutStore();
  const {
    isReady,
    isLoading,
    isPlaying,
    volume,
    error,
    play,
    stop,
    setVolume,
    getSpectrumFrame,
  } = useStrudelAudio();

  useEffect(() => {
    fetchAboutData().catch((error) => {
      console.error('Failed to refresh about page data:', error);
    });
  }, [fetchAboutData]);

  const focusAreas = useMemo(
    () => parseFocusAreas(aboutData.focus || aboutData.tagline, 12),
    [aboutData.focus, aboutData.tagline]
  );

  const handlePlaybackToggle = async (nextState: boolean) => {
    if (nextState) {
      await play();
      return;
    }

    await stop();
  };

  return (
    <main className="relative isolate overflow-hidden py-16 md:py-20">
      <div className="pointer-events-none absolute inset-0 -z-20">
        <FlowFieldBackground className="h-full w-full opacity-35" particleCount={420} speed={0.75} trailOpacity={0.08} />
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-background/80 via-background/65 to-background" />

      <div className="container mx-auto space-y-16 px-4">
        <section id="bio" className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="space-y-6"
          >
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              About Profile
            </p>

            <div className="space-y-3">
              <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">Building scalable systems with product-first thinking.</h1>
              <p className="max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">{aboutData.bio}</p>
            </div>

            <div className="rounded-2xl border border-primary/30 bg-card/80 p-5 shadow-lg backdrop-blur">
              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">Mission Statement</p>
              <p className="text-base leading-relaxed text-foreground/90">{aboutData.mission}</p>
            </div>

            <div id="focus" className="flex flex-wrap gap-2">
              {focusAreas.map((area) => (
                <span
                  key={area}
                  className="rounded-full border border-border/70 bg-card/75 px-3 py-1 text-sm text-foreground/90"
                >
                  {area}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4 rounded-2xl border border-border/70 bg-card/70 p-5 shadow-lg backdrop-blur"
          >
            <div className="relative aspect-4/4 overflow-hidden rounded-xl border border-border/70 bg-muted/50">
              {aboutData.avatarUrl ? (
                <CloudinaryImage src={aboutData.avatarUrl} alt="Pranshu Basak" fill className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  Avatar not configured in admin
                </div>
              )}
              <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-background/80 to-transparent" />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border/70 bg-background/75 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Journey Steps</p>
                <p className="mt-2 text-2xl font-semibold text-foreground">{aboutData.journey.length || '-'}</p>
              </div>
              <div className="rounded-xl border border-border/70 bg-background/75 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Core Values</p>
                <p className="mt-2 text-2xl font-semibold text-foreground">{aboutData.values.length || '-'}</p>
              </div>
            </div>
          </motion.aside>
        </section>

        <section id="journey" className="space-y-6 px-4 md:px-10 lg:px-20 xl:px-32">
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">Professional Journey</h2>

          <div className="space-y-4">
            {aboutData.journey.length > 0 ? (
              aboutData.journey.map((item, index) => (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, x: -14 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                  className="relative rounded-2xl border border-border/70 bg-card/75 p-5 shadow-sm"
                >
                  <div className="mb-2 flex flex-wrap items-start justify-between gap-2 ">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                      <p className="text-sm text-muted-foreground ">{item.company}</p>
                    </div>
                    <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                      {item.date}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/90">{item.description}</p>
                </motion.article>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-border bg-card/60 p-6 text-sm text-muted-foreground">
                Professional journey entries are currently empty. Add them from Admin {'>'} About {'>'} Professional Journey.
              </div>
            )}
          </div>
        </section>

        <section id="values" className="space-y-6 px-4 md:px-10 lg:px-20 xl:px-32">
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">Core Values</h2>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {aboutData.values.length > 0 ? (
              aboutData.values.map((value) => {
                const Icon = getValueIcon(value.icon);
                return (
                  <article
                    key={value.id}
                    className="rounded-2xl border border-border/70 bg-card/75 p-5 shadow-sm"
                  >
                    <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/12 text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="text-base font-semibold text-foreground">{value.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{value.description}</p>
                  </article>
                );
              })
            ) : (
              <div className="col-span-full rounded-xl border border-dashed border-border bg-card/60 p-6 text-sm text-muted-foreground">
                Core values are currently empty. Add them from Admin {'>'} About {'>'} Core Values.
              </div>
            )}
          </div>
        </section>

        <section id="tech" className="space-y-6 px-4 md:px-10 lg:px-20 xl:px-32">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">Technology Ecosystem</h2>
            <Link href="/projects" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
              See project implementations
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <AboutTechGrid showCategories />
        </section>

        <section id="interactive" className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">Music Jam Panel</h2>

          <div className="grid gap-5 lg:grid-cols-[1fr_1fr_1.1fr]">
            <ControlKnob
              className="h-full"
              initialValue={volume}
              value={volume}
              onChange={setVolume}
              label="Master Volume"
              disabled={isLoading}
            />
            <ToggleSwitch
              className="h-full"
              checked={isPlaying || isLoading}
              onToggle={(value) => {
                void handlePlaybackToggle(value);
              }}
              label="Music Channel"
              onLabel="Playing"
              offLabel="Stopped"
              disabled={isLoading}
            />

            <aside className="rounded-2xl border border-border/70 bg-card/80 p-5 shadow-lg">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Synth Visualizer</p>
              <StrudelSpectrumVisualizer
                className="mt-3"
                isLoading={isLoading}
                isPlaying={isPlaying}
                getSpectrumFrame={getSpectrumFrame}
              />
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between rounded-lg border border-border/70 bg-background/75 px-3 py-2">
                  <span className="text-muted-foreground">Engine Status</span>
                  <span className="font-semibold text-foreground">
                    {isLoading ? 'Loading Samples' : isPlaying ? 'Playing' : isReady ? 'Ready' : 'Idle'}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border/70 bg-background/75 px-3 py-2">
                  <span className="text-muted-foreground">Master Volume</span>
                  <span className="font-semibold text-primary">{volume}%</span>
                </div>
              </div>

              <div className="mt-4 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-sm text-foreground/90">
                <p className="font-medium text-primary">
                  Playback requires a user interaction due browser autoplay policy.
                </p>
                <p className="mt-2 text-muted-foreground">
                  Toggle the switch once to initialize Strudel and load sample packs.
                </p>
              </div>

              {error && (
                <div className="mt-3 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </div>
              )}
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
