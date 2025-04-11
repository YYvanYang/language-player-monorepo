// packages/api-client/src/index.ts
// (Content from previous response is generally good)
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
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "/api/v1";
        // console.log("API Client Base URL (Client):", baseUrl);
        return baseUrl;
    }
    // Server-side check (Server Components, Actions, Route Handlers)
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1";
    // console.log("API Client Base URL (Server):", baseUrl);
    return baseUrl;
}

// --- Core API Client Function ---
interface RequestOptions extends Omit<RequestInit, 'body'> { // Omit body, handle separately
    body?: any; // Allow any body type initially
    // Add specific options if needed later (e.g., custom timeout)
}

/**
 * Generic API client function using fetch.
 * Handles request/response processing, JSON parsing, and error standardization.
 * Automatically handles cookies for same-site requests.
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

  // Prepare Request Body and Headers
  let bodyToSend: BodyInit | null = null;
  if (options.body !== undefined && options.body !== null) {
    // Handle FormData separately - let the browser set the Content-Type
    if (options.body instanceof FormData) {
        bodyToSend = options.body;
    }
    // Handle ArrayBuffer for direct binary upload (though usually done via presigned URL)
    else if (options.body instanceof ArrayBuffer || options.body instanceof Blob) {
        bodyToSend = options.body;
        // Potentially set Content-Type based on Blob type if needed
        // headers.set('Content-Type', options.body.type);
    }
    // Handle strings - assume plain text unless Content-Type is set otherwise
    else if (typeof options.body === 'string') {
        bodyToSend = options.body;
        if (!headers.has("Content-Type")) {
            // headers.set("Content-Type", "text/plain"); // Or let caller specify
        }
    }
    // Assume JSON for other types (objects, arrays)
    else {
        try {
            bodyToSend = JSON.stringify(options.body);
            if (!headers.has("Content-Type")) {
                headers.set("Content-Type", "application/json");
            }
        } catch (stringifyError) {
            console.error(`API Client: Failed to stringify request body for ${url}:`, stringifyError);
            throw new APIError(
                "Failed to serialize request body.",
                0,
                "SERIALIZATION_ERROR",
                undefined,
                stringifyError
            );
        }
    }
  }

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json"); // Default to accepting JSON
  }

  // Fetch Configuration
  const config: RequestInit = {
    method: options.method || (bodyToSend ? 'POST' : 'GET'),
    headers: headers,
    body: bodyToSend,
    cache: options.cache || 'no-store', // Sensible default for API calls
    signal: options.signal,
    credentials: options.credentials ?? 'include', // IMPORTANT: Include credentials (cookies) by default for same-origin/configured CORS requests
  };

  // Execute Fetch
  let response: Response;
  try {
    // console.log(`API Client Request: ${config.method} ${url}`, { body: config.body ? '[BODY PRESENT]' : '[NO BODY]', headers: Object.fromEntries(config.headers.entries())});
    response = await fetch(url, config);
    // console.log(`API Client Response: ${response.status} for ${config.method} ${url}`);
  } catch (networkError) {
    console.error(`API Client Network Error (${config.method} ${url}):`, networkError);
    throw new APIError(
      "Network request failed. Please check your connection.",
      0,
      "NETWORK_ERROR",
      undefined,
      networkError
    );
  }

  // Process Response
  const requestId = response.headers.get("X-Request-ID") ?? undefined;

  // Handle No Content response successfully
  if (response.status === 204) {
    // console.log(`API Client: Received 204 No Content for ${config.method} ${url}`);
    return undefined as T; // Return undefined for void responses
  }

  // Try to parse response body
  let responseBody: any = null;
  let parseError: Error | null = null;
  const responseText = await response.text(); // Read as text first to ensure we have it even if JSON parsing fails

  if (responseText) {
    const contentType = response.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
      try {
        responseBody = JSON.parse(responseText);
      } catch (e) {
        parseError = e as Error;
        console.warn(`API Client: Could not parse JSON response from ${url} (status: ${response.status}). Body: ${responseText.substring(0, 100)}...`, parseError);
        // Keep responseText as potential detail
        responseBody = responseText;
      }
    } else {
       // If not JSON, keep the text response
       responseBody = responseText;
    }
  }

  // Check if the request failed (non-2xx status code)
  if (!response.ok) {
    let message = `API request failed with status ${response.status}`;
    let code = `HTTP_${response.status}`;
    let details: unknown = responseBody; // Include parsed body (or text) as details

    // If JSON error response was successfully parsed, use its fields
    if (!parseError && responseBody && typeof responseBody === 'object' && (responseBody as ErrorResponseDTO).code) {
        const errorDto = responseBody as ErrorResponseDTO;
        message = errorDto.message || message; // Prefer backend message
        code = errorDto.code; // Use backend code
    } else if (typeof responseBody === 'string' && responseBody) {
       // Use text body as message if JSON parsing failed or wasn't JSON
       message = responseBody.substring(0, 200); // Limit length
    }

    console.error(`API Error (${config.method} ${url}): ${response.status} ${code} - ${message}`, { requestId, details: responseBody }); // Log full details

    throw new APIError(message, response.status, code, requestId, details);
  }

  // If parsing failed but status was OK (e.g., 200 OK with invalid JSON), throw specific error
  if (parseError && response.ok) {
    throw new APIError(
      `API request succeeded (${response.status}) but failed to parse response body.`,
      response.status,
      "PARSE_ERROR",
      requestId,
      { parseError: parseError.message, responseText: responseText.substring(0, 500) }
    );
  }

  // Successful response with parsed body (which could be text if not JSON)
  return responseBody as T;
}

export default apiClient;

// Convenience Methods (no change)
export const apiGet = <T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
  apiClient<T>(endpoint, { ...options, method: 'GET' });

export const apiPost = <T>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>) =>
  apiClient<T>(endpoint, { ...options, method: 'POST', body: body });

export const apiPut = <T>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>) =>
  apiClient<T>(endpoint, { ...options, method: 'PUT', body: body });

export const apiDelete = <T = void>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
  apiClient<T>(endpoint, { ...options, method: 'DELETE' });