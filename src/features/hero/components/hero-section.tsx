'use client';

import { Button } from '@/components/ui/button';
import { useHeroStore } from '@/lib/stores/hero-store';
import { useSiteSettingsStore } from '@/lib/stores/site-settings-store';
import { motion } from 'framer-motion';
import { ArrowRight, Download, Github, Linkedin, Mail, FileText } from 'lucide-react';
import Link from 'next/link';
import { CYBERPUNK_MESSAGES } from '@/data/cyberpunk-messages';
import { useEffect, useState } from 'react';
import { Waves } from '@/components/ui/wave-background';
import { Typewriter } from '@/components/ui/typewriter';
import ParallaxProfileImage from './parallax-profile-image';

export default function HeroSection() {
  const { heroData } = useHeroStore();
  const { settings } = useSiteSettingsStore();
  const [randomMessage, setRandomMessage] = useState('');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRandomMessage(CYBERPUNK_MESSAGES.hero[Math.floor(Math.random() * CYBERPUNK_MESSAGES.hero.length)]);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16 md:pt-0">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 opacity-30">
        <Waves 
          strokeColor={settings.appearance.primaryColor || "#00ff00"} 
          backgroundColor="transparent"
        />
      </div>
      
      <div className="container px-4 mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Info */}
          <div className="space-y-8 text-left">
            
            {/* Status Badge */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-mono backdrop-blur-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              {heroData.status || "STATUS: AVAILABLE FOR HIRE"}
            </motion.div>

            {/* Name & Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-2"
            >
              <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-foreground">
                {heroData.name}
              </h1>
              <h2 className="text-2xl md:text-3xl font-mono text-primary">
                &lt;{heroData.title} /&gt;
              </h2>
            </motion.div>

            {/* Description / About */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-muted-foreground max-w-xl leading-relaxed border-l-2 border-primary/20 pl-6 min-h-[100px]"
            >
              <Typewriter 
                text={heroData.description} 
                speed={20} 
                delay={0.5}
                className="text-muted-foreground"
                cursorClassName="bg-primary"
              />
            </motion.div>

            {/* Actions & Socials */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-6"
            >
              {/* Social Links */}
              <div className="flex items-center gap-4">
                <Link href={settings.social.github} target="_blank" className="p-2 rounded-full bg-muted/10 hover:bg-primary/20 text-muted-foreground hover:text-primary transition-all border border-transparent hover:border-primary/50">
                  <Github className="w-5 h-5" />
                </Link>
                <Link href={settings.social.linkedin} target="_blank" className="p-2 rounded-full bg-muted/10 hover:bg-primary/20 text-muted-foreground hover:text-primary transition-all border border-transparent hover:border-primary/50">
                  <Linkedin className="w-5 h-5" />
                </Link>
                <Link href={`mailto:${settings.social.email}`} className="p-2 rounded-full bg-muted/10 hover:bg-primary/20 text-muted-foreground hover:text-primary transition-all border border-transparent hover:border-primary/50">
                  <Mail className="w-5 h-5" />
                </Link>
                <Link href={settings.social.medium} target="_blank" className="p-2 rounded-full bg-muted/10 hover:bg-primary/20 text-muted-foreground hover:text-primary transition-all border border-transparent hover:border-primary/50">
                  <FileText className="w-5 h-5" />
                </Link>
              </div>

              {/* Resume Button */}
              <Link href="/resume">
                <Button size="lg" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-[0_0_15px_rgba(var(--primary),0.4)] hover:shadow-[0_0_25px_rgba(var(--primary),0.6)] transition-all">
                  <Download className="mr-2 h-4 w-4" />
                  Resume
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Right Column: Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px]">
               <ParallaxProfileImage 
                 imageUrl={heroData.avatarUrl || "https://media.licdn.com/dms/image/v2/D4D03AQHQrREy7e6Rtg/profile-displayphoto-scale_200_200/B4DZnJTBmyIgAY-/0/1760018833625?e=1764201600&v=beta&t=vyCLeSdMBoBRggqkBS6sLubEG0q6IUZIcbowwpyQ_Joi"}
               />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
