'use client';

import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import Image from 'next/image';

interface GlowingAvatarProps {
  src?: string;
  alt: string;
  size?: number;
}

export default function GlowingAvatar({
  src,
  alt,
  size = 200,
}: GlowingAvatarProps) {
  // Generate a beautiful gradient placeholder
  const gradientPlaceholder = `data:image/svg+xml;base64,${btoa(`
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:rgb(79, 70, 229);stop-opacity:1" />
          <stop offset="100%" style="stop-color:rgb(124, 58, 237);stop-opacity:1" />
        </linearGradient>
      </defs>
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="url(#grad)"/>
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 3}" fill="white" fill-opacity="0.2"/>
    </svg>
  `)}`;

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated glow effect using CSS classes */}
      <motion.div
        className="absolute inset-0 rounded-full bg-primary/30 blur-2xl"
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
      />

      {/* Avatar container */}
      <div
        className="relative rounded-full overflow-hidden border-4 border-primary/20 shadow-2xl bg-gradient-to-br from-primary to-accent"
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover transition-transform duration-500 hover:scale-110"
            priority
            onError={(e) => {
              // Fallback to placeholder on error
              const target = e.target as HTMLImageElement;
              target.src = gradientPlaceholder;
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User className="w-1/2 h-1/2 text-white/80" />
          </div>
        )}
      </div>
    </motion.div>
  );
}
