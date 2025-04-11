// packages/ui/src/Input.tsx
import * as React from "react";
import { cn } from "@repo/utils"; // Use shared util

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
    // Add size variants if needed
    size?: 'default' | 'sm' | 'lg';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, size = 'default', ...props }, ref) => {
    const sizeClasses = {
        sm: 'h-8 px-2 text-xs',
        default: 'h-10 px-3 py-2 text-sm',
        lg: 'h-11 px-4 text-base',
    };
    return (
      <input
        type={type}
        className={cn(
          "flex w-full rounded-md border border-input bg-background ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          sizeClasses[size], // Apply size class
          className // Allow overriding
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };