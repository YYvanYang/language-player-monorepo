// packages/api-client/src/index.ts
import type { ErrorResponseDTO } from "@repo/types";

// Define APIError class for standardized error handling
export class APIError extends Error {
    status: number; // HTTP status code (0 for network/parsing errors)
    code: string; // Application-specific error code (e.g., "NOT_FOUND", "INVALID_INPUT", "NETWORK_ERROR")
    requestId?: string; // Optional request ID from response headers for tracing
    details?: unknown; // Optional structured details from the error response body

    constructor(message: string, status: number, code: string, requestId?: string, details?: unknown) {
        super(message);
        this.name = "APIError";
        this.status = status;
        this.code = code;
        this.requestId = requestId;
        this.details = details;
        // Maintain stack trace in V8 environments
        if (Error.captureStackTrace) { Error.captureStackTrace(this, APIError); }
        // Set the prototype explicitly for correct instanceof checks
        Object.setPrototypeOf(this, APIError.prototype);
    }
}

// Helper function to determine the correct base URL for the API call
function getApiClientBaseUrl(endpoint: string): string {
    const isProxyCall = endpoint.startsWith('/api/proxy/');
    const isServerSide = typeof window === 'undefined';

    if (isProxyCall) {
        // --- Calling the internal Next.js proxy route ---
        if (isServerSide) {
            // Server-side requires the *absolute* URL of the Next.js app itself
            const appUrl = process.env.NEXT_PUBLIC_APP_URL;
            if (!appUrl) {
                // This is a critical configuration error for server-side proxy calls
                console.error("API Client Config Error: NEXT_PUBLIC_APP_URL is not set. This is required for server-side calls to the internal API proxy (/api/proxy/).");
                // Fallback to localhost:3000 only in non-production environments WITH a warning
                if (process.env.NODE_ENV !== 'production') {
                    console.warn("API Client Warning: Falling back to 'http://localhost:3000' for server-side proxy call. Ensure NEXT_PUBLIC_APP_URL is set correctly in your .env files.");
                    return 'http://localhost:3000'; // Default for local dev, ensure no trailing slash
                }
                // In production, this should ideally cause a startup failure or throw a hard error.
                throw new Error("NEXT_PUBLIC_APP_URL environment variable is not set. Cannot make server-side proxy calls.");
            }
            return appUrl.replace(/\/$/, ''); // Remove trailing slash if present
        } else {
            // Client-side calls to the proxy can use a relative path
            return '';
        }
    } else {
        // --- Calling the external Go backend API directly ---
        // (e.g., for public routes if not using the proxy for them)
        const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
         if (!backendUrl) {
             // Direct backend calls ALWAYS need the base URL defined.
             console.error("API Client Config Error: NEXT_PUBLIC_API_BASE_URL is not set. This is required for direct calls to the backend API.");
             throw new Error("NEXT_PUBLIC_API_BASE_URL environment variable is not set.");
         }
         return backendUrl.replace(/\/$/, ''); // Remove trailing slash
    }
}

// Define RequestInit options excluding 'body' for type safety with our body handling
interface RequestOptions extends Omit<RequestInit, 'body'> {
    body?: any; // Allow any type for body before stringification
}

/**
 * Generic API client function using fetch.
 * Handles request/response processing, JSON parsing, error standardization.
 * Authentication is handled implicitly via cookies passed by the browser/fetch or
 * by the BFF proxy adding the Authorization header.
 *
 * @template T The expected type of the successful response data.
 * @param {string} endpoint - API endpoint path (e.g., '/users/me' for direct backend, or '/api/proxy/users/me' for proxy). MUST start with '/'.
 * @param {RequestOptions} [options={}] - Fetch options (method, body, headers, cache, signal, etc.).
 * @returns {Promise<T>} Promise resolving to the parsed JSON response body of type T, or undefined for 204 No Content.
 * @throws {APIError} on network errors or non-2xx HTTP status codes.
 */
async function apiClient<T>(
    endpoint: string,
    options: RequestOptions = {}
): Promise<T> {
    // Ensure endpoint starts with a slash for consistent URL construction
    if (!endpoint.startsWith('/')) {
        console.warn(`API Client Warning: Endpoint "${endpoint}" should start with '/'. Prepending automatically.`);
        endpoint = `/${endpoint}`;
    }

    const baseURL = getApiClientBaseUrl(endpoint); // Determine base URL dynamically
    const url = `${baseURL}${endpoint}`;

    const headers = new Headers(options.headers); // Initialize headers
    let bodyToSend: BodyInit | null = null; // Prepare body

    // Process request body if provided
    if (options.body !== undefined && options.body !== null) {
         if (options.body instanceof FormData || options.body instanceof URLSearchParams || options.body instanceof ArrayBuffer || options.body instanceof Blob || typeof options.body === 'string') {
             // Pass through standard body types
             bodyToSend = options.body;
             // Let browser/fetch set Content-Type for FormData
             if (options.body instanceof FormData) {
                 headers.delete('Content-Type');
             } else if (options.body instanceof URLSearchParams && !headers.has("Content-Type")) {
                 // Set default for URLSearchParams if not already set
                 headers.set("Content-Type", "application/x-www-form-urlencoded");
             }
         } else {
             // Assume JSON for other object types
             try {
                 bodyToSend = JSON.stringify(options.body);
                 if (!headers.has("Content-Type")) {
                    headers.set("Content-Type", "application/json");
                 }
             } catch (stringifyError) {
                 console.error(`API Client Error: Failed to stringify JSON request body for ${url}:`, stringifyError);
                 throw new APIError("Failed to serialize request body.", 0, "SERIALIZATION_ERROR", undefined, stringifyError);
             }
         }
    }

    // Set default Accept header if not provided
    if (!headers.has("Accept")) {
        headers.set("Accept", "application/json");
    }

    // Final fetch configuration
    const config: RequestInit = {
        ...options,
        method: options.method?.toUpperCase() || (bodyToSend ? 'POST' : 'GET'), // Default method based on body presence
        headers: headers,
        body: bodyToSend,
        cache: options.cache ?? 'no-store', // Default to no-store for API calls to prevent stale data
        // Send credentials (cookies) with the request. This is crucial for both
        // sending the session cookie to the BFF proxy and potentially sending
        // backend-specific cookies if not using the proxy for some calls.
        credentials: options.credentials ?? 'include',
    };

    let response: Response;
    try {
        // console.debug(`API Client Request: ${config.method} ${url}`); // Uncomment for verbose request logging
        response = await fetch(url, config);
    } catch (networkError: any) {
        console.error(`API Client Network Error: ${config.method} ${url}`, networkError);
        // Check specifically for the URL parsing error which indicates config issues
        if (networkError instanceof TypeError && (networkError.message.includes('Invalid URL') || networkError.message.includes('Failed to parse URL'))) {
             throw new APIError(
                `Network request failed: Invalid URL constructed ('${url}'). Please check NEXT_PUBLIC_APP_URL and NEXT_PUBLIC_API_BASE_URL environment variable configurations.`,
                0, // Status code 0 for network/config errors
                "INVALID_URL_CONFIG", // Specific error code
                undefined,
                networkError
            );
        }
        // Throw generic network error otherwise
        throw new APIError(
            `Network request failed: ${networkError?.message || 'Check connection or API server.'}`,
            0,
            "NETWORK_ERROR",
            undefined,
            networkError
        );
    }

    // --- Response Processing ---
    const requestId = response.headers.get("X-Request-ID") ?? undefined;

    // Handle successful No Content response
    if (response.status === 204) {
        return undefined as T; // Explicitly return undefined for 204
    }

    // Attempt to read the response body as text
    let responseText: string | null = null;
    try {
        responseText = await response.text();
    } catch (readError: any) {
        // This can happen if the connection drops while reading the body
        console.warn(`API Client Warning: Failed to read response body for ${url} (status: ${response.status})`, readError);
        const msg = `API request ${response.ok ? 'succeeded' : 'failed'} (${response.status}) but response body could not be fully read.`;
        const code = response.ok ? "READ_ERROR_SUCCESS" : `READ_ERROR_FAIL_${response.status}`;
        // Throw an error even if status was 2xx, because we couldn't get the body
        throw new APIError(msg, response.status, code, requestId, { bodyReadError: readError.message });
    }

    // Attempt to parse JSON if applicable and text exists
    let responseBody: any = responseText; // Default to text if not JSON or empty
    let parseError: Error | null = null;
    const contentType = response.headers.get("Content-Type");
    if (responseText && contentType?.toLowerCase().includes("application/json")) {
        try {
            responseBody = JSON.parse(responseText);
        } catch (e: any) {
            parseError = e; // Store parse error
            console.warn(`API Client Warning: Could not parse JSON response from ${url} (status: ${response.status}). Body: ${responseText.substring(0, 100)}...`, parseError);
        }
    }

    // Handle non-OK HTTP responses (4xx, 5xx)
    if (!response.ok) {
        let message = `API request failed with status ${response.status} ${response.statusText}`;
        let code = `HTTP_${response.status}`;
        let details: unknown = responseBody; // Use parsed body (or text) as details

        // Try to extract details from standard error DTO if parsing didn't fail
        if (!parseError && responseBody && typeof responseBody === 'object' && (responseBody as ErrorResponseDTO).code) {
            const errorDto = responseBody as ErrorResponseDTO;
            message = errorDto.message || message; // Use backend message if available
            code = errorDto.code; // Use backend code
            details = errorDto; // Keep the DTO as details
        } else if (typeof responseBody === 'string' && responseBody) {
           // If JSON parsing failed or it wasn't JSON, use the text as message (limited length)
           message = responseBody.substring(0, 200);
        }

        console.error(`API Client Error Response: ${config.method} ${url} -> ${response.status} ${code} - ${message}`, { requestId, details: typeof details === 'object' ? details : undefined });

        // Throw the standardized APIError
        throw new APIError(message, response.status, code, requestId, details);
    }

    // Handle JSON parsing errors even for OK responses (2xx)
    if (parseError) {
        console.error(`API Client Parse Error: ${config.method} ${url} -> Status ${response.status} but failed to parse JSON response.`, parseError);
        throw new APIError(
            `API request succeeded (${response.status}) but failed to parse expected JSON response.`,
            response.status, // Keep original status
            "PARSE_ERROR",    // Specific code for parse error
            requestId,
            { parseErrorMessage: parseError.message, responseText: responseText?.substring(0, 500) } // Include details
        );
    }

    // Return the successfully parsed response body
    return responseBody as T;
}

export default apiClient;

// --- Convenience Methods (No Token Needed) ---
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