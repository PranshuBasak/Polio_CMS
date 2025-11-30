'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AdminActivityChart,
  AdminProjectsChart,
  AdminStats,
  QuickActions,
  RecentActivity,
} from '@/features/admin/components';
import AdminHeader from '@/features/admin/components/admin-header';
import { ErrorBoundary } from '@/shared/components/ui-enhancements/error-boundary';
import { useAdminStats } from '../../_hooks/use-admin-stats';

/**
 * Container component for Admin Dashboard
 * Handles data aggregation and layout
 */
export function AdminDashboardContainer() {
  // const stats = useAdminStats(); // stats is unused

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Dashboard"
        description="Welcome to your portfolio admin dashboard. Manage your content and track performance."
      />

      <ErrorBoundary>
        <AdminStats />
      </ErrorBoundary>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full md:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Visitor Activity</CardTitle>
                <CardDescription>
                  Page views over the last 30 days
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ErrorBoundary>
                  <AdminActivityChart />
                </ErrorBoundary>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Projects by Category</CardTitle>
                <CardDescription>
                  Distribution of your portfolio projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ErrorBoundary>
                  <AdminProjectsChart />
                </ErrorBoundary>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <ErrorBoundary>
              <QuickActions className="col-span-3" />
            </ErrorBoundary>
            <ErrorBoundary>
              <RecentActivity className="col-span-4" />
            </ErrorBoundary>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Analytics</CardTitle>
              <CardDescription>
                Comprehensive view of your portfolio performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex flex-col items-center justify-center border rounded-md">
                <p className="text-muted-foreground mb-2">
                  Detailed analytics dashboard
                </p>
                <p className="text-xs text-muted-foreground">
                  Coming soon with more metrics and insights
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <ErrorBoundary>
            <RecentActivity fullHeight />
          </ErrorBoundary>
        </TabsContent>
      </Tabs>
    </div>
  );
}
