packages/ui/src/Select.tsx
import * as React from "react"
import { cn } from "@repo/utils"

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
    size?: 'default' | 'sm' | 'lg';
  }

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, size = 'default', children, ...props }, ref) => {
    const sizeClasses = {
        sm: 'h-8 px-2 text-xs rounded-sm', // Smaller size
        default: 'h-10 px-3 py-2 text-sm rounded-md',
        lg: 'h-11 px-4 text-base rounded-md',
    };
    return (
      <select
        className={cn(
          "flex w-full border border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          sizeClasses[size], // Apply size class
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
    )
  }
)
Select.displayName = "Select"

export { Select }