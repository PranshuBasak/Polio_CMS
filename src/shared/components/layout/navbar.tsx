'use client';

import { Button } from '@/components/ui/button';
import { useTranslations } from '@/lib/i18n/translations-context';
import { cn } from '@/lib/utils';
import { LanguageSwitcher } from '@/shared/components/layout/language-switcher';
import { ModeToggle } from '@/shared/components/layout/mode-toggle';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { LiquidGlass } from '@/components/ui/liquid-glass';
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

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('mobile-sidebar');
      const toggle = document.getElementById('mobile-toggle');
      if (isOpen && sidebar && !sidebar.contains(event.target as Node) && toggle && !toggle.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Right Sidebar Logic
  return (
    <>
      {/* Mobile Toggle Button - Top Right */}
      <div className="fixed top-4 right-4 z-50 md:hidden">
        <LiquidGlass className="p-2">
          <Button 
            id="mobile-toggle"
            variant="ghost" 
            size="icon" 
            onClick={() => setIsOpen(!isOpen)}
            className="text-primary hover:text-accent hover:bg-accent/10"
          >
            {isOpen ? <X /> : <Menu />}
          </Button>
        </LiquidGlass>
      </div>

      {/* Sidebar Container */}
      <header 
        id="mobile-sidebar"
        className={cn(
          "fixed z-40 transition-all duration-300",
          // Desktop: Bottom Center, Always Visible
          "md:bottom-8 md:left-1/2 md:-translate-x-1/2 md:right-auto md:top-auto md:translate-y-0 md:opacity-100 md:pointer-events-auto",
          // Mobile: Top Right, Collapsible
          "top-20 right-4 bottom-auto left-auto",
          isOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-4 pointer-events-none md:opacity-100 md:translate-y-0 md:pointer-events-auto"
        )}
      >
        <LiquidGlass className="p-2">
          <div className={cn(
            "flex items-center justify-center gap-4 px-2 py-0",
            "flex-col-reverse",
            "md:flex-row md:gap-8"
          )}>
            
            {/* Actions (Language/Theme) */}
            <div className={cn(
              "flex gap-2 shrink-0",
              "flex-col md:flex-row"
            )}>
               <div className="scale-90 shrink-0 hover:text-primary">
                  <ModeToggle />
                </div>
                <div className="scale-90 shrink-0 hover:text-primary">
                  <LanguageSwitcher />
                </div>
                {!isAdmin && (
                  <Link href="/admin" className="p-2 rounded-full hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors shrink-0 flex items-center justify-center">
                    <span className="sr-only">{t('nav.admin')}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
                  </Link>
                )}
            </div>

            <div className="w-6 h-px bg-primary/20 md:w-px md:h-6 shrink-0" />

            {/* Navigation Items */}
            <nav className={cn(
              "flex items-center gap-2",
              "flex-col md:flex-row md:gap-6"
            )}>
              {navLinks.slice(1).map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    'px-4 py-2 rounded-full transition-all relative group shrink-0 font-mono text-sm font-bold whitespace-nowrap',
                    (pathname === link.href || pathname.startsWith(link.href) && link.href !== '/') 
                      ? 'text-primary bg-primary/10' 
                      : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Home / Logo */}
            <Link href="/" className="p-2 rounded-full hover:bg-primary/10 text-primary hover:text-primary transition-colors shrink-0 md:order-first">
              <div className="w-8 h-8 flex items-center justify-center font-bold font-mono text-lg border-2 border-current rounded-full">
                0x
              </div>
            </Link>

          </div>
        </LiquidGlass>
      </header>
    </>
  );
});

export default Navbar;
