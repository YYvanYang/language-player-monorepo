// apps/admin-panel/_actions/adminAuthActions.ts
'use server'; // Mark this module as Server Actions

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers'; // To potentially read/clear cookies if needed server-side directly (alternative to fetch)
import apiClient, { APIError } from '@repo/api-client';
import type { LoginRequestDTO } from '@repo/types'; // Using shared Login DTO
// Import session library for direct use if preferred over fetch
// import { getIronSession } from 'iron-session';
// import { adminSessionOptions } from '../app/api/auth/session/route'; // Adjust path if exporting options

// Define return type for useActionState
interface AdminAuthResult {
    success: boolean;
    message?: string;
}

// Define the expected structure of the SUCCESSFUL response from the Go backend's ADMIN login endpoint
// Adjust this based on your actual Go API response structure
interface GoAdminLoginSuccessResponse {
    userId: string;
    isAdmin: boolean; // Crucial: Backend must confirm admin status
    token?: string; // Optional: Backend might return its own token, but we rely on session cookie here
    // Add other relevant fields like name, email if needed
}


export async function adminLoginAction(previousState: AdminAuthResult | null, formData: FormData): Promise<AdminAuthResult> {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Basic server-side validation
    if (!email || !password) {
        return { success: false, message: 'Email and password are required.' };
    }

    try {
        const loginData: LoginRequestDTO = { email, password };

        // 1. Call the Go backend's ADMIN login endpoint
        // Replace '/admin/auth/login' with your actual admin login endpoint
        const adminAuthResponse = await apiClient<GoAdminLoginSuccessResponse>('/admin/auth/login', {
            method: 'POST',
            body: JSON.stringify(loginData),
        });

        // 2. Verify backend confirmed admin status
        if (!adminAuthResponse?.userId || !adminAuthResponse?.isAdmin) {
             // Log this serious issue - backend didn't confirm admin status!
             console.error(`Admin login error: Backend response missing userId or isAdmin flag for email: ${email}`);
             return { success: false, message: 'Login failed: Invalid admin credentials or permissions.' };
        }

        // 3. Call THIS admin panel's session API route handler to set the cookie
        // Use absolute URL if running in different environments or use env var for app URL
        // Ensure NEXT_PUBLIC_ADMIN_APP_URL is set appropriately in your environment
         const appUrl = process.env.NEXT_PUBLIC_ADMIN_APP_URL || 'http://localhost:3001'; // Default to common admin port if not set
         const sessionResponse = await fetch(`${appUrl}/api/auth/session`, { // Fetch THIS app's API route
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             // Send data needed to set the session, INCLUDING isAdmin flag
             body: JSON.stringify({
                userId: adminAuthResponse.userId,
                isAdmin: true // We trust the backend confirmation here
                // Add other session data if needed
            }),
         });

         if (!sessionResponse.ok) {
             const errorBody = await sessionResponse.text();
             console.error(`Admin login error: Failed to set session cookie via API route. Status: ${sessionResponse.status}, Body: ${errorBody}`);
             throw new Error(`Failed to set session cookie (status: ${sessionResponse.status}).`);
         }

        // Session cookie should be set now by the Route Handler's response

        // 4. Revalidate and prepare success state (don't redirect here)
        revalidatePath('/', 'layout'); // Revalidate admin layout
        console.log(`Admin user ${adminAuthResponse.userId} logged in successfully.`);
        return { success: true };

    } catch (error) {
        console.error("Admin Login Action Error:", error);
        if (error instanceof APIError) {
            // Map specific backend errors
            if (error.status === 401) { // Unauthorized from Go backend
                return { success: false, message: 'Invalid email or password.' };
            }
            if (error.status === 403) { // Forbidden from Go backend (maybe not admin?)
                return { success: false, message: 'Access denied. User is not an administrator.' };
            }
            // General API error
            return { success: false, message: `Login failed: ${error.message}` };
        }
        // Handle fetch errors to session API or other unexpected errors
        return { success: false, message: `An unexpected error occurred during login: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
}

export async function adminLogoutAction() {
    // Call THIS admin panel's session API route handler to clear the cookie
     const appUrl = process.env.NEXT_PUBLIC_ADMIN_APP_URL || 'http://localhost:3001';
    try {
         const response = await fetch(`${appUrl}/api/auth/session`, { method: 'DELETE' });
         if (!response.ok) {
             console.error("Admin logout error: Failed to clear session via API route. Status:", response.status);
             // Proceed with redirect anyway? Best effort logout.
         } else {
             console.log("Admin session cleared successfully via API route.");
         }
    } catch (error) {
         console.error("Admin logout error: Fetching session API route failed:", error);
         // Proceed with redirect anyway?
    }


    // Alternative: Use iron-session directly if preferred and options are accessible
    // try {
    //     const session = await getIronSession<SessionData>(cookies(), adminSessionOptions);
    //     session.destroy();
    //     console.log("Admin session destroyed directly.");
    // } catch (error) {
    //     console.error("Admin logout error: Failed to destroy session directly:", error);
    // }


    // Revalidate paths relevant after logout and redirect to admin login
    revalidatePath('/', 'layout'); // Revalidate the whole admin layout
    redirect('/login'); // Redirect to admin login page
}

// --- Helper Function (if not using direct iron-session) ---
// NOTE: This helper is primarily for use within the action itself if needed,
//       but verifyAdmin above is likely sufficient.
// async function getAdminSessionData(): Promise<SessionData | null> {
//     try {
//         const session = await getIronSession<SessionData>(cookies(), adminSessionOptions);
//         if (!session.userId || !session.isAdmin) {
//             return null;
//         }
//         return session;
//     } catch (error) {
//         console.error("Error getting admin session data in action:", error);
//         return null;
//     }
// }