// packages/api-client/src/index.ts
import type { ErrorResponseDTO } from "@repo/types";
import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import logger from '@repo/logger';

const apiClientLogger = logger.child({ module: 'api-client' });

// Define APIError class
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

// Helper function to determine base URL
function getApiClientBaseUrl(endpoint: string): string {
    const isProxyCall = endpoint.startsWith('/api/proxy/');
    const isServerSide = typeof window === 'undefined';

    if (isProxyCall) {
        if (isServerSide) {
            const appUrl = process.env.NEXT_PUBLIC_APP_URL;
            if (!appUrl) {
                apiClientLogger.error("Config Error: NEXT_PUBLIC_APP_URL is not set. Required for server-side proxy calls.");
                throw new Error("NEXT_PUBLIC_APP_URL environment variable is not set. Cannot make server-side proxy calls.");
            }
            return appUrl.replace(/\/$/, '');
        } else {
            return ''; // Client-side proxy calls use relative paths
        }
    } else {
        const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
         if (!backendUrl) {
             apiClientLogger.error("Config Error: NEXT_PUBLIC_API_BASE_URL is not set. Required for direct backend calls.");
             throw new Error("NEXT_PUBLIC_API_BASE_URL environment variable is not set.");
         }
         return backendUrl.replace(/\/$/, '');
    }
}

// Define RequestInit options
interface RequestOptions extends Omit<RequestInit, 'body'> {
    body?: any;
}

/**
 * Generic API client function using fetch.
 * Handles cookie forwarding for server-side proxy calls.
 * Handles Authorization header injection for server-side direct backend calls.
 */
async function apiClient<T>(
    endpoint: string,
    options: RequestOptions = {},
    token?: string | null // Optional token for direct server-side calls
): Promise<T> {
    if (!endpoint.startsWith('/')) {
        apiClientLogger.warn({ endpoint }, `Endpoint should start with '/'. Prepending automatically.`);
        endpoint = `/${endpoint}`;
    }

    const isProxyCall = endpoint.startsWith('/api/proxy/');
    const isServerSide = typeof window === 'undefined';
    const baseURL = getApiClientBaseUrl(endpoint);
    const url = `${baseURL}${endpoint}`;

    const headers = new Headers(options.headers);
    let bodyToSend: BodyInit | null = null;

    // --- START: Server-Side Auth Handling ---
    if (isServerSide) {
        if (isProxyCall) {
            // --- Option 1: Forward Cookies to Proxy ---
            apiClientLogger.debug({ url }, `Server-side proxy call detected. Attempting to forward cookies.`);
            try {
                const { cookies: getCookies } = await import('next/headers');
                const cookieStore: ReadonlyRequestCookies = await getCookies();
                const cookieHeader = cookieStore.getAll().map(cookie => `${cookie.name}=${cookie.value}`).join('; ');
                if (cookieHeader) {
                    headers.set('Cookie', cookieHeader);
                    apiClientLogger.debug(`Forwarded Cookie header to proxy.`);
                } else {
                    apiClientLogger.warn(`No cookies found in incoming request to forward to proxy.`);
                }
            } catch (e: any) {
                apiClientLogger.error({ error: e, url }, `Error importing/using next/headers cookies() for proxy call`);
            }
        } else if (token) {
            // --- Option 2: Inject Bearer Token for Direct Backend Call ---
            apiClientLogger.debug({ url }, `Server-side direct call detected. Injecting Authorization header.`);
            headers.set('Authorization', `Bearer ${token}`);
        } else {
            // Server-side direct call *without* a token provided
            apiClientLogger.warn({ url }, `Server-side direct call initiated without an explicit token. Request will likely be unauthenticated.`);
        }
    }
    // --- END: Server-Side Auth Handling ---

    // --- Body Processing ---
    if (options.body !== undefined && options.body !== null) {
        if (options.body instanceof FormData || options.body instanceof URLSearchParams || options.body instanceof ArrayBuffer || options.body instanceof Blob || typeof options.body === 'string') {
            bodyToSend = options.body;
            if (options.body instanceof FormData) { headers.delete('Content-Type'); }
            else if (options.body instanceof URLSearchParams && !headers.has("Content-Type")) { headers.set("Content-Type", "application/x-www-form-urlencoded"); }
        } else {
            try {
                bodyToSend = JSON.stringify(options.body);
                if (!headers.has("Content-Type")) { headers.set("Content-Type", "application/json"); }
            } catch (stringifyError) {
                apiClientLogger.error({ error: stringifyError, url }, `Failed to stringify JSON request body`);
                throw new APIError("Failed to serialize request body.", 0, "SERIALIZATION_ERROR", undefined, stringifyError);
            }
        }
    }

    if (!headers.has("Accept")) { headers.set("Accept", "application/json"); }

    // --- Final Fetch Config ---
    const config: RequestInit = {
        ...options,
        method: options.method?.toUpperCase() || (bodyToSend ? 'POST' : 'GET'),
        headers: headers,
        body: bodyToSend,
        cache: options.cache ?? 'no-store',
        // Omit credentials if server-side, include otherwise (for browser calls)
        credentials: (isServerSide) ? 'omit' : options.credentials ?? 'include',
    };

    // --- Fetch Execution ---
    let response: Response;
    try {
        apiClientLogger.debug({ method: config.method, url }, `Executing API request`);
        response = await fetch(url, config);
    } catch (networkError: any) {
        apiClientLogger.error({ error: networkError, url, method: config.method }, `Network Error`);
        if (networkError instanceof TypeError && (networkError.message.includes('Invalid URL') || networkError.message.includes('Failed to parse URL'))) {
             throw new APIError( `Network request failed: Invalid URL constructed ('${url}'). Check NEXT_PUBLIC_APP_URL/NEXT_PUBLIC_API_BASE_URL configs.`, 0, "INVALID_URL_CONFIG", undefined, networkError );
        }
        throw new APIError( `Network request failed: ${networkError?.message || 'Check connection or API server.'}`, 0, "NETWORK_ERROR", undefined, networkError );
    }

    // --- Response Processing ---
    const requestId = response.headers.get("X-Request-ID") ?? undefined;
    const logContext = { url, method: config.method, status: response.status, requestId };

    if (response.status === 204) {
        apiClientLogger.debug(logContext, `Request successful (204 No Content)`);
        return undefined as T;
    }

    let responseText: string | null = null;
    try { responseText = await response.text(); }
    catch (readError: any) {
        apiClientLogger.warn({ ...logContext, error: readError }, `Failed to read response body`);
        const msg = `API request ${response.ok ? 'succeeded' : 'failed'} (${response.status}) but response body could not be fully read.`;
        const code = response.ok ? "READ_ERROR_SUCCESS" : `READ_ERROR_FAIL_${response.status}`;
        throw new APIError(msg, response.status, code, requestId, { bodyReadError: readError.message });
    }

    let responseBody: any = responseText;
    let parseError: Error | null = null;
    const contentType = response.headers.get("Content-Type");
    if (responseText && contentType?.toLowerCase().includes("application/json")) {
        try { responseBody = JSON.parse(responseText); } catch (e: any) { parseError = e; }
    }

    if (!response.ok) {
        let message = `API request failed with status ${response.status} ${response.statusText}`;
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

        apiClientLogger.error({ ...logContext, code, message, details: typeof details === 'object' ? details : undefined }, `API Error Response`);
        throw new APIError(message, response.status, code, requestId, details);
    }

    if (parseError) {
        apiClientLogger.error({ ...logContext, error: parseError }, `Failed to parse expected JSON response`);
        throw new APIError( `API request succeeded (${response.status}) but failed to parse expected JSON response.`, response.status, "PARSE_ERROR", requestId, { parseErrorMessage: parseError.message, responseText: responseText?.substring(0, 500) } );
    }

    apiClientLogger.debug(logContext, `Request successful (${response.status})`);
    return responseBody as T;
}

export default apiClient;

// --- Convenience Methods - Add Optional Token Parameter ---
export const apiGet = <T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>, token?: string | null) =>
    apiClient<T>(endpoint, { ...options, method: 'GET' }, token);

export const apiPost = <T>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>, token?: string | null) =>
    apiClient<T>(endpoint, { ...options, method: 'POST', body }, token);

export const apiPut = <T>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>, token?: string | null) =>
    apiClient<T>(endpoint, { ...options, method: 'PUT', body }, token);

export const apiPatch = <T>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>, token?: string | null) =>
    apiClient<T>(endpoint, { ...options, method: 'PATCH', body }, token);

export const apiDelete = <T = void>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>, token?: string | null) =>
    apiClient<T>(endpoint, { ...options, method: 'DELETE' }, token);