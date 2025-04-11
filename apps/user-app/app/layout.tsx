// apps/user-app/app/layout.tsx
'use client';

import React, { useEffect } from 'react';
import { Inter as FontSans } from "next/font/google";
import { cn } from "@repo/utils";
import { AuthProvider } from '@/_context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { usePlayerStore } from '@/_stores/playerStore';
import '@/app/globals.css'; // Use relative path for app's globals

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

// Create queryClient instance ONCE
// Move this to a shared package if needed, but keeping it here is fine too.
const queryClient = new QueryClient({
    defaultOptions: {
         queries: {
             staleTime: 5 * 60 * 1000, // 5 minutes
             gcTime: 10 * 60 * 1000,  // 10 minutes garbage collection
             refetchOnWindowFocus: false, // Prevent refetching just on window focus
             retry: 1, // Retry failed queries once
         }
     },
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const playerCleanup = usePlayerStore((state) => state.cleanup);

  // Cleanup audio resources on root unmount
  useEffect(() => {
    return () => {
      playerCleanup();
    };
  }, [playerCleanup]);

  return (
    <html lang="en" suppressHydrationWarning className={fontSans.variable}>
      <body className={cn("min-h-screen bg-background font-sans antialiased")}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
             {/* Zustand store is accessed via hook, no Provider needed */}
             {children}
          </AuthProvider>
          {/* Optional: DevTools */}
          <ReactQueryDevtools initialIsOpen={false} position="bottom" />
        </QueryClientProvider>
      </body>
    </html>
  );
}