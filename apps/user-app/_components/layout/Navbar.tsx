// apps/user-app/_components/layout/Navbar.tsx
'use client'; // Needs useAuth hook and potentially client-side interactions

import Link from 'next/link';
import { useAuth } from '@/../_hooks/useAuth'; // Adjust alias
import { logoutAction } from '@/../_actions/authActions'; // Adjust alias
import { Button } from '@repo/ui'; // Shared component
import { User, LogOut, LogIn, UserPlus } from 'lucide-react'; // Example icons

export function Navbar() {
  const { user, isAuthenticated, isLoading } = useAuth();

  const handleLogout = async () => {
    // No need for useActionState if simple logout + redirect
    await logoutAction();
  };

  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          AudioLang Player
        </Link>
        <div className="space-x-4 flex items-center">
          <Link href="/tracks" className="hover:text-gray-300">Tracks</Link>
          <Link href="/collections" className="hover:text-gray-300">Collections</Link>
          <Link href="/bookmarks" className="hover:text-gray-300">Bookmarks</Link>
          {isLoading ? (
            <span className="text-sm">Loading...</span>
          ) : isAuthenticated && user ? (
            <>
              <Link href="/profile" className="flex items-center hover:text-gray-300">
                <User className="h-4 w-4 mr-1" />
                Profile ({user.name || user.email})
              </Link>
              {/* Use a form for logout to work reliably with Server Actions */}
              <form action={handleLogout}>
                <Button variant="ghost" size="sm" className="text-white hover:bg-gray-700">
                  <LogOut className="h-4 w-4 mr-1" /> Logout
                </Button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="flex items-center hover:text-gray-300">
                <LogIn className="h-4 w-4 mr-1" /> Login
              </Link>
              <Link href="/register" className="flex items-center hover:text-gray-300">
                 <UserPlus className="h-4 w-4 mr-1" /> Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}