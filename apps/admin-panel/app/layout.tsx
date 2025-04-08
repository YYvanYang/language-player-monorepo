// apps/admin-panel/app/layout.tsx
// Can likely remain a Server Component if just setting up context providers
import React from 'react';
import { Inter as FontSans } from "next/font/google"; // Example font
import { cn } from "@repo/utils"; // Assuming shared util
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // Or import SharedProvider
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'; // Optional DevTools
import '@/../styles/globals.css'; // Import app-specific global styles

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

// Create queryClient instance (or import from shared package @repo/query-client)
const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 5 * 60 * 1000 } },
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
         <QueryClientProvider client={queryClient}>
            {children}
             {/* Optional: DevTools */}
             <ReactQueryDevtools initialIsOpen={false} />
         </QueryClientProvider>
      </body>
    </html>
  );
}