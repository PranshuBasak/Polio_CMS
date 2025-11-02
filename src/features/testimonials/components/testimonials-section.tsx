import { getTestimonials } from '@/services/portfolio-data';
import { TestimonialsClient } from './testimonials-client';

/**
 * Testimonials Section - Server Component
 */
export default async function TestimonialsSection() {
  const testimonials = await getTestimonials();

  return <TestimonialsClient testimonials={testimonials} />;
}
