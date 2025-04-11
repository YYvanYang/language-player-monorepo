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
    UserResponseDTO, // Import User DTO
} from '@repo/types';
import { getIronSession } from 'iron-session';
import { SessionData, getUserSessionOptions } from '@repo/auth'; // Use user options

// Action Result Type
interface ActionResult {
    success: boolean;
    message?: string;
    isNewUser?: boolean; // For Google callback
}

// Helper to set the user session cookie directly
async function setFrontendSession(userId: string): Promise<boolean> {
    if (!userId) {
        console.error("Auth Action: Cannot set session: userId is missing.");
        return false;
    }
    try {
        // Use cookies() from next/headers within Server Actions
        const session = await getIronSession<SessionData>(cookies(), getUserSessionOptions());
        session.userId = userId;
        delete session.isAdmin; // Ensure admin flag is not set in user session
        await session.save();
        // console.log("Auth Action: User session cookie set successfully for user:", userId);
        return true;
    } catch (error) {
        console.error("Auth Action: Error setting user session directly:", error);
        return false;
    }
}

// Helper to clear the user session cookie directly
async function clearFrontendSession(): Promise<boolean> {
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


// Login Action
export async function loginAction(previousState: ActionResult | null, formData: FormData): Promise<ActionResult> {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        return { success: false, message: 'Email and password are required.' };
    }

    try {
        const loginData: LoginRequestDTO = { email, password };
        // Backend should return user details in the response if login is successful
        const authResponse = await apiClient<AuthResponseDTO & { user: UserResponseDTO }>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(loginData),
        });

        // **CRITICAL:** Get userId from the VERIFIED backend response, NOT the token.
        const userId = authResponse.user?.id;
        if (!userId) {
            console.error("Login Action: Backend response missing user ID after successful login.");
            return { success: false, message: 'Login failed: Could not establish session (missing user ID).' };
        }

        const sessionSet = await setFrontendSession(userId);
        if (!sessionSet) {
            return { success: false, message: 'Login failed: Could not save session state.' };
        }

        revalidatePath('/', 'layout');
        // TODO: Securely handle/store authResponse.refreshToken on client if needed for refresh flow
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
        // Backend should return user details on successful registration
        const authResponse = await apiClient<AuthResponseDTO & { user: UserResponseDTO }>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(registerData),
        });

        // **CRITICAL:** Get userId from the backend response.
        const userId = authResponse.user?.id;
        if (!userId) {
             console.error("Register Action: Backend response missing user ID after successful registration.");
            return { success: false, message: 'Registration failed: Could not establish session (missing user ID).' };
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
        const authResponse = await apiClient<AuthResponseDTO & { user: UserResponseDTO }>('/auth/google/callback', {
            method: 'POST',
            body: JSON.stringify(callbackData),
        });

        // **CRITICAL:** Get userId from the backend response.
        const userId = authResponse.user?.id;
        if (!userId) {
             console.error("Google Callback Action: Backend response missing user ID after successful callback.");
             return { success: false, message: 'Google Sign-In failed: Could not establish session (missing user ID).' };
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
    // 1. Call Backend Logout (Best effort - Requires secure refresh token handling which is omitted here)
    // For now, we rely on clearing the frontend session and backend token expiry.
    // If you implement secure refresh token storage client-side (e.g., secure cookie),
    // retrieve it here and call the backend /auth/logout endpoint.
    console.log("Logout Action: Skipping backend /auth/logout call.");
    // const refreshToken = getSecureRefreshToken(); // Hypothetical
    // if (refreshToken) {
    //     try {
    //         const logoutData: LogoutRequestDTO = { refreshToken };
    //         await apiClient<void>('/auth/logout', { method: 'POST', body: JSON.stringify(logoutData) });
    //         clearSecureRefreshToken(); // Hypothetical
    //     } catch (error) { console.error("Logout Action: Error calling backend /auth/logout:", error); }
    // }

    // 2. Clear the frontend session cookie directly
    await clearFrontendSession();

    // 3. Revalidate and redirect
    revalidatePath('/', 'layout'); // Revalidate all layouts/pages potentially affected by auth state
    redirect('/login'); // Redirect to login page
}

// Refresh Action (Placeholder - Complex client-side coordination required)
// This action would typically be called by client-side logic (e.g., in an API client interceptor)
// when a primary API request fails with a 401 due to an expired access token.
// It needs a securely stored refresh token.
export async function refreshSessionAction(refreshToken: string): Promise<ActionResult & { newAccessToken?: string; newRefreshToken?: string }> {
    console.warn("refreshSessionAction called - requires secure refresh token storage & client-side coordination.");
    if (!refreshToken) {
        return { success: false, message: 'Refresh token is required.' };
    }
    try {
        const refreshData: RefreshRequestDTO = { refreshToken };
        // Backend returns new tokens
        const authResponse = await apiClient<AuthResponseDTO>('/auth/refresh', {
            method: 'POST',
            body: JSON.stringify(refreshData),
        });
        // The client-side logic that called this action needs to securely store
        // the new authResponse.refreshToken and update the access token used for subsequent requests.
        return {
            success: true,
            newAccessToken: authResponse.accessToken,
            newRefreshToken: authResponse.refreshToken,
        };
    } catch (error) {
        console.error("Refresh Action Error:", error);
        if (error instanceof APIError && error.status === 401) {
             console.log("Refresh token invalid/expired during refresh attempt.");
             // Clear the invalid refresh token from client storage (hypothetical)
             // clearSecureRefreshToken();
             // Signal client to trigger full logout
             return { success: false, message: 'Session expired. Please log in again.' };
        }
        return { success: false, message: 'Failed to refresh session.' };
    }
}