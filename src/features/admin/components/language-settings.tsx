'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
  useTranslations,
  type Language,
} from '@/lib/i18n/translations-context';
import { useAboutStore, useHeroStore } from '@/lib/stores';
import { Info } from 'lucide-react';

export default function LanguageSettings() {
  const { toast } = useToast();
  const { language, setLanguage } = useTranslations();
  const heroData = useHeroStore((state) => state.heroData);
  const aboutData = useAboutStore((state) => state.aboutData);

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
  ];

  return (
    <div className="space-y-4">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Translation Management</AlertTitle>
        <AlertDescription>
          Translations are currently managed in the codebase
          (`src/lib/i18n/translations-context.tsx`). This page displays
          the current language settings and data from your stores.
          To edit translations, modify the translations context file directly.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="settings" className="space-y-4">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="settings">Language Settings</TabsTrigger>
          <TabsTrigger value="hero">Hero Content</TabsTrigger>
          <TabsTrigger value="about">About Content</TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Language</CardTitle>
              <CardDescription>
                Select your preferred language for the portfolio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {languages.map((lang) => (
                  <Button
                    key={lang.code}
                    variant={language === lang.code ? 'default' : 'outline'}
                    onClick={() => {
                      setLanguage(lang.code);
                      toast({
                        title: 'Language changed',
                        description: `Portfolio language set to ${lang.name}`,
                      });
                    }}
                    className="h-20 flex flex-col items-center justify-center gap-2"
                  >
                    <span className="text-3xl">{lang.flag}</span>
                    <span className="text-sm">{lang.name}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hero" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section Data</CardTitle>
              <CardDescription>
                Current hero section content (from Hero Store)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Name:</p>
                <p className="text-sm text-muted-foreground">{heroData.name}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Title:</p>
                <p className="text-sm text-muted-foreground">{heroData.title}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Description:</p>
                <p className="text-sm text-muted-foreground">{heroData.description}</p>
              </div>
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Edit hero content in Admin → Hero section
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>About Section Data</CardTitle>
              <CardDescription>
                Current about section content (from About Store)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Bio:</p>
                <p className="text-sm text-muted-foreground">{aboutData.bio}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Tagline:</p>
                <p className="text-sm text-muted-foreground">{aboutData.tagline}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Mission:</p>
                <p className="text-sm text-muted-foreground">{aboutData.mission}</p>
              </div>
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Edit about content in Admin → About section
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
