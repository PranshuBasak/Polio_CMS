import { AdminSidebar } from '@/features/admin/components/admin-sidebar';
import { DataProvider } from '@/lib/data-provider';
import { ErrorBoundary } from '@/shared/components/ui-enhancements/error-boundary';
import type React from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DataProvider>
      <ErrorBoundary>
        <div className="flex min-h-screen bg-background">
          <AdminSidebar />
          <div className="flex-1 w-full transition-all duration-300 ease-in-out md:pl-64">
            <div className="container p-4 pt-6 md:p-6 lg:p-8 max-w-7xl mx-auto">
              {children}
            </div>
          </div>
        </div>
      </ErrorBoundary>
    </DataProvider>
  );
}
