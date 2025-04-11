// apps/user-app/app/(main)/layout.tsx
// This can be a Client Component because PlayerUI and Navbar likely need client hooks/state
'use client';

import React from 'react';
import { Navbar } from '@/_components/layout/Navbar'; // Adjust alias
import { Footer } from '@/_components/layout/Footer'; // Adjust alias
import { PlayerUI } from '@/_components/player/PlayerUI'; // Adjust alias
import { useAuth } from '@/_hooks/useAuth'; // To conditionally render player?

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth(); // Use auth state if needed

  // Conditionally render PlayerUI only if authenticated? Or always show?
  // Showing always might be simpler, the store handles lack of track.
  const showPlayer = true; // Or based on isAuthenticated && !isLoading;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {/* Add padding-bottom to main content area to prevent overlap with fixed player */}
      <main className="flex-grow container mx-auto px-4 py-8 pb-24"> {/* Added pb-24 (adjust as needed) */}
        {children}
      </main>
      {showPlayer && <PlayerUI />}
      <Footer />
    </div>
  );
}