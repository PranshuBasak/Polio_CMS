import { AdminSidebar } from '@/features/admin/components/admin-sidebar';
import { ErrorBoundary } from '@/shared/components/ui-enhancements/error-boundary';
import type React from 'react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <ErrorBoundary>
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />
        <div className="flex-1 w-full min-h-screen transition-all duration-300 ease-in-out md:ml-64">
          <div className="w-full p-4 pt-20 md:pt-6 md:p-8 lg:p-10 max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
