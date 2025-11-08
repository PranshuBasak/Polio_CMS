'use client';

import { Image as ImageIcon, User } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface PlaceholderImageProps {
  src?: string | null;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  type?: 'avatar' | 'project' | 'thumbnail';
}

/**
 * PlaceholderImage Component
 *
 * A robust image component with built-in fallback handling.
 * Generates beautiful gradient placeholders when images fail to load.
 *
 * @param src - Image source URL
 * @param alt - Alternative text for accessibility
 * @param width - Image width (required if not using fill)
 * @param height - Image height (required if not using fill)
 * @param className - Additional CSS classes
 * @param priority - Whether to prioritize loading
 * @param fill - Whether to fill the parent container
 * @param type - Type of placeholder to show (avatar, project, thumbnail)
 */
export function PlaceholderImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  fill = false,
  type = 'thumbnail',
}: PlaceholderImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Generate gradient based on alt text for consistency
  const generateGradient = () => {
    const hash = alt.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);

    const hue1 = (Math.abs(hash) % 360);
    const hue2 = (Math.abs(hash) % 360 + 60) % 360;

    return `linear-gradient(135deg, hsl(${hue1}, 70%, 60%) 0%, hsl(${hue2}, 75%, 65%) 100%)`;
  };

  const renderFallback = () => {
    const Icon = type === 'avatar' ? User : ImageIcon;

    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10 ${className}`}
        style={{
          background: generateGradient(),
          width: fill ? '100%' : width,
          height: fill ? '100%' : height,
        }}
      >
        <Icon className="w-1/3 h-1/3 text-white/80" />
      </div>
    );
  };

  // If no src or error occurred, show fallback
  if (!src || imageError) {
    return renderFallback();
  }

  // Clean the src - remove query strings that cause issues
  const cleanSrc = src.split('?')[0];

  return (
    <div className={`relative ${fill ? 'w-full h-full' : ''}`}>
      {isLoading && (
        <div
          className={`absolute inset-0 animate-pulse bg-muted ${className}`}
          style={{ width: fill ? '100%' : width, height: fill ? '100%' : height }}
        />
      )}
      <Image
        src={cleanSrc}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        className={className}
        priority={priority}
        onError={() => setImageError(true)}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
}
