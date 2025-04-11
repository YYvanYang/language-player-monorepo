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
 * Logs a warning if the variable is missing and falls back.
 * @returns {string} The API base URL.
 */
function getApiBaseUrl(): string {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) {
        console.warn(
            "API Client Warning: NEXT_PUBLIC_API_BASE_URL environment variable is not set. " +
            "Ensure it's configured in your environment (.env.local, etc.). " +
            "Falling back to relative '/api/v1'. This may fail for server-side requests."
        );
        return "/api/v1"; // Adjust fallback if necessary
    }
    // Remove trailing slash if present
    return baseUrl.replace(/\/$/, '');
}

// --- Core API Client Function ---
interface RequestOptions extends Omit<RequestInit, 'body'> {
    body?: any; // Allow structured data, FormData, etc.
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
  // Ensure endpoint starts with a slash
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
    if (options.body instanceof FormData || options.body instanceof URLSearchParams || options.body instanceof ArrayBuffer || options.body instanceof Blob || typeof options.body === 'string') {
        // For these types, let fetch handle Content-Type or expect caller to set it
        bodyToSend = options.body;
        if(options.body instanceof FormData) {
            headers.delete('Content-Type'); // Crucial for FormData
        } else if(options.body instanceof URLSearchParams && !headers.has("Content-Type")) {
            headers.set("Content-Type", "application/x-www-form-urlencoded");
        }
    } else { // Assume JSON for other objects/arrays
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
    ...options,
    method: options.method?.toUpperCase() || (bodyToSend ? 'POST' : 'GET'),
    headers: headers,
    body: bodyToSend,
    cache: options.cache ?? 'no-store',
    credentials: options.credentials ?? 'include', // Send cookies by default
  };

  // --- Execute Fetch ---
  let response: Response;
  try {
    // console.log(`API Client Request: ${config.method} ${url}`); // Reduce logging verbosity
    response = await fetch(url, config);
  } catch (networkError: any) {
    console.error(`API Client Network Error: ${config.method} ${url}`, networkError);
    throw new APIError(
      `Network request failed: ${networkError?.message || 'Check connection or CORS policy.'}`,
      0, "NETWORK_ERROR", undefined, networkError
    );
  }

  // --- Process Response ---
  const requestId = response.headers.get("X-Request-ID") ?? undefined;

  if (response.status === 204) {
    return undefined as T; // Handle No Content
  }

  let responseText: string | null = null;
  try {
      responseText = await response.text();
  } catch (readError: any) {
      console.warn(`API Client: Failed to read response body for ${url} (status: ${response.status})`, readError);
      if (!response.ok) {
          throw new APIError(
              `API request failed (${response.status}) and response body could not be read.`,
              response.status, `HTTP_${response.status}`, requestId, { bodyReadError: readError.message }
          );
      } else {
           throw new APIError(
              `API request succeeded (${response.status}) but failed to read response body.`,
              response.status, "READ_ERROR", requestId, { bodyReadError: readError.message }
           );
      }
  }

  let responseBody: any = responseText; // Default to text
  let parseError: Error | null = null;
  const contentType = response.headers.get("Content-Type");

  if (responseText && contentType?.toLowerCase().includes("application/json")) {
    try {
      responseBody = JSON.parse(responseText);
    } catch (e: any) {
      parseError = e;
      console.warn(`API Client: Could not parse JSON response from ${url} (status: ${response.status}). Body: ${responseText.substring(0, 100)}...`, parseError);
    }
  }

  if (!response.ok) {
    let message = `API request failed with status ${response.status}`;
    let code = `HTTP_${response.status}`;
    let details: unknown = responseBody;

    if (!parseError && responseBody && typeof responseBody === 'object' && (responseBody as ErrorResponseDTO).code) {
        const errorDto = responseBody as ErrorResponseDTO;
        message = errorDto.message || message;
        code = errorDto.code;
        details = errorDto;
    } else if (typeof responseBody === 'string' && responseBody) {
       message = responseBody.substring(0, 200);
    }

    console.error(`API Error: ${config.method} ${url} -> ${response.status} ${code} - ${message}`, { requestId, details }); // Log full details

    // Throw the APIError with extracted/constructed info
    throw new APIError(message, response.status, code, requestId, details);
  }

  if (parseError) {
    // Success status but failed to parse JSON body
    throw new APIError(
      `API request succeeded (${response.status}) but failed to parse expected JSON response.`,
      response.status, "PARSE_ERROR", requestId,
      { parseErrorMessage: parseError.message, responseText: responseText?.substring(0, 500) }
    );
  }

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

export const apiDelete = <T = void>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
  apiClient<T>(endpoint, { ...options, method: 'DELETE' });