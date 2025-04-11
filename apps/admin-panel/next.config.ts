// apps/admin-panel/next.config.ts
import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  // Ensure experimental features match if needed, e.g., serverActions
   experimental: {
       serverActions: {
         // Allowed origins for server actions if needed (e.g., specific domains)
         // allowedOrigins: ['my-proxy.com', '*.my-proxy.com'],
       },
     },
   // Configure transpilePackages if using packages that need transpilation
   // (Often needed for UI packages that import CSS directly)
   transpilePackages: ['@repo/ui', '@repo/utils'], // Example
   reactStrictMode: true,
   // Add other configurations as needed
};

export default nextConfig;