'use client';

import { Button } from '@/components/ui/button';
import { MockBrowserWindow } from '@/components/ui/mock-browser-window';
import { useAboutStore } from '@/lib/stores/about-store';
import { motion } from 'framer-motion';
import { ArrowRight, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { CYBERPUNK_MESSAGES } from '@/data/cyberpunk-messages';

export default function AboutSection() {
  const { aboutData } = useAboutStore();

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold text-primary font-mono">
                {CYBERPUNK_MESSAGES.headers.about[0]}
              </h2>
              <div className="h-1 w-20 bg-primary/50 rounded-full" />
            </div>

            <div className="prose prose-lg dark:prose-invert">
              <p className="text-muted-foreground leading-relaxed">
                {aboutData.bio}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/about">
                <Button variant="outline" className="rounded-full border-primary/50 hover:bg-primary/10 hover:text-primary group">
                  <User className="mr-2 h-4 w-4" />
                  Read Full Profile
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Visual Content - Mock Browser */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <MockBrowserWindow url="https://portfolio.exe/user/profile" title="User Profile">
              <div className="relative aspect-square md:aspect-video w-full overflow-hidden bg-muted/20">
                {aboutData.avatarUrl ? (
                  <Image
                    src={aboutData.avatarUrl}
                    alt="Profile"
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground font-mono">
                    [NO_IMAGE_DATA_FOUND]
                  </div>
                )}
                
                {/* Overlay UI elements to make it look like a profile scan */}
                <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="border border-primary/30 bg-black/50 backdrop-blur-sm px-2 py-1 text-xs font-mono text-primary rounded">
                      ID: 0x{Math.floor(Math.random() * 10000).toString(16)}
                    </div>
                    <div className="w-16 h-16 border-2 border-primary/30 rounded-full border-t-primary animate-spin duration-[3s]" />
                  </div>
                  <div className="space-y-1">
                    <div className="h-1 w-full bg-primary/20 overflow-hidden rounded-full">
                      <div className="h-full bg-primary w-[85%] animate-pulse" />
                    </div>
                    <div className="flex justify-between text-xs font-mono text-primary/70">
                      <span>SYNCING...</span>
                      <span>85%</span>
                    </div>
                  </div>
                </div>
              </div>
            </MockBrowserWindow>
            
            {/* Decorative background blob */}
            <div className="absolute -inset-4 bg-primary/20 blur-3xl -z-10 rounded-full opacity-50" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
