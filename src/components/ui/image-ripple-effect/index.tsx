'use client';
import dynamic from 'next/dynamic';
import React from 'react';

const Scene = dynamic(() => import('./scene'), {
  ssr: false,
  loading: () => (
    <div className='flex w-full h-full justify-center items-center bg-muted/20 rounded-[2rem]'>
      <div className="animate-pulse w-full h-full rounded-[2rem] bg-muted/40" />
    </div>
  ),
});

interface ImageRippleEffectProps {
  imageUrl: string;
  className?: string;
}

export default function ImageRippleEffect({ imageUrl, className }: ImageRippleEffectProps) {
  return (
    <div className={className}>
      <Scene imageUrl={imageUrl} />
    </div>
  );
}
