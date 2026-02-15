import AnimatedWaves from '@/shared/components/ui-enhancements/animated-waves';
import { Suspense } from 'react';
import {
    BlogSkeleton,
    ContactSkeleton,
    ProjectsSkeleton,
    SkillsSkeleton,
} from '../components/ui/skeleton-loader';
import { ErrorBoundary } from '../shared/components/ui-enhancements/error-boundary';

// Import refactored Server Components
import AboutSection from '@/features/about/components/about-section';
import BlogSection from '@/features/blog/components/blog-section';
import ContactSection from '@/features/contact/components/contact-section';
import HeroSection from '@/features/hero/components/hero-section';
import SkillsSection from '@/features/skills/components/skills-section';
import { ProjectsSectionContainer } from '@/app/projects/_components/interactive/projects-section-container';

// Keep client-only components
import HomeClient from './home-client';
import { TerminalSection } from '@/components/ui/terminal-section';
import ExperienceTimelineSection from '@/features/experience/components/experience-timeline-section';

function SectionWaveDivider({ flip = false }: { flip?: boolean }) {
  return (
    <div className="relative h-10 w-full">
      <AnimatedWaves position="bottom" flip={flip} height={48} />
    </div>
  );
}

export default function Home() {
  return (
    <HomeClient>
      <div className="w-full">
        {/* Hero Section - Server Component */}
        <ErrorBoundary>
          <HeroSection />
        </ErrorBoundary>
        <SectionWaveDivider />

        {/* Terminal Section */}  
        <ErrorBoundary>
          <Suspense fallback={<div className="py-20" />}>
            <TerminalSection />
          </Suspense>
        </ErrorBoundary>
        <SectionWaveDivider flip />

        {/* About Section */}
        <ErrorBoundary>
          <Suspense fallback={<div className="py-20" />}>
            <AboutSection />
          </Suspense>
        </ErrorBoundary>
        <SectionWaveDivider />

        {/* Projects Section - Server Component */}
        <ErrorBoundary>
          <Suspense fallback={<ProjectsSkeleton />}>
            <ProjectsSectionContainer />
          </Suspense>
        </ErrorBoundary>
        <SectionWaveDivider flip />

        {/* Skills Section - Server Component */}
        <ErrorBoundary>
          <Suspense fallback={<SkillsSkeleton />}>
            <SkillsSection />
          </Suspense>
        </ErrorBoundary>
        <SectionWaveDivider />

        {/* Experience Timeline - Client Component */}
        <ErrorBoundary>
          <Suspense fallback={<div className="py-20" />}>
            <ExperienceTimelineSection context="home" />
          </Suspense>
        </ErrorBoundary>
        <SectionWaveDivider flip />

        {/* Blog Section - Server Component */}
        <ErrorBoundary>
          <Suspense fallback={<BlogSkeleton />}>
            <BlogSection />
          </Suspense>
        </ErrorBoundary>
        <SectionWaveDivider />

        {/* Contact Section - Server Component */}
        <ErrorBoundary>
          <Suspense fallback={<ContactSkeleton />}>
            <ContactSection />
          </Suspense>
        </ErrorBoundary>
        <SectionWaveDivider flip />

      </div>
    </HomeClient>
  );
}
