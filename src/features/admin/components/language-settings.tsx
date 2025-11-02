'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  useTranslations,
  type Language,
} from '@/lib/i18n/translations-context';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

export default function LanguageSettings() {
  const { toast } = useToast();
  const { language, setLanguage, t } = useTranslations();
  const [isLoading, setIsLoading] = useState(false);

  // Mock translation settings - in a real implementation, this would come from your data provider
  const [translations, setTranslations] = useState({
    hero: {
      title: {
        en: 'Software Architect & Backend Developer',
        es: 'Arquitecto de Software y Desarrollador Backend',
        fr: 'Architecte Logiciel et Développeur Backend',
        zh: '软件架构师和后端开发人员',
        ar: 'مهندس برمجيات ومطور خلفية',
        bn: 'সফটওয়্যার আর্কিটেক্ট এবং ব্যাকএন্ড ডেভেলপার',
      },
      description: {
        en: 'I build scalable backend systems and architect software solutions with a focus on performance, security, and maintainability.',
        es: 'Construyo sistemas backend escalables y arquitecto soluciones de software con un enfoque en rendimiento, seguridad y mantenibilidad.',
        fr: 'Je construis des systèmes backend évolutifs et conçois des solutions logicielles axées sur la performance, la sécurité et la maintenabilité.',
        zh: '我构建可扩展的后端系统并设计软件解决方案，注重性能、安全性和可维护性。',
        ar: 'أقوم ببناء أنظمة خلفية قابلة للتوسع وتصميم حلول برمجية مع التركيز على الأداء والأمان وقابلية الصيانة.',
        bn: 'আমি স্কেলেবল ব্যাকএন্ড সিস্টেম তৈরি করি এবং পারফরম্যান্স, সিকিউরিটি এবং মেইনটেইনেবিলিটি ফোকাস করে সফটওয়্যার সলিউশন ডিজাইন করি।',
      },
    },
    about: {
      bio: {
        en: "I'm a software architect and backend developer with expertise in TypeScript, Java, Spring Boot, and Node.js. I specialize in designing and implementing scalable, maintainable, and secure backend systems.",
        es: 'Soy un arquitecto de software y desarrollador backend con experiencia en TypeScript, Java, Spring Boot y Node.js. Me especializo en diseñar e implementar sistemas backend escalables, mantenibles y seguros.',
        fr: "Je suis un architecte logiciel et développeur backend avec une expertise en TypeScript, Java, Spring Boot et Node.js. Je me spécialise dans la conception et l'implémentation de systèmes backend évolutifs, maintenables et sécurisés.",
        zh: '我是一名软件架构师和后端开发人员，擅长TypeScript、Java、Spring Boot和Node.js。我专注于设计和实现可扩展、可维护和安全的后端系统。',
        ar: 'أنا مهندس برمجيات ومطور خلفية مع خبرة في تايب سكريبت، جافا، سبرينج بوت، ونود.جيه إس. أتخصص في تصميم وتنفيذ أنظمة خلفية قابلة للتوسع وقابلة للصيانة وآمنة.',
        bn: 'আমি একজন সফটওয়্যার আর্কিটেক্ট এবং ব্যাকএন্ড ডেভেলপার যার টাইপস্ক্রিপ্ট, জাভা, স্প্রিং বুট এবং নোড.জেএস এ দক্ষতা রয়েছে। আমি স্কেলেবল, মেইনটেইনেবল এবং সিকিউর ব্যাকএন্ড সিস্টেম ডিজাইন এবং ইমপ্লিমেন্ট করতে বিশেষজ্ঞ।',
      },
    },
  });

  const handleChange = (
    section: string,
    field: string,
    lang: Language,
    value: string
  ) => {
    setTranslations((prev) => {
      const section_key = section as keyof typeof prev;
      const section_data = prev[section_key];
      if (typeof section_data !== 'object' || section_data === null)
        return prev;

      const field_key = field as keyof typeof section_data;
      const field_data = section_data[field_key];
      if (typeof field_data !== 'object' || field_data === null) return prev;

      return {
        ...prev,
        [section]: {
          ...section_data,
          [field]: {
            ...(field_data as Record<string, string>),
            [lang]: value,
          },
        },
      };
    });
  };

  const handleSave = () => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: 'Translations saved',
        description: 'Your translations have been saved successfully.',
      });

      setIsLoading(false);
    }, 1000);
  };

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
  ];

  return (
    <Tabs defaultValue="hero" className="space-y-4">
      <TabsList className="grid grid-cols-3">
        <TabsTrigger value="hero">Hero Section</TabsTrigger>
        <TabsTrigger value="about">About Section</TabsTrigger>
        <TabsTrigger value="projects">Projects</TabsTrigger>
      </TabsList>

      <TabsContent value="hero" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Hero Section Translations</CardTitle>
            <CardDescription>
              Manage translations for the hero section of your portfolio
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {languages.map((lang) => (
              <div
                key={lang.code}
                className="space-y-4 border-b pb-4 last:border-0"
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{lang.flag}</span>
                  <h3 className="text-lg font-medium">{lang.name}</h3>
                </div>

                <div className="space-y-4 pl-8">
                  <div className="space-y-2">
                    <Label htmlFor={`hero-title-${lang.code}`}>Title</Label>
                    <Input
                      id={`hero-title-${lang.code}`}
                      value={translations.hero.title[lang.code]}
                      onChange={(e) =>
                        handleChange('hero', 'title', lang.code, e.target.value)
                      }
                      dir={lang.code === 'ar' ? 'rtl' : 'ltr'}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`hero-description-${lang.code}`}>
                      Description
                    </Label>
                    <Textarea
                      id={`hero-description-${lang.code}`}
                      value={translations.hero.description[lang.code]}
                      onChange={(e) =>
                        handleChange(
                          'hero',
                          'description',
                          lang.code,
                          e.target.value
                        )
                      }
                      rows={3}
                      dir={lang.code === 'ar' ? 'rtl' : 'ltr'}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="about" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>About Section Translations</CardTitle>
            <CardDescription>
              Manage translations for the about section of your portfolio
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {languages.map((lang) => (
              <div
                key={lang.code}
                className="space-y-4 border-b pb-4 last:border-0"
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{lang.flag}</span>
                  <h3 className="text-lg font-medium">{lang.name}</h3>
                </div>

                <div className="space-y-4 pl-8">
                  <div className="space-y-2">
                    <Label htmlFor={`about-bio-${lang.code}`}>Bio</Label>
                    <Textarea
                      id={`about-bio-${lang.code}`}
                      value={translations.about.bio[lang.code]}
                      onChange={(e) =>
                        handleChange('about', 'bio', lang.code, e.target.value)
                      }
                      rows={4}
                      dir={lang.code === 'ar' ? 'rtl' : 'ltr'}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="projects" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Projects Translations</CardTitle>
            <CardDescription>
              Manage translations for your projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Select a project from the projects section to manage its
              translations.
            </p>
          </CardContent>
        </Card>
      </TabsContent>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Translations'}
        </Button>
      </div>
    </Tabs>
  );
}
