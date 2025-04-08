// apps/user-app/app/layout.tsx
import { AuthProvider } from '@/../_context/AuthContext'; // Adjust path
// Import SharedQueryClientProvider if using shared package
// import { SharedQueryClientProvider } from '@repo/query-client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // Or use shared provider

// Create queryClient instance here if not using shared package
const queryClient = new QueryClient({/* options */});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Wrap with QueryClientProvider first */}
        <QueryClientProvider client={queryClient}>
        {/* <SharedQueryClientProvider> */}
          <AuthProvider> {/* AuthProvider inside QueryProvider */}
            {/* Other global providers */}
            {children}
          </AuthProvider>
        {/* </SharedQueryClientProvider> */}
        </QueryClientProvider>
      </body>
    </html>
  );
}