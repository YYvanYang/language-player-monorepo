// apps/admin-panel/_actions/adminCollectionActions.ts
'use server';

import { cookies } from 'next/headers';
import { revalidateTag, revalidatePath } from 'next/cache';
import apiClient, { APIError } from '@repo/api-client';
import type {
    AudioCollectionResponseDTO,
    CreateCollectionRequestDTO, // Assuming admin uses the same creation DTO
    UpdateCollectionRequestDTO,
    UpdateCollectionTracksRequestDTO
} from '@repo/types';
import { getIronSession } from 'iron-session';
import type { SessionData } from '@repo/auth'; // Or define locally

// --- Session Options (Admin) ---
// !! IMPORTANT: Ensure these EXACTLY match the ones in admin middleware and session route !!
const adminSessionOptions = {
    cookieName: process.env.ADMIN_SESSION_NAME || 'admin_panel_auth_session',
    password: process.env.ADMIN_SESSION_SECRET!, // MUST be set
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'strict', // Recommended for admin
        maxAge: undefined, // Session cookie
    },
};
if (!adminSessionOptions.password) {
    throw new Error("ADMIN_SESSION_SECRET environment variable is not set for server actions!");
}
// --- End Session Options ---

// --- Helper to verify admin status ---
async function verifyAdmin(): Promise<{ isAdmin: boolean; userId?: string }> {
    try {
        const session = await getIronSession<SessionData>(cookies(), adminSessionOptions);
        const isAdmin = session.userId != null && session.userId != "" && session.isAdmin === true;
        return { isAdmin, userId: session.userId };
    } catch (error) {
        console.error("Error verifying admin session in action:", error);
        return { isAdmin: false };
    }
}

// --- Action Result Types ---
interface AdminActionResult { success: boolean; message?: string; }
interface AdminCollectionResult extends AdminActionResult { collection?: AudioCollectionResponseDTO; }

// --- Action: Create Collection ---
// Note: Admin might have different validation or default settings than user creation
export async function createCollectionAction(requestData: CreateCollectionRequestDTO): Promise<AdminCollectionResult> {
    const { isAdmin } = await verifyAdmin();
    if (!isAdmin) { return { success: false, message: "Permission denied." }; }

    // Basic server-side validation
    if (!requestData.title || !requestData.type) {
        return { success: false, message: "Title and type are required." };
    }
    if (requestData.type !== "COURSE" && requestData.type !== "PLAYLIST") {
        return { success: false, message: "Invalid collection type." };
    }
    // Could add validation for initialTrackIds format here if needed

    try {
        // Assuming a dedicated admin endpoint `/admin/audio/collections`
        const createdCollection = await apiClient<AudioCollectionResponseDTO>(`/admin/audio/collections`, {
            method: 'POST',
            body: JSON.stringify(requestData),
        });

        revalidateTag('admin-collections'); // Invalidate the general collection list cache for admins

        console.log(`Admin created collection ${createdCollection.id}`);
        return { success: true, collection: createdCollection, message: "Collection created successfully." };

    } catch (error) {
        console.error(`Admin error creating collection:`, error);
        if (error instanceof APIError) {
            // Handle specific backend errors if applicable
            if (error.status === 400 && error.message.includes('track IDs do not exist')) {
                 return { success: false, message: 'One or more initial tracks could not be found.' };
            }
            if (error.status === 403) { return { success: false, message: "Permission denied by backend." }; }
            return { success: false, message: `Failed to create collection: ${error.message}` };
        }
        return { success: false, message: 'An unexpected error occurred while creating the collection.' };
    }
}

// --- Action: Update Collection Metadata ---
export async function updateCollectionMetadataAction(collectionId: string, requestData: UpdateCollectionRequestDTO): Promise<AdminActionResult> {
    const { isAdmin } = await verifyAdmin();
    if (!isAdmin) { return { success: false, message: "Permission denied." }; }
    if (!collectionId) { return { success: false, message: "Collection ID is required." }; }
    if (!requestData.title && requestData.description == null) { // Check if description is explicitly null too
         return { success: false, message: "No update data provided (title or description required)."};
    }

    try {
        // Assuming endpoint `/admin/audio/collections/{collectionId}` for metadata update
        await apiClient<void>(`/admin/audio/collections/${collectionId}`, {
            method: 'PUT',
            body: JSON.stringify(requestData),
        });

        revalidateTag('admin-collections'); // Invalidate list view
        revalidateTag(`admin-collection-${collectionId}`); // Invalidate detail view/cache
        revalidatePath(`/collections/${collectionId}`); // Invalidate detail page path

        console.log(`Admin updated collection metadata ${collectionId}`);
        return { success: true, message: "Collection updated successfully." };

    } catch (error) {
        console.error(`Admin error updating collection metadata ${collectionId}:`, error);
        if (error instanceof APIError) {
            if (error.status === 404) { return { success: false, message: "Collection not found." }; }
            if (error.status === 403) { return { success: false, message: "Permission denied by backend." }; }
            if (error.status === 400) { return { success: false, message: `Invalid input: ${error.message}` }; }
            return { success: false, message: `Failed to update collection: ${error.message}` };
        }
        return { success: false, message: 'An unexpected error occurred.' };
    }
}

// --- Action: Update Collection Tracks ---
export async function updateCollectionTracksAction(collectionId: string, requestData: UpdateCollectionTracksRequestDTO): Promise<AdminActionResult> {
    const { isAdmin } = await verifyAdmin();
    if (!isAdmin) { return { success: false, message: "Permission denied." }; }
    if (!collectionId) { return { success: false, message: "Collection ID is required." }; }
    // Add validation for UUIDs in requestData.orderedTrackIds if needed

    try {
        // Assuming endpoint `/admin/audio/collections/{collectionId}/tracks`
        await apiClient<void>(`/admin/audio/collections/${collectionId}/tracks`, {
            method: 'PUT',
            body: JSON.stringify(requestData),
        });

        revalidateTag(`admin-collection-${collectionId}`); // Invalidate detail view/cache
        // List view might not need invalidation unless it shows track count directly

        console.log(`Admin updated collection tracks for ${collectionId}`);
        return { success: true, message: "Collection tracks updated successfully." };

    } catch (error) {
        console.error(`Admin error updating collection tracks ${collectionId}:`, error);
        if (error instanceof APIError) {
            if (error.status === 404) { return { success: false, message: "Collection or one/more tracks not found." }; }
            if (error.status === 403) { return { success: false, message: "Permission denied by backend." }; }
            if (error.status === 400) { return { success: false, message: `Invalid input: ${error.message}` }; }
            return { success: false, message: `Failed to update tracks: ${error.message}` };
        }
        return { success: false, message: 'An unexpected error occurred.' };
    }
}


// --- Action: Delete Collection ---
export async function deleteCollectionAction(collectionId: string): Promise<AdminActionResult> {
    const { isAdmin } = await verifyAdmin();
    if (!isAdmin) { return { success: false, message: "Permission denied." }; }
    if (!collectionId) { return { success: false, message: "Collection ID is required." }; }

    try {
        // Assuming endpoint `/admin/audio/collections/{collectionId}`
        await apiClient<void>(`/admin/audio/collections/${collectionId}`, { method: 'DELETE' });

        revalidateTag('admin-collections'); // Invalidate list view
        revalidatePath(`/collections/${collectionId}`); // Invalidate detail page path

        console.log(`Admin deleted collection ${collectionId}`);
        return { success: true, message: "Collection deleted successfully." };

    } catch (error) {
        console.error(`Admin error deleting collection ${collectionId}:`, error);
        if (error instanceof APIError) {
            if (error.status === 404) { return { success: false, message: "Collection not found." }; }
            if (error.status === 403) { return { success: false, message: "Permission denied by backend." }; }
            return { success: false, message: `Failed to delete collection: ${error.message}` };
        }
        return { success: false, message: 'An unexpected error occurred.' };
    }
}