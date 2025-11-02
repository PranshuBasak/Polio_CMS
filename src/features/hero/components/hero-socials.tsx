'use client';

import { FileText, Github, Linkedin } from 'lucide-react';

/**
 * Hero Socials - Presentational Component
 *
 * Social media links with icons
 */
export function HeroSocials() {
  const socials = [
    {
      href: 'https://github.com/0xTanzim',
      icon: Github,
      label: 'GitHub',
    },
    {
      href: 'https://linkedin.com/in/0xTanzim',
      icon: Linkedin,
      label: 'LinkedIn',
    },
    {
      href: '/resume',
      icon: FileText,
      label: 'Resume',
    },
  ];

  return (
    <div className="flex mt-8 space-x-4">
      {socials.map((social) => {
        const Icon = social.icon;
        return (
          <a
            key={social.label}
            href={social.href}
            target={social.href.startsWith('http') ? '_blank' : undefined}
            rel={
              social.href.startsWith('http') ? 'noopener noreferrer' : undefined
            }
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label={social.label}
          >
            <Icon className="h-6 w-6" />
            <span className="sr-only">{social.label}</span>
          </a>
        );
      })}
    </div>
  );
}
