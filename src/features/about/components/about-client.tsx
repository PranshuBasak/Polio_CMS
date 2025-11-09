'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslations } from '@/lib/i18n/translations-context';
import type { AboutData } from '@/lib/types';
import { motion } from 'framer-motion';
import { AboutBio } from './about-bio';
import { AboutJourney } from './about-journey';
import { AboutValues } from './about-values';

/**
 * About Client - Client Component Wrapper
 *
 * Manages tab state and coordinates sub-components with enhanced styling
 */
interface AboutClientProps {
  aboutData: AboutData;
}

export function AboutClient({ aboutData }: AboutClientProps) {
  const { t } = useTranslations();

  return (
    <section id="about" className="section-container bg-dot-pattern">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="section-heading text-center">{t('about.title')}</h2>

        <Tabs defaultValue="bio" className="w-full max-w-5xl mx-auto">
          <TabsList className="grid grid-cols-3 mb-8 sm:mb-12 h-10 sm:h-12 bg-muted/50 w-full">
            <TabsTrigger value="bio" className="tab-enhanced text-xs sm:text-sm md:text-base px-2 sm:px-4">
              {t('about.tab.bio')}
            </TabsTrigger>
            <TabsTrigger value="journey" className="tab-enhanced text-xs sm:text-sm md:text-base px-2 sm:px-4">
              {t('about.tab.journey')}
            </TabsTrigger>
            <TabsTrigger value="values" className="tab-enhanced text-xs sm:text-sm md:text-base px-2 sm:px-4">
              {t('about.tab.values')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bio" className="space-y-6 animate-fade-in">
            <AboutBio bio={aboutData.bio} focus={aboutData.focus} />
          </TabsContent>

          <TabsContent value="journey" className="space-y-6 animate-fade-in">
            <AboutJourney journey={aboutData.journey} />
          </TabsContent>

          <TabsContent value="values" className="space-y-6 animate-fade-in">
            <AboutValues
              values={aboutData.values}
              mission={aboutData.mission}
            />
          </TabsContent>
        </Tabs>
      </motion.div>
    </section>
  );
}
