// apps/user-app/_actions/authActions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers'; // Import cookies from next/headers
import { getIronSession } from 'iron-session';
import { SessionData, getUserSessionOptions } from '@repo/auth';
import { encryptToken } from '../_lib/server-utils'; // Use correct relative path or alias
import apiClient, { APIError } from '@repo/api-client';
import logger from '@repo/logger'; // 导入日志库
import type {
    AuthResponseDTO,
    LoginRequestDTO,
    RegisterRequestDTO,
    GoogleCallbackRequestDTO,
    // RefreshRequestDTO, // Keep for potential future use
    // LogoutRequestDTO, // Not used if using backend session invalidation via user ID
} from '@repo/types';

interface ActionResult {
    success: boolean;
    message?: string;
    isNewUser?: boolean; // For Google callback
}

// --- Constants for Refresh Token Cookie ---
const REFRESH_TOKEN_COOKIE_NAME = 'user_app_refresh_token';
const REFRESH_TOKEN_MAX_AGE_SECONDS = 30 * 24 * 60 * 60; // 30 days (match backend/refresh API)

// 创建认证模块专用的日志记录器
const authLogger = logger.child({ module: 'auth-actions' });

// --- NEW: Helper to set cookies directly within Server Action ---
async function setAuthCookiesDirectly(userId: string, accessToken: string, refreshToken: string): Promise<boolean> {
    authLogger.info(`Setting cookies for userId: ${userId.substring(0, 4)}...`);
    
    if (!userId || !accessToken || !refreshToken) {
        authLogger.error("Cannot set cookies directly: userId, accessToken, or refreshToken is missing.");
        return false;
    }
    try {
        const encryptedAccessToken = encryptToken(accessToken);
        
        if (!encryptedAccessToken) {
            authLogger.error("Failed to encrypt access token. Cannot set cookies.");
            return false;
        }

        // 1. Set Iron Session Cookie (contains userId, encryptedAccessToken)
        const cookieStore = await cookies();
        const sessionOptions = getUserSessionOptions();
        const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
        
        session.userId = userId;
        session.encryptedAccessToken = encryptedAccessToken;
        delete session.isAdmin;
        
        try {
            await session.save(); // Applies Set-Cookie header for the session cookie
        } catch (saveError) {
            authLogger.error({ error: saveError }, "Failed to save session");
            return false;
        }

        // 2. Set HttpOnly Refresh Token Cookie using cookies().set()
        try {
            cookieStore.set(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                path: '/',
                sameSite: 'lax',
                maxAge: REFRESH_TOKEN_MAX_AGE_SECONDS,
                // expires: new Date(Date.now() + REFRESH_TOKEN_MAX_AGE_SECONDS * 1000), // Alternative
            });
        } catch (cookieError) {
            authLogger.error({ error: cookieError }, "Failed to set refresh token cookie");
            return false;
        }

        authLogger.info(`Authentication succeeded for user: ${userId}`);
        return true;
    } catch (error) {
        authLogger.error({ error }, 'Error setting cookies directly');
        return false;
    }
}

// --- NEW: Helper to clear cookies directly within Server Action ---
async function clearAuthCookiesDirectly(): Promise<boolean> {
    try {
        const cookieStore = await cookies();

        // 1. Clear Iron Session Cookie
        const session = await getIronSession<SessionData>(cookieStore, getUserSessionOptions());
        session.destroy();
        // Normally save() is implicit in destroy for setting headers, but call explicitly if needed before further cookie ops
        // await session.save();

        // 2. Clear HttpOnly Refresh Token Cookie using cookies().delete() or .set() with past expiry
        cookieStore.delete(REFRESH_TOKEN_COOKIE_NAME);
        // OR (more robust):
        // cookieStore.set(REFRESH_TOKEN_COOKIE_NAME, '', {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === 'production',
        //     path: '/',
        //     sameSite: 'lax',
        //     maxAge: -1, // Make it expire immediately
        //     expires: new Date(0),
        // });

        authLogger.info("Session and Refresh Token cookies cleared directly.");
        return true;
    } catch (error) {
        authLogger.error({ error }, 'Error clearing cookies directly');
        return false;
    }
}


// --- MODIFIED: Login Action (Uses direct cookie helpers) ---
export async function loginAction(previousState: ActionResult | null, formData: FormData): Promise<ActionResult> {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) { return { success: false, message: 'Email and password are required.' }; }

    try {
        const loginData: LoginRequestDTO = { email, password };
        const authResponse = await apiClient<AuthResponseDTO>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(loginData),
        });

        const userId = authResponse.user?.id;
        const accessToken = authResponse.accessToken;
        const refreshToken = authResponse.refreshToken;

        if (!userId || !accessToken || !refreshToken) {
            console.error("Login Action: Backend response missing required data.");
            return { success: false, message: 'Login failed: Incomplete response from server.' };
        }

        // Use direct helper
        const cookiesSet = await setAuthCookiesDirectly(userId, accessToken, refreshToken);
        if (!cookiesSet) {
            return { success: false, message: 'Login successful, but failed to save session. Please try again.' };
        }

        revalidatePath('/', 'layout');
        console.log(`User ${userId} logged in successfully.`);
        return { success: true };

    } catch (error) { /* ... error handling as before ... */
        console.error("Login Action Error:", error);
        if (error instanceof APIError) {
            if (error.status === 401) return { success: false, message: 'Invalid email or password.' };
            return { success: false, message: error.message || 'Login failed due to an API error.' };
        }
        return { success: false, message: 'An unexpected error occurred during login.' };
    }
}

// --- MODIFIED: Register Action (Uses direct cookie helpers) ---
export async function registerAction(previousState: ActionResult | null, formData: FormData): Promise<ActionResult> {
     const email = formData.get('email') as string;
     const password = formData.get('password') as string;
     const name = formData.get('name') as string;

     if (!email || !password || !name) { return { success: false, message: 'Email, password, and name are required.' }; }
     if (password.length < 8) { return { success: false, message: 'Password must be at least 8 characters.' }; }

     try {
         const registerData: RegisterRequestDTO = { email, password, name };
         const authResponse = await apiClient<AuthResponseDTO>('/auth/register', {
             method: 'POST',
             body: JSON.stringify(registerData),
         });

         const userId = authResponse.user?.id;
         const accessToken = authResponse.accessToken;
         const refreshToken = authResponse.refreshToken;

         if (!userId || !accessToken || !refreshToken) {
             console.error("Register Action: Backend response missing required data.");
             return { success: false, message: 'Registration failed: Incomplete response from server.' };
         }

         // Use direct helper
         const cookiesSet = await setAuthCookiesDirectly(userId, accessToken, refreshToken);
         if (!cookiesSet) {
             return { success: false, message: 'Registration successful, but failed to save session. Please try again.' };
         }

         revalidatePath('/', 'layout');
         console.log(`User ${userId} registered successfully.`);
         return { success: true };

     } catch (error) { /* ... error handling as before ... */
        console.error("Register Action Error:", error);
        if (error instanceof APIError) {
            if (error.status === 409) { return { success: false, message: 'Email already exists.' }; }
            if (error.status === 400) { return { success: false, message: `Invalid input: ${error.message}` }; }
            return { success: false, message: error.message || 'Registration failed due to an API error.' };
        }
        return { success: false, message: 'An unexpected error occurred during registration.' };
     }
}

// --- MODIFIED: Google Callback Action (Uses direct cookie helpers) ---
export async function googleCallbackAction(idToken: string): Promise<ActionResult> {
    if (!idToken) { return { success: false, message: 'Google ID token is required.' }; }

    try {
        const callbackData: GoogleCallbackRequestDTO = { idToken };
        const authResponse = await apiClient<AuthResponseDTO>('/auth/google/callback', {
            method: 'POST',
            body: JSON.stringify(callbackData),
        });

        const userId = authResponse.user?.id;
        const accessToken = authResponse.accessToken;
        const refreshToken = authResponse.refreshToken;

        if (!userId || !accessToken || !refreshToken) {
            console.error("Google Callback Action: Backend response missing required data.");
            return { success: false, message: 'Google Sign-In failed: Incomplete response from server.' };
        }

        // Use direct helper
        const cookiesSet = await setAuthCookiesDirectly(userId, accessToken, refreshToken);
        if (!cookiesSet) {
            return { success: false, message: 'Google Sign-In successful, but failed to save session. Please try again.' };
        }

        revalidatePath('/', 'layout');
        console.log(`User ${userId} authenticated via Google (New User: ${!!authResponse.isNewUser}).`);
        return { success: true, isNewUser: authResponse.isNewUser };

    } catch (error) { /* ... error handling as before ... */
        console.error("Google Callback Action Error:", error);
        if (error instanceof APIError) {
            if (error.status === 409) { return { success: false, message: 'Email already linked to another account.' }; }
            if (error.status === 401) { return { success: false, message: 'Google authentication failed. Please try again.' }; }
            return { success: false, message: error.message || 'Google sign-in failed due to an API error.' };
        }
        return { success: false, message: 'An unexpected error occurred during Google sign-in.' };
    }
}

// --- MODIFIED: Logout Action (Uses direct cookie helpers) ---
export async function logoutAction() {
    try {
        // IMPORTANT: Get session *before* calling backend logout, as we need the
        // encrypted token for the apiClient call via the proxy.
        const cookieStore = await cookies();
        const session = await getIronSession<SessionData>(cookieStore, getUserSessionOptions());
        const userIdForLog = session.userId; // For logging

        // Check if user was actually logged in before attempting backend logout
        if (session.userId && session.encryptedAccessToken) {
            // Call backend /auth/logout. apiClient will handle using the token from the session via the proxy.
            // Backend uses user ID from validated access token to invalidate refresh tokens.
            await apiClient<void>('/auth/logout', { method: 'POST' });
            console.log(`Logout Action: Backend logout request sent successfully for user ${userIdForLog}.`);
        } else {
             console.log("Logout Action: No active session found, skipping backend logout call.");
        }
    } catch (error) {
        // Log the error, but proceed with frontend cookie clearing regardless
        console.error("Logout Action: Error calling backend logout:", error);
    }

    // Always attempt to clear frontend cookies directly
    const cookiesCleared = await clearAuthCookiesDirectly();
    if (!cookiesCleared) {
        console.warn("Logout Action: Failed to clear frontend auth cookies directly.");
        // Usually not critical.
    }

    // Revalidate and redirect
    revalidatePath('/', 'layout');
    redirect('/login');
}

// Refresh Action remains a placeholder, client-side handles it via /api/auth/refresh
export async function refreshSessionAction(refreshToken: string): Promise<ActionResult & { newAccessToken?: string; newRefreshToken?: string }> {
    console.warn("Server Action refreshSessionAction called, but refresh should be handled client-side via /api/auth/refresh.");
    return { success: false, message: 'Refresh should be initiated client-side.' };
}