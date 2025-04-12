// apps/admin-panel/app/layout.tsx
// Can likely remain a Server Component if just setting up context providers
import React from 'react';
import { Inter as FontSans } from "next/font/google"; // Example font
import { cn } from "@repo/utils"; // Assuming shared util
import { SharedQueryClientProvider } from '@repo/query-client'; // Import the shared provider
import './globals.css'; // Import app-specific global styles

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
         <SharedQueryClientProvider>
            {children}
         </SharedQueryClientProvider>
      </body>
    </html>
  );
}