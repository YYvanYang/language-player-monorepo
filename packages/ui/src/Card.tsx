// packages/ui/src/Card.tsx
import React from 'react';
import { cn } from '@repo/utils'; // Assuming cn utility is shared

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border bg-card text-card-foreground shadow-sm", // Uses CSS vars defined in globals.css/tailwind config
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

// Simple Card Header, Content, Footer components (Example)
const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => ( <div ref={ref} className={cn("flex flex-col space-y-1.5 p-4 sm:p-6", className)} {...props} /> ) // Adjusted padding
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => ( <h3 ref={ref} className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} /> )
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    ({ className, ...props }, ref) => ( <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} /> ) // Uses CSS var
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => ( <div ref={ref} className={cn("p-4 sm:p-6 pt-0", className)} {...props} /> ) // Adjusted padding
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => ( <div ref={ref} className={cn("flex items-center p-4 sm:p-6 pt-0", className)} {...props} /> ) // Adjusted padding
);
CardFooter.displayName = "CardFooter";


export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };