'use client';

import * as React from 'react';

interface ErrorMessageProps {
  message: string | null | undefined;
  className?: string;
}

export function ErrorMessage({ message, className }: ErrorMessageProps): JSX.Element | null {
  if (!message) {
    return null;
  }

  return (
    <p
      className={`text-red-500 text-sm ${className || ''}`}
      role="alert"
    >
      {message}
    </p>
  );
} 