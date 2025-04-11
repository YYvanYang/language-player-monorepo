// apps/user-app/_context/AuthContext.tsx
'use client';

import React, { createContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';

// Minimal user representation for context
interface AuthUser {
  id: string;
  // Add other non-sensitive fields if needed by UI frequently (e.g., name)
  // name?: string;
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
  const [isLoading, setIsLoading] = useState(true); // Start loading on initial mount
  const isCheckingSession = useRef(false); // Prevent race conditions

  const checkSession = useCallback(async () => {
    // Prevent multiple simultaneous checks
    if (isCheckingSession.current) {
        // console.log("AuthContext: Session check already in progress.");
        return;
    }
    // console.log("AuthContext: Checking session...");
    isCheckingSession.current = true;
    setIsLoading(true); // Set loading true at the start of check

    try {
      const response = await fetch('/api/auth/session', {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          cache: 'no-store', // Ensure fresh check
      });

      // Check status code explicitly
      if (response.status === 401 || response.status === 403) {
         // console.log("AuthContext: No authenticated session found (401/403).");
         setUser(null);
      } else if (!response.ok) {
         // Handle other non-OK statuses
         console.error(`AuthContext: Session check failed with status ${response.status}`);
         setUser(null); // Assume logged out on other errors too
      } else {
         const data = await response.json() as { user: AuthUser | null, isAuthenticated: boolean };
         if (data.isAuthenticated && data.user?.id) {
            // console.log("AuthContext: Session validated for user:", data.user.id);
            setUser(data.user);
         } else {
            // console.log("AuthContext: Session check returned unauthenticated.");
            setUser(null);
         }
      }
    } catch (error) {
      setUser(null);
      console.error("AuthContext: Failed to fetch session API:", error);
    } finally {
      setIsLoading(false); // Set loading false after check completes
      isCheckingSession.current = false;
      // console.log("AuthContext: Session check finished.");
    }
  }, []); // No dependencies needed for useCallback itself

  // Initial check on mount
  useEffect(() => {
    checkSession();
  }, [checkSession]);

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