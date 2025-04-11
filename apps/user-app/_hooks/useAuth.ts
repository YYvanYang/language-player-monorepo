// apps/user-app/_hooks/useAuth.ts
'use client';
import { useContext } from 'react';
import { AuthContext, AuthContextType } from '@/_context/AuthContext'; // Adjust path

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // This error indicates the hook is used outside of the AuthProvider
    // Ensure AuthProvider wraps the component tree in the root layout.
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};