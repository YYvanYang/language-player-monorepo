// apps/user-app/_components/layout/Footer.tsx
import React from 'react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-slate-50 dark:bg-slate-800 text-center text-xs text-slate-500 dark:text-slate-400 p-4 mt-auto border-t dark:border-slate-700">
      © {currentYear} YourAppName. All rights reserved.
       {/* Optional: Add links */}
       {/* <span className="mx-2">|</span>
       <a href="/privacy" className="hover:underline">Privacy Policy</a> */}
    </footer>
  );
}