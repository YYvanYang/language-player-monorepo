'use client';

import * as React from 'react';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';

interface LinkProps extends NextLinkProps {
  children: React.ReactNode;
  className?: string;
  // Add any other custom props or styling logic here
}

export function Link({ children, className, ...props }: LinkProps): JSX.Element {
  return (
    <NextLink
      className={`text-blue-600 hover:underline ${className || ''}`}
      {...props}
    >
      {children}
    </NextLink>
  );
} 