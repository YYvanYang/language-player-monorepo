'use client';
// packages/query-client/src/index.tsx
import React from 'react';
import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Global error handler for TanStack Query
const handleQueryError = (error: unknown, context?: string) => {
    console.error(`TanStack Query Error${context ? ` (${context})` : ''}:`, error);
    // TODO: Implement global error logging/reporting service (e.g., Sentry)
    // reportErrorToServer(error);
    // TODO: Potentially show a global toast notification for critical errors
    // showGlobalErrorToast("An error occurred while fetching data.");
};

// Create a single QueryClient instance with default options
export const queryClient = new QueryClient({
    // Global error handlers for queries and mutations
    queryCache: new QueryCache({
        onError: (error) => handleQueryError(error, 'QueryCache'),
    }),
    mutationCache: new MutationCache({
        onError: (error) => handleQueryError(error, 'MutationCache'),
    }),
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes - how long data is considered fresh
            gcTime: 15 * 60 * 1000,  // 15 minutes - how long inactive data stays in cache
            refetchOnWindowFocus: process.env.NODE_ENV === 'production', // Refetch on focus only in production
            retry: (failureCount, error: any) => {
                 // Don't retry on 404, 403, 401 errors
                 if (error?.status === 404 || error?.status === 403 || error?.status === 401) {
                     return false;
                 }
                 // Retry once otherwise
                 return failureCount < 1;
             },
        },
         mutations: {
             onError: (error) => handleQueryError(error, 'MutationDefault'),
             // Default retry for mutations is usually 0
         },
    },
});

// Shared provider component wrapper
export const SharedQueryClientProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Add DevTools only in development environments */}
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />}
    </QueryClientProvider>
  );
};