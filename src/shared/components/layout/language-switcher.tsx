'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  useTranslations,
  type Language,
} from '@/lib/i18n/translations-context';
import { Check, Globe } from 'lucide-react';
import { useState } from 'react';

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useTranslations();
  const [isOpen, setIsOpen] = useState(false);

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: 'en', name: t('language.en'), flag: '🇺🇸' },
    { code: 'es', name: t('language.es'), flag: '🇪🇸' },
    { code: 'fr', name: t('language.fr'), flag: '🇫🇷' },
    { code: 'zh', name: t('language.zh'), flag: '🇨🇳' },
    { code: 'ar', name: t('language.ar'), flag: '🇸🇦' },
    { code: 'bn', name: t('language.bn'), flag: '🇧🇩' },
  ];

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Globe className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => {
              setLanguage(lang.code);
              setIsOpen(false);
            }}
            className="flex items-center justify-between"
          >
            <span>
              {lang.flag} {lang.name}
            </span>
            {language === lang.code && <Check className="h-4 w-4 ml-2" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
