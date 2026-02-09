'use client';

// import { useTranslations } from '@/lib/i18n/translations-context';
import type { HeroData } from '@/lib/types';
import GlowingAvatar from '@/shared/components/ui-enhancements/glowing-avatar';
import { motion } from 'framer-motion';
import { HeroActions } from './hero-actions';
import { HeroSocials } from './hero-socials';

/**
 * Hero Content - Presentational Component
 *
 * Pure UI component that displays hero data.
 * Uses client-side features for animations and i18n.
 */
interface HeroContentProps {
  heroData: HeroData;
}

export function HeroContent({ heroData }: HeroContentProps) {


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
          {heroData.name}
        </h1>
        <h2 className="text-2xl md:text-3xl text-muted-foreground mb-6">
          {heroData.title}
        </h2>
        <p className="text-lg mb-8 max-w-md">{heroData.description}</p>

        <HeroActions />
        <HeroSocials />
      </motion.div>

      <div className="flex justify-center">
        <GlowingAvatar
          src={heroData.avatarUrl || '/avatar-placeholder.svg'}
          alt={heroData.name}
          size={280}
        />
      </div>
    </div>
  );
}
