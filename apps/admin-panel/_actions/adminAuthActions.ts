'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Placeholder for apiClient and types - replace with actual imports if available
// import apiClient, { APIError } from '@repo/api-client';
// import type { AuthResponseDTO, LoginRequestDTO } from '@repo/types';

// --- Placeholder Types (Remove if using actual imports) ---
interface AuthResponseDTO {
    token: string;
    userId: string; // Assuming backend sends userId upon successful admin login
    // Add other relevant fields if needed
}
interface LoginRequestDTO {
    email: string;
    password: string;
}
class APIError extends Error {
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.name = 'APIError';
        this.status = status;
    }
}
const apiClient = async <T>(url: string, options: RequestInit): Promise<T | null> => {
    // Basic placeholder fetch implementation
    try {
        const baseUrl = process.env.ADMIN_API_URL || 'http://localhost:8080'; // Example base URL for the Go backend
        const response = await fetch(`${baseUrl}${url}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers || {}),
            },
        });
        if (!response.ok) {
            const errorData = await response.text();
            throw new APIError(`API request failed: ${errorData || response.statusText}`, response.status);
        }
        if (response.status === 204) return null; // Handle No Content
        return await response.json() as T;
    } catch (error) {
        if (error instanceof APIError) throw error;
        console.error("API Client Error:", error);
        throw new Error("Network or API request error");
    }
};
// --- End Placeholder Types ---

interface ActionResult {
    success: boolean;
    message?: string;
}

export async function adminLoginAction(previousState: ActionResult | null, formData: FormData): Promise<ActionResult> {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        return { success: false, message: 'Email and password are required.' };
    }

    try {
        const loginData: LoginRequestDTO = { email, password };
        // Use admin-specific login endpoint
        const authResponse = await apiClient<AuthResponseDTO>('/admin/auth/login', {
            method: 'POST',
            body: JSON.stringify(loginData),
        });

        if (authResponse?.token && authResponse.userId) {
            // Call the admin panel's session API route handler
            // Using relative URL - assumes fetch is called from the same origin as the admin panel
            const sessionResponse = await fetch(`/api/auth/session`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // Send userId and isAdmin flag
                body: JSON.stringify({ userId: authResponse.userId, isAdmin: true }),
            });

            if (!sessionResponse.ok) {
                 const errorText = await sessionResponse.text();
                 console.error("Failed to set admin session:", sessionResponse.status, errorText);
                 throw new Error('Failed to set admin session');
            }

            revalidatePath('/admin', 'layout'); // Revalidate admin layout
            return { success: true };
        } else {
            return { success: false, message: 'Admin login failed: Invalid response from server.' };
        }

    } catch (error) {
        console.error("Admin Login Action Error:", error);
        if (error instanceof APIError) {
            if (error.status === 401) {
                return { success: false, message: 'Invalid email or password.' };
            }
            return { success: false, message: error.message };
        }
        return { success: false, message: 'An unexpected error occurred during admin login.' };
    }
}

export async function adminLogoutAction() {
    try {
        // Call the admin panel's session API route handler to logout
        const response = await fetch(`/api/auth/session`, { method: 'DELETE' });
        if (!response.ok) {
             const errorText = await response.text();
             console.error("Failed to clear admin session via API route:", response.status, errorText);
             // Decide how to handle this? Maybe redirect anyway?
        }
    } catch (error) {
        console.error("Error during admin logout fetch:", error);
        // Log error but proceed to redirect
    }

    // Revalidate and redirect to admin login page
    revalidatePath('/admin', 'layout');
    redirect('/admin/login'); // Adjust if your admin login path is different
}
