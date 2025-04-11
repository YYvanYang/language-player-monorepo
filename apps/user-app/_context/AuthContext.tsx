// apps/user-app/_context/AuthContext.tsx
'use client';

import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import apiClient from '@repo/api-client';

// Define shape of user data exposed by context
// Keep it minimal, fetch full profile details elsewhere if needed
interface AuthUser {
  id: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  checkSession: () => Promise<void>; // Function to re-check session status
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start loading initially

  const checkSession = useCallback(async () => {
    // console.log("AuthContext: Checking session...");
    setIsLoading(true);
    try {
      // Use internal fetch for API route to avoid circular dependencies or token issues
      // with apiClient before auth state is known. Ensures browser cookies are sent.
      const response = await fetch('/api/auth/session', {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          cache: 'no-store', // Ensure we always get the latest session status
      });

      if (!response.ok) {
         // Handle non-200 status from session check (e.g., 500)
         console.error(`AuthContext: Session check failed with status ${response.status}`);
         setUser(null);
         // Don't throw here, just indicate not authenticated
         return;
      }

      const data = await response.json() as { user: AuthUser | null, isAuthenticated: boolean };

      if (data.isAuthenticated && data.user) {
        // console.log("AuthContext: User authenticated", data.user);
        setUser(data.user);
      } else {
        // console.log("AuthContext: User not authenticated");
        setUser(null);
      }
    } catch (error) {
      setUser(null);
      console.error("AuthContext: Failed to fetch session", error);
    } finally {
      setIsLoading(false);
      // console.log("AuthContext: Session check finished.");
    }
  }, []); // useCallback with empty dependency array

  useEffect(() => {
    // Fetch session status on initial client load
    checkSession();
  }, [checkSession]); // Run once on mount

  const isAuthenticated = !!user;

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    user,
    isAuthenticated,
    isLoading,
    checkSession, // Expose the check function
  }), [user, isAuthenticated, isLoading, checkSession]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}