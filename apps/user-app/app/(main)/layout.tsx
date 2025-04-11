// apps/user-app/app/(main)/layout.tsx
'use client'; // Required for PlayerUI and useAuth hook

import React from 'react';
import { Navbar } from '@/_components/layout/Navbar';
import { Footer } from '@/_components/layout/Footer';
import { PlayerUI } from '@/_components/player/PlayerUI';
// import { useAuth } from '@/_hooks/useAuth'; // AuthProvider wraps this in root layout

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const { isAuthenticated, isLoading } = useAuth(); // Can use auth state if layout needs it

  // PlayerUI is always rendered, its internal state handles visibility/functionality
  const showPlayer = true;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      {/* Adjust padding-bottom to accommodate player height (pb-20 assumes ~80px height) */}
      <main className="flex-grow container mx-auto px-4 py-6 md:py-8 pb-24 relative">
        {children}
      </main>
      {showPlayer && <PlayerUI />} {/* Render player */}
      {/* Footer is less common when a persistent player is present */}
      {/* <Footer /> */}
    </div>
  );
}