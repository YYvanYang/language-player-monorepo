// apps/admin-panel/_actions/adminUserActions.ts
'use server';

import { cookies } from 'next/headers';
import { revalidateTag, revalidatePath } from 'next/cache';
import apiClient, { APIError } from '@repo/api-client';
import type { UserResponseDTO, AdminUpdateUserRequestDTO } from '@repo/types'; // Use correct types
import { getAdminSessionOptions, SessionData } from '@repo/auth';
import { getIronSession } from 'iron-session';

// --- Helper to verify admin status ---
// Export it if used by other admin actions in this app
export async function verifyAdmin(): Promise<boolean> {
    try {
       const session = await getIronSession<SessionData>(cookies(), getAdminSessionOptions());
       return session.userId != null && session.userId !== "" && session.isAdmin === true;
    } catch { return false; }
}
// --- End Helper ---

// --- Action Result Types ---
export interface AdminActionResult { success: boolean; message?: string; }
export interface AdminUserResult extends AdminActionResult { user?: UserResponseDTO;}

// --- Action: Update User ---
// NOTE: The backend API route and request structure for admin user updates
// need to be defined. Assuming PUT /admin/users/{userId} and AdminUpdateUserRequestDTO.
export async function updateUserAction(userId: string, formData: FormData): Promise<AdminActionResult> {
    if (!await verifyAdmin()) { return { success: false, message: "Permission denied." }; }

    // Extract data from FormData
    const name = formData.get('name') as string;
    const email = formData.get('email') as string; // Allow updating email? Risky.
    const isAdminStr = formData.get('isAdmin') as string; // Get potential role update

    // Basic Validation
    if (!userId) { return { success: false, message: "User ID is required." }; }
    // Ensure required fields are present if they are being updated
    // Example: if (!name && ...) return { success: false, message: "Name is required if updating." };

    // Construct the request DTO based on backend expectations
    // Only include fields that are actually editable by admin
    const requestData: Partial<AdminUpdateUserRequestDTO> = {};
    if (name) requestData.name = name;
    if (email) requestData.email = email; // Careful with email updates
    // Handle boolean admin flag carefully
    if (isAdminStr !== null && isAdminStr !== undefined) {
         requestData.isAdmin = isAdminStr === 'on' || isAdminStr === 'true';
    }
    // Add other fields like roles, status etc. as needed

    if (Object.keys(requestData).length === 0) {
        return { success: false, message: "No fields provided for update." };
    }

    try {
        // Assuming a PUT /admin/users/{userId} endpoint exists
        await apiClient<UserResponseDTO>(`/admin/users/${userId}`, { // Update endpoint if needed
            method: 'PUT',
            body: JSON.stringify(requestData),
        });

        revalidateTag('admin-users'); // Invalidate the general user list cache
        revalidateTag(`admin-user-${userId}`); // Invalidate specific user detail cache
        revalidatePath(`/users/${userId}/edit`); // Invalidate edit page path

        console.log(`Admin updated user ${userId}`);
        return { success: true, message: "User updated successfully." };

    } catch (error) {
        console.error(`Admin error updating user ${userId}:`, error);
         if (error instanceof APIError) {
             if (error.status === 404) { return { success: false, message: "User not found." }; }
             if (error.status === 403) { return { success: false, message: "Permission denied by backend." }; }
             if (error.status === 400) { return { success: false, message: `Invalid input: ${error.message}` }; }
             if (error.status === 409) { return { success: false, message: `Conflict: ${error.message}` }; } // e.g., Email conflict on update
            return { success: false, message: `Failed to update user: ${error.message}` };
        }
        return { success: false, message: 'An unexpected error occurred.' };
    }
}

// --- Action: Delete User ---
export async function deleteUserAction(userId: string): Promise<AdminActionResult> {
    if (!await verifyAdmin()) { return { success: false, message: "Permission denied." }; }
    if (!userId) { return { success: false, message: "User ID is required." }; }

     // **Critical Check:** Prevent admin from deleting themselves? Depends on requirements.
     // const session = await getIronSession<SessionData>(cookies(), getAdminSessionOptions());
     // if (session.userId === userId) { return { success: false, message: "Cannot delete your own account." }; }

    try {
         // Assuming a DELETE /admin/users/{userId} endpoint exists
         // Backend should handle cascading deletes or blocking deletion based on dependencies
         await apiClient<void>(`/admin/users/${userId}`, { method: 'DELETE' });

         revalidateTag('admin-users'); // Invalidate list
         revalidatePath(`/users/${userId}/edit`); // Invalidate edit page path

        console.log(`Admin deleted user ${userId}`);
        return { success: true, message: "User deleted successfully." };

    } catch (error) {
         console.error(`Admin error deleting user ${userId}:`, error);
         if (error instanceof APIError) {
             if (error.status === 404) { return { success: false, message: "User not found." }; }
             if (error.status === 403) { return { success: false, message: "Permission denied by backend." }; }
             if (error.status === 409) { return { success: false, message: `Cannot delete user: ${error.message}` }; } // e.g., User has critical resources
            return { success: false, message: `Failed to delete user: ${error.message}` };
        }
        return { success: false, message: 'An unexpected error occurred.' };
    }
}

// --- Action: Create User (Admin) ---
// This often involves more complex logic like setting initial passwords or sending invites.
// Define based on backend capabilities. Assuming simple creation for now.
interface AdminCreateUserRequestDTO {
    email: string;
    name: string;
    isAdmin?: boolean; // Allow setting admin status on creation
    // Add initial password field if required by backend
    // initialPassword?: string;
}

export async function createUserAction(formData: FormData): Promise<AdminUserResult> {
     if (!await verifyAdmin()) { return { success: false, message: "Permission denied." }; }

     const email = formData.get('email') as string;
     const name = formData.get('name') as string;
     const isAdminStr = formData.get('isAdmin') as string;

     if (!email || !name) { return { success: false, message: "Email and Name are required." }; }
     // Add password validation if applicable

     const requestData: AdminCreateUserRequestDTO = {
         email,
         name,
         isAdmin: isAdminStr === 'on' || isAdminStr === 'true',
         // initialPassword: ...
     };

     try {
         // Assuming POST /admin/users endpoint
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
             if (error.status === 409) { return { success: false, message: `Conflict: ${error.message}` }; } // e.g., Email exists
             if (error.status === 400) { return { success: false, message: `Invalid input: ${error.message}` }; }
             return { success: false, message: `Failed to create user: ${error.message}` };
         }
         return { success: false, message: 'An unexpected error occurred.' };
     }
}