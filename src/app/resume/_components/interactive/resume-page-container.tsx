'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  Award,
  BookOpenText,
  Briefcase,
  GraduationCap,
  Languages,
  Route,
  Sparkles,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { InteractiveMenu, type InteractiveMenuItem } from '@/components/ui/modern-mobile-menu';
import ResumeDownload from '@/features/resume/components/resume-download';
import { ErrorBoundary } from '@/shared/components/ui-enhancements/error-boundary';
import { useHydration } from '@/lib/hooks/use-hydration';
import { useResumeData } from '../../_hooks/use-resume-data';
import { resumeService } from '../../_services/resume-service';
import { CertificationCard } from '../ui/certification-card';
import { EducationCard } from '../ui/education-card';
import { ExperienceCard } from '../ui/experience-card';
import ExperienceTimelineSection from '@/features/experience/components/experience-timeline-section';

type ResumeSectionKey = 'journey' | 'experience' | 'education' | 'certifications' | 'personal';

const menuItems: InteractiveMenuItem[] = [
  { key: 'journey', label: 'Journey', icon: Route },
  { key: 'experience', label: 'Experience', icon: Briefcase },
  { key: 'education', label: 'Education', icon: GraduationCap },
  { key: 'certifications', label: 'Certifications', icon: Award },
  { key: 'personal', label: 'Personal', icon: BookOpenText },
];

const defaultSection: ResumeSectionKey = 'journey';

const getSectionFromHash = (hashValue: string): ResumeSectionKey => {
  const section = hashValue.replace('#', '') as ResumeSectionKey;
  return menuItems.some((item) => item.key === section) ? section : defaultSection;
};

export function ResumePageContainer() {
  const { experiences, education, certifications, languages, interests } = useResumeData();
  const isHydrated = useHydration();
  const [activeSection, setActiveSection] = useState<ResumeSectionKey>(defaultSection);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initialSection = getSectionFromHash(window.location.hash);
    setActiveSection(initialSection);

    const onHashChange = () => {
      setActiveSection(getSectionFromHash(window.location.hash));
    };

    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const handleSectionChange = (nextSectionKey: string) => {
    const typedSection = nextSectionKey as ResumeSectionKey;
    setActiveSection(typedSection);
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#${typedSection}`);
    }
  };

  const sectionContent = useMemo(() => {
    switch (activeSection) {
      case 'journey':
        return (
          <section id="journey" className="space-y-4">
            <ExperienceTimelineSection context="resume" />
          </section>
        );
      case 'experience':
        return (
          <section id="experience" className="space-y-5">
            {experiences.map((exp) => (
              <ExperienceCard
                key={exp.id}
                experience={exp}
                formatDateRange={resumeService.formatDateRange}
              />
            ))}
          </section>
        );
      case 'education':
        return (
          <section id="education" className="space-y-5">
            {education.map((edu) => (
              <EducationCard
                key={edu.id}
                education={edu}
                formatDateRange={resumeService.formatDateRange}
              />
            ))}
          </section>
        );
      case 'certifications':
        return (
          <section id="certifications" className="space-y-5">
            {certifications.map((cert) => (
              <CertificationCard
                key={cert.id}
                certification={cert}
                formatDate={resumeService.formatCertificationDate}
              />
            ))}
          </section>
        );
      case 'personal':
        return (
          <section id="personal" className="grid gap-4 md:grid-cols-2">
            <Card className="border-border/70 bg-card/80">
              <CardContent className="p-5">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  <Languages className="mr-2 inline h-4 w-4" />
                  Languages
                </h3>
                <div className="space-y-2">
                  {languages.map((lang) => (
                    <div key={lang.id || lang.name} className="rounded-lg border border-border/70 bg-background/65 px-3 py-2">
                      <p className="font-medium text-foreground">{lang.name}</p>
                      <p className="text-sm text-muted-foreground">{lang.proficiency}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/70 bg-card/80">
              <CardContent className="p-5">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  <Sparkles className="mr-2 inline h-4 w-4" />
                  Interests
                </h3>
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest, idx) => (
                    <span
                      key={`${interest}-${idx}`}
                      className="rounded-full border border-border/70 bg-background/65 px-3 py-1.5 text-sm text-foreground/90"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        );
      default:
        return null;
    }
  }, [activeSection, certifications, education, experiences, interests, languages]);

  if (!isHydrated) return null;

  return (
    <div className="container mx-auto px-4 py-10 md:py-14">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center text-balance">Resume</h1>
        <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto text-pretty leading-relaxed">
          Experience-first resume with professional journey, roles, education, and certifications.
        </p>

        <div className="mb-6 sticky top-16 z-20">
          <InteractiveMenu
            items={menuItems}
            activeKey={activeSection}
            onChange={handleSectionChange}
            className="mx-auto max-w-5xl"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="space-y-4 lg:sticky lg:top-36 lg:self-start">
            <ResumeDownload />
            <Card className="border-border/70 bg-card/80">
              <CardContent className="p-4">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground mb-2">
                  Sections
                </p>
                <ul className="space-y-2 text-sm">
                  {menuItems.map((item) => (
                    <li key={item.key}>
                      <a
                        href={`#${item.key}`}
                        onClick={() => handleSectionChange(item.key)}
                        className="text-primary hover:underline"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </aside>

          <main className="min-w-0">
            <ErrorBoundary>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-5"
                >
                  {sectionContent}
                </motion.div>
              </AnimatePresence>
            </ErrorBoundary>
          </main>
        </div>
      </motion.div>
    </div>
  );
}

