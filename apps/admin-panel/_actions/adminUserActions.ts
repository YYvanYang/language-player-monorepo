// apps/admin-panel/_actions/adminUserActions.ts
'use server';

import { cookies } from 'next/headers'; // Import cookies
import { revalidateTag, revalidatePath } from 'next/cache';
import apiClient, { APIError } from '@repo/api-client';
// MODIFIED: Ensure AdminUpdateUserRequestDTO is imported
import type { UserResponseDTO, AdminUpdateUserRequestDTO } from '@repo/types';
import { getAdminSessionOptions, SessionData } from '@repo/auth';
import { getIronSession } from 'iron-session';

// --- Helper to verify admin status ---
export async function verifyAdmin(): Promise<boolean> {
    try {
       // --- FIX: Await cookies() before passing to getIronSession ---
       const cookieStore = await cookies();
       const session = await getIronSession<SessionData>(cookieStore, getAdminSessionOptions());
       // --- END FIX ---
       return session.userId != null && session.userId !== "" && session.isAdmin === true;
    } catch { return false; }
}
// --- End Helper ---

// --- Action Result Types ---
export interface AdminActionResult { success: boolean; message?: string; }
export interface AdminUserResult extends AdminActionResult { user?: UserResponseDTO;}

// --- Action: Update User ---
export async function updateUserAction(userId: string, formData: FormData): Promise<AdminActionResult> {
    if (!await verifyAdmin()) { return { success: false, message: "Permission denied." }; }
    if (!userId) { return { success: false, message: "User ID is required." }; }

    // Extract data from FormData
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const isAdminStr = formData.get('isAdmin') as string | null; // Checkbox might be null if unchecked

    // Construct the request DTO - Include only fields that have values
    // Use Partial because not all fields might be sent
    const requestData: Partial<AdminUpdateUserRequestDTO> = {};
    if (name !== null) requestData.name = name; // Allow empty string if intended
    if (email) requestData.email = email; // Careful with email updates
    // Handle boolean checkbox: "on" means true, absence means false
    if (isAdminStr !== null) { // Check if the checkbox was present in the form data
        requestData.isAdmin = isAdminStr === 'on';
    } else {
        // If the checkbox is missing from the FormData (e.g., unchecked and not submitted),
        // explicitly set it to false in the request if the backend expects a boolean.
        // Adjust this logic based on how your form submits unchecked checkboxes and backend expectations.
        requestData.isAdmin = false;
    }

    if (Object.keys(requestData).length === 0) {
        return { success: false, message: "No fields provided for update." };
    }

    try {
        // Assuming a PUT /admin/users/{userId} endpoint exists
        await apiClient<UserResponseDTO>(`/admin/users/${userId}`, { // Update endpoint if needed
            method: 'PUT',
            body: JSON.stringify(requestData),
        });

        revalidateTag('admin-users');
        revalidateTag(`admin-user-${userId}`);
        revalidatePath(`/users/${userId}/edit`);

        console.log(`Admin updated user ${userId}`);
        return { success: true, message: "User updated successfully." };

    } catch (error) {
        console.error(`Admin error updating user ${userId}:`, error);
         if (error instanceof APIError) {
             if (error.status === 404) { return { success: false, message: "User not found." }; }
             if (error.status === 403) { return { success: false, message: "Permission denied by backend." }; }
             if (error.status === 400) { return { success: false, message: `Invalid input: ${error.message}` }; }
             if (error.status === 409) { return { success: false, message: `Conflict: ${error.message}` }; }
            return { success: false, message: `Failed to update user: ${error.message}` };
        }
        return { success: false, message: 'An unexpected error occurred.' };
    }
}

// --- Action: Delete User ---
export async function deleteUserAction(userId: string): Promise<AdminActionResult> {
    if (!await verifyAdmin()) { return { success: false, message: "Permission denied." }; }
    if (!userId) { return { success: false, message: "User ID is required." }; }

    try {
         await apiClient<void>(`/admin/users/${userId}`, { method: 'DELETE' });
         revalidateTag('admin-users');
         revalidatePath(`/users/${userId}/edit`);
         revalidatePath(`/users`); // Invalidate user list page

        console.log(`Admin deleted user ${userId}`);
        return { success: true, message: "User deleted successfully." };

    } catch (error) {
         console.error(`Admin error deleting user ${userId}:`, error);
         if (error instanceof APIError) {
             if (error.status === 404) { return { success: false, message: "User not found." }; }
             if (error.status === 403) { return { success: false, message: "Permission denied by backend." }; }
             if (error.status === 409) { return { success: false, message: `Cannot delete user: ${error.message}` }; }
            return { success: false, message: `Failed to delete user: ${error.message}` };
        }
        return { success: false, message: 'An unexpected error occurred.' };
    }
}

// --- Action: Create User (Admin) ---
// Adjust DTO based on backend requirements
interface AdminCreateUserRequestDTO {
    email: string;
    name: string;
    isAdmin?: boolean;
    // initialPassword?: string;
}

export async function createUserAction(formData: FormData): Promise<AdminUserResult> {
     if (!await verifyAdmin()) { return { success: false, message: "Permission denied." }; }

     const email = formData.get('email') as string;
     const name = formData.get('name') as string;
     const isAdminStr = formData.get('isAdmin') as string | null;

     if (!email || !name) { return { success: false, message: "Email and Name are required." }; }

     const requestData: AdminCreateUserRequestDTO = {
         email,
         name,
         isAdmin: isAdminStr === 'on',
     };

     try {
         const newUser = await apiClient<UserResponseDTO>(`/admin/users`, {
             method: 'POST',
             body: JSON.stringify(requestData),
         });

         revalidateTag('admin-users');

         console.log(`Admin created new user ${newUser.id}`);
         return { success: true, user: newUser, message: "User created successfully." };

     } catch (error) {
         console.error(`Admin error creating user:`, error);
         if (error instanceof APIError) {
             if (error.status === 409) { return { success: false, message: `Conflict: ${error.message}` }; }
             if (error.status === 400) { return { success: false, message: `Invalid input: ${error.message}` }; }
             return { success: false, message: `Failed to create user: ${error.message}` };
         }
         return { success: false, message: 'An unexpected error occurred.' };
     }
}