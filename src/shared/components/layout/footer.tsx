'use client';

import { useTranslations } from '@/lib/i18n/translations-context';
import { useHeroStore, useSiteSettingsStore } from '@/lib/stores';
import { FileText, Github, Linkedin, Mail } from 'lucide-react';
import Link from 'next/link';
import { memo } from 'react';

export default memo(function Footer() {
  const { t } = useTranslations();
  const heroData = useHeroStore((state) => state.heroData);
  const settings = useSiteSettingsStore((state) => state.settings);

  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">{heroData.name}</h3>
            <p className="text-sm text-muted-foreground">
              {heroData.title}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/#about"
                  className="hover:text-primary transition-colors"
                >
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link
                  href="/#projects"
                  className="hover:text-primary transition-colors"
                >
                  {t('nav.projects')}
                </Link>
              </li>
              <li>
                <Link
                  href="/#skills"
                  className="hover:text-primary transition-colors"
                >
                  {t('nav.skills')}
                </Link>
              </li>
              <li>
                <Link
                  href="/#blog"
                  className="hover:text-primary transition-colors"
                >
                  {t('nav.blog')}
                </Link>
              </li>
              <li>
                <Link
                  href="/#contact"
                  className="hover:text-primary transition-colors"
                >
                  {t('nav.contact')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">
              {t('footer.connect')}
            </h3>
            <div className="flex space-x-4">
              <Link
                href={settings.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link
                href={settings.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link
                href={`mailto:${settings.social.email}`}
                className="hover:text-primary transition-colors"
              >
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </Link>
              <Link
                href={settings.social.medium}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                <FileText className="h-5 w-5" />
                <span className="sr-only">Medium</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>{t('footer.copyright')}</p>
          <p className="mt-2">
            &copy; {new Date().getFullYear()} {heroData.name}. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
});
