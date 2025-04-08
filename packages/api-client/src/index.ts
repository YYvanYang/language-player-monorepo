// packages/api-client/src/index.ts
import type { ErrorResponseDTO } from "@repo/types";

// Custom Error for API specific issues
export class APIError extends Error {
  status: number;
  code: string;
  requestId?: string;
  details?: unknown; // Can hold validation details etc.

  constructor(message: string, status: number, code: string, requestId?: string, details?: unknown) {
    super(message);
    this.name = "APIError";
    this.status = status;
    this.code = code;
    this.requestId = requestId;
    this.details = details;
    Object.setPrototypeOf(this, APIError.prototype);
  }
}

// Helper to get the base URL, ensuring it's available client/server side
function getApiBaseUrl(): string {
    // Client-side check for NEXT_PUBLIC_ var
    if (typeof window !== 'undefined') {
        return process.env.NEXT_PUBLIC_API_BASE_URL || "/api/v1"; // Fallback to relative for client? Or default dev server
    }
    // Server-side check (Server Components, Actions, Route Handlers)
    // Can access non-public vars if needed, but NEXT_PUBLIC_ usually works for consistency
    return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1"; // Server fallback to localhost
}

// --- Core API Client Function ---
interface RequestOptions extends Omit<RequestInit, 'body'> { // Omit body, handle separately
    body?: any; // Allow any body type initially
    // Add specific options if needed later (e.g., custom timeout)
}

/**
 * Generic API client function using fetch.
 * Handles request/response processing, JSON parsing, and error standardization.
 * Authorization header must be added by the caller when needed.
 * @param endpoint API endpoint path (e.g., '/users/me')
 * @param options Fetch options (method, body, headers, etc.)
 * @returns Promise resolving to the parsed JSON response body of type T
 * @throws {APIError} on failed requests (non-2xx status) or network errors
 */
async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const baseURL = getApiBaseUrl();
  const url = `${baseURL}${endpoint}`;
  const headers = new Headers(options.headers); // Initialize Headers object

  // --- Prepare Request Body and Headers ---
  let bodyToSend: BodyInit | null = null;
  if (options.body) {
    if (options.body instanceof FormData || typeof options.body === 'string') {
      // Don't set Content-Type for FormData (browser does it with boundary)
      // Allow raw string body without setting JSON header
      bodyToSend = options.body;
    } else {
      // Assume JSON for other types
      bodyToSend = JSON.stringify(options.body);
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }
    }
  }

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  // --- Fetch Configuration ---
  const config: RequestInit = {
    method: options.method || (bodyToSend ? 'POST' : 'GET'), // Default method
    headers: headers,
    body: bodyToSend,
    cache: options.cache || 'no-store', // Default for API calls, can be overridden by caller
    // Add other options like signal for cancellation
    signal: options.signal,
  };

  // --- Execute Fetch ---
  let response: Response;
  try {
    response = await fetch(url, config);
  } catch (networkError) {
    // Handle fetch exceptions (network errors, DNS issues, CORS problems client-side)
    console.error(`API Client Network Error (${config.method} ${url}):`, networkError);
    throw new APIError(
      "Network request failed. Please check your connection.",
      0, // Indicate network error with status 0
      "NETWORK_ERROR",
      undefined,
      networkError // Include original error
    );
  }

  // --- Process Response ---
  const requestId = response.headers.get("X-Request-ID") ?? undefined;

  // Handle No Content response successfully
  if (response.status === 204) {
    return undefined as T; // Or null as T, depending on convention
  }

  // Try to parse response body (likely JSON, but could be text for errors)
  let responseBody: any = null;
  let parseError: Error | null = null;
  try {
    const contentType = response.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
      responseBody = await response.json();
    } else {
      // Read as text if not JSON - useful for unexpected error pages or plain text responses
      responseBody = await response.text();
      // If response was OK but not JSON, maybe return text if T is string? Or handle based on status.
      // For now, we primarily expect JSON success or JSON/text error.
    }
  } catch (e) {
    parseError = e as Error;
    console.warn(`API Client: Could not parse response body from ${url} (status: ${response.status})`, parseError);
  }

  // Check if the request failed (non-2xx status code)
  if (!response.ok) {
    let message = `API request failed with status ${response.status}`;
    let code = `HTTP_${response.status}`;
    let details: unknown = responseBody; // Include parsed body (or text) as details

    // If JSON error response was successfully parsed, use its fields
    if (responseBody && typeof responseBody === 'object' && (responseBody as ErrorResponseDTO).message) {
        const errorDto = responseBody as ErrorResponseDTO;
        message = errorDto.message;
        if (errorDto.code) {
            code = errorDto.code;
        }
    } else if (typeof responseBody === 'string' && responseBody.length > 0) {
        // Use text body as message if JSON parsing failed or wasn't JSON
        message = responseBody;
    }

    // Log the error server-side or client-side
    console.error(`API Error (${config.method} ${url}): ${response.status} ${code} - ${message}`, details);

    throw new APIError(message, response.status, code, requestId, details);
  }

  // If parsing failed but status was OK (e.g., 200 OK with invalid JSON), throw error
  if (parseError && response.ok) {
    throw new APIError(
      `API request succeeded (${response.status}) but failed to parse response body.`,
      response.status,
      "PARSE_ERROR",
      requestId,
      parseError
    );
  }

  // Successful response with parsed body
  return responseBody as T;
}

export default apiClient;

// --- Convenience Methods ---
export const apiGet = <T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
  apiClient<T>(endpoint, { ...options, method: 'GET' });

export const apiPost = <T>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>) =>
  apiClient<T>(endpoint, { ...options, method: 'POST', body: body });

export const apiPut = <T>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>) =>
  apiClient<T>(endpoint, { ...options, method: 'PUT', body: body });

export const apiDelete = <T = void>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
  apiClient<T>(endpoint, { ...options, method: 'DELETE' });

// Usage Example (in a service or action):
// try {
//   const user = await apiGet<UserResponseDTO>('/users/me', { headers: { Authorization: `Bearer ${token}` } });
//   console.log(user.name);
// } catch (error) {
//   if (error instanceof APIError) {
//     console.error(`API Error: ${error.status} ${error.code} - ${error.message}`);
//   } else {
//     console.error("Network Error:", error);
//   }
// }