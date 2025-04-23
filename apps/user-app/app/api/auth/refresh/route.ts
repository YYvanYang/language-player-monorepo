// apps/user-app/app/api/auth/refresh/route.ts
import { type NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers'; // *** 使用 next/headers 的 cookies() 函数 ***
import { getIronSession } from 'iron-session';
import { SessionData, getUserSessionOptions } from '@repo/auth';
import apiClient, { APIError } from '@repo/api-client';
import type { RefreshRequestDTO, AuthResponseDTO } from '@repo/types';
import { encryptToken } from '@/_lib/server-utils';

// --- Constants ---
const REFRESH_TOKEN_COOKIE_NAME = 'user_app_refresh_token';
const REFRESH_TOKEN_MAX_AGE_SECONDS = 30 * 24 * 60 * 60; // 30 days
const sessionOptions = getUserSessionOptions();

// --- POST Handler ---
export async function POST(request: NextRequest) {
    const cookieStore = await cookies(); // 获取 Cookie 存储实例

    // 1. Read Refresh Token using cookies()
    const refreshTokenCookie = cookieStore.get(REFRESH_TOKEN_COOKIE_NAME);

    if (!refreshTokenCookie?.value) {
        console.warn("Refresh API: No refresh token cookie found.");
        return NextResponse.json({ message: 'Refresh token not found. Please login again.' }, { status: 401 });
    }
    const refreshTokenValue = refreshTokenCookie.value;

    // 2. Call Backend /auth/refresh Endpoint
    try {
        const backendReqData: RefreshRequestDTO = { refreshToken: refreshTokenValue };
        const authResponse = await apiClient<AuthResponseDTO>('/auth/refresh', {
            method: 'POST',
            body: JSON.stringify(backendReqData),
        });

        // 3. Process Successful Backend Response
        const newAccessToken = authResponse.accessToken;
        const newRefreshToken = authResponse.refreshToken;
        const userId = authResponse.user?.id;

        if (!newAccessToken || !newRefreshToken || !userId) {
            console.error("Refresh API: Backend response missing required data after successful refresh.");
            const clearResponseHeaders = await clearAuthCookiesHelper(); // 清理 cookies 并获取响应头
            return NextResponse.json({ message: 'Session refresh failed (backend data missing). Please login again.' }, { status: 401, headers: clearResponseHeaders });
        }

        // 4. Encrypt New Access Token
        const encryptedAccessToken = encryptToken(newAccessToken);
        if (!encryptedAccessToken) {
            console.error("Refresh API: Failed to encrypt new access token for user:", userId);
            const clearResponseHeaders = await clearAuthCookiesHelper();
            return NextResponse.json({ message: 'Failed to secure refreshed session.' }, { status: 500, headers: clearResponseHeaders });
        }

        // 5. Set New Cookies using the Response object and cookieStore
        // Prepare a response to attach headers to. Return the new raw access token.
        const response = NextResponse.json({ ok: true, accessToken: newAccessToken });

        // Set/Update Iron Session Cookie (attaches header to `response`)
        const session = await getIronSession<SessionData>(request, response, sessionOptions);
        session.userId = userId;
        session.encryptedAccessToken = encryptedAccessToken;
        delete session.isAdmin;
        await session.save();

        // Set/Update HttpOnly Refresh Token Cookie using cookieStore.set()
        // This will add headers to the *final* outgoing response managed by Next.js for this handler
        // NOTE: We modify the cookieStore *obtained at the beginning* of the handler.
        // Next.js automatically applies these changes to the final response headers.
        cookieStore.set(REFRESH_TOKEN_COOKIE_NAME, newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            sameSite: 'lax',
            maxAge: REFRESH_TOKEN_MAX_AGE_SECONDS,
        });

        console.log(`Refresh API: Tokens refreshed and cookies updated for user: ${userId}`);
        // The `response` object now has the session cookie header, and Next.js will add the refresh token cookie header.
        return response;

    } catch (error: any) {
        console.error("Refresh API Error calling backend:", error);
        let status = 500; // Default status
        let message = 'Session refresh failed: Internal server error';

        if (error instanceof APIError) {
             status = error.status; // Use status from APIError
             message = `Session refresh failed: ${error.message}`;
             if (status === 401) {
                 console.log("Refresh API: Backend indicated invalid/expired refresh token. Clearing frontend tokens.");
                 message = 'Session expired. Please login again.';
             }
        }

        // Always attempt to clear cookies on refresh failure
        const clearResponseHeaders = await clearAuthCookiesHelper();
        // Create the final error response and merge clearing headers onto it
        const finalResponse = NextResponse.json({ message }, { status });
        clearResponseHeaders.forEach((value, key) => {
             if (key.toLowerCase() === 'set-cookie') {
                 finalResponse.headers.append(key, value);
             } else {
                 finalResponse.headers.set(key, value);
             }
         });
         return finalResponse;
    }
}


// --- Helper to Clear Cookies (Returns Headers object) ---
// This helper clears cookies using the cookieStore and session management.
// It returns the headers needed to clear cookies, primarily for error scenarios.
async function clearAuthCookiesHelper(): Promise<Headers> {
    const responseHeaders = new Headers(); // Create headers object to return
    try {
        const cookieStore = await cookies();

        // 1. Clear HttpOnly Refresh Token Cookie using cookieStore.delete()
        // This implicitly adds a 'Set-Cookie' header to the eventual response
        if (cookieStore.has(REFRESH_TOKEN_COOKIE_NAME)) {
            cookieStore.delete(REFRESH_TOKEN_COOKIE_NAME);
             console.log("Clear Tokens Helper: Refresh token cookie delete queued.");
             // Manually construct the clearing header to return it immediately
             const refreshCookieClear = cookie.serialize(REFRESH_TOKEN_COOKIE_NAME, '', {
                 httpOnly: true, secure: process.env.NODE_ENV === 'production', path: '/', sameSite: 'lax', expires: new Date(0), maxAge: -1,
             });
              responseHeaders.append('Set-Cookie', refreshCookieClear);
        }


        // 2. Clear Iron Session Cookie
        // We need a request-like object to pass to getIronSession.
        // We can construct a minimal one or pass the original request if available.
        // Since this helper might be called from error blocks, creating a dummy seems safer.
        const dummyReq = new Request('http://localhost/dummy'); // Needs a URL
        const dummyRes = new NextResponse(); // For attaching headers during save
        const session = await getIronSession<SessionData>(dummyReq as NextRequest, dummyRes, sessionOptions);
        session.destroy();
        await session.save(); // This adds the Set-Cookie header to dummyRes.headers

        // Copy the session clearing header from dummyRes to our return headers
        const sessionCookieHeader = dummyRes.headers.get('set-cookie');
        if (sessionCookieHeader) {
            responseHeaders.append('Set-Cookie', sessionCookieHeader);
             console.log("Clear Tokens Helper: Session cookie delete queued.");
        }

    } catch(error) {
        console.error("Clear Tokens Helper Error:", error);
        // Don't add headers if clearing failed
    }
    return responseHeaders;
}
