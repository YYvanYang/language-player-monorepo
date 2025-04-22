// packages/utils/src/index.ts
import React from 'react';
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// --- Constants ---
// MOVED Pagination constants here
export const DefaultLimit = 20; // Default items per page
export const MaxLimit = 100; // Max items per page

// --- Types ---
// Moved PaginationParams here
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
    return `${hours}:${minutesStr}:${secondsStr}`;
  }
  return `${minutesStr}:${secondsStr}`;
}

/**
 * Debounces a function.
 * @param func The function to debounce.
 * @param delay Delay in milliseconds.
 * @returns A debounced version of the function with a cancel and flush method.
 */
export function debounce<T extends (...args: any[]) => void>(
    func: T,
    delay: number
): T & { cancel: () => void; flush: () => void } {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let lastArgs: Parameters<T> | null = null;
    let lastThis: any = null;
    let trailingCallScheduled = false;

    const debounced = (...args: Parameters<T>) => {
        lastArgs = args;
        lastThis = this;
        trailingCallScheduled = true; // Mark that a call is pending

        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
            if (trailingCallScheduled) {
                func.apply(lastThis, lastArgs!); // Use apply to preserve context
            }
            timeoutId = null;
            trailingCallScheduled = false;
            lastArgs = null;
            lastThis = null;
        }, delay);
    };

    const cancel = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = null;
        trailingCallScheduled = false;
        lastArgs = null;
        lastThis = null;
    };

    // Flush: Immediately call the function if there's a pending call
    const flush = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        if (trailingCallScheduled) {
            func.apply(lastThis, lastArgs!);
        }
        timeoutId = null;
        trailingCallScheduled = false;
        lastArgs = null;
        lastThis = null;
    };

    (debounced as any).cancel = cancel;
    (debounced as any).flush = flush;

    return debounced as T & { cancel: () => void; flush: () => void };
}


/**
 * Builds a URL query string from a parameters object.
 * Handles arrays by repeating the key. Encodes keys/values. Skips null/undefined/empty strings.
 * @param params - An object containing query parameters.
 * @returns A URL query string starting with '?' or an empty string.
 */
export function buildQueryString(params?: Record<string, any> | null): string {
    if (!params) {
      return '';
    }
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        return; // Skip null, undefined, and empty strings
      }
      if (Array.isArray(value)) {
        value.forEach((item) => {
          if (item !== undefined && item !== null && item !== '') { // Also skip empty strings in arrays
            query.append(key, String(item));
          }
        });
      } else {
        query.set(key, String(value));
      }
    });
    const queryString = query.toString();
    return queryString ? `?${queryString}` : '';
}

// Add useDebounce hook
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export * from "./hooks/useAudioClip";