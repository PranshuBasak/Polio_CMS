'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface LiquidGlassProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  intensity?: 'sm' | 'md' | 'lg';
}

export function LiquidGlass({ children, className, intensity = 'md', ...props }: LiquidGlassProps) {
  const intensityMap = {
    sm: 'backdrop-blur-sm bg-background/30 border-white/10',
    md: 'backdrop-blur-md bg-background/40 border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]',
    lg: 'backdrop-blur-xl bg-background/60 border-white/30 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]',
  };

  return (
    <motion.div
      className={cn(
        'relative overflow-hidden rounded-[2rem] border',
        intensityMap[intensity],
        'before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none',
        className
      )}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      {...props as any}
    >
      {children}
    </motion.div>
  );
}
