// apps/admin-panel/_components/layout/AdminSidebar.tsx
'use client'; // Needed for using usePathname

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, Music, ListMusic, BarChart2, Settings } from 'lucide-react';
import { cn } from '@repo/utils'; // Assuming a cn utility exists in shared utils

const navigation = [
  { name: 'Dashboard', href: '/', icon: BarChart2 },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Audio Tracks', href: '/tracks', icon: Music },
  { name: 'Collections', href: '/collections', icon: ListMusic },
  // Add more sections like Settings etc.
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col fixed h-full pt-16"> {/* pt matches header height */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'group flex items-center px-2 py-2 text-sm font-medium rounded-md',
              pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                ? 'bg-gray-200 text-gray-900'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            )}
          >
            <item.icon
              className={cn(
                'mr-3 flex-shrink-0 h-5 w-5',
                pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href)) ? 'text-gray-700' : 'text-gray-400 group-hover:text-gray-500'
              )}
              aria-hidden="true"
            />
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}