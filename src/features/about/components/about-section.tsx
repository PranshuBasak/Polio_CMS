import { getAboutData } from '@/services/portfolio-data';
import { AboutClient } from './about-client';

/**
 * About Section - Server Component
 *
 * Fetches about data on the server and passes to client component.
 */
export default async function AboutSection() {
  const aboutData = await getAboutData();

  return <AboutClient aboutData={aboutData} />;
}
