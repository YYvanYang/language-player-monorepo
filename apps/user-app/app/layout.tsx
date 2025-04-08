// apps/user-app/app/layout.tsx
'use client'; // Root layout likely needs to be client if providing context/store hooks

import { useEffect } from 'react'; // Need useEffect for cleanup
import { AuthProvider } from '@/../_context/AuthContext';
// Import SharedQueryClientProvider or setup here
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePlayerStore } from '@/../_stores/playerStore'; // Adjust path

// Create queryClient instance (or import from shared package)
const queryClient = new QueryClient({/* options */});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Optional: Pre-initialize AudioContext on mount? Or let store do it lazily.
  // const initAudioContext = usePlayerStore((state) => state._initAudioContext);
  // useEffect(() => {
  //    initAudioContext(); // Try to init early
  // }, [initAudioContext]);

  // Get cleanup function from store
  const playerCleanup = usePlayerStore((state) => state.cleanup);

  useEffect(() => {
    // Cleanup audio resources when the root layout unmounts
    // (e.g., user navigates away completely, browser closes)
    return () => {
      playerCleanup();
    };
  }, [playerCleanup]); // Dependency array includes cleanup function

  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
             {/* No specific provider needed for Zustand usually */}
             {children}
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}