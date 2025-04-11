// packages/ui/src/Link.tsx
'use client';

import * as React from 'react';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import { cn } from '@repo/utils';

interface LinkProps extends NextLinkProps, React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  // className?: string; // Included in AnchorHTMLAttributes
  // Add other props if needed
}

export function Link({ children, className, ...props }: LinkProps): JSX.Element {
  return (
    <NextLink
      className={cn(
          "text-blue-600 underline-offset-4 hover:underline dark:text-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rounded-sm", // Added focus ring
          className // Allow overriding
      )}
      {...props} // Pass rest of the props (href, target, etc.)
    >
      {children}
    </NextLink>
  );
}