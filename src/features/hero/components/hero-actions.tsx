'use client';

import { Button } from '@/components/ui/button';
import { useTranslations } from '@/lib/i18n/translations-context';
import { ArrowRight, Download } from 'lucide-react';

/**
 * Hero Actions - Client Component
 *
 * Interactive CTA buttons with translations and enhanced styling
 */
export function HeroActions() {
  const { t } = useTranslations();

  return (
    <div className="flex flex-wrap gap-4">
      <Button
        asChild
        size="lg"
        className="btn-gradient group"
      >
        <a href="#projects" className="flex items-center gap-2">
          {t('hero.viewProjects')}
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </a>
      </Button>
      <Button
        asChild
        variant="outline"
        size="lg"
        className="hover:bg-primary/5 transition-all duration-300 hover:border-primary group"
      >
        <a href="/resume" className="flex items-center gap-2">
          <Download className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
          {t('hero.downloadResume')}
        </a>
      </Button>
    </div>
  );
}
