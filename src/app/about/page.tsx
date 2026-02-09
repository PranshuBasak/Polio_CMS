import { AboutPageContent } from '@/features/about/components/about-page-content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Me',
  description: 'Learn more about my background, journey, and values',
};

export default function AboutPage() {
  return <AboutPageContent />;
}
