'use client';

import * as React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className, ...props }: CardProps): JSX.Element {
  return (
    <div
      className={`border rounded-lg shadow-sm p-4 ${className || ''}`}
      {...props}
    >
      {children}
    </div>
  );
} 