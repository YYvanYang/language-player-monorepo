// apps/admin-panel/_actions/adminAuthActions.ts
'use server'; // Mark this module as Server Actions

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import apiClient, { APIError } from '@repo/api-client';
import type { LoginRequestDTO, UserResponseDTO } from '@repo/types'; // Using shared Login DTO
import { getAdminSessionOptions, SessionData } from '@repo/auth'; // Use admin options
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers'; // Import cookies

// Define return type for useActionState
interface AdminAuthResult {
    success: boolean;
    message?: string;
}

// Define the expected structure of the SUCCESSFUL response from the Go backend's ADMIN login endpoint
// NOTE: Adjust this if your backend admin login returns different fields
interface GoAdminLoginSuccessResponse {
    // Assuming admin login returns user details similar to regular login,
    // plus potentially specific admin flags/roles if not derived from session.
    accessToken: string; // We don't use this directly, but backend sends it
    refreshToken: string; // We don't use this directly
    user: UserResponseDTO; // Contains user ID and potentially isAdmin flag from DB
}

// Helper to call the internal session API route (POST)
async function setAdminSession(userId: string, isAdminConfirmed: boolean): Promise<boolean> {
    // Server Actions run on the server, directly call getIronSession
    if (!isAdminConfirmed) {
        console.warn("Admin Auth Action: Attempted to set session for non-admin user.");
        return false; // Don't set session if backend didn't confirm admin
    }
    try {
        // Set session directly in the Server Action context
        const session = await getIronSession<SessionData>(cookies(), getAdminSessionOptions());
        session.userId = userId;
        session.isAdmin = true; // Explicitly set admin flag
        await session.save();
        console.log("Admin Auth Action: Admin session saved directly for userId:", userId);
        return true;
    } catch (error) {
        console.error("Admin Auth Action: Error saving admin session directly:", error);
        return false;
    }
}

// Helper to clear the admin session cookie directly
async function clearAdminSession(): Promise<boolean> {
     try {
        const session = await getIronSession<SessionData>(cookies(), getAdminSessionOptions());
        session.destroy();
        console.log("Admin Auth Action: Admin session destroyed directly.");
        return true;
    } catch (error) {
        console.error("Admin Auth Action: Error destroying admin session directly:", error);
        return false;
    }
}

export async function adminLoginAction(previousState: AdminAuthResult | null, formData: FormData): Promise<AdminAuthResult> {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        return { success: false, message: 'Email and password are required.' };
    }

    try {
        const loginData: LoginRequestDTO = { email, password };

        // 1. Call the Go backend's ADMIN login endpoint
        // NOTE: Update '/admin/auth/login' if your backend uses a different path
        const adminAuthResponse = await apiClient<GoAdminLoginSuccessResponse>('/admin/auth/login', {
            method: 'POST',
            body: JSON.stringify(loginData),
        });

        // 2. Verify backend confirmed admin status (adjust based on backend response)
        // Assuming the backend includes user details with an isAdmin flag or similar
        const user = adminAuthResponse?.user;
        if (!user?.id || user?.isAdmin !== true) {
             console.error(`Admin login error: Backend response missing userId or isAdmin flag for email: ${email}`);
             return { success: false, message: 'Login failed: User not found or is not an administrator.' };
        }

        // 3. Set the admin session cookie directly in the server action
        const sessionSet = await setAdminSession(user.id, true); // Pass admin confirmation
         if (!sessionSet) {
             console.error(`Admin login error: Failed to set session cookie for userId: ${user.id}`);
             return { success: false, message: 'Login failed: Could not save session state.' };
         }

        // 4. Revalidate and prepare success state
        revalidatePath('/', 'layout'); // Revalidate admin layout/dashboard
        console.log(`Admin user ${user.id} logged in successfully.`);
        return { success: true }; // Redirect happens in the component useEffect

    } catch (error) {
        console.error("Admin Login Action Error:", error);
        if (error instanceof APIError) {
            if (error.status === 401) return { success: false, message: 'Invalid email or password.' };
            if (error.status === 403) return { success: false, message: 'Access denied. Ensure user has admin privileges.' };
            return { success: false, message: `Login failed: ${error.message}` };
        }
        return { success: false, message: `An unexpected error occurred during login: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
}

export async function adminLogoutAction() {
    // Clear the session cookie directly
    await clearAdminSession();

    // Revalidate paths relevant after logout and redirect to admin login
    revalidatePath('/', 'layout'); // Revalidate the whole admin layout
    redirect('/login'); // Redirect to admin login page
}