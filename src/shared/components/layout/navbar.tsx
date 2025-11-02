'use client';

import { Button } from '@/components/ui/button';
import { useTranslations } from '@/lib/i18n/translations-context';
import { cn } from '@/lib/utils';
import { LanguageSwitcher } from '@/shared/components/layout/language-switcher';
import { ModeToggle } from '@/shared/components/layout/mode-toggle';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { memo, useCallback, useEffect, useState } from 'react';

const Navbar = memo(function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  const { t } = useTranslations();

  const navLinks = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.about'), href: '/#about' },
    { name: t('nav.projects'), href: '/projects' },
    { name: t('nav.skills'), href: '/#skills' },
    { name: t('nav.resume'), href: '/resume' },
    { name: t('nav.blog'), href: '/blog' },
    { name: t('nav.contact'), href: '/#contact' },
  ];

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 10);
  }, []);

  useEffect(() => {
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [handleScroll]);

  // Close mobile menu when route changes
  useEffect(() => {
    if (isOpen) {
      setIsOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled || isOpen
          ? 'bg-background shadow-sm'
          : 'bg-background/80 backdrop-blur-md'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                0xTanzim
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary relative group',
                  (pathname === link.href ||
                    (link.href === '/projects' &&
                      pathname.startsWith('/projects')) ||
                    (link.href === '/blog' && pathname.startsWith('/blog')) ||
                    (link.href === '/resume' &&
                      pathname.startsWith('/resume'))) &&
                    'text-primary'
                )}
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 h-0.5 bg-primary w-0 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
            {!isAdmin && (
              <Link href="/admin">
                <Button variant="outline" size="sm">
                  {t('nav.admin')}
                </Button>
              </Link>
            )}
            <LanguageSwitcher />
            <ModeToggle />
          </nav>

          {/* Mobile Navigation Toggle */}
          <div className="flex items-center md:hidden space-x-4">
            <LanguageSwitcher />
            <ModeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle Menu"
              className="relative z-50"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden bg-background border-t shadow-lg pt-16"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="container mx-auto px-4 py-8">
              <nav className="flex flex-col space-y-6">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        'text-lg font-medium py-2 transition-colors hover:text-primary flex items-center',
                        (pathname === link.href ||
                          (link.href === '/projects' &&
                            pathname.startsWith('/projects')) ||
                          (link.href === '/blog' &&
                            pathname.startsWith('/blog')) ||
                          (link.href === '/resume' &&
                            pathname.startsWith('/resume'))) &&
                          'text-primary'
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
                {!isAdmin && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: navLinks.length * 0.05 }}
                  >
                    <Link href="/admin" onClick={() => setIsOpen(false)}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full bg-transparent"
                      >
                        {t('nav.admin')}
                      </Button>
                    </Link>
                  </motion.div>
                )}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
});

export default Navbar;
