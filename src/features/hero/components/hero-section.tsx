import { getHeroData } from '@/services/portfolio-data';
import { HeroClient } from './hero-client';

/**
 * Hero Section - Server Component
 *
 * Fetches hero data on the server and passes to client component.
 * This allows SSR while maintaining client-side interactivity.
 */
export default async function HeroSection() {
  const heroData = await getHeroData();

  return <HeroClient heroData={heroData} />;
}
