// apps/user-app/_actions/authActions.ts
// APPLY THE FULL CODE FROM THE PREVIOUS RESPONSE HERE
// Key changes:
// - Handling AuthResponseDTO (accessToken, refreshToken, isNewUser)
// - Using setFrontendSession helper
// - Using decodeUserIdFromJwt helper (or adapting if backend sends userId)
// - Updated logoutAction logic
// - Added refreshAction placeholder
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import apiClient, { APIError } from '@repo/api-client';
import type {
    AuthResponseDTO, // Updated type
    LoginRequestDTO,
    RegisterRequestDTO,
    GoogleCallbackRequestDTO,
    RefreshRequestDTO, // Added type
    LogoutRequestDTO,  // Added type
} from '@repo/types';
// Assuming session management via internal API route

// Action Result Type
interface ActionResult {
    success: boolean;
    message?: string;
    isNewUser?: boolean; // For Google callback
}

// Fetch URL Helper (No change)
function getAppUrl() {
    const url = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL;
    if (!url) {
         console.warn("Warning: APP_URL environment variable is not set. API calls to self might fail.");
         return "";
    }
     return url.startsWith('http') ? url : `https://${url}`;
}

// Helper to call the internal session API route
async function setFrontendSession(userId: string): Promise<boolean> {
    const appUrl = getAppUrl();
    if (!appUrl) {
        console.error("Cannot set session: Application URL not configured.");
        return false;
    }
    try {
        const sessionResponse = await fetch(`${appUrl}/api/auth/session`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: userId }), // Send extracted user ID
        });
        if (!sessionResponse.ok) {
            const errorBody = await sessionResponse.text();
            console.error("Failed to set session via API route:", sessionResponse.status, errorBody);
            return false;
        }
        console.log("Frontend session cookie set successfully for user:", userId);
        return true;
    } catch (error) {
        console.error("Error calling internal session API:", error);
        return false;
    }
}

// Helper to decode User ID from JWT (Placeholder - Requires actual JWT library)
function decodeUserIdFromJwt(token: string): string | null {
    // !!! Placeholder Implementation !!!
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        const payload = JSON.parse(atob(parts[1]));
        // Standard JWT claim for subject is 'sub'. 'uid' might be custom.
        return payload.sub || payload.uid || null;
    } catch (e) {
        console.error("Failed to decode JWT (placeholder)", e);
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
        const authResponse = await apiClient<AuthResponseDTO>('/auth/login', { // Expects AuthResponseDTO
            method: 'POST',
            body: JSON.stringify(loginData),
        });

        const userId = decodeUserIdFromJwt(authResponse.accessToken);
        if (!userId) {
            console.error("Login Action: Could not determine user ID from backend response.");
            return { success: false, message: 'Login failed: Could not establish session.' };
        }

        const sessionSet = await setFrontendSession(userId);
        if (!sessionSet) {
            return { success: false, message: 'Login failed: Could not save session state.' };
        }

        revalidatePath('/', 'layout');
        // Optionally: Store refresh token securely if managing client-side refresh
        // storeRefreshToken(authResponse.refreshToken);
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
        const authResponse = await apiClient<AuthResponseDTO>('/auth/register', { // Expects AuthResponseDTO
            method: 'POST',
            body: JSON.stringify(registerData),
        });

        const userId = decodeUserIdFromJwt(authResponse.accessToken);
        if (!userId) {
            console.error("Register Action: Could not determine user ID from backend response.");
            return { success: false, message: 'Registration failed: Could not establish session.' };
        }

         const sessionSet = await setFrontendSession(userId);
         if (!sessionSet) {
            return { success: false, message: 'Registration failed: Could not save session state.' };
         }

         revalidatePath('/', 'layout');
         // Optionally: Store refresh token
         // storeRefreshToken(authResponse.refreshToken);
         return { success: true };

    } catch (error) {
        console.error("Register Action Error:", error);
         if (error instanceof APIError) {
             if (error.status === 409) { return { success: false, message: 'Email already exists.' }; }
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
         const authResponse = await apiClient<AuthResponseDTO>('/auth/google/callback', { // Expects AuthResponseDTO
             method: 'POST',
             body: JSON.stringify(callbackData),
         });

         const userId = decodeUserIdFromJwt(authResponse.accessToken);
         if (!userId) {
             console.error("Google Callback Action: Could not determine user ID from backend response.");
             return { success: false, message: 'Google Sign-In failed: Could not establish session.' };
         }

          const sessionSet = await setFrontendSession(userId);
         if (!sessionSet) {
            return { success: false, message: 'Google Sign-In failed: Could not save session state.' };
         }

         revalidatePath('/', 'layout');
         // Optionally: Store refresh token
         // storeRefreshToken(authResponse.refreshToken);
         return { success: true, isNewUser: authResponse.isNewUser }; // Pass back isNewUser status

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

// Logout Action (Updated)
export async function logoutAction() {
    let clearSessionApiError = false;
    const appUrl = getAppUrl();
    if (!appUrl) {
         console.error("Cannot call internal logout API: Application URL not configured.");
         clearSessionApiError = true;
    } else {
        try {
             // 1. Clear the frontend session cookie
             const response = await fetch(`${appUrl}/api/auth/session`, { method: 'DELETE' });
             if (!response.ok) {
                 console.error("Failed to clear session via API route");
                 clearSessionApiError = true;
             }
        } catch (error) {
            console.error("Error calling internal logout API route:", error);
            clearSessionApiError = true;
        }
    }

    // 2. Call Backend Logout (If refresh token is accessible - often not in this simple setup)
    // const refreshToken = getClientSideRefreshToken(); // Hypothetical function
    // if (refreshToken) {
    //     try {
    //         const logoutData: LogoutRequestDTO = { refreshToken };
    //         await apiClient<void>('/auth/logout', { method: 'POST', body: JSON.stringify(logoutData) });
    //         console.log("Backend refresh token invalidated.");
    //         clearClientSideRefreshToken(); // Clear storage
    //     } catch (error) {
    //         console.error("Error calling backend /auth/logout:", error);
    //     }
    // }

    // 3. Revalidate and redirect
    revalidatePath('/', 'layout');
    redirect('/login');
}

// Refresh Action (Placeholder - Requires Client-Side Token Management)
export async function refreshAction(refreshToken: string): Promise<ActionResult & { newAccessToken?: string; newRefreshToken?: string }> {
    // This action would typically be called via client-side JavaScript, not a form.
    // It needs to receive the *current* refresh token.
    if (!refreshToken) {
        return { success: false, message: 'Refresh token is required.' };
    }
    try {
        const refreshData: RefreshRequestDTO = { refreshToken };
        const authResponse = await apiClient<AuthResponseDTO>('/auth/refresh', { // Expects AuthResponseDTO
            method: 'POST',
            body: JSON.stringify(refreshData),
        });

        // The action *must return* the new tokens to the client-side caller
        // so it can update its state/storage.
        return {
            success: true,
            newAccessToken: authResponse.accessToken,
            newRefreshToken: authResponse.refreshToken,
        };

    } catch (error) {
        console.error("Refresh Action Error:", error);
        if (error instanceof APIError && error.status === 401) {
             return { success: false, message: 'Session expired. Please log in again.' }; // Refresh token invalid
        }
        return { success: false, message: 'Failed to refresh session.' };
    }
}