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
    RefreshRequestDTO, // Added type
    LogoutRequestDTO,  // Added type
} from '@repo/types';

// Action Result Type
interface ActionResult {
    success: boolean;
    message?: string;
    isNewUser?: boolean; // For Google callback
}

// Fetch URL Helper (Use NEXT_PUBLIC_APP_URL for internal API calls)
function getAppUrl() {
    // Ensure this works correctly on Vercel and locally
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
        // Use internal fetch, not apiClient for this internal call
        const sessionResponse = await fetch(`${appUrl}/api/auth/session`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: userId }),
            cache: 'no-store', // Ensure fresh session setting
        });
        if (!sessionResponse.ok) {
            const errorBody = await sessionResponse.text();
            console.error("Auth Action: Failed to set session via API route:", sessionResponse.status, errorBody);
            return false;
        }
        console.log("Auth Action: Frontend session cookie set successfully for user:", userId);
        return true;
    } catch (error) {
        console.error("Auth Action: Error calling internal session API:", error);
        return false;
    }
}

// Helper to decode User ID from JWT (Simplified - REAL IMPLEMENTATION NEEDED)
// **WARNING:** THIS IS INSECURE. IN PRODUCTION, NEVER TRUST CLIENT-SIDE DECODING.
// The backend should ideally return the user ID or profile upon successful auth,
// OR the frontend session API should verify the token itself before setting the session.
// For now, we assume the backend token is trustworthy *after* successful login/register.
function decodeUserIdFromJwt_INSECURE_DEMO(token: string): string | null {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))); // Base64 URL decode
        // Look for 'sub' (subject) or a custom claim like 'uid'
        const userId = payload.sub || payload.uid;
        // Add basic validation (e.g., check if it looks like a UUID)
        if (typeof userId === 'string' && userId.length > 10) { // Basic sanity check
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

        const userId = decodeUserIdFromJwt_INSECURE_DEMO(authResponse.accessToken); // Use INSECURE demo function
        if (!userId) {
            console.error("Login Action: Could not determine user ID from token.");
            return { success: false, message: 'Login failed: Could not establish session (invalid token).' };
        }

        const sessionSet = await setFrontendSession(userId);
        if (!sessionSet) {
            return { success: false, message: 'Login failed: Could not save session state.' };
        }

        // Revalidate necessary paths after login
        revalidatePath('/', 'layout');
        // TODO: Securely store authResponse.refreshToken if implementing client-side refresh
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

        const userId = decodeUserIdFromJwt_INSECURE_DEMO(authResponse.accessToken); // Use INSECURE demo function
        if (!userId) {
            console.error("Register Action: Could not determine user ID from token.");
            return { success: false, message: 'Registration failed: Could not establish session (invalid token).' };
        }

         const sessionSet = await setFrontendSession(userId);
         if (!sessionSet) {
            return { success: false, message: 'Registration failed: Could not save session state.' };
         }

         revalidatePath('/', 'layout');
         // TODO: Securely store authResponse.refreshToken
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

         const userId = decodeUserIdFromJwt_INSECURE_DEMO(authResponse.accessToken); // Use INSECURE demo function
         if (!userId) {
             console.error("Google Callback Action: Could not determine user ID from token.");
             return { success: false, message: 'Google Sign-In failed: Could not establish session (invalid token).' };
         }

          const sessionSet = await setFrontendSession(userId);
         if (!sessionSet) {
            return { success: false, message: 'Google Sign-In failed: Could not save session state.' };
         }

         revalidatePath('/', 'layout');
         // TODO: Securely store authResponse.refreshToken
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
    let clearSessionApiError = false;
    const appUrl = getAppUrl();

    // 1. Clear the frontend session cookie (Best effort)
    if (!appUrl) {
        console.error("Logout Action: Cannot call internal logout API: Application URL not configured.");
        clearSessionApiError = true;
    } else {
        try {
            const response = await fetch(`${appUrl}/api/auth/session`, { method: 'DELETE', cache: 'no-store' });
            if (!response.ok) {
                console.error("Logout Action: Failed to clear session via API route, Status:", response.status);
                clearSessionApiError = true;
            }
        } catch (error) {
            console.error("Logout Action: Error calling internal logout API route:", error);
            clearSessionApiError = true;
        }
    }

    // 2. Call Backend Logout (If refresh token is available)
    // **NOTE:** Getting the refresh token securely here is tricky.
    // It might be stored client-side (e.g., secure httpOnly cookie managed by backend,
    // or localStorage - less secure). If using a cookie, fetch might send it automatically.
    // If stored elsewhere, the client needs to pass it to this action.
    // For simplicity, we'll assume *no* refresh token is passed here,
    // relying on backend session timeout or access token expiry.
    // If refresh tokens ARE managed and stored securely client-side,
    // the client would need to retrieve it and pass it to this action.
    /*
    const refreshToken = getRefreshTokenFromSomewhereSecure(); // This is the hard part
    if (refreshToken) {
        try {
            const logoutData: LogoutRequestDTO = { refreshToken };
            await apiClient<void>('/auth/logout', { method: 'POST', body: JSON.stringify(logoutData) });
            console.log("Logout Action: Backend refresh token invalidated.");
            // clearRefreshTokenFromSecureStorage();
        } catch (error) {
            console.error("Logout Action: Error calling backend /auth/logout:", error);
            // Don't block logout if backend call fails, session cookie is cleared anyway
        }
    }
    */

    // 3. Revalidate and redirect
    revalidatePath('/', 'layout'); // Revalidate all pages basically
    redirect('/login'); // Force redirect to login page
}

// Refresh Action (Placeholder - Requires Secure Client-Side Token Management)
// This action is difficult to implement securely purely server-side without access
// to the refresh token stored client-side. A common pattern involves the client:
// 1. Detecting a 401 from apiClient on a normal request.
// 2. Retrieving the securely stored refresh token.
// 3. Calling a dedicated API endpoint (or this action) WITH the refresh token.
// 4. The endpoint/action validates the refresh token, gets new tokens from backend /auth/refresh.
// 5. The endpoint/action returns the NEW tokens to the client.
// 6. The client stores the new tokens and retries the original failed request.
// Implementing this robustly is beyond a simple Server Action example.
export async function refreshSessionAction(refreshToken: string): Promise<ActionResult & { newAccessToken?: string; newRefreshToken?: string }> {
    console.warn("refreshSessionAction is a placeholder and requires secure client-side refresh token handling.");
    if (!refreshToken) {
        return { success: false, message: 'Refresh token is required.' };
    }
    try {
        const refreshData: RefreshRequestDTO = { refreshToken };
        const authResponse = await apiClient<AuthResponseDTO>('/auth/refresh', {
            method: 'POST',
            body: JSON.stringify(refreshData),
        });
        // IMPORTANT: This action returns the tokens. The *caller* (client-side logic)
        // is responsible for storing them securely and updating the user session state.
        return {
            success: true,
            newAccessToken: authResponse.accessToken,
            newRefreshToken: authResponse.refreshToken,
        };
    } catch (error) {
        console.error("Refresh Action Error:", error);
        if (error instanceof APIError && error.status === 401) {
             // If refresh fails (invalid/expired token), trigger full logout
             // This requires coordination with client-side logic
             console.log("Refresh token invalid, triggering logout flow...");
             return { success: false, message: 'Session expired. Please log in again.' };
        }
        return { success: false, message: 'Failed to refresh session.' };
    }
}