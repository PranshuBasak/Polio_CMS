'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AdminHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    href: string;
  };
}

export default function AdminHeader({
  title,
  description,
  action,
}: AdminHeaderProps) {
  return (
    <div className="flex flex-col space-y-2 md:space-y-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h1
            className={cn(
              'text-xl md:text-2xl font-bold tracking-tight truncate pl-10 md:pl-0',
              'bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent'
            )}
          >
            {title}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {action && (
            <Button asChild size="sm" className="hidden sm:flex">
              <a href={action.href}>{action.label}</a>
            </Button>
          )}
        </div>
      </div>
      {description && (
        <p className="text-sm md:text-base text-muted-foreground max-w-4xl pl-10 md:pl-0">
          {description}
        </p>
      )}
      {action && (
        <div className="sm:hidden mt-2">
          <Button asChild className="w-full">
            <a href={action.href}>{action.label}</a>
          </Button>
        </div>
      )}
    </div>
  );
}
