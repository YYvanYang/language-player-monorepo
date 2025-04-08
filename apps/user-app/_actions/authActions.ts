// apps/user-app/_actions/authActions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import apiClient, { APIError } from '@repo/api-client';
import type { AuthResponseDTO, LoginRequestDTO, RegisterRequestDTO, GoogleCallbackRequestDTO } from '@repo/types';
// NOTE: Cannot directly import functions/variables from Route Handlers.
// Actions must call the API route handler via fetch if they need to modify the session cookie.
// Or use iron-session directly with cookies() if preferred (requires sharing sessionOptions carefully).

// Action Result Type
interface ActionResult {
    success: boolean;
    message?: string;
}

// Fetch URL Helper (needed because actions run server-side but might call own API routes)
function getAppUrl() {
    // Use NEXT_PUBLIC_APP_URL if set (for local dev hitting localhost),
    // fallback to VERCEL_URL (production on Vercel), or require explicit setup
    const url = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL;
    if (!url) {
        // Throw error only if absolutely needed, otherwise relative might work sometimes
        // but absolute is safer for server->server fetch
         console.warn("Warning: APP_URL environment variable is not set. API calls to self might fail.");
         return ""; // Or throw new Error("APP_URL environment variable is not set");
    }
     // Ensure it starts with http
     return url.startsWith('http') ? url : `https://${url}`;
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
        // 1. Call Go backend API
        const authResponse = await apiClient<AuthResponseDTO>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(loginData),
        });

        if (authResponse?.token) {
            // 2. Extract User ID from backend token (THIS IS CRUCIAL AND DEPENDS ON YOUR BACKEND JWT)
            //    !!! Replace this with your actual token parsing logic !!!
            const decodedUserId = "user-id-from-backend-jwt-decode"; // Placeholder
             if (!decodedUserId) {
                throw new Error("Could not extract user ID from backend token.");
             }

            // 3. Call internal Session API Route Handler to set the secure cookie
            const appUrl = getAppUrl();
            if (!appUrl) return { success: false, message: "Application URL not configured." };

            const sessionResponse = await fetch(`${appUrl}/api/auth/session`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: decodedUserId }), // Send extracted user ID
            });

            if (!sessionResponse.ok) {
                const errorBody = await sessionResponse.text();
                console.error("Failed to set session via API route:", sessionResponse.status, errorBody);
                throw new Error('Failed to save session state.');
            }

            // 4. Invalidate cache and signal success (redirect happens client-side)
            revalidatePath('/', 'layout');
            return { success: true };
        } else {
            // Should not happen if backend API is correct
            return { success: false, message: 'Login failed: Invalid response from server.' };
        }

    } catch (error) {
        console.error("Login Action Error:", error);
        if (error instanceof APIError) {
            if (error.status === 401) {
                return { success: false, message: 'Invalid email or password.' };
            }
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
        // 1. Call Go backend API
        const authResponse = await apiClient<AuthResponseDTO>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(registerData),
        });

        if (authResponse?.token) {
             // 2. Extract User ID
             const decodedUserId = "user-id-from-backend-jwt-decode"; // Placeholder
             if (!decodedUserId) { throw new Error("Could not extract user ID from backend token."); }

             // 3. Call internal Session API Route
             const appUrl = getAppUrl();
             if (!appUrl) return { success: false, message: "Application URL not configured." };
             const sessionResponse = await fetch(`${appUrl}/api/auth/session`, {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify({ userId: decodedUserId }),
             });
             if (!sessionResponse.ok) { throw new Error('Failed to save session state.'); }

             // 4. Invalidate cache and signal success
             revalidatePath('/', 'layout');
             return { success: true };
        } else {
            return { success: false, message: 'Registration failed: Invalid response.' };
        }
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
export async function googleCallbackAction(idToken: string): Promise<ActionResult & { isNewUser?: boolean }> {
     if (!idToken) { return { success: false, message: 'Google ID token is required.' }; }

     try {
         const callbackData: GoogleCallbackRequestDTO = { idToken };
         // 1. Call Go backend
         const authResponse = await apiClient<AuthResponseDTO>('/auth/google/callback', {
             method: 'POST',
             body: JSON.stringify(callbackData),
         });

         if (authResponse?.token) {
             // 2. Extract User ID
              const decodedUserId = "user-id-from-backend-jwt-decode"; // Placeholder
             if (!decodedUserId) { throw new Error("Could not extract user ID from backend token."); }

             // 3. Call internal Session API Route
             const appUrl = getAppUrl();
             if (!appUrl) return { success: false, message: "Application URL not configured." };
             const sessionResponse = await fetch(`${appUrl}/api/auth/session`, {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify({ userId: decodedUserId }),
             });
             if (!sessionResponse.ok) { throw new Error('Failed to save session state.'); }

             // 4. Invalidate cache and signal success
             revalidatePath('/', 'layout');
             return { success: true, isNewUser: authResponse.isNewUser }; // Include isNewUser flag
         } else {
             return { success: false, message: 'Google authentication failed: Invalid response.' };
         }
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
    if (!appUrl) {
         console.error("Cannot logout: Application URL not configured.");
         // Should we still try to redirect? Maybe.
    } else {
        try {
             // Call internal Session API Route Handler to clear the cookie
             const response = await fetch(`${appUrl}/api/auth/session`, { method: 'DELETE' });
             if (!response.ok) { console.error("Failed to clear session via API route"); }
        } catch (error) {
            console.error("Error calling logout API route:", error);
        }
    }

    // Clear cookie directly using next/headers
    // const session = await getIronSession<SessionData>(cookies(), sessionOptions);
    // session.destroy();

    // Revalidate and redirect regardless of API call success
    revalidatePath('/', 'layout');
    redirect('/login');
}