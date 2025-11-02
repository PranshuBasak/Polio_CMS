'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Edit, Plus, RefreshCw } from 'lucide-react';
import Link from 'next/link';

interface QuickActionsProps {
  className?: string;
}

export default function QuickActions({ className }: QuickActionsProps) {
  const actions = [
    {
      title: 'Edit Hero Section',
      description: 'Update your profile and headline',
      href: '/admin/hero',
      icon: Edit,
    },
    {
      title: 'Add New Project',
      description: 'Showcase your latest work',
      href: '/admin/projects/new',
      icon: Plus,
    },
    {
      title: 'Write Blog Post',
      description: 'Share your knowledge',
      href: '/admin/blog/new',
      icon: Plus,
    },
    {
      title: 'Refresh RSS Feeds',
      description: 'Update external content',
      href: '/admin/blog',
      icon: RefreshCw,
    },
  ];

  return (
    <Card className={cn('col-span-3', className)}>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks to manage your portfolio</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {actions.map((action) => (
            <Button
              key={action.title}
              variant="outline"
              className="justify-start h-auto py-3"
              asChild
            >
              <Link href={action.href}>
                <div className="flex items-center">
                  <action.icon className="mr-2 h-4 w-4" />
                  <div className="text-left">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {action.description}
                    </div>
                  </div>
                </div>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
