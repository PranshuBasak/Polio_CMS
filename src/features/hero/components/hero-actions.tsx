'use client';

import { Button } from '@/components/ui/button';
import { useTranslations } from '@/lib/i18n/translations-context';

/**
 * Hero Actions - Client Component
 *
 * Interactive CTA buttons with translations
 */
export function HeroActions() {
  const { t } = useTranslations();

  return (
    <div className="flex flex-wrap gap-4">
      <Button asChild size="lg">
        <a href="#projects">{t('hero.viewProjects')}</a>
      </Button>
      <Button asChild variant="outline" size="lg">
        <a href="/resume">{t('hero.downloadResume')}</a>
      </Button>
    </div>
  );
}
