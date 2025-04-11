// packages/ui/src/Spinner.tsx
'use client';

import * as React from 'react';
import { cn } from '@repo/utils'; // Use shared util
import { Loader } from 'lucide-react'; // Use Lucide loader for consistency

interface SpinnerProps extends React.HTMLAttributes<SVGSVGElement> {
  size?: 'sm' | 'md' | 'lg';
}

export function Spinner({ size = 'md', className, ...props }: SpinnerProps): JSX.Element {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <Loader
      className={cn(
          "animate-spin text-primary", // Use primary color for spinner
          sizeClasses[size],
          className
      )}
      role="status"
      aria-live="polite"
      aria-label="Loading"
      {...props}
    />
  );
}