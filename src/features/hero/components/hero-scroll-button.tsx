'use client';

import { Button } from '@/components/ui/button';
import { useTranslations } from '@/lib/i18n/translations-context';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

/**
 * Hero Scroll Button - Client Component
 *
 * Animated scroll-down button with smooth scroll behavior
 */
export function HeroScrollButton() {
  const { t } = useTranslations();

  const handleScroll = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex justify-center mt-16">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: 0.5,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: 'reverse',
          repeatDelay: 0.5,
        }}
      >
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={handleScroll}
          aria-label={t('hero.scrollDown')}
        >
          <ArrowDown className="h-6 w-6" />
          <span className="sr-only">{t('hero.scrollDown')}</span>
        </Button>
      </motion.div>
    </div>
  );
}
