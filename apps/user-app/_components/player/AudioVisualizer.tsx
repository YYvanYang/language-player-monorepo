// apps/user-app/_components/player/AudioVisualizer.tsx
'use client';

import React from 'react';
import { cn } from '@repo/utils';

interface AudioVisualizerProps {
    levels: number[]; // Array of numbers between 0 and 1
    barWidth?: number; // Width of each bar in pixels
    gapWidth?: number; // Gap between bars in pixels
    className?: string;
    barClassName?: string;
    isPlaying?: boolean; // Optional prop to control animation
}

const MAX_BAR_HEIGHT = 16; // Max height of a bar in pixels

export function AudioVisualizer({
    levels = [],
    barWidth = 2,
    gapWidth = 2,
    className,
    barClassName,
    isPlaying = false, // Default to not animating
}: AudioVisualizerProps) {
    const totalWidth = levels.length * barWidth + (levels.length - 1) * gapWidth;

    return (
        <div
            className={cn("flex items-end justify-center", className)}
            style={{ width: `${totalWidth}px`, height: `${MAX_BAR_HEIGHT}px` }}
            aria-hidden="true" // It's decorative
        >
            {levels.map((level, index) => {
                 // Ensure level is between 0 and 1, add a minimum height for visibility
                 const clampedLevel = Math.max(0.05, Math.min(1, level || 0));
                 const barHeight = Math.round(clampedLevel * MAX_BAR_HEIGHT);
                 const animationDelay = `${index * 0.08}s`; // Stagger animation slightly

                 return (
                    <div
                        key={index}
                        className={cn(
                            "bg-blue-400 dark:bg-blue-500 rounded-sm transition-all duration-100 ease-out origin-bottom", // Base bar style
                            isPlaying ? 'animate-pulse-bar' : '', // Conditionally apply animation class
                            barClassName
                        )}
                        style={{
                            width: `${barWidth}px`,
                            height: `${barHeight}px`,
                            marginLeft: index > 0 ? `${gapWidth}px` : '0px',
                            // --- Add keyframes animation directly or via Tailwind config ---
                            // Example using a utility class 'animate-pulse-bar' defined elsewhere
                            // animationDelay: isPlaying ? animationDelay : undefined, // Stagger if animating
                            transform: `scaleY(${clampedLevel})` // Alternative: Scale instead of height
                        }}
                    />
                 );
             })}
             {/* Define keyframes in globals.css or Tailwind config if using class */}
             {/* Example in globals.css:
                 @keyframes pulse-bar {
                   0%, 100% { transform: scaleY(0.1); opacity: 0.5; }
                   50% { transform: scaleY(1); opacity: 1; }
                 }
                .animate-pulse-bar { animation: pulse-bar 1s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
             */}
        </div>
    );
}