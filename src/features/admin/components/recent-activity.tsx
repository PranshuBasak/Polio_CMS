'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Activity {
  id: number;
  action: string;
  description: string;
  timestamp: string;
  icon: string;
}

// Mock activity data
const activityData: Activity[] = [
  {
    id: 1,
    action: 'Updated Hero Section',
    description: 'Changed profile image and description',
    timestamp: '2 hours ago',
    icon: '🖼️',
  },
  {
    id: 2,
    action: 'Added New Project',
    description: 'API Gateway project with TypeScript',
    timestamp: 'Yesterday',
    icon: '📁',
  },
  {
    id: 3,
    action: 'Published Blog Post',
    description: 'Microservices vs Monoliths: Making the Right Choice',
    timestamp: '3 days ago',
    icon: '📝',
  },
  {
    id: 4,
    action: 'Updated Skills',
    description: 'Added Rust to learning skills',
    timestamp: '1 week ago',
    icon: '📊',
  },
  {
    id: 5,
    action: 'Refreshed External Posts',
    description: 'Updated RSS feeds from Medium and Dev.to',
    timestamp: '1 week ago',
    icon: '🔄',
  },
];

interface RecentActivityProps {
  className?: string;
  fullHeight?: boolean;
}

export default function RecentActivity({
  className,
  fullHeight = false,
}: RecentActivityProps) {
  return (
    <Card className={cn('col-span-4', className)}>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Your latest content updates and actions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className={cn('space-y-6', fullHeight && 'min-h-[400px]')}>
          {activityData.length > 0 ? (
            activityData.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4">
                <div className="flex-shrink-0 rounded-full bg-primary/10 p-2">
                  <span className="text-xl">{activity.icon}</span>
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {activity.action}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.timestamp}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-40">
              <p className="text-muted-foreground">
                No recent activity to display
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
