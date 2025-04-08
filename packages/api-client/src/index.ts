// packages/api-client/src/index.ts
import type { ErrorResponseDTO } from "@repo/types"; // Import shared error type

// Custom Error for API specific issues
export class APIError extends Error {
  status: number;
  code: string;
  requestId?: string;
  details?: unknown; // Could hold validation details etc.

  constructor(message: string, status: number, code: string, requestId?: string, details?: unknown) {
    super(message);
    this.name = "APIError";
    this.status = status;
    this.code = code;
    this.requestId = requestId;
    this.details = details;
    // Ensure the prototype chain is correct for Error subclasses
    Object.setPrototypeOf(this, APIError.prototype);
  }
}

// Base API URL from environment variable (defined per app)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1";

interface RequestOptions extends RequestInit {
  // Add specific options if needed later
}

async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = new Headers(options.headers);

  // Default headers
  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }
  if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  // **IMPORTANT:** Authorization header is NOT added here automatically.
  // The caller (Server Action, Route Handler, specific client-side fetch)
  // must add it if required, retrieving the token securely from its context.

  const config: RequestInit = {
    ...options,
    headers: headers,
  };

  try {
    const response = await fetch(url, config);

    // Add Request ID to potential error messages if available in headers
    const requestId = response.headers.get("X-Request-ID") ?? undefined; // Or your header name

    // Handle No Content response
    if (response.status === 204) {
      // Return null or an empty object/array based on expected T
      // Returning 'undefined' might be cleaner if T allows it.
      // Here we cast to T assuming caller expects no content.
      return undefined as T;
    }

    // Attempt to parse JSON, even for errors, as body might contain details
    let responseBody: any = null;
    try {
        // Check Content-Type before assuming JSON
        const contentType = response.headers.get("Content-Type");
        if (contentType && contentType.includes("application/json")) {
            responseBody = await response.json();
        } else if (response.status < 400){
            // For non-JSON success responses (if any), maybe return text?
            // responseBody = await response.text();
            // For now, assume JSON or no content for success
        } else {
             // For non-JSON errors, try to read text for the message
             responseBody = { message: await response.text() };
        }
    } catch (parseError) {
        // Ignore JSON parsing errors if response is OK but empty or not JSON
        // Log if needed, but don't fail the request if status is OK
        if (!response.ok) {
            console.error("API Client: Failed to parse response body", parseError);
            // Throw generic error if parsing fails on an error response
            throw new APIError(
                `API request failed with status ${response.status}, and response body parsing failed.`,
                response.status,
                "PARSE_ERROR",
                requestId
            );
        }
    }


    if (!response.ok) {
      // Try to use the parsed error structure from the backend
      const errorDto = responseBody as ErrorResponseDTO;
      const message = errorDto?.message || `API request failed with status ${response.status}`;
      const code = errorDto?.code || "HTTP_ERROR";
      console.error(`API Error (${url}): ${status} ${code} - ${message}`, responseBody);
      throw new APIError(message, response.status, code, requestId, responseBody);
    }

    // Assume successful JSON response matches type T
    return responseBody as T;

  } catch (error) {
    // Handle fetch exceptions (network errors, etc.) or re-throw APIError
    if (error instanceof APIError) {
      throw error; // Re-throw known API errors
    }
    console.error(`API Client Network/Fetch Error (${url}):`, error);
    throw new APIError(
      "Network request failed. Please check your connection.",
      0, // Indicate network error with status 0 or similar
      "NETWORK_ERROR",
      undefined, // No request ID if fetch failed early
      error // Include original error
    );
  }
}

export default apiClient;

// Convenience methods (optional)
export const apiGet = <T>(endpoint: string, options: RequestOptions = {}) =>
  apiClient<T>(endpoint, { ...options, method: 'GET' });

export const apiPost = <T>(endpoint: string, body: any, options: RequestOptions = {}) =>
  apiClient<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) });

export const apiPut = <T>(endpoint: string, body: any, options: RequestOptions = {}) =>
  apiClient<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) });

export const apiDelete = <T>(endpoint: string, options: RequestOptions = {}) =>
  apiClient<T>(endpoint, { ...options, method: 'DELETE' });