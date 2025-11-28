'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import type { Project } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';


const chartConfig = {
  views: {
    label: 'Views',
    color: 'hsl(var(--primary))',
  },
};

export function ProjectViewsChart() {
    const { user } = useUser();
    const firestore = useFirestore();

    const projectsQuery = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return query(
            collection(firestore, `users/${user.uid}/projects`),
            where('views', '>', 0),
            orderBy('views', 'desc')
        );
    }, [user, firestore]);
    
    const { data: projects, isLoading } = useCollection<Project>(projectsQuery);

    const chartData = (projects || [])
        .map(p => ({ project: p.title, views: p.views || 0 }))
        .slice(0, 5); // Limit to top 5 for readability


     if(isLoading) {
        return (
             <Card>
                <CardHeader>
                    <Skeleton className="h-7 w-48" />
                    <Skeleton className="h-4 w-40" />
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
        <CardTitle>Top Project Views</CardTitle>
        <CardDescription>All-time view count for your most popular projects</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
           <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ left: 10, right: 20 }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="project"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              className="capitalize"
               width={80}
               tick={{fontSize: 12}}
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
              label={{ position: 'right', fill: 'hsl(var(--foreground))', fontSize: 12 }}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
