import { cn } from '@/lib/utils';
import Image from 'next/image';

type BrandLogoProps = {
  size?: number;
  className?: string;
  imageClassName?: string;
  showLabel?: boolean;
  label?: string;
  labelClassName?: string;
  priority?: boolean;
};

export function BrandLogo({
  size = 36,
  className,
  imageClassName,
  showLabel = false,
  label = 'Pranshu Basak Portfolio',
  labelClassName,
  priority = false,
}: BrandLogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <Image
        src="/AppIcon.png"
        alt="Portfolio logo"
        width={size}
        height={size}
        priority={priority}
        className={cn('rounded-full object-cover', imageClassName)}
      />
      {showLabel ? (
        <span className={cn('font-semibold text-foreground', labelClassName)}>
          {label}
        </span>
      ) : null}
    </span>
  );
}

export default BrandLogo;

