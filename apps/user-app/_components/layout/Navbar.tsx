// apps/user-app/_components/layout/Navbar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/../_hooks/useAuth';
import { logoutAction } from '@/../_actions/authActions';
import { Button } from '@repo/ui';
import { User, LogOut, LogIn, UserPlus, Music, ListMusic, Bookmark } from 'lucide-react';
import { cn } from '@repo/utils';

export function Navbar() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();

  const handleLogout = async () => {
    // Logout action handles redirect
    await logoutAction();
  };

  const navItems = [
    { href: "/tracks", label: "Tracks", icon: Music },
    { href: "/collections", label: "Collections", icon: ListMusic, protected: true },
    { href: "/bookmarks", label: "Bookmarks", icon: Bookmark, protected: true },
  ];

  return (
    <nav className="bg-slate-900 text-slate-200 p-3 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-lg font-bold hover:text-white transition-colors">
          AudioLang
        </Link>
        <div className="space-x-3 md:space-x-4 flex items-center">
          {/* Main Navigation */}
          {navItems.map((item) => {
             // Hide protected routes if not authenticated
             if (item.protected && !isAuthenticated && !isLoading) return null;
             // Show placeholder/disabled if loading? Or just hide? Hiding is simpler.
             if (item.protected && isLoading) return null;

             const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
             return (
                 <Link
                     key={item.href}
                     href={item.href}
                     className={cn(
                         "text-sm font-medium transition-colors hidden sm:inline-flex items-center", // Hide on small screens
                         isActive ? "text-white font-semibold" : "text-slate-400 hover:text-white"
                     )}
                     aria-current={isActive ? "page" : undefined}
                 >
                     <item.icon className="h-4 w-4 mr-1.5" />
                     {item.label}
                 </Link>
             );
          })}

          {/* Auth Buttons */}
          <div className="flex items-center space-x-2">
            {isLoading ? (
              <span className="text-xs px-2">Loading...</span>
            ) : isAuthenticated && user ? (
              <>
                <Link href="/profile" className="flex items-center hover:text-white transition-colors p-1 rounded focus:outline-none focus:ring-2 focus:ring-slate-500" title="Profile">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Profile</span> {/* Screen reader only */}
                </Link>
                <form action={handleLogout}>
                  <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-700 px-2 py-1" title="Logout">
                    <LogOut className="h-4 w-4 mr-1" /> Logout
                  </Button>
                </form>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild className="text-slate-300 hover:text-white hover:bg-slate-700 px-2 py-1">
                   <Link href="/login"><LogIn className="h-4 w-4 mr-1" /> Login</Link>
                </Button>
                 <Button variant="outline" size="sm" asChild className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white px-2 py-1">
                   <Link href="/register"><UserPlus className="h-4 w-4 mr-1" /> Register</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}