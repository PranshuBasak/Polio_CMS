'use client';

import { Card } from '@/components/ui/card';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type ChartData = {
  date: string;
  value: number;
};

// Generate random data for the chart
const generateData = (): ChartData[] => {
  const data: ChartData[] = [];
  const now = new Date();

  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    data.push({
      date: date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      value: Math.floor(Math.random() * 100) + 50,
    });
  }

  return data;
};

export default function AdminActivityChart() {
  const data = generateData();

  return (
    <div className="w-full h-[300px]">
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 10,
              left: 10,
              bottom: 0,
            }}
          >
            <XAxis
              dataKey="date"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => value}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <Card className="p-2 border shadow-sm">
                      <div className="text-xs text-muted-foreground">
                        {payload[0].payload.date}
                      </div>
                      <div className="font-bold">{payload[0].value} views</div>
                    </Card>
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, style: { fill: 'hsl(var(--primary))' } }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Loading chart data...</p>
        </div>
      )}
    </div>
  );
}
