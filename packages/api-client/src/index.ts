// packages/api-client/src/index.ts
import type { ErrorResponseDTO } from "@repo/types";

/**
 * Custom Error class for API-specific issues, providing status and code.
 */
export class APIError extends Error {
  status: number; // HTTP status code (0 for network errors)
  code: string; // Backend's application-specific error code or generic code
  requestId?: string; // Optional request ID for tracing
  details?: unknown; // Can hold validation details or original error

  constructor(message: string, status: number, code: string, requestId?: string, details?: unknown) {
    super(message);
    this.name = "APIError";
    this.status = status;
    this.code = code;
    this.requestId = requestId;
    this.details = details;
    // Maintains proper stack trace in V8 environments
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, APIError);
    }
    Object.setPrototypeOf(this, APIError.prototype);
  }
}

/**
 * Retrieves the API base URL from environment variables.
 * Prefers NEXT_PUBLIC_API_BASE_URL (for client & server).
 * Falls back to a default relative path which might work for client-side calls
 * but could fail for server-side fetch if API is on a different origin.
 * Logs a warning if the variable is missing.
 * @returns {string} The API base URL.
 */
function getApiBaseUrl(): string {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) {
        console.warn(
            "API Client Warning: NEXT_PUBLIC_API_BASE_URL environment variable is not set. " +
            "Falling back to relative '/api/v1'. This may fail for server-side requests " +
            "(Server Components, Actions, Route Handlers) if the API is hosted separately. " +
            "Ensure NEXT_PUBLIC_API_BASE_URL is configured in your environment (.env.local, etc.) " +
            "and exposed to the browser if needed."
        );
        return "/api/v1"; // Fallback, suitable if Next.js hosts the API route proxy
        // If API is always external, fallback could be e.g., "http://localhost:8080/api/v1"
        // but env var is strongly preferred.
    }
    // Remove trailing slash if present
    return baseUrl.replace(/\/$/, '');
}

// --- Core API Client Function ---
interface RequestOptions extends Omit<RequestInit, 'body'> {
    body?: any; // Allow structured data, FormData, etc.
    // Custom options can be added here (e.g., timeout)
}

/**
 * Generic API client function using fetch.
 * Handles request/response processing, JSON parsing, error standardization.
 * Includes credentials (cookies) by default for API requests.
 *
 * @template T - The expected type of the successful response data.
 * @param {string} endpoint - API endpoint path (e.g., '/users/me', must start with '/').
 * @param {RequestOptions} [options={}] - Fetch options (method, body, headers, cache, signal, etc.).
 * @returns {Promise<T>} Promise resolving to the parsed JSON response body of type T, or undefined for 204 No Content.
 * @throws {APIError} on network errors or non-2xx HTTP status codes.
 */
async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  if (!endpoint.startsWith('/')) {
      console.warn(`API Client: Endpoint "${endpoint}" should start with '/'. Prepending automatically.`);
      endpoint = `/${endpoint}`;
  }

  const baseURL = getApiBaseUrl();
  const url = `${baseURL}${endpoint}`;
  const headers = new Headers(options.headers); // Use Headers interface

  // --- Prepare Body & Content-Type ---
  let bodyToSend: BodyInit | null = null;
  if (options.body !== undefined && options.body !== null) {
    if (options.body instanceof FormData) {
        bodyToSend = options.body;
        // Browser sets Content-Type automatically for FormData
        headers.delete('Content-Type'); // Ensure no manual Content-Type overrides FormData boundary
    } else if (options.body instanceof URLSearchParams) {
        bodyToSend = options.body;
        if (!headers.has("Content-Type")) {
            headers.set("Content-Type", "application/x-www-form-urlencoded");
        }
    } else if (options.body instanceof ArrayBuffer || options.body instanceof Blob) {
        bodyToSend = options.body;
        // Caller should set Content-Type appropriately
    } else if (typeof options.body === 'string') {
        bodyToSend = options.body;
        // Default to text/plain if not set, allow overrides
        if (!headers.has("Content-Type")) {
            // headers.set("Content-Type", "text/plain;charset=UTF-8");
        }
    } else { // Assume JSON for objects/arrays
        try {
            bodyToSend = JSON.stringify(options.body);
            if (!headers.has("Content-Type")) {
                headers.set("Content-Type", "application/json");
            }
        } catch (stringifyError) {
            console.error(`API Client: Failed to stringify JSON request body for ${url}:`, stringifyError);
            throw new APIError("Failed to serialize request body.", 0, "SERIALIZATION_ERROR", undefined, stringifyError);
        }
    }
  }

  // Set default Accept header if not already set
  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  // --- Fetch Configuration ---
  const config: RequestInit = {
    ...options, // Spread other fetch options (signal, keepalive, etc.)
    method: options.method?.toUpperCase() || (bodyToSend ? 'POST' : 'GET'),
    headers: headers,
    body: bodyToSend,
    // Sensible default: 'no-store' to prevent browser/intermediate caching of API calls.
    // Can be overridden by caller if caching is desired (e.g., for public, immutable data).
    cache: options.cache ?? 'no-store',
    // Include credentials (cookies) by default. Necessary for session-based auth.
    // Requires proper CORS configuration on the backend if making cross-origin requests.
    credentials: options.credentials ?? 'include',
  };

  // --- Execute Fetch ---
  let response: Response;
  try {
    // console.log(`API Client Request: ${config.method} ${url}`, { bodyProvided: !!config.body }); // Reduce logging noise
    response = await fetch(url, config);
    // console.log(`API Client Response: ${response.status} ${response.statusText} for ${config.method} ${url}`);
  } catch (networkError: any) {
    console.error(`API Client Network Error: ${config.method} ${url}`, networkError);
    throw new APIError(
      `Network request failed: ${networkError?.message || 'Check connection or CORS policy.'}`,
      0, // Status 0 for network errors
      "NETWORK_ERROR",
      undefined,
      networkError
    );
  }

  // --- Process Response ---
  const requestId = response.headers.get("X-Request-ID") ?? undefined;

  // Handle successful No Content response
  if (response.status === 204) {
    return undefined as T;
  }

  // Attempt to read response body (only once)
  let responseText: string | null = null;
  try {
      responseText = await response.text();
  } catch (readError: any) {
      console.warn(`API Client: Failed to read response body for ${url} (status: ${response.status})`, readError);
      // If reading fails, we can't parse JSON or get error details from body
      if (!response.ok) {
          // Throw APIError for the failed status code, noting body read error
          throw new APIError(
              `API request failed with status ${response.status} and response body could not be read.`,
              response.status,
              `HTTP_${response.status}`,
              requestId,
              { bodyReadError: readError.message }
          );
      } else {
           // Success status but failed to read body - unusual, treat as parse error
           throw new APIError(
              `API request succeeded (${response.status}) but failed to read response body.`,
              response.status, "READ_ERROR", requestId, { bodyReadError: readError.message }
           );
      }
  }

  // Try to parse as JSON if Content-Type indicates it
  let responseBody: any = responseText; // Default to text if not JSON or parsing fails
  let parseError: Error | null = null;
  const contentType = response.headers.get("Content-Type");

  if (responseText && contentType && contentType.toLowerCase().includes("application/json")) {
    try {
      responseBody = JSON.parse(responseText);
    } catch (e: any) {
      parseError = e;
      console.warn(`API Client: Could not parse JSON response from ${url} (status: ${response.status}). Body: ${responseText.substring(0, 100)}...`, parseError);
      // Keep responseBody as the original text for error reporting
    }
  }

  // Check for non-2xx status codes AFTER attempting to parse
  if (!response.ok) {
    let message = `API request failed with status ${response.status}`;
    let code = `HTTP_${response.status}`;
    let details: unknown = responseBody; // Use parsed body (or text) as details

    // If JSON error DTO was successfully parsed, use its fields
    if (!parseError && responseBody && typeof responseBody === 'object' && (responseBody as ErrorResponseDTO).code) {
        const errorDto = responseBody as ErrorResponseDTO;
        message = errorDto.message || message; // Prefer backend message
        code = errorDto.code; // Use backend code
        details = errorDto; // Use the full DTO as details
    } else if (typeof responseBody === 'string' && responseBody) {
       // Use text body as message if JSON parsing failed or wasn't JSON
       message = responseBody.substring(0, 200); // Limit length
    }

    console.error(`API Error: ${config.method} ${url} -> ${response.status} ${code} - ${message}`, { requestId, details: responseBody }); // Log full details

    throw new APIError(message, response.status, code, requestId, details);
  }

  // Handle case where status is OK (2xx) but JSON parsing failed (unexpected)
  if (parseError) {
    throw new APIError(
      `API request succeeded (${response.status}) but failed to parse expected JSON response.`,
      response.status,
      "PARSE_ERROR",
      requestId,
      { parseErrorMessage: parseError.message, responseText: responseText?.substring(0, 500) }
    );
  }

  // Successful response with parsed body (JSON or text)
  return responseBody as T;
}

export default apiClient;

// Convenience Methods
export const apiGet = <T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
  apiClient<T>(endpoint, { ...options, method: 'GET' });

export const apiPost = <T>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>) =>
  apiClient<T>(endpoint, { ...options, method: 'POST', body });

export const apiPut = <T>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>) =>
  apiClient<T>(endpoint, { ...options, method: 'PUT', body });

export const apiPatch = <T>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiClient<T>(endpoint, { ...options, method: 'PATCH', body });

// DELETE often returns 204 No Content, so default T to void
export const apiDelete = <T = void>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
  apiClient<T>(endpoint, { ...options, method: 'DELETE' });