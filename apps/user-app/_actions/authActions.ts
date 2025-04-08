// apps/user-app/_actions/authActions.ts
'use server'; // Mark this module as Server Actions

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers'; // To potentially read/clear cookies if needed server-side directly (alternative to fetch)
import apiClient, { APIError } from '@repo/api-client';
import type { AuthResponseDTO, LoginRequestDTO, RegisterRequestDTO, GoogleCallbackRequestDTO } from '@repo/types';
// Import session library for direct use if preferred over fetch
// import { getIronSession } from 'iron-session';
// import { sessionOptions } from '../app/api/auth/session/route'; // Adjust path if needed

// Define return type for useActionState
interface ActionResult {
    success: boolean;
    message?: string;
    // isNewUser?: boolean; // For Google callback
}

export async function loginAction(previousState: ActionResult | null, formData: FormData): Promise<ActionResult> {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Basic server-side validation
    if (!email || !password) {
        return { success: false, message: 'Email and password are required.' };
    }

    try {
        const loginData: LoginRequestDTO = { email, password };
        const authResponse = await apiClient<AuthResponseDTO>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(loginData),
        });

        if (authResponse?.token) {
            // TODO: Securely get User ID from the backend token if needed for the session
            // For now, assume backend provides needed info or token IS the session key
            // Option 1: Call our session API route handler
             const sessionResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/session`, { // Use absolute URL for server->server fetch
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 // Send user ID extracted from token, or needed session data
                 body: JSON.stringify({ userId: 'user-id-from-token' /* extract properly */ }),
             });
             if (!sessionResponse.ok) throw new Error('Failed to set session');

            // Option 2: Use iron-session directly server-side (requires sessionOptions)
            // const session = await getIronSession<SessionData>(cookies(), sessionOptions);
            // session.userId = 'user-id-from-token';
            // await session.save();

            revalidatePath('/', 'layout'); // Revalidate layout to update auth state display
            // Don't redirect here, let the component do it based on success state
            return { success: true };
        } else {
            return { success: false, message: 'Login failed: Invalid response from server.' };
        }

    } catch (error) {
        console.error("Login Action Error:", error);
        if (error instanceof APIError) {
            if (error.status === 401) {
                return { success: false, message: 'Invalid email or password.' };
            }
            return { success: false, message: error.message };
        }
        return { success: false, message: 'An unexpected error occurred during login.' };
    }
}

export async function registerAction(previousState: ActionResult | null, formData: FormData): Promise<ActionResult> {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;

    if (!email || !password || !name) {
        return { success: false, message: 'Email, password, and name are required.' };
    }
    if (password.length < 8) {
         return { success: false, message: 'Password must be at least 8 characters.' };
    }

    try {
        const registerData: RegisterRequestDTO = { email, password, name };
        const authResponse = await apiClient<AuthResponseDTO>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(registerData),
        });

         if (authResponse?.token) {
            // Set session cookie (similar to login)
            // TODO: Get User ID
             const sessionResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/session`, {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify({ userId: 'user-id-from-token' }),
             });
             if (!sessionResponse.ok) throw new Error('Failed to set session');

            revalidatePath('/', 'layout');
            return { success: true };
         } else {
             return { success: false, message: 'Registration failed: Invalid response.' };
         }
    } catch (error) {
         console.error("Register Action Error:", error);
         if (error instanceof APIError) {
             if (error.status === 409) {
                 return { success: false, message: 'Email already exists.' };
             }
             return { success: false, message: error.message };
         }
         return { success: false, message: 'An unexpected error occurred during registration.' };
    }
}

 export async function googleCallbackAction(idToken: string): Promise<ActionResult & { isNewUser?: boolean }> { // Return type adjusted
     if (!idToken) {
         return { success: false, message: 'Google ID token is required.' };
     }

     try {
         const callbackData: GoogleCallbackRequestDTO = { idToken };
         // Call Go backend
         const authResponse = await apiClient<AuthResponseDTO>('/auth/google/callback', {
             method: 'POST',
             body: JSON.stringify(callbackData),
         });

         if (authResponse?.token) {
             // Set session cookie
             // TODO: Get User ID
             const sessionResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/session`, {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify({ userId: 'user-id-from-token' }),
             });
             if (!sessionResponse.ok) throw new Error('Failed to set session');

             revalidatePath('/', 'layout');
             return { success: true, isNewUser: authResponse.isNewUser };
         } else {
              return { success: false, message: 'Google authentication failed: Invalid response.' };
         }
     } catch (error) {
         console.error("Google Callback Action Error:", error);
         if (error instanceof APIError) {
             if (error.status === 409) { // Conflict
                return { success: false, message: 'Email already linked to another account.' };
             }
             if (error.status === 401) { // Auth failed (bad token)
                 return { success: false, message: 'Google authentication failed. Please try again.' };
             }
             return { success: false, message: error.message };
         }
         return { success: false, message: 'An unexpected error occurred during Google sign-in.' };
     }
 }


export async function logoutAction() {
    // Option 1: Call API Route Handler
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/session`, { method: 'DELETE' });
    if (!response.ok) {
        console.error("Failed to clear session via API route");
        // Decide how to handle this? Maybe clear client-side anyway?
    }

    // Option 2: Clear cookie directly using next/headers
    // const session = await getIronSession<SessionData>(cookies(), sessionOptions);
    // session.destroy();

    // Revalidate and redirect
    revalidatePath('/', 'layout');
    redirect('/login'); // Redirect to login page
}
