// apps/admin-panel/app/(admin)/layout.tsx
// Server Component for layout structure
import React from 'react';
import { AdminHeader } from '@/_components/layout/AdminHeader'; // Adjust alias
import { AdminSidebar } from '@/_components/layout/AdminSidebar'; // Adjust alias

export default function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Middleware ensures only authenticated admins reach this layout
  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-900">
      <AdminSidebar />
      {/* Adjust margin-left based on sidebar width */}
      <div className="flex-1 flex flex-col overflow-hidden ml-60">
        <AdminHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100 dark:bg-slate-900 p-4 md:p-6">
          {/* Container for consistent padding, or apply padding directly to main */}
          <div className="container mx-auto">
              {children}
          </div>
        </main>
      </div>
    </div>
  );
}