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
interface GoAdminLoginSuccessResponse {
    // Assuming admin login returns user details similar to regular login,
    // plus potentially specific admin flags/roles if not derived from session.
    accessToken: string; // We don't use this directly, but backend sends it
    refreshToken: string; // We don't use this directly
    user: UserResponseDTO; // Contains user ID and *must* contain isAdmin: true
}

// REFACTORED: Helper to set the admin session cookie directly using iron-session
async function setAdminSessionCookie(userId: string, isAdminConfirmed: boolean): Promise<boolean> {
    if (!isAdminConfirmed) {
        console.warn("Admin Auth Action: Attempted to set session for non-admin user.");
        return false;
    }
    try {
        // --- FIX: Await cookies() before passing to getIronSession ---
        const cookieStore = await cookies();
        const session = await getIronSession<SessionData>(cookieStore, getAdminSessionOptions());
        // --- END FIX ---
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

// REFACTORED: Helper to clear the admin session cookie directly
async function clearAdminSessionCookie(): Promise<boolean> {
     try {
        // --- FIX: Await cookies() before passing to getIronSession ---
        const cookieStore = await cookies();
        const session = await getIronSession<SessionData>(cookieStore, getAdminSessionOptions());
        // --- END FIX ---
        session.destroy();
        // await session.save(); // save implicitly called by destroy in v8+
        console.log("Admin Auth Action: Admin session destroyed directly.");
        return true;
    } catch (error) {
        console.error("Admin Auth Action: Error destroying admin session directly:", error);
        return false;
    }
}

// REFACTORED: Login Action to use direct session management
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

        // 2. Verify backend confirmed admin status
        const user = adminAuthResponse?.user;
        // --- CRITICAL CHECK ---
        if (!user?.id || user?.isAdmin !== true) {
             console.error(`Admin login error: Backend response missing userId or isAdmin=true flag for email: ${email}`);
             return { success: false, message: 'Login failed: User not found or is not an administrator.' };
        }
        // --- END CHECK ---

        // 3. Set the admin session cookie DIRECTLY
        const sessionSet = await setAdminSessionCookie(user.id, true); // Pass admin confirmation
         if (!sessionSet) {
             console.error(`Admin login error: Failed to set session cookie for userId: ${user.id}`);
             return { success: false, message: 'Login failed: Could not save session state.' };
         }

        // 4. Revalidate and prepare success state
        revalidatePath('/', 'layout'); // Revalidate admin layout/dashboard
        console.log(`Admin user ${user.id} logged in successfully.`);
        // Redirect will be handled by the component's useEffect based on the success state
        return { success: true };

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

// REFACTORED: Logout Action to use direct session management
export async function adminLogoutAction() {
    // Clear the session cookie directly
    await clearAdminSessionCookie();

    // Revalidate paths relevant after logout and redirect to admin login
    revalidatePath('/', 'layout'); // Revalidate the whole admin layout
    redirect('/login'); // Redirect to admin login page
}