// packages/query-client/src/index.ts
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// Optional: import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Create a single QueryClient instance with default options
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes garbage collection
      refetchOnWindowFocus: false, // Adjust as needed
      retry: 1, // Retry failed queries once
    },
  },
});

// Optional: Export a provider component wrapper
export const SharedQueryClientProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Optional: Add DevTools only in development */}
      {/* process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
};