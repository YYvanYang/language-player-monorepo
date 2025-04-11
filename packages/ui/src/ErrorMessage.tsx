// packages/ui/src/ErrorMessage.tsx
'use client';

import * as React from 'react';
import { cn } from '@repo/utils'; // Assuming shared util
import { AlertTriangle } from 'lucide-react'; // Optional icon

interface ErrorMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  message: string | null | undefined;
  showIcon?: boolean;
}

export function ErrorMessage({ message, className, showIcon = false, ...props }: ErrorMessageProps): JSX.Element | null {
  if (!message) {
    return null;
  }

  return (
    <p
      className={cn(
          "text-red-600 dark:text-red-400 text-sm", // Base styles
          showIcon && "flex items-center", // Add flex for icon alignment
          className // Allow overriding classes
      )}
      role="alert"
      {...props}
    >
       {showIcon && <AlertTriangle className="h-4 w-4 mr-1.5 flex-shrink-0"/>}
      {message}
    </p>
  );
}