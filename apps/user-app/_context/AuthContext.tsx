// apps/user-app/_context/AuthContext.tsx
'use client';

import React, { createContext, useState, useEffect, useMemo } from 'react';
import apiClient from '@repo/api-client'; // Use shared client

// Define shape of user data exposed by context
interface AuthUser {
  id: string;
  // Add other fields if needed from session endpoint (name, email?)
}

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  // Add logout function or rely on server action?
  // logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start loading initially

  useEffect(() => {
    // Fetch session status on initial client load
    let isMounted = true;
    const checkSession = async () => {
      setIsLoading(true);
      try {
        // Call the GET endpoint of our session handler
        const response = await apiClient<{ user: AuthUser | null, isAuthenticated: boolean }>('/auth/session', {
            method: 'GET',
            // Important: Let browser handle cookies automatically for same-site requests
        });

        if (isMounted) {
          if (response.isAuthenticated && response.user) {
            setUser(response.user);
          } else {
            setUser(null);
          }
        }
      } catch (error) {
        // Treat errors (like 401) as not authenticated
         if (isMounted) {
            setUser(null);
         }
         console.error("AuthContext: Failed to fetch session", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    checkSession();

    return () => { isMounted = false }; // Cleanup on unmount
  }, []); // Run only once on mount

  const isAuthenticated = !!user;

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    user,
    isAuthenticated,
    isLoading,
  }), [user, isAuthenticated, isLoading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}