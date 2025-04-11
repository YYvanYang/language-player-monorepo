// apps/user-app/app/layout.tsx
'use client'; // Must be client component to use hooks/providers

import React, { useEffect } from 'react';
import { Inter as FontSans } from "next/font/google";
import { cn } from "@repo/utils";
import { AuthProvider } from '@/../_context/AuthContext'; // Adjust path
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'; // Optional
import { usePlayerStore } from '@/../_stores/playerStore'; // Adjust path
import '@/../app/globals.css'; // Adjust path for global styles

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

// Create queryClient instance ONCE (module scope)
const queryClient = new QueryClient({
    defaultOptions: {
         queries: {
             staleTime: 5 * 60 * 1000, // 5 minutes
             gcTime: 10 * 60 * 1000,  // 10 minutes
             refetchOnWindowFocus: false,
         }
     },
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Get cleanup function from player store
  const playerCleanup = usePlayerStore((state) => state.cleanup);

  useEffect(() => {
    // Cleanup audio resources when the root layout unmounts
    return () => {
      playerCleanup();
    };
  }, [playerCleanup]);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
             {/* Zustand Provider is not needed, just import the hook */}
             {children}
          </AuthProvider>
          {/* Optional: DevTools outside AuthProvider but inside QueryClientProvider */}
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </body>
    </html>
  );
}