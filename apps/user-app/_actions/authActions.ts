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
import { SessionData, getUserSessionOptions } from '@repo/auth'; // Use user options

// Action Result Type
interface ActionResult {
    success: boolean;
    message?: string;
    isNewUser?: boolean; // For Google callback
}

// REFACTORED: Helper to set the user session cookie directly
async function setUserSessionCookie(userId: string): Promise<boolean> {
    if (!userId) {
        console.error("Auth Action: Cannot set session: userId is missing.");
        return false;
    }
    try {
        const session = await getIronSession<SessionData>(cookies(), getUserSessionOptions());
        session.userId = userId;
        delete session.isAdmin; // Ensure admin flag is not set
        await session.save();
        // console.log("Auth Action: User session cookie set successfully for user:", userId);
        return true;
    } catch (error) {
        console.error("Auth Action: Error setting user session directly:", error);
        return false;
    }
}

// REFACTORED: Helper to clear the user session cookie directly
async function clearUserSessionCookie(): Promise<boolean> {
     try {
        const session = await getIronSession<SessionData>(cookies(), getUserSessionOptions());
        session.destroy();
        console.log("Auth Action: User session destroyed directly.");
        return true;
    } catch (error) {
        console.error("Auth Action: Error destroying user session directly:", error);
        return false;
    }
}


// REFACTORED: Login Action
export async function loginAction(previousState: ActionResult | null, formData: FormData): Promise<ActionResult> {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        return { success: false, message: 'Email and password are required.' };
    }

    try {
        const loginData: LoginRequestDTO = { email, password };
        // Backend returns full AuthResponseDTO including user details
        const authResponse = await apiClient<AuthResponseDTO>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(loginData),
        });

        const userId = authResponse.user?.id;
        if (!userId) {
            console.error("Login Action: Backend response missing user ID after successful login.");
            return { success: false, message: 'Login failed: Could not establish session (missing user ID).' };
        }

        // --- Set Session Cookie Directly ---
        const sessionSet = await setUserSessionCookie(userId);
        if (!sessionSet) {
            return { success: false, message: 'Login failed: Could not save session state.' };
        }
        // --- End Session Cookie ---

        revalidatePath('/', 'layout');
        // TODO: Securely handle/store authResponse.refreshToken on client if needed for refresh flow
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

// REFACTORED: Register Action
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
        if (!userId) {
             console.error("Register Action: Backend response missing user ID after successful registration.");
            return { success: false, message: 'Registration failed: Could not establish session (missing user ID).' };
        }

        // --- Set Session Cookie Directly ---
        const sessionSet = await setUserSessionCookie(userId);
        if (!sessionSet) {
            return { success: false, message: 'Registration failed: Could not save session state.' };
        }
        // --- End Session Cookie ---

        revalidatePath('/', 'layout');
        // TODO: Securely handle/store authResponse.refreshToken
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

// REFACTORED: Google Callback Action
export async function googleCallbackAction(idToken: string): Promise<ActionResult> {
    if (!idToken) { return { success: false, message: 'Google ID token is required.' }; }

    try {
        const callbackData: GoogleCallbackRequestDTO = { idToken };
        const authResponse = await apiClient<AuthResponseDTO>('/auth/google/callback', {
            method: 'POST',
            body: JSON.stringify(callbackData),
        });

        const userId = authResponse.user?.id;
        if (!userId) {
             console.error("Google Callback Action: Backend response missing user ID after successful callback.");
             return { success: false, message: 'Google Sign-In failed: Could not establish session (missing user ID).' };
        }

        // --- Set Session Cookie Directly ---
        const sessionSet = await setUserSessionCookie(userId);
        if (!sessionSet) {
            return { success: false, message: 'Google Sign-In failed: Could not save session state.' };
        }
        // --- End Session Cookie ---

        revalidatePath('/', 'layout');
        // TODO: Securely handle/store authResponse.refreshToken
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

// REFACTORED: Logout Action
export async function logoutAction() {
    // 1. Backend Logout (Optional - requires refresh token handling)
    // console.log("Logout Action: Skipping backend /auth/logout call.");
    // Retrieve stored refresh token, call API, clear stored token...

    // 2. Clear the frontend session cookie directly
    const cleared = await clearUserSessionCookie();
    if (!cleared) {
        console.warn("Logout Action: Failed to clear user session cookie, redirecting anyway.");
    }

    // 3. Revalidate and redirect
    revalidatePath('/', 'layout');
    redirect('/login');
}

// Refresh Action (Remains placeholder - requires complex client coordination)
export async function refreshSessionAction(refreshToken: string): Promise<ActionResult & { newAccessToken?: string; newRefreshToken?: string }> {
    console.warn("refreshSessionAction called - requires secure refresh token storage & client-side coordination.");
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
}