'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

// This is mock data. In a real application, you would fetch this from your analytics service.
const chartData = [
  { project: "QuantumLeap", views: 125 },
  { project: "ConnectSphere", views: 98 },
  { project: "Orion Site", views: 75 },
  { project: "Minerva", views: 50 },
];

const chartConfig = {
  views: {
    label: 'Views',
    color: 'hsl(var(--primary))',
  },
};

export function ProjectViewsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Views</CardTitle>
        <CardDescription>All-time view count per project</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
           <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ left: 10 }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="project"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              className="capitalize"
            />
            <XAxis dataKey="views" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="views"
              fill="var(--color-views)"
              radius={5}
              layout="vertical"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
