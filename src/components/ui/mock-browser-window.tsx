'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface MockBrowserWindowProps {
  children: React.ReactNode;
  className?: string;
  url?: string;
  title?: string;
}

export function MockBrowserWindow({
  children,
  className,
  url = 'https://portfolio.exe',
  title = 'Portfolio',
}: MockBrowserWindowProps) {
  return (
    <div className={cn("rounded-lg border border-primary/20 bg-black/80 backdrop-blur-sm overflow-hidden shadow-2xl shadow-primary/5", className)}>
      {/* Browser Toolbar */}
      <div className="flex items-center gap-4 px-4 py-3 border-b border-primary/10 bg-primary/5">
        {/* Window Controls */}
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/50" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
          <div className="w-3 h-3 rounded-full bg-green-500/50" />
        </div>

        {/* Navigation Controls */}
        <div className="flex gap-2 text-primary/40">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
        </div>

        {/* Address Bar */}
        <div className="flex-1 flex items-center justify-center px-4 py-1.5 rounded-md bg-black/50 border border-primary/10 text-xs text-primary/60 font-mono">
          <span className="mr-2 text-green-500">🔒</span>
          {url}
        </div>

        {/* Menu */}
        <div className="flex gap-1">
          <div className="w-1 h-1 rounded-full bg-primary/40" />
          <div className="w-1 h-1 rounded-full bg-primary/40" />
          <div className="w-1 h-1 rounded-full bg-primary/40" />
        </div>
      </div>

      {/* Content */}
      <div className="relative">
        {children}
        
        {/* Scanline overlay effect */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%] z-20 opacity-20" />
      </div>
    </div>
  );
}
