'use client';

import { BrandLogo } from '@/components/ui/brand-logo';
import { BuyMeCoffee } from '@/components/ui/buy-me-coffee';
import { FallingPattern } from '@/components/ui/falling-pattern';
import { CYBERPUNK_MESSAGES } from '@/data/cyberpunk-messages';
import { useTranslations } from '@/lib/i18n/translations-context';
import { useHeroStore, useSiteSettingsStore } from '@/lib/stores';
import { FileText, Github, Linkedin, Mail } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { memo, useEffect, useState } from 'react';

export default memo(function Footer() {
  const { t } = useTranslations();
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  const heroData = useHeroStore((state) => state.heroData);
  const settings = useSiteSettingsStore((state) => state.settings);
  const [randomFooterMessage, setRandomFooterMessage] = useState('');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRandomFooterMessage(
      CYBERPUNK_MESSAGES.footer[
        Math.floor(Math.random() * CYBERPUNK_MESSAGES.footer.length)
      ]
    );
  }, []);

  if (isAdmin) {
    return null;
  }

  return (
    <footer className="relative overflow-hidden border-t border-border/70 bg-background pb-24 md:pb-8">
      <div className="pointer-events-none absolute inset-0">
        <FallingPattern
          className="h-full w-full opacity-90 dark:opacity-95"
          color="var(--accent)"
          backgroundColor="transparent"
          duration={120}
          density={0.9}
          blurIntensity="0.35em"
          overlayOpacity={0.30}
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/30 via-background/55 to-background/80 dark:from-background/20 dark:via-background/45 dark:to-background/72" />

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-5">
          <div className="col-span-1 md:col-span-2">
            <div className="mb-4 flex items-center gap-3">
              <BrandLogo
                size={40}
                imageClassName="border border-primary/25 shadow-md shadow-primary/25"
              />
              <h3 className="bg-gradient-to-r from-primary to-accent bg-clip-text text-2xl font-bold text-transparent">
                {heroData.name || 'Pranshu Basak'}
              </h3>
            </div>
            <p className="mb-6 max-w-md text-sm font-mono text-primary/80">
              {randomFooterMessage}
            </p>
            <div className="flex space-x-4">
              <Link
                href={settings.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary/80 transition-all duration-200 hover:scale-110 hover:text-primary"
              >
                <Github className="h-6 w-6 [stroke-width:2.4]" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link
                href={settings.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary/80 transition-all duration-200 hover:scale-110 hover:text-primary"
              >
                <Linkedin className="h-6 w-6 [stroke-width:2.4]" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link
                href={`mailto:${settings.social.email}`}
                className="text-primary/80 transition-all duration-200 hover:scale-110 hover:text-primary"
              >
                <Mail className="h-6 w-6 [stroke-width:2.4]" />
                <span className="sr-only">Email</span>
              </Link>
              <Link
                href={settings.social.medium}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary/80 transition-all duration-200 hover:scale-110 hover:text-primary"
              >
                <FileText className="h-6 w-6 [stroke-width:2.4]" />
                <span className="sr-only">Medium</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-mono text-lg font-semibold text-primary">
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-2 text-sm font-mono">
              {['about', 'projects', 'skills', 'blog', 'contact'].map((item) => (
                <li key={item}>
                  <Link
                    href={`/#${item}`}
                    className="inline-block font-semibold text-primary/80 transition-colors duration-200 hover:translate-x-1 hover:text-primary"
                  >
                    {`> ${t(`nav.${item}`)}`}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-mono text-lg font-semibold text-primary">
              Legal
            </h3>
            <ul className="space-y-2 text-sm font-mono">
              <li>
                <Link
                  href="/privacy-policy"
                  className="inline-block font-semibold text-primary/80 transition-colors duration-200 hover:translate-x-1 hover:text-primary"
                >
                  {`> Privacy Policy`}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-and-conditions"
                  className="inline-block font-semibold text-primary/80 transition-colors duration-200 hover:translate-x-1 hover:text-primary"
                >
                  {`> Terms & Conditions`}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-mono text-lg font-semibold text-primary">
              Sponsor
            </h3>
            <BuyMeCoffee
              href="https://buymeacoffee.com/pranshubasak"
              classname="w-50 h-50"
              iconClassName="w-20 h-20 text-black-500"
              textSvgClassName="fill-current text-black-800"
            />
          </div>
        </div>

        <div className="mt-12 border-t border-primary/10 pt-6 text-center text-xs font-mono text-primary/40">
          <p>
            &copy; {new Date().getFullYear()} {heroData.name}. {t('footer.rights')}
          </p>
          <p className="mt-2 opacity-50">
            SYSTEM_STATUS: ONLINE | ENCRYPTION: 256-BIT | LOCATION: UNKNOWN
          </p>
        </div>
      </div>
    </footer>
  );
});
