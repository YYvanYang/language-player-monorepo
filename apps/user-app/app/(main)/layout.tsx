// apps/user-app/app/(main)/layout.tsx
import React from 'react';
import { Navbar } from '@/../_components/layout/Navbar'; // Adjust alias
import { Footer } from '@/../_components/layout/Footer'; // Adjust alias
// Import Player UI component - it needs context provider setup here or root layout
import { PlayerUI } from '@/../_components/player/PlayerUI'; // Adjust alias

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout is protected by middleware, so user is authenticated here.
  // Navbar uses useAuth hook to display user info client-side.

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      {/* Player UI fixed at the bottom or integrated differently */}
       <PlayerUI />
      <Footer />
    </div>
  );
}