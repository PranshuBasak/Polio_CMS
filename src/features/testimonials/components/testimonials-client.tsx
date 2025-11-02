'use client';

import { useTranslations } from '@/lib/i18n/translations-context';
import type { Testimonial } from '@/lib/types';
import { motion } from 'framer-motion';
import { TestimonialsGrid } from './testimonials-grid';

/**
 * Testimonials Client - Client Wrapper
 */
interface TestimonialsClientProps {
  testimonials: Testimonial[];
}

export function TestimonialsClient({ testimonials }: TestimonialsClientProps) {
  const { t } = useTranslations();

  return (
    <section className="section-container bg-muted/30">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-12">
          <h2 className="section-heading">{t('testimonials.title')}</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t('testimonials.description')}
          </p>
        </div>

        <TestimonialsGrid testimonials={testimonials} />
      </motion.div>
    </section>
  );
}
