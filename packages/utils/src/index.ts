// packages/utils/src/index.ts

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a duration in milliseconds into a string like MM:SS or HH:MM:SS.
 * @param ms Duration in milliseconds.
 * @returns Formatted time string.
 */
export function formatDuration(ms: number | undefined | null): string {
    if (ms === null || ms === undefined || ms < 0) {
      return "00:00";
    }
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
  
    const secondsStr = seconds < 10 ? `0${seconds}` : `${seconds}`;
    const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
  
    if (hours > 0) {
      const hoursStr = hours < 10 ? `0${hours}` : `${hours}`;
      return `${hoursStr}:${minutesStr}:${secondsStr}`;
    }
    return `${minutesStr}:${secondsStr}`;
  }
  
  /**
   * Debounces a function.
   * @param func The function to debounce.
   * @param delay Delay in milliseconds.
   * @returns A debounced version of the function.
   */
  export function debounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    return (...args: Parameters<T>) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  }
  
  // Add other common utilities: capitalize, truncate, etc.