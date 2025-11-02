import AboutSection from '@/features/about/components/about-section';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Me',
  description: 'Learn more about my background, journey, and values',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <AboutSection />
    </div>
  );
}
