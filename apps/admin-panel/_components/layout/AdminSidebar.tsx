// apps/admin-panel/_components/layout/AdminSidebar.tsx
'use client'; // Needed for using usePathname

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, Music, ListMusic, LayoutDashboard, Settings } from 'lucide-react'; // Changed BarChart2 to LayoutDashboard
import { cn } from '@repo/utils'; // Assuming a cn utility exists in shared utils

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Audio Tracks', href: '/tracks', icon: Music },
  { name: 'Collections', href: '/collections', icon: ListMusic },
  // { name: 'Settings', href: '/settings', icon: Settings }, // Example future item
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 bg-slate-50 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col fixed h-full pt-16"> {/* Adjusted width, pt matches header height (adjust header height if needed) */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
            // More robust check for active link, handling nested routes
            const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
                <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                    'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                        ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-100'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                >
                    <item.icon
                    className={cn(
                        'mr-3 flex-shrink-0 h-5 w-5',
                        isActive ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-500 dark:group-hover:text-slate-400'
                    )}
                    aria-hidden="true"
                    />
                    {item.name}
                </Link>
            );
        })}
      </nav>
    </aside>
  );
}