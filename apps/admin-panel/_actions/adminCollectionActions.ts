// apps/admin-panel/_actions/adminCollectionActions.ts
'use server';

import { cookies } from 'next/headers'; // Import cookies
import { revalidateTag, revalidatePath } from 'next/cache';
import apiClient, { APIError } from '@repo/api-client';
import type {
    AudioCollectionResponseDTO,
    CreateCollectionRequestDTO,
    UpdateCollectionRequestDTO,
    UpdateCollectionTracksRequestDTO,
} from '@repo/types';
import { getAdminSessionOptions, SessionData } from '@repo/auth'; // Use admin options
import { getIronSession } from 'iron-session';

// --- Helper to verify admin status ---
async function verifyAdmin(): Promise<boolean> {
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
export interface AdminCollectionResult extends AdminActionResult { collection?: AudioCollectionResponseDTO; }

// --- Action: Create Collection ---
// Note: Admin might have different validation or default settings than user creation
export async function createCollectionAction(requestData: CreateCollectionRequestDTO): Promise<AdminCollectionResult> {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) { return { success: false, message: "Permission denied." }; }

    // Basic server-side validation
    if (!requestData.title || !requestData.type) {
        return { success: false, message: "Title and type are required." };
    }
    if (requestData.type !== "COURSE" && requestData.type !== "PLAYLIST") {
        return { success: false, message: "Invalid collection type." };
    }
    // TODO: Add validation for initialTrackIds format here if needed

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
            if (error.status === 400 && error.message?.includes('track IDs do not exist')) {
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
    const isAdmin = await verifyAdmin();
    if (!isAdmin) { return { success: false, message: "Permission denied." }; }
    if (!collectionId) { return { success: false, message: "Collection ID is required." }; }
    // Allow updating title/description to empty string, but ensure at least one field is attempted to be updated
    if (requestData.title === undefined && requestData.description === undefined) {
         return { success: false, message: "No update data provided (title or description required)."};
    }

    try {
        // Assuming endpoint `/admin/audio/collections/{collectionId}` for metadata update
        // Backend likely returns 204 No Content or the updated resource
        await apiClient<void | AudioCollectionResponseDTO>(`/admin/audio/collections/${collectionId}`, {
            method: 'PUT',
            body: JSON.stringify(requestData),
        });

        revalidateTag('admin-collections'); // Invalidate list view
        revalidateTag(`admin-collection-${collectionId}`); // Invalidate detail view/cache
        revalidatePath(`/collections/${collectionId}/edit`); // Invalidate edit page path
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
    const isAdmin = await verifyAdmin();
    if (!isAdmin) { return { success: false, message: "Permission denied." }; }
    if (!collectionId) { return { success: false, message: "Collection ID is required." }; }
    // TODO: Add validation for UUIDs in requestData.orderedTrackIds if needed

    try {
        // Assuming endpoint `/admin/audio/collections/{collectionId}/tracks`
        // Backend likely returns 204 No Content
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
    const isAdmin = await verifyAdmin();
    if (!isAdmin) { return { success: false, message: "Permission denied." }; }
    if (!collectionId) { return { success: false, message: "Collection ID is required." }; }

    try {
        // Assuming endpoint `/admin/audio/collections/{collectionId}`
        // Backend returns 204 No Content
        await apiClient<void>(`/admin/audio/collections/${collectionId}`, { method: 'DELETE' });

        revalidateTag('admin-collections'); // Invalidate list view
        revalidatePath(`/collections/${collectionId}`); // Invalidate detail page path (it will 404 now)

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