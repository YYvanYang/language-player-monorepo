// apps/user-app/app/layout.tsx
'use client';

import React, { useEffect } from 'react';
import { Inter as FontSans } from "next/font/google";
import { cn } from "@repo/utils";
import { AuthProvider } from '@/_context/AuthContext';
import { SharedQueryClientProvider } from '@repo/query-client';
import { usePlayerStore } from '@/_stores/playerStore';
import '@/app/globals.css'; // Use relative path for app's globals

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const playerCleanup = usePlayerStore((state) => state.cleanupAudioEngine);

  // Register Service Worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/audio-sw.js') // Path relative to the root
        .then((registration) => {
          console.log('[Layout] Service Worker registered with scope:', registration.scope);
        })
        .catch((error) => {
          console.error('[Layout] Service Worker registration failed:', error);
        });
    }
  }, []);
  
  // Cleanup audio resources on root unmount
  useEffect(() => {
    return () => {
      playerCleanup();
    };
  }, [playerCleanup]);

  return (
    <html lang="en" suppressHydrationWarning className={fontSans.variable}>
      <body className={cn("min-h-screen bg-background font-sans antialiased")}>
        <SharedQueryClientProvider>
          <AuthProvider>
             {/* Zustand store is accessed via hook, no Provider needed */}
             {children}
          </AuthProvider>
        </SharedQueryClientProvider>
      </body>
    </html>
  );
}