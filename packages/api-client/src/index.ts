// packages/api-client/src/index.ts
import type { ErrorResponseDTO } from "@repo/types";

export class APIError extends Error {
    status: number;
    code: string;
    requestId?: string;
    details?: unknown;
    constructor(message: string, status: number, code: string, requestId?: string, details?: unknown) {
        super(message);
        this.name = "APIError";
        this.status = status;
        this.code = code;
        this.requestId = requestId;
        this.details = details;
        if (Error.captureStackTrace) { Error.captureStackTrace(this, APIError); }
        Object.setPrototypeOf(this, APIError.prototype);
    }
}

function getApiBaseUrl(): string {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) {
        console.warn(
            "API Client Warning: NEXT_PUBLIC_API_BASE_URL environment variable is not set. " +
            "Falling back to relative path. This will work for browser calls but fail for server-side calls directly to the backend."
        );
        // Use empty string for relative path if called from browser to proxy
        // If called server-side directly to backend, it needs the full URL.
        // This simple logic might need refinement based on where apiClient is called.
        return typeof window === 'undefined' ? 'http://localhost:8080/api/v1' : ''; // TODO: Revisit fallback logic
    }
    return baseUrl.replace(/\/$/, ''); // Remove trailing slash
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
    body?: any;
}

/**
 * Generic API client function using fetch.
 * Handles request/response processing, JSON parsing, error standardization.
 * REMOVED optional token parameter. Auth is handled by session or proxy.
 *
 * @template T
 * @param {string} endpoint - API endpoint path (e.g., '/users/me', or '/api/proxy/users/me').
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

    // Determine base URL: Use relative path for proxy calls from browser/server, or absolute for direct backend calls (if any)
    const isProxyCall = endpoint.startsWith('/api/proxy/');
    const baseURL = isProxyCall ? '' : getApiBaseUrl();
    const url = `${baseURL}${endpoint}`;

    const headers = new Headers(options.headers);
    let bodyToSend: BodyInit | null = null;

    if (options.body !== undefined && options.body !== null) {
         if (options.body instanceof FormData || options.body instanceof URLSearchParams || options.body instanceof ArrayBuffer || options.body instanceof Blob || typeof options.body === 'string') {
             bodyToSend = options.body;
             if (options.body instanceof FormData) {
                 headers.delete('Content-Type');
             } else if (options.body instanceof URLSearchParams && !headers.has("Content-Type")) {
                 headers.set("Content-Type", "application/x-www-form-urlencoded");
             }
         } else {
             try {
                 bodyToSend = JSON.stringify(options.body);
                 if (!headers.has("Content-Type")) { headers.set("Content-Type", "application/json"); }
             } catch (stringifyError) {
                 console.error(`API Client: Failed to stringify JSON request body for ${url}:`, stringifyError);
                 throw new APIError("Failed to serialize request body.", 0, "SERIALIZATION_ERROR", undefined, stringifyError);
             }
         }
    }

    if (!headers.has("Accept")) { headers.set("Accept", "application/json"); }

    // --- REMOVED Authorization Header Logic ---

    const config: RequestInit = {
        ...options,
        method: options.method?.toUpperCase() || (bodyToSend ? 'POST' : 'GET'),
        headers: headers,
        body: bodyToSend,
        cache: options.cache ?? 'no-store', // Default to no-store for API calls
        // --- Always include credentials when calling from browser/server to Proxy/Backend ---
        // The proxy will decide whether to forward cookies or use the Bearer token
        credentials: options.credentials ?? 'include',
    };

    let response: Response;
    try {
        // console.log(`API Client Request: ${config.method} ${url}`); // Reduce verbosity
        response = await fetch(url, config);
    } catch (networkError: any) {
        console.error(`API Client Network Error: ${config.method} ${url}`, networkError);
        throw new APIError(
            `Network request failed: ${networkError?.message || 'Check connection or API server.'}`,
            0, "NETWORK_ERROR", undefined, networkError
        );
    }

    // Response processing...
    const requestId = response.headers.get("X-Request-ID") ?? undefined;
    if (response.status === 204) { return undefined as T; }

    let responseText: string | null = null;
    try { responseText = await response.text(); }
    catch (readError: any) {
        console.warn(`API Client: Failed to read response body for ${url} (status: ${response.status})`, readError);
        const msg = `API request ${response.ok ? 'succeeded' : 'failed'} (${response.status}) but response body could not be read.`;
        const code = response.ok ? "READ_ERROR" : `HTTP_${response.status}`;
        throw new APIError(msg, response.status, code, requestId, { bodyReadError: readError.message });
    }

    let responseBody: any = responseText;
    let parseError: Error | null = null;
    const contentType = response.headers.get("Content-Type");
    if (responseText && contentType?.toLowerCase().includes("application/json")) {
        try { responseBody = JSON.parse(responseText); }
        catch (e: any) {
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
            details = errorDto; // Use the parsed DTO as details
        } else if (typeof responseBody === 'string' && responseBody) {
           message = responseBody.substring(0, 200); // Use response text as message fallback
        }

        console.error(`API Error: ${config.method} ${url} -> ${response.status} ${code} - ${message}`, { requestId, details: typeof details === 'object' ? details : undefined });

        throw new APIError(message, response.status, code, requestId, details);
    }

    if (parseError) {
        throw new APIError(
            `API request succeeded (${response.status}) but failed to parse expected JSON response.`,
            response.status, "PARSE_ERROR", requestId,
            { parseErrorMessage: parseError.message, responseText: responseText?.substring(0, 500) }
        );
    }

    return responseBody as T;
}

export default apiClient;

// --- Convenience Methods (REMOVED token parameter) ---
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