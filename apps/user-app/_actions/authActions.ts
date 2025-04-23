// apps/user-app/_actions/authActions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import apiClient, { APIError } from '@repo/api-client';
import type {
    AuthResponseDTO,
    LoginRequestDTO,
    RegisterRequestDTO,
    GoogleCallbackRequestDTO,
    RefreshRequestDTO,
    LogoutRequestDTO,
    UserResponseDTO,
} from '@repo/types';
import { getIronSession } from 'iron-session';
import { SessionData, getUserSessionOptions } from '@repo/auth';
// Import encryption helper
import { encryptToken } from '../_lib/server-utils'; // Use correct relative path or alias

// Action Result Type
interface ActionResult {
    success: boolean;
    message?: string;
    isNewUser?: boolean; // For Google callback
}

// --- MODIFIED: Helper to set session cookie, now encrypts access token ---
async function setUserSessionCookie(userId: string, accessToken: string): Promise<boolean> {
    if (!userId || !accessToken) {
        console.error("Auth Action: Cannot set session: userId or accessToken is missing.");
        return false;
    }
    try {
        const encryptedAccessToken = encryptToken(accessToken); // Encrypt the token
        if (!encryptedAccessToken) {
            // Encryption failure is critical, prevent session establishment
            console.error("Auth Action: Failed to encrypt access token. Session cannot be fully established.");
            // Optionally destroy any potentially partially set session data?
            // const existingSession = await getIronSession...; existingSession.destroy(); await existingSession.save();
            return false;
        }

        const cookieStore = await cookies();
        const session = await getIronSession<SessionData>(cookieStore, getUserSessionOptions());

        session.userId = userId;
        session.encryptedAccessToken = encryptedAccessToken; // Store encrypted token
        delete session.isAdmin; // Ensure admin flag is not set for user app
        await session.save();
        console.log("Auth Action: User session cookie set (with encrypted token) for user:", userId);
        return true;
    } catch (error) {
        console.error("Auth Action: Error setting user session directly:", error);
        return false;
    }
}

// --- Helper to clear the user session cookie directly ---
async function clearUserSessionCookie(): Promise<boolean> {
     try {
        const cookieStore = await cookies();
        const session = await getIronSession<SessionData>(cookieStore, getUserSessionOptions());
        session.destroy(); // Clears data and prepares cookie removal header on save
        // No need to manually save unless required before redirect/return
        console.log("Auth Action: User session destroyed directly.");
        return true;
    } catch (error) {
        console.error("Auth Action: Error destroying user session directly:", error);
        return false;
    }
}

// --- MODIFIED: Login Action ---
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

        const userId = authResponse.user?.id;
        const accessToken = authResponse.accessToken;
        if (!userId || !accessToken) {
            console.error("Login Action: Backend response missing userId or accessToken after successful login.");
            return { success: false, message: 'Login failed: Could not establish session (missing credentials).' };
        }

        // MODIFIED: Pass accessToken to helper for encryption and saving
        const sessionSet = await setUserSessionCookie(userId, accessToken);
        if (!sessionSet) {
            // Provide specific error if session setting fails
            return { success: false, message: 'Login successful, but failed to save session state. Please try again.' };
        }

        revalidatePath('/', 'layout');
        // Note: Refresh token is NOT handled here - requires client-side secure storage
        console.log(`User ${userId} logged in successfully.`);
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

// --- MODIFIED: Register Action ---
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
        if (!userId || !accessToken) {
            console.error("Register Action: Backend response missing userId or accessToken after successful registration.");
            return { success: false, message: 'Registration failed: Could not establish session (missing credentials).' };
        }

        // MODIFIED: Pass accessToken to helper
        const sessionSet = await setUserSessionCookie(userId, accessToken);
        if (!sessionSet) {
             // Provide specific error if session setting fails
             return { success: false, message: 'Registration successful, but failed to save session state. Please try again.' };
        }

        revalidatePath('/', 'layout');
        console.log(`User ${userId} registered successfully.`);
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

// --- MODIFIED: Google Callback Action ---
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
        if (!userId || !accessToken) {
             console.error("Google Callback Action: Backend response missing userId or accessToken after successful callback.");
             return { success: false, message: 'Google Sign-In failed: Could not establish session (missing credentials).' };
        }

        // MODIFIED: Pass accessToken to helper
        const sessionSet = await setUserSessionCookie(userId, accessToken);
        if (!sessionSet) {
            // Provide specific error if session setting fails
             return { success: false, message: 'Google Sign-In successful, but failed to save session state. Please try again.' };
        }

        revalidatePath('/', 'layout');
        console.log(`User ${userId} authenticated via Google (New User: ${!!authResponse.isNewUser}).`);
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

// --- REFACTORED: Logout Action ---
export async function logoutAction() {
    // Backend logout (invalidate refresh token) - Requires secure refresh token handling client-side
    // This part remains complex and needs a client-side strategy for storing the refresh token securely.
    // const storedRefreshToken = await getRefreshTokenFromSecureStorage(); // Pseudocode
    // if (storedRefreshToken) {
    //     try {
    //         // Note: Backend logout *might* not need the access token, only the refresh token
    //         await apiClient('/auth/logout', { method: 'POST', body: { refreshToken: storedRefreshToken } });
    //         await clearRefreshTokenFromSecureStorage(); // Pseudocode
    //     } catch (err) { console.error("Backend logout call failed:", err); /* Handle potentially */ }
    // } else {
    //      console.log("Logout Action: No refresh token found to invalidate on backend.");
    // }

    // Clear the frontend session cookie directly
    const cleared = await clearUserSessionCookie();
    if (!cleared) {
        // Log but proceed with redirect as the main goal is frontend logout
        console.warn("Logout Action: Failed to clear user session cookie, redirecting anyway.");
    }

    // Revalidate and redirect
    revalidatePath('/', 'layout'); // Revalidate all pages potentially affected by auth state
    redirect('/login'); // Redirect to login page
}

// Refresh Action remains placeholder
export async function refreshSessionAction(refreshToken: string): Promise<ActionResult & { newAccessToken?: string; newRefreshToken?: string }> {
    console.warn("refreshSessionAction is not fully implemented due to refresh token storage complexity.");
    if (!refreshToken) {
        return { success: false, message: 'Refresh token is required.' };
    }
    try {
        const refreshData: RefreshRequestDTO = { refreshToken };
        const authResponse = await apiClient<AuthResponseDTO>('/auth/refresh', {
            method: 'POST',
            body: JSON.stringify(refreshData),
        });
        // Client-side logic needs to handle storing new tokens
        return {
            success: true,
            newAccessToken: authResponse.accessToken,
            newRefreshToken: authResponse.refreshToken,
        };
    } catch (error) {
        console.error("Refresh Action Error:", error);
        if (error instanceof APIError && error.status === 401) {
             console.log("Refresh token invalid/expired during refresh attempt.");
             return { success: false, message: 'Session expired. Please log in again.' };
        }
        return { success: false, message: 'Failed to refresh session.' };
    }
    // Implementation would involve:
    // 1. Calling backend `/auth/refresh` with the securely stored refreshToken.
    // 2. Receiving new accessToken and refreshToken.
    // 3. Encrypting the new accessToken and updating the session cookie.
    // 4. Securely storing the new refreshToken client-side (e.g., HttpOnly cookie if possible, or secure local/session storage).
    // 5. Returning the new tokens to the caller (e.g., an interceptor in apiClient).
}