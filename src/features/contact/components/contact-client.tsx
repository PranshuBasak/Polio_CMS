'use client';

import { useTranslations } from '@/lib/i18n/translations-context';
import { motion } from 'framer-motion';
import { ContactForm } from './contact-form';
import { ContactInfo } from './contact-info';

/**
 * Contact Client - Client Wrapper
 */
interface ContactClientProps {
  contactInfo: {
    email: string;
    location: string;
    social: {
      github: string;
      linkedin: string;
      medium: string;
    };
  };
}

export function ContactClient({ contactInfo }: ContactClientProps) {
  const { t } = useTranslations();

  return (
    <section id="contact" className="section-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-12">
          <h2 className="section-heading">{t('contact.title')}</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t('contact.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <ContactForm />
          <ContactInfo contactInfo={contactInfo} />
        </div>
      </motion.div>
    </section>
  );
}
