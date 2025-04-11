// apps/user-app/next.config.ts
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
   // (Often needed for UI packages that import CSS directly or use specific syntax)
   transpilePackages: ['@repo/ui', '@repo/utils', '@repo/auth', '@repo/types', '@repo/api-client'], // List shared packages
   reactStrictMode: true,
   // Configure image optimization domains if using external images
   images: {
       remotePatterns: [
           {
               protocol: 'https', // or 'http' if needed
               hostname: 'lh3.googleusercontent.com', // Example for Google profile pics
           },
           {
               protocol: 'http', // Example for local MinIO during development
               hostname: 'localhost',
               port: '9000', // Or your MinIO API port
               pathname: '/language-audio/**', // Match your bucket name
           },
           // Add other domains for cover images if applicable
       ],
   },
};

export default nextConfig;