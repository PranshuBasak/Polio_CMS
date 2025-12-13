'use client';

import type React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ArrowDown,
    ArrowUp,
    BarChart3,
    Eye,
    FileText,
    FolderKanban,
} from 'lucide-react';
import { useAdminStats } from '@/app/admin/_hooks/use-admin-stats';

type StatChangeType = 'increase' | 'decrease';

type Stat = {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  change: string;
  changeType: StatChangeType;
  changeText: string;
};

export default function AdminStats() {
  const { 
    totalProjects, 
    totalBlogPosts, 
    totalSkills, 
    totalPageViews, 
    pageViewsGrowth,
    statsGrowth 
  } = useAdminStats();

  const stats: Stat[] = [
    {
      title: 'Total Projects',
      value: totalProjects,
      icon: FolderKanban,
      change: `${statsGrowth.projects >= 0 ? '+' : ''}${statsGrowth.projects}%`,
      changeType: statsGrowth.projects >= 0 ? 'increase' : 'decrease',
      changeText: 'from last month',
    },
    {
      title: 'Blog Posts',
      value: totalBlogPosts,
      icon: FileText,
      change: `${statsGrowth.blog >= 0 ? '+' : ''}${statsGrowth.blog}%`,
      changeType: statsGrowth.blog >= 0 ? 'increase' : 'decrease',
      changeText: 'from last month',
    },
    {
      title: 'Skills',
      value: totalSkills,
      icon: BarChart3,
      change: `${statsGrowth.skills >= 0 ? '+' : ''}${statsGrowth.skills}%`,
      changeType: statsGrowth.skills >= 0 ? 'increase' : 'decrease',
      changeText: 'from last month',
    },
    {
      title: 'Page Views',
      value: totalPageViews.toLocaleString(),
      icon: Eye,
      change: `${pageViewsGrowth >= 0 ? '+' : ''}${pageViewsGrowth}%`,
      changeType: pageViewsGrowth >= 0 ? 'increase' : 'decrease',
      changeText: 'from last month',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card
          key={stat.title}
          className="overflow-hidden border-l-4 border-l-primary/70"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className="rounded-md bg-muted p-2">
              <stat.icon className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center text-xs mt-1">
              <span
                className={
                  stat.changeType === 'increase'
                    ? 'text-emerald-500 flex items-center'
                    : 'text-rose-500 flex items-center'
                }
              >
                {stat.changeType === 'increase' ? (
                  <ArrowUp className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDown className="h-3 w-3 mr-1" />
                )}
                {stat.change}
              </span>
              <span className="text-muted-foreground ml-1">
                {stat.changeText}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
