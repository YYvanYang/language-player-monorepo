// packages/utils/src/index.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// --- Constants ---
export const DefaultLimit = 20; // Default items per page
export const MaxLimit = 100; // Max items per page

// --- Types ---
export interface PaginationParams {
    limit?: number;
    offset?: number;
}

// --- Functions ---

/** Merges Tailwind classes, handling conflicts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a duration in milliseconds into a string like MM:SS or H:MM:SS.
 * Handles undefined, null, and negative values gracefully.
 * @param ms Duration in milliseconds (number).
 * @returns Formatted time string "MM:SS" or "H:MM:SS". Returns "00:00" for invalid inputs.
 */
export function formatDuration(ms: number | undefined | null): string {
  if (ms === null || ms === undefined || ms < 0 || isNaN(ms)) {
    return "00:00";
  }
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const secondsStr = seconds < 10 ? `0${seconds}` : `${seconds}`;
  const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`;

  if (hours > 0) {
    // Don't pad hours with 0 unless it's always desired
    return `${hours}:${minutesStr}:${secondsStr}`;
  }
  return `${minutesStr}:${secondsStr}`;
}

/**
 * Debounces a function.
 * @param func The function to debounce.
 * @param delay Delay in milliseconds.
 * @returns A debounced version of the function with a cancel method.
 */
 export function debounce<T extends (...args: any[]) => void>(
   func: T,
   delay: number
 ): T & { cancel: () => void } {
   let timeoutId: ReturnType<typeof setTimeout> | null = null;

   const debounced = (...args: Parameters<T>) => {
     if (timeoutId) {
       clearTimeout(timeoutId);
     }
     timeoutId = setTimeout(() => {
       func(...args);
       timeoutId = null; // Clear after execution
     }, delay);
   };

   const cancel = () => {
     if (timeoutId) {
       clearTimeout(timeoutId);
       timeoutId = null;
     }
   };

   // Attach the cancel method to the debounced function
   (debounced as T & { cancel: () => void }).cancel = cancel;

   return debounced as T & { cancel: () => void };
 }


/**
 * Builds a URL query string from a parameters object.
 * Handles arrays by repeating the key. Encodes keys/values. Skips null/undefined.
 * @param params - An object containing query parameters.
 * @returns A URL query string starting with '?' or an empty string.
 */
export function buildQueryString(params?: Record<string, any> | null): string {
    if (!params) {
      return '';
    }
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') { // Skip empty strings too
        return;
      }
      if (Array.isArray(value)) {
        value.forEach((item) => { // Append each item for array values
          if (item !== undefined && item !== null && item !== '') {
            query.append(key, String(item));
          }
        });
      } else {
        query.set(key, String(value)); // Set for non-array values
      }
    });
    const queryString = query.toString();
    return queryString ? `?${queryString}` : '';
}