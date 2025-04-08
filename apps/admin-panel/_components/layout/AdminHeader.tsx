// apps/admin-panel/_components/layout/AdminHeader.tsx
'use client'; // Needs logout action trigger

import Link from 'next/link';
import { adminLogoutAction } from '@/../_actions/adminAuthActions'; // Adjust alias
import { Button } from '@repo/ui';
import { LogOut, UserCog } from 'lucide-react'; // Or admin-specific icon

export function AdminHeader() {
  // Could potentially use a hook to get admin user info if needed

  const handleLogout = async () => {
    await adminLogoutAction();
  };

  return (
    <header className="bg-gray-900 text-white p-4 shadow-md sticky top-0 z-40">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold flex items-center">
           <UserCog className="h-6 w-6 mr-2"/> Admin Panel
        </Link>
        <form action={handleLogout}>
            <Button variant="ghost" size="sm" className="text-white hover:bg-gray-700">
            <LogOut className="h-4 w-4 mr-1" /> Logout
            </Button>
        </form>
      </div>
    </header>
  );
}