// apps/admin-panel/_actions/adminUserActions.ts
'use server';

import { cookies } from 'next/headers';
import { revalidateTag, revalidatePath } from 'next/cache';
import apiClient, { APIError } from '@repo/api-client';
import type { UserResponseDTO } from '@repo/types'; // Assume backend returns UserDTO on update/create
import { getIronSession } from 'iron-session';
import type { SessionData } from '@repo/auth';

// --- Session Options (Admin) ---
const adminSessionOptions = { /* ... PASTE ADMIN SESSION OPTIONS ... */ };
if (!adminSessionOptions.password) { throw new Error("ADMIN_SESSION_SECRET missing"); }
// --- End Session Options ---

// --- Helper to verify admin status ---
async function verifyAdmin(): Promise<boolean> {
    try {
       const session = await getIronSession<SessionData>(cookies(), adminSessionOptions);
       return session.userId != null && session.userId != "" && session.isAdmin === true;
    } catch { return false; }
}

// --- Action Result Types ---
interface AdminActionResult { success: boolean; message?: string; }
interface AdminUserResult extends AdminActionResult { user?: UserResponseDTO;}

// --- Action: Update User (Example: Update name, potentially role later) ---
export async function updateUserAction(userId: string, formData: FormData): Promise<AdminActionResult> {
    if (!await verifyAdmin()) { return { success: false, message: "Permission denied." }; }

    const name = formData.get('name') as string;
    // Add other updatable fields like roles if needed

    if (!userId || !name) { return { success: false, message: "User ID and Name are required." }; }

    try {
        // Assuming a PUT /admin/users/{userId} endpoint exists
        await apiClient<UserResponseDTO>(`/admin/users/${userId}`, {
            method: 'PUT',
            body: JSON.stringify({ name }), // Send only updatable fields
        });

        revalidateTag('admin-users'); // Invalidate the general user list cache
        revalidateTag(`admin-user-${userId}`); // Invalidate specific user detail cache
        revalidatePath(`/users/${userId}`); // Invalidate specific user page path

        console.log(`Admin updated user ${userId}`);
        return { success: true, message: "User updated successfully." };

    } catch (error) {
        console.error(`Admin error updating user ${userId}:`, error);
         if (error instanceof APIError) {
             if (error.status === 404) { return { success: false, message: "User not found." }; }
             if (error.status === 403) { return { success: false, message: "Permission denied by backend." }; }
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
         // Assuming a DELETE /admin/users/{userId} endpoint exists
         await apiClient<void>(`/admin/users/${userId}`, { method: 'DELETE' });

        revalidateTag('admin-users'); // Invalidate list
         revalidatePath(`/users/${userId}`); // Invalidate detail page path

        console.log(`Admin deleted user ${userId}`);
        return { success: true, message: "User deleted successfully." };

    } catch (error) {
         console.error(`Admin error deleting user ${userId}:`, error);
         if (error instanceof APIError) {
             if (error.status === 404) { return { success: false, message: "User not found." }; }
             if (error.status === 403) { return { success: false, message: "Permission denied by backend." }; }
            return { success: false, message: `Failed to delete user: ${error.message}` };
        }
        return { success: false, message: 'An unexpected error occurred.' };
    }
}

// TODO: Add createUserAction if needed (might involve setting initial password or sending invite)