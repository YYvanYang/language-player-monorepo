// packages/utils/src/index.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a duration in milliseconds into a string like MM:SS or HH:MM:SS.
 * Handles undefined, null, and negative values gracefully.
 * @param ms Duration in milliseconds (number).
 * @returns Formatted time string "MM:SS" or "HH:MM:SS". Returns "00:00" for invalid inputs.
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
    const hoursStr = hours < 10 ? `0${hours}` : `${hours}`; // Pad hours too if needed, though less common
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

/**
 * Builds a URL query string from a parameters object.
 * Correctly handles arrays by repeating the key.
 * Encodes keys and values. Skips null/undefined values.
 * @param params - An object containing query parameters.
 * @returns A URL query string starting with '?' (e.g., "?limit=10&offset=0&tags=news&tags=podcast") or an empty string if no params.
 */
export function buildQueryString(params?: Record<string, any> | null): string {
    if (!params) {
      return '';
    }

    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        return; // Skip null/undefined
      }

      if (Array.isArray(value)) {
        // Handle arrays by appending each value
        value.forEach((item) => {
          if (item !== undefined && item !== null) {
            query.append(key, String(item)); // Use append for arrays
          }
        });
      } else {
        // Handle other types (string, number, boolean)
        query.set(key, String(value)); // Use set for non-array types
      }
    });

    const queryString = query.toString();
    return queryString ? `?${queryString}` : ''; // Prepend '?' if not empty
}