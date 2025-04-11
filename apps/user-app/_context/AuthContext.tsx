// apps/user-app/_context/AuthContext.tsx
'use client';

import { createContext, useState, useEffect, useMemo, useCallback } from 'react';

// Minimal user representation for context
interface AuthUser {
  id: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  checkSession: () => Promise<void>; // Function to manually re-check session
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start loading

  const checkSession = useCallback(async () => {
    // console.log("AuthContext: Checking session...");
    // Prevent race conditions if called multiple times quickly
    if (!isLoading) setIsLoading(true);

    try {
      // Use internal fetch, not apiClient, for this internal API call
      const response = await fetch('/api/auth/session', {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          cache: 'no-store', // Ensure fresh check
      });

      if (!response.ok) {
         console.error(`AuthContext: Session check failed with status ${response.status}`);
         setUser(null);
      } else {
         const data = await response.json() as { user: AuthUser | null, isAuthenticated: boolean };
         if (data.isAuthenticated && data.user) {
            setUser(data.user);
         } else {
            setUser(null);
         }
      }
    } catch (error) {
      setUser(null);
      console.error("AuthContext: Failed to fetch session", error);
    } finally {
      setIsLoading(false);
      // console.log("AuthContext: Session check finished.");
    }
  }, [isLoading]); // Include isLoading dependency to allow re-triggering if needed? Or keep empty? Empty seems better for manual trigger.

  useEffect(() => {
    checkSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  const isAuthenticated = !!user;

  const value = useMemo(() => ({
    user,
    isAuthenticated,
    isLoading,
    checkSession,
  }), [user, isAuthenticated, isLoading, checkSession]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}