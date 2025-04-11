// apps/user-app/_actions/authActions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import apiClient, { APIError } from '@repo/api-client';
import type {
    AuthResponseDTO,
    LoginRequestDTO,
    RegisterRequestDTO,
    GoogleCallbackRequestDTO,
    RefreshRequestDTO,
    LogoutRequestDTO,
} from '@repo/types';

// Action Result Type
interface ActionResult {
    success: boolean;
    message?: string;
    isNewUser?: boolean; // For Google callback
}

// Fetch URL Helper
function getAppUrl() {
    const url = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL || "http://localhost:3000";
    return url.startsWith('http') ? url : `https://${url}`;
}

// Helper to call the internal session API route
async function setFrontendSession(userId: string): Promise<boolean> {
    const appUrl = getAppUrl();
    if (!appUrl) {
        console.error("Auth Action: Cannot set session: Application URL not configured.");
        return false;
    }
    try {
        const sessionResponse = await fetch(`${appUrl}/api/auth/session`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: userId }),
            cache: 'no-store',
        });
        if (!sessionResponse.ok) {
            const errorBody = await sessionResponse.text();
            console.error("Auth Action: Failed to set session via API route:", sessionResponse.status, errorBody);
            return false;
        }
        // console.log("Auth Action: Frontend session cookie set successfully for user:", userId);
        return true;
    } catch (error) {
        console.error("Auth Action: Error calling internal session API:", error);
        return false;
    }
}

// Helper to decode User ID from JWT (INSECURE - FOR DEMO ONLY)
// WARNING: Replace with secure method (backend providing ID or session route verifying token)
function decodeUserIdFromJwt_INSECURE_DEMO(token: string): string | null {
    try {
        if (!token) return null;
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
        const userId = payload.sub || payload.uid; // Check common claims 'sub' or custom 'uid'
        if (typeof userId === 'string' && userId) {
            return userId;
        }
        console.warn("Auth Action (decodeUserIdFromJwt_INSECURE_DEMO): Could not find valid user ID (sub or uid) in JWT payload:", payload);
        return null;
    } catch (e) {
        console.error("Auth Action (decodeUserIdFromJwt_INSECURE_DEMO): Failed to decode JWT:", e);
        return null;
    }
}

// Login Action
export async function loginAction(previousState: ActionResult | null, formData: FormData): Promise<ActionResult> {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        return { success: false, message: 'Email and password are required.' };
    }

    try {
        const loginData: LoginRequestDTO = { email, password };
        const authResponse = await apiClient<AuthResponseDTO>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(loginData),
        });

        const userId = decodeUserIdFromJwt_INSECURE_DEMO(authResponse.accessToken);
        if (!userId) {
            return { success: false, message: 'Login failed: Could not establish session (invalid token).' };
        }

        const sessionSet = await setFrontendSession(userId);
        if (!sessionSet) {
            return { success: false, message: 'Login failed: Could not save session state.' };
        }

        revalidatePath('/', 'layout');
        // TODO: Securely handle/store authResponse.refreshToken if needed
        return { success: true };

    } catch (error) {
        console.error("Login Action Error:", error);
        if (error instanceof APIError) {
            if (error.status === 401) return { success: false, message: 'Invalid email or password.' };
            return { success: false, message: error.message || 'Login failed due to an API error.' };
        }
        return { success: false, message: 'An unexpected error occurred during login.' };
    }
}

// Register Action
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

        const userId = decodeUserIdFromJwt_INSECURE_DEMO(authResponse.accessToken);
        if (!userId) {
            return { success: false, message: 'Registration failed: Could not establish session (invalid token).' };
        }

        const sessionSet = await setFrontendSession(userId);
        if (!sessionSet) {
            return { success: false, message: 'Registration failed: Could not save session state.' };
        }

        revalidatePath('/', 'layout');
        // TODO: Securely handle/store authResponse.refreshToken
        return { success: true };

    } catch (error) {
        console.error("Register Action Error:", error);
        if (error instanceof APIError) {
            if (error.status === 409) { return { success: false, message: 'Email already exists.' }; }
            if (error.status === 400) { return { success: false, message: `Invalid input: ${error.message}` }; }
            return { success: false, message: error.message || 'Registration failed due to an API error.' };
        }
        return { success: false, message: 'An unexpected error occurred during registration.' };
    }
}

// Google Callback Action
export async function googleCallbackAction(idToken: string): Promise<ActionResult> {
    if (!idToken) { return { success: false, message: 'Google ID token is required.' }; }

    try {
        const callbackData: GoogleCallbackRequestDTO = { idToken };
        const authResponse = await apiClient<AuthResponseDTO>('/auth/google/callback', {
            method: 'POST',
            body: JSON.stringify(callbackData),
        });

        const userId = decodeUserIdFromJwt_INSECURE_DEMO(authResponse.accessToken);
        if (!userId) {
            return { success: false, message: 'Google Sign-In failed: Could not establish session (invalid token).' };
        }

        const sessionSet = await setFrontendSession(userId);
        if (!sessionSet) {
            return { success: false, message: 'Google Sign-In failed: Could not save session state.' };
        }

        revalidatePath('/', 'layout');
        // TODO: Securely handle/store authResponse.refreshToken
        return { success: true, isNewUser: authResponse.isNewUser };

    } catch (error) {
        console.error("Google Callback Action Error:", error);
        if (error instanceof APIError) {
            if (error.status === 409) { return { success: false, message: 'Email already linked to another account.' }; }
            if (error.status === 401) { return { success: false, message: 'Google authentication failed. Please try again.' }; }
            return { success: false, message: error.message || 'Google sign-in failed due to an API error.' };
        }
        return { success: false, message: 'An unexpected error occurred during Google sign-in.' };
    }
}

// Logout Action
export async function logoutAction() {
    const appUrl = getAppUrl();

    // 1. Clear the frontend session cookie (Best effort)
    if (appUrl) {
         try {
             await fetch(`${appUrl}/api/auth/session`, { method: 'DELETE', cache: 'no-store' });
         } catch (error) { console.error("Logout Action: Error clearing frontend session:", error); }
    } else { console.error("Logout Action: Cannot clear session: Application URL not configured."); }


    // 2. Call Backend Logout (if refresh token is securely accessible)
    // NOTE: This part is omitted due to complexity of secure client-side token storage.
    // Rely on session cookie removal and backend token expiry for now.
    // console.log("Logout Action: Skipping backend /auth/logout call (requires secure refresh token handling).");
    /*
    const refreshToken = getSecureRefreshToken(); // Hypothetical
    if (refreshToken) {
        try {
            await apiClient<void>('/auth/logout', { method: 'POST', body: { refreshToken } });
            clearSecureRefreshToken();
        } catch (error) { console.error("Logout Action: Error calling backend /auth/logout:", error); }
    }
    */

    // 3. Revalidate and redirect
    revalidatePath('/', 'layout');
    redirect('/login');
}

// Refresh Action (Placeholder - Requires Secure Client-Side Token Management & Handling)
// This action needs to be called *by client-side logic* when an API call fails with 401.
// It returns the new tokens, which the client then needs to store.
export async function refreshSessionAction(refreshToken: string): Promise<ActionResult & { newAccessToken?: string; newRefreshToken?: string }> {
    console.warn("refreshSessionAction called - requires client-side logic to store new tokens and retry requests.");
    if (!refreshToken) {
        return { success: false, message: 'Refresh token is required.' };
    }
    try {
        const refreshData: RefreshRequestDTO = { refreshToken };
        const authResponse = await apiClient<AuthResponseDTO>('/auth/refresh', {
            method: 'POST',
            body: JSON.stringify(refreshData),
        });
        return {
            success: true,
            newAccessToken: authResponse.accessToken,
            newRefreshToken: authResponse.refreshToken,
        };
    } catch (error) {
        console.error("Refresh Action Error:", error);
        // If refresh itself fails with 401, the refresh token is invalid/expired.
        if (error instanceof APIError && error.status === 401) {
             console.log("Refresh token invalid/expired during refresh attempt.");
             // Client-side logic should trigger full logout here.
             return { success: false, message: 'Session expired. Please log in again.' };
        }
        return { success: false, message: 'Failed to refresh session.' };
    }
}