// apps/user-app/app/api/proxy/[...path]/route.ts
import { type NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { SessionData, getUserSessionOptions } from '@repo/auth';
import { APIError } from '@repo/api-client';
import logger from '@repo/logger';
// Import the decryption function
import { decryptToken } from '@/_lib/server-utils'; // Use alias or correct relative path

// 创建代理专用日志记录器
const proxyLogger = logger.child({ module: 'api-proxy' });

// Re-export methods for each HTTP verb
export { handleProxy as GET, handleProxy as POST, handleProxy as PUT, handleProxy as DELETE, handleProxy as PATCH }

// Central handler function
async function handleProxy(
    request: NextRequest,
    { params }: { params: { path: string[] } }
) {
    const apiPath = params.path.join('/');
    const backendBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    proxyLogger.info(`[${request.method}] Received request for /${apiPath}${request.nextUrl.search || ''}`);

    if (!backendBaseUrl) {
        proxyLogger.error("Config Error: NEXT_PUBLIC_API_BASE_URL is not configured.");
        return NextResponse.json({ message: "API endpoint configuration error" }, { status: 500 });
    }

    let session: SessionData;
    let decryptedToken: string | null = null;
    let hasValidSession = false;
    const response = NextResponse.next();

    try {
        // 详细记录会话处理过程
        proxyLogger.debug(`Starting session validation for request to /${apiPath}...`);
        
        // Pass empty response initially, headers will be added later or by fetch response
        session = await getIronSession<SessionData>(request, response, getUserSessionOptions());
        hasValidSession = !!session?.userId; // Check if basic session exists

        if (!hasValidSession) {
            proxyLogger.warn(`Unauthorized access attempt to /${apiPath} (no session).`);
            return NextResponse.json({ code: 'UNAUTHENTICATED', message: 'Authentication required.' }, { status: 401 });
        }

        // 此时session.userId一定不为undefined (hasValidSession检查已确保)
        const userId = session.userId as string;
        proxyLogger.debug(`Session found for user ${userId.substring(0, 8)}...`);

        if (!session.encryptedAccessToken) {
            proxyLogger.warn(`Missing encryptedAccessToken in session for user ${userId} accessing /${apiPath}. Session might be outdated.`);
            // Destroy potentially incomplete session? Or just deny access? Deny is safer.
            // session.destroy(); await session.save();
            return NextResponse.json({ code: 'UNAUTHENTICATED', message: 'Session data incomplete. Please login again.' }, { status: 401 });
        }

        proxyLogger.debug(`Attempting to decrypt token for user ${userId.substring(0, 8)}...`);
        proxyLogger.debug(`Encrypted token format check: ${session.encryptedAccessToken.includes(':') ? 'valid (has separator)' : 'INVALID (missing separator)'}`);
        
        decryptedToken = decryptToken(session.encryptedAccessToken);

        if (!decryptedToken) {
            proxyLogger.error(`Failed to decrypt token for user ${userId} accessing /${apiPath}. Session is likely invalid.`);
            // 检查环境变量
            const hasEncryptionKey = !!process.env.ACCESS_TOKEN_ENCRYPTION_KEY;
            const hasEncryptionSalt = !!process.env.ACCESS_TOKEN_ENCRYPTION_SALT;
            proxyLogger.error(`Environment check - Encryption key: ${hasEncryptionKey ? 'SET' : 'MISSING'}, Encryption salt: ${hasEncryptionSalt ? 'SET' : 'MISSING'}`);
            
            // 销毁会话 (iron-session添加的方法，不在SessionData类型中)
            // @ts-ignore - session.destroy 是iron-session运行时添加的方法
            session.destroy(); 
            const errorResponse = NextResponse.json({ code: 'UNAUTHENTICATED', message: 'Session decryption failed. Please login again.' }, { status: 401 });
            // @ts-ignore - session.save 是iron-session运行时添加的方法
            await session.save(); 
            return errorResponse;
        }
        // If decryption succeeded, we have a token to use
        proxyLogger.debug(`Decrypted token successfully for user ${userId.substring(0, 8)}. Token length: ${decryptedToken.length}, prefix: ${decryptedToken.substring(0, 10)}...`);

    } catch (sessionError) {
        proxyLogger.error({ error: sessionError }, `Error reading session for /${apiPath}`);
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
    proxyLogger.debug(`Added Authorization header with Bearer token`);
    
    // Remove Content-Type if it's multipart/form-data, let fetch set it with boundary
    if (headers.get('content-type')?.includes('multipart/form-data')) {
       headers.delete('content-type');
    }

    proxyLogger.info(`Forwarding ${request.method} to ${targetUrl}`);

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

        proxyLogger.info(`Received response from backend: ${backendResponse.status} ${backendResponse.statusText}`);
        
        // 记录响应详情
        if (backendResponse.status >= 400) {
            const contentType = backendResponse.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                try {
                    const errorClone = backendResponse.clone();
                    const errorData = await errorClone.json();
                    proxyLogger.error({ errorData }, `Backend returned error ${backendResponse.status}`);
                } catch (err) {
                    proxyLogger.error(`Backend returned error ${backendResponse.status}, but could not parse response body`);
                }
            } else {
                proxyLogger.error(`Backend returned error ${backendResponse.status} ${backendResponse.statusText}`);
            }
        }

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
         proxyLogger.error({ error: fetchError }, `Error fetching backend API ${targetUrl}`);
         const message = fetchError.cause?.code === 'ECONNREFUSED'
             ? 'API service unavailable.'
             : `Failed to connect to API service: ${fetchError.message}`;
         return NextResponse.json({ code: 'PROXY_ERROR', message }, { status: 502 }); // Bad Gateway
    }
}