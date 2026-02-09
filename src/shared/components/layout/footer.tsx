'use client';

import { useTranslations } from '@/lib/i18n/translations-context';
import { useHeroStore, useSiteSettingsStore } from '@/lib/stores';
import { FileText, Github, Linkedin, Mail } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { memo, useEffect, useState } from 'react';
import { CYBERPUNK_MESSAGES } from '@/data/cyberpunk-messages';

export default memo(function Footer() {
  const { t } = useTranslations();
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  const heroData = useHeroStore((state) => state.heroData);
  const settings = useSiteSettingsStore((state) => state.settings);
  const { settings: siteSettings } = useSiteSettingsStore();

  const [randomFooterMessage, setRandomFooterMessage] = useState('');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRandomFooterMessage(CYBERPUNK_MESSAGES.footer[Math.floor(Math.random() * CYBERPUNK_MESSAGES.footer.length)]);
  }, []);

  // Hide footer on admin pages
  if (isAdmin) {
    return null;
  }

  return (
    <footer className="relative border-t border-primary/20 bg-black/95 overflow-hidden pb-24 md:pb-8">
      {/* Sparkles / Background Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-1 h-1 bg-primary rounded-full animate-ping" style={{ animationDuration: '3s' }} />
        <div className="absolute top-10 right-1/4 w-1 h-1 bg-accent rounded-full animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }} />
        <div className="absolute bottom-10 left-1/3 w-1 h-1 bg-primary rounded-full animate-ping" style={{ animationDuration: '5s', animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {heroData.name || '0xPranshu'}
            </h3>
            <p className="text-sm text-primary/80 max-w-md mb-6 font-mono">
              {randomFooterMessage}
            </p>
            <div className="flex space-x-4">
              <Link
                href={settings.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary/60 hover:text-primary transition-colors hover:scale-110 transform duration-200"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link
                href={settings.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary/60 hover:text-primary transition-colors hover:scale-110 transform duration-200"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link
                href={`mailto:${settings.social.email}`}
                className="text-primary/60 hover:text-primary transition-colors hover:scale-110 transform duration-200"
              >
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </Link>
              <Link
                href={settings.social.medium}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary/60 hover:text-primary transition-colors hover:scale-110 transform duration-200"
              >
                <FileText className="h-5 w-5" />
                <span className="sr-only">Medium</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary font-mono">
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-2 text-sm font-mono">
              {['about', 'projects', 'skills', 'blog', 'contact'].map((item) => (
                <li key={item}>
                  <Link
                    href={`/#${item}`}
                    className="text-primary/60 hover:text-primary transition-colors hover:translate-x-1 inline-block duration-200"
                  >
                    {`> ${t(`nav.${item}`)}`}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary font-mono">
              Sponsor
            </h3>
            <a
              href="https://www.buymeacoffee.com/pranshubasak" // Replace with actual link if available or dynamic
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FFDD00] text-black font-bold hover:bg-[#FFDD00]/90 transition-all hover:scale-105 shadow-lg shadow-yellow-500/20"
            >
              <span role="img" aria-label="coffee">☕</span>
              Buy me a coffee
            </a>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-primary/10 text-center text-xs text-primary/40 font-mono">
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
