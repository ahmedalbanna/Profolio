'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, Timestamp } from 'firebase/firestore';
import { subDays, format, eachDayOfInterval } from 'date-fns';
import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const chartConfig = {
  visitors: {
    label: 'Visitors',
    color: 'hsl(var(--primary))',
  },
};

export function VisitorsChart() {
    const firestore = useFirestore();
    const sevenDaysAgo = subDays(new Date(), 7);

    const visitorsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(
            collection(firestore, 'visits'),
            where('timestamp', '>=', Timestamp.fromDate(sevenDaysAgo))
        );
    }, [firestore]);

    const { data: visits, isLoading } = useCollection(visitorsQuery);

    const chartData = useMemo(() => {
        if (!visits) return [];
        
        const interval = eachDayOfInterval({ start: sevenDaysAgo, end: new Date() });
        const dailyCounts = new Map<string, number>();
        interval.forEach(day => {
            dailyCounts.set(format(day, 'yyyy-MM-dd'), 0);
        });

        visits.forEach(visit => {
            const date = format(visit.timestamp.toDate(), 'yyyy-MM-dd');
            if (dailyCounts.has(date)) {
                dailyCounts.set(date, (dailyCounts.get(date) || 0) + 1);
            }
        });

        return Array.from(dailyCounts.entries()).map(([date, visitors]) => ({
            date,
            visitors
        })).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    }, [visits]);

    if(isLoading) {
        return (
             <Card>
                <CardHeader>
                    <Skeleton className="h-7 w-48" />
                    <Skeleton className="h-4 w-32" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-[200px] w-full" />
                </CardContent>
            </Card>
        )
    }

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
