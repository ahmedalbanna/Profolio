'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

// This is mock data. In a real application, you would fetch this from your analytics service.
const chartData = [
  { date: '2024-05-20', visitors: 12 },
  { date: '2024-05-21', visitors: 18 },
  { date: '2024-05-22', visitors: 15 },
  { date: '2024-05-23', visitors: 25 },
  { date: '2024-05-24', visitors: 22 },
  { date: '2024-05-25', visitors: 30 },
  { date: '2024-05-26', visitors: 28 },
];

const chartConfig = {
  visitors: {
    label: 'Visitors',
    color: 'hsl(var(--primary))',
  },
};

export function VisitorsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Website Visitors</CardTitle>
        <CardDescription>Last 7 Days</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="visitors" fill="var(--color-visitors)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
