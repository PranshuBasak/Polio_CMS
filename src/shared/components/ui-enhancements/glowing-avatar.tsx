'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface GlowingAvatarProps {
  src: string;
  alt: string;
  size?: number;
  glowColor?: string;
}

export default function GlowingAvatar({
  src,
  alt,
  size = 200,
  glowColor = '#3b82f6',
}: GlowingAvatarProps) {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, ${glowColor}40 0%, transparent 70%)`,
          filter: 'blur(15px)',
        }}
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.7, 0.9, 0.7],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: 'reverse',
        }}
      />
      <div
        className="relative rounded-full overflow-hidden border-4 border-primary/20"
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        <Image
          src={src || '/placeholder.svg'}
          alt={alt}
          fill
          className="object-cover transition-transform duration-500 hover:scale-110"
          priority
        />
      </div>
    </motion.div>
  );
}
