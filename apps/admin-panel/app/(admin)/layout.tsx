// apps/admin-panel/app/(admin)/layout.tsx
// Can be a Server Component as it just arranges layout components
import React from 'react';
import { AdminHeader } from '@/_components/layout/AdminHeader'; // Adjust alias
import { AdminSidebar } from '@/_components/layout/AdminSidebar'; // Adjust alias

export default function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Middleware already ensures user is an authenticated admin here
  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden ml-64"> {/* Adjust margin based on sidebar width */}
        <AdminHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}