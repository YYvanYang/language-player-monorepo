// apps/user-app/_lib/utils.ts OR packages/utils/src/query.ts

/**
 * Builds a query string from a parameters object.
 * Handles undefined, null, string, number, boolean, and array values.
 * @param params - An object containing query parameters.
 * @returns A URL query string (e.g., "?limit=10&offset=0&tags=news&tags=podcast") or an empty string.
 */
export function buildQueryString(params?: Record<string, any> | null): string {
    if (!params) {
      return '';
    }
  
    const queryParts: string[] = [];
  
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        return; // Skip undefined or null values
      }
  
      if (Array.isArray(value)) {
        // Handle array values (e.g., tags) by adding multiple key=value pairs
        value.forEach((item) => {
          if (item !== undefined && item !== null) {
             queryParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(item))}`);
          }
        });
      } else {
        // Handle other primitive types (string, number, boolean)
        queryParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
      }
    });
  
    if (queryParts.length === 0) {
      return '';
    }
  
    return `?${queryParts.join('&')}`;
  }
  
  // --- Also include formatDuration and cn from previous steps if putting them here ---
  import { type ClassValue, clsx } from "clsx"
  import { twMerge } from "tailwind-merge"
  import { formatDuration as formatMs } from "@repo/utils"; // Assuming formatDuration is in shared utils
  
  export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
  }
  
  export const formatDuration = formatMs; // Re-export if needed under this path
  
  // --- Define Pagination Params Type ---
  export interface PaginationParams {
      limit?: number;
      offset?: number;
  }