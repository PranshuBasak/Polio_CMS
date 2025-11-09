import {
    JsonLd,
    generatePersonSchema,
    generateWebsiteSchema,
} from '@/lib/seo/structured-data';
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
import ProjectsSection from '@/features/projects/components/projects-section';
import SkillsSection from '@/features/skills/components/skills-section';

// Keep client-only components
import TechStackLogos from '@/shared/components/ui-enhancements/tech-stack-logos';
import TimelineSection from '@/shared/components/ui-enhancements/timeline-section';

export default function Home() {
  return (
    <>
      <JsonLd data={generatePersonSchema()} />
      <JsonLd data={generateWebsiteSchema()} />
      <div className="container mx-auto px-4">
      {/* Hero Section - Server Component */}
      <ErrorBoundary>
        <HeroSection />
      </ErrorBoundary>

      {/* About Section with Animation Waves */}
      <div className="relative">
        <AnimatedWaves position="top" />
        <ErrorBoundary>
          <Suspense fallback={<div className="py-20" />}>
            <AboutSection />
          </Suspense>
        </ErrorBoundary>
        <Suspense fallback={<div className="py-8" />}>
          <TechStackLogos />
        </Suspense>
        <AnimatedWaves position="bottom" />
      </div>

      {/* Projects Section - Server Component */}
      <ErrorBoundary>
        <Suspense fallback={<ProjectsSkeleton />}>
          <ProjectsSection />
        </Suspense>
      </ErrorBoundary>

      {/* Skills Section - Server Component */}
      <div className="relative">
        <AnimatedWaves position="top" flip={true} />
        <ErrorBoundary>
          <Suspense fallback={<SkillsSkeleton />}>
            <SkillsSection />
          </Suspense>
        </ErrorBoundary>
        <AnimatedWaves
          position="bottom"
          flip={true}
        />
      </div>

      {/* Timeline Section - Client Component (keep as is) */}
      <ErrorBoundary>
        <Suspense fallback={<div className="py-20" />}>
          <TimelineSection />
        </Suspense>
      </ErrorBoundary>

      {/* Blog Section - Server Component */}
      <ErrorBoundary>
        <Suspense fallback={<BlogSkeleton />}>
          <BlogSection />
        </Suspense>
      </ErrorBoundary>

      {/* Contact Section - Server Component */}
      <ErrorBoundary>
        <Suspense fallback={<ContactSkeleton />}>
          <ContactSection />
        </Suspense>
      </ErrorBoundary>
    </div>
    </>
  );
}
