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
 * Manages tab state and coordinates sub-components
 */
interface AboutClientProps {
  aboutData: AboutData;
}

export function AboutClient({ aboutData }: AboutClientProps) {
  const { t } = useTranslations();

  return (
    <section id="about" className="section-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="section-heading text-center">{t('about.title')}</h2>

        <Tabs defaultValue="bio" className="w-full max-w-4xl mx-auto">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="bio">{t('about.tab.bio')}</TabsTrigger>
            <TabsTrigger value="journey">{t('about.tab.journey')}</TabsTrigger>
            <TabsTrigger value="values">{t('about.tab.values')}</TabsTrigger>
          </TabsList>

          <TabsContent value="bio" className="space-y-6">
            <AboutBio bio={aboutData.bio} focus={aboutData.focus} />
          </TabsContent>

          <TabsContent value="journey" className="space-y-6">
            <AboutJourney journey={aboutData.journey} />
          </TabsContent>

          <TabsContent value="values" className="space-y-6">
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
