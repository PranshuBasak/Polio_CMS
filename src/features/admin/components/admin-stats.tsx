'use client';

import type React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBlogStore, useProjectsStore, useSkillsStore } from '@/lib/stores';
import {
    ArrowDown,
    ArrowUp,
    BarChart3,
    Eye,
    FileText,
    FolderKanban,
} from 'lucide-react';

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
  const projects = useProjectsStore((state) => state.projects);
  const internalPosts = useBlogStore((state) => state.internalPosts);
  const skills = useSkillsStore((state) => state.skills);

  const stats: Stat[] = [
    {
      title: 'Total Projects',
      value: projects?.length ?? 0,
      icon: FolderKanban,
      change: '+2',
      changeType: 'increase',
      changeText: 'from last month',
    },
    {
      title: 'Blog Posts',
      value: internalPosts?.length ?? 0,
      icon: FileText,
      change: '+1',
      changeType: 'increase',
      changeText: 'from last month',
    },
    {
      title: 'Skills',
      value: skills?.length ?? 0,
      icon: BarChart3,
      change: '+3',
      changeType: 'increase',
      changeText: 'from last month',
    },
    {
      title: 'Page Views',
      value: '1,234',
      icon: Eye,
      change: '-5%',
      changeType: 'decrease',
      changeText: 'from last week',
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
