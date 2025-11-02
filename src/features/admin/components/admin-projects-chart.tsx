'use client';

import { Card } from '@/components/ui/card';
import { useProjectsStore } from '@/lib/stores';
import { useEffect, useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

type ChartData = {
  name: string;
  value: number;
};

export default function AdminProjectsChart() {
  const projects = useProjectsStore((state) => state.projects);
  const [data, setData] = useState<ChartData[]>([
    { name: 'TypeScript', value: 4 },
    { name: 'React', value: 3 },
    { name: 'Node.js', value: 3 },
    { name: 'Next.js', value: 2 },
    { name: 'Tailwind', value: 2 },
  ]);

  useEffect(() => {
    // Process project data to get categories
    const categories = new Map<string, number>();

    if (projects && projects.length > 0) {
      projects.forEach((project) => {
        if (project.technologies && project.technologies.length > 0) {
          project.technologies.forEach((tech) => {
            categories.set(tech, (categories.get(tech) || 0) + 1);
          });
        }
      });

      // Convert to chart data format
      const chartData = Array.from(categories.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5); // Take top 5 categories

      // Use requestAnimationFrame to delay state update
      const frame = requestAnimationFrame(() => {
        setData(chartData);
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [projects]);

  // Colors for the pie chart
  const COLORS = [
    'hsl(var(--primary))',
    'hsl(var(--primary) / 0.8)',
    'hsl(var(--primary) / 0.6)',
    'hsl(var(--primary) / 0.4)',
    'hsl(var(--primary) / 0.2)',
  ];

  return (
    <div className="w-full h-[300px] flex items-center justify-center">
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              label={(props: { name?: string; percent?: number }) =>
                `${props.name} (${((props.percent ?? 0) * 100).toFixed(0)}%)`
              }
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <Card className="p-2 border shadow-sm">
                      <div className="font-bold">{payload[0].name}</div>
                      <div className="text-xs text-muted-foreground">
                        {payload[0].value} project
                        {payload[0].value !== 1 ? 's' : ''}
                      </div>
                    </Card>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-muted-foreground text-sm">
          Loading project data...
        </div>
      )}
    </div>
  );
}
