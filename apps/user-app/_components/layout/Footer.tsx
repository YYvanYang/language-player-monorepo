// apps/user-app/_components/layout/Footer.tsx
// Can be a simple Server Component
import React from 'react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-gray-100 text-center text-sm text-gray-600 p-4 mt-8 border-t">
      © {currentYear} Language Player Inc. All rights reserved.
    </footer>
  );
}