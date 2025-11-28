'use client';
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { VisitorsChart } from "@/components/admin/charts/VisitorsChart";
import { ProjectViewsChart } from "@/components/admin/charts/ProjectViewsChart";

export default function AdminDashboardPage() {
  return (
    <div className="animate-in fade-in-0 duration-500 space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <VisitorsChart />
        <ProjectViewsChart />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Welcome to your Dashboard</CardTitle>
          <CardDescription>
            This is where you can manage your portfolio content and view analytics.
            The charts above are currently using mock data.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <p>Use the navigation on the left to manage your Experience, Projects, and Education, or to update your personal Settings.</p>
        </CardContent>
      </Card>
    </div>
  );
}
