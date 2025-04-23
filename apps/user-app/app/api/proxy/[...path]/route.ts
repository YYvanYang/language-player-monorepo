// apps/user-app/app/api/proxy/[...path]/route.ts
import { type NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { SessionData, getUserSessionOptions } from '@repo/auth';
import { APIError } from '@repo/api-client';
// Import the decryption function
import { decryptToken } from '@/_lib/server-utils'; // Use alias or correct relative path

// Re-export methods for each HTTP verb
export { handleProxy as GET, handleProxy as POST, handleProxy as PUT, handleProxy as DELETE, handleProxy as PATCH }

// Central handler function
async function handleProxy(
    request: NextRequest,
    { params }: { params: { path: string[] } }
) {
    const apiPath = params.path.join('/');
    const backendBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!backendBaseUrl) {
        console.error("Proxy Error: NEXT_PUBLIC_API_BASE_URL is not configured.");
        return NextResponse.json({ message: "API endpoint configuration error" }, { status: 500 });
    }

    let session: SessionData | undefined;
    let decryptedToken: string | null = null;
    let hasValidSession = false;

    try {
        // Pass empty response initially, headers will be added later or by fetch response
        session = await getIronSession<SessionData>(request, NextResponse.next(), getUserSessionOptions());
        hasValidSession = !!session?.userId; // Check if basic session exists

        if (!hasValidSession) {
             console.log(`Proxy: Unauthorized access attempt to /${apiPath} (no session).`);
            return NextResponse.json({ code: 'UNAUTHENTICATED', message: 'Authentication required.' }, { status: 401 });
        }

        if (!session.encryptedAccessToken) {
             console.warn(`Proxy: Missing encryptedAccessToken in session for user ${session.userId} accessing /${apiPath}. Session might be outdated.`);
             // Destroy potentially incomplete session? Or just deny access? Deny is safer.
             // session.destroy(); await session.save();
             return NextResponse.json({ code: 'UNAUTHENTICATED', message: 'Session data incomplete. Please login again.' }, { status: 401 });
        }

        decryptedToken = decryptToken(session.encryptedAccessToken);

        if (!decryptedToken) {
            console.error(`Proxy: Failed to decrypt token for user ${session.userId} accessing /${apiPath}. Session is likely invalid.`);
            // Destroy the invalid session
            session.destroy(); // Marks for destruction
            const response = NextResponse.json({ code: 'UNAUTHENTICATED', message: 'Session decryption failed. Please login again.' }, { status: 401 });
            await session.save(); // Saves the destruction (sets cookie removal headers on response)
            return response;
        }
        // If decryption succeeded, we have a token to use
        console.log(`Proxy: Decrypted token successfully for user ${session.userId} accessing /${apiPath}.`);

    } catch (sessionError) {
        console.error(`Proxy: Error reading session for /${apiPath}:`, sessionError);
        return NextResponse.json({ message: "Session handling error" }, { status: 500 });
    }

    // Forward the request to the Go backend
    const targetUrl = `${backendBaseUrl}/${apiPath}${request.nextUrl.search}`; // Include query params
    const headers = new Headers();

    // Copy relevant headers from incoming request to backend request
    // Avoid copying host, connection, cookie, and Next.js/Vercel internal headers
    const headersToSkip = new Set([
        'host', 'connection', 'cookie', 'transfer-encoding',
        'x-forwarded-host', 'x-forwarded-proto', 'x-forwarded-for',
        'x-vercel-id', 'x-vercel-deployment-url', 'x-vercel-forwarded-for',
        'content-length', // Let fetch calculate content-length based on body
    ]);
    request.headers.forEach((value, key) => {
        if (!headersToSkip.has(key.toLowerCase())) {
            headers.set(key, value);
        }
    });

    // Add the Authorization header with the decrypted token
    headers.set('Authorization', `Bearer ${decryptedToken}`);
    // Remove Content-Type if it's multipart/form-data, let fetch set it with boundary
    if (headers.get('content-type')?.includes('multipart/form-data')) {
       headers.delete('content-type');
    }

    console.log(`Proxy: Forwarding ${request.method} to ${targetUrl}`);

    try {
        // Use streaming for request body if available
        const body = request.body;
        const duplex = request.method !== 'GET' && request.method !== 'HEAD' ? 'half' : undefined;

        const backendResponse = await fetch(targetUrl, {
            method: request.method,
            headers: headers,
            // @ts-ignore - Workaround for duplex typing issues in some environments
            body: body,
            // @ts-ignore
            duplex: duplex,
            redirect: 'manual', // Let the browser handle redirects from the proxy response
            cache: 'no-store',
            credentials: 'omit', // We are sending Authorization header
        });

        // Create a new response streaming the body and copying relevant headers
        const responseHeaders = new Headers();
        backendResponse.headers.forEach((value, key) => {
             // Filter headers before sending back to client if necessary (e.g., hide internal details)
             const lowerKey = key.toLowerCase();
             if (!lowerKey.startsWith('x-') && lowerKey !== 'content-encoding' && lowerKey !== 'transfer-encoding' && lowerKey !== 'content-length') { // Filter some common problematic headers
                 responseHeaders.set(key, value);
             }
        });
        responseHeaders.set('X-Proxied-By', 'NextJS-BFF');

        // If the backend sent a session-related header (e.g., Set-Cookie), DO NOT forward it
        responseHeaders.delete('set-cookie');

        return new NextResponse(backendResponse.body, {
            status: backendResponse.status,
            statusText: backendResponse.statusText,
            headers: responseHeaders,
        });

    } catch (fetchError: any) {
         console.error(`Proxy: Error fetching backend API ${targetUrl}:`, fetchError);
         const message = fetchError.cause?.code === 'ECONNREFUSED'
             ? 'API service unavailable.'
             : `Failed to connect to API service: ${fetchError.message}`;
         return NextResponse.json({ code: 'PROXY_ERROR', message }, { status: 502 }); // Bad Gateway
    }
}