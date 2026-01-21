'use client';

import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useCursorStore } from '@/lib/stores/cursor-store';
import { useSiteSettingsStore } from '@/lib/stores/site-settings-store';
import { cn } from '@/lib/utils';

interface ParallaxProfileImageProps {
  imageUrl: string;
  className?: string;
}

export default function ParallaxProfileImage({ imageUrl, className }: ParallaxProfileImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { setCursorColor, setCursorVariant, resetCursor } = useCursorStore();
  const { settings } = useSiteSettingsStore();
  const primaryColor = settings.appearance.primaryColor || '#22c55e'; // Default to green if not set

  // Motion values for 3D tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth spring animation for tilt
  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

  // Transform mouse position to rotation degrees
  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-15deg", "15deg"]);

  // Handle mouse move for tilt effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseXPos = e.clientX - rect.left;
    const mouseYPos = e.clientY - rect.top;

    const xPct = mouseXPos / width - 0.5;
    const yPct = mouseYPos / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    resetCursor();
  };

  const handleMouseEnter = () => {
    setCursorColor(primaryColor);
    setCursorVariant('hover');
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={cn("relative w-full h-full perspective-1000 cursor-none group", className)}
    >
      {/* Background Ring - Changes color on hover */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center transform-style-3d translate-z-[-50px]">
        <div 
          className="w-[120%] h-[120%] rounded-full transition-all duration-500 ease-out opacity-0 group-hover:opacity-100 blur-md"
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3cellipse cx='50%25' cy='50%25' rx='48%25' ry='48%25' fill='none' stroke='${encodeURIComponent(primaryColor)}' stroke-width='40' stroke-dasharray='20, 30' stroke-linecap='round'/%3e%3c/svg%3e")`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
        />
      </div>

      {/* Main Image Container */}
      <div 
        className="relative w-full h-full rounded-[2rem] overflow-hidden border-2 transition-colors duration-300 bg-black/50 backdrop-blur-sm transform-style-3d"
        style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
      >
        {/* Dynamic Border Overlay - Sticks to image */}
        <div 
          className="absolute inset-0 rounded-[2rem] border-2 opacity-50 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-30"
          style={{ borderColor: primaryColor }}
        />
        
        {/* Image */}
        <div className="relative w-full h-full transform-style-3d translate-z-[20px]">
          <Image
            src={imageUrl}
            alt="Profile"
            fill
            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 ease-out scale-105 group-hover:scale-110"
            priority
          />
        </div>

        {/* Cyberpunk Overlay Elements */}
        <div className="absolute inset-0 pointer-events-none z-20 transform-style-3d translate-z-[40px]">
          
          {/* Corner Accents - Dynamic Color */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 transition-colors duration-300 rounded-tl-lg" style={{ borderColor: primaryColor }} />
          <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 transition-colors duration-300 rounded-tr-lg" style={{ borderColor: primaryColor }} />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 transition-colors duration-300 rounded-bl-lg" style={{ borderColor: primaryColor }} />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 transition-colors duration-300 rounded-br-lg" style={{ borderColor: primaryColor }} />

          {/* Status Dot */}
          <div className="absolute top-1/2 left-4 -translate-y-1/2 flex flex-col items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full animate-pulse" 
              style={{ 
                backgroundColor: primaryColor,
                boxShadow: `0 0 10px ${primaryColor}` 
              }} 
            />
          </div>

          {/* System Online Badge - Moved Down */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
             <div 
               className="px-4 py-1 bg-black/80 border rounded-full text-[10px] font-mono tracking-widest backdrop-blur-md"
               style={{ 
                 borderColor: `${primaryColor}80`, // 50% opacity
                 color: primaryColor,
                 boxShadow: `0 0 20px ${primaryColor}4d` // 30% opacity
               }}
             >
                SYSTEM_ONLINE
             </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
