// apps/admin-panel/_components/layout/AdminHeader.tsx
'use client'; // Needs logout action trigger

import Link from 'next/link';
import { adminLogoutAction } from '@/_actions/adminAuthActions'; // Adjust alias
import { Button } from '@repo/ui';
import { LogOut, UserCog } from 'lucide-react'; // Or admin-specific icon

export function AdminHeader() {

  // No need to call action directly from onClick, use form action
  // const handleLogout = async () => { await adminLogoutAction(); };

  return (
    <header className="bg-slate-800 text-slate-100 p-3 shadow-md sticky top-0 z-40"> {/* Darker admin theme */}
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-lg font-bold flex items-center hover:text-white transition-colors">
           <UserCog className="h-5 w-5 mr-2"/> Admin Panel
        </Link>
        {/* Use a form for logout to work without JS */}
        <form action={adminLogoutAction}>
            <Button variant="ghost" size="sm" type="submit" className="text-slate-300 hover:text-white hover:bg-slate-700 px-2 py-1">
                <LogOut className="h-4 w-4 mr-1" /> Logout
            </Button>
        </form>
      </div>
    </header>
  );
}