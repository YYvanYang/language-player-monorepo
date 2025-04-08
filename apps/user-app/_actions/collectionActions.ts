// apps/user-app/_actions/collectionActions.ts
'use server';

import { cookies } from 'next/headers';
import { revalidateTag, revalidatePath } from 'next/cache';
import apiClient, { APIError } from '@repo/api-client';
import type {
    CreateCollectionRequestDTO,
    UpdateCollectionRequestDTO,
    UpdateCollectionTracksRequestDTO,
    AudioCollectionResponseDTO,
} from '@repo/types';
import { getIronSession } from 'iron-session';
import type { SessionData } from '@repo/auth'; // Or define locally

// --- Session Options (Duplicate or import) ---
const sessionOptions = { /* ... PASTE USER SESSION OPTIONS ... */ };
if (!sessionOptions.password) { throw new Error("USER_SESSION_SECRET missing for server action"); }
// --- End Session Options ---

async function getAuthenticatedUserID(): Promise<string | null> { /* ... Same helper as before ... */ }

// --- Action: Create Collection ---
interface CreateCollectionResult {
    success: boolean;
    message?: string;
    collection?: AudioCollectionResponseDTO; // Return created collection DTO
}
export async function createCollectionAction(requestData: CreateCollectionRequestDTO): Promise<CreateCollectionResult> {
    const userId = await getAuthenticatedUserID();
    if (!userId) {
        return { success: false, message: "User not authenticated." };
    }

    // Basic server-side validation (more can be added)
    if (!requestData.title || !requestData.type) {
         return { success: false, message: "Title and type are required." };
    }
    if (requestData.type !== "COURSE" && requestData.type !== "PLAYLIST") {
        return { success: false, message: "Invalid collection type." };
    }

    try {
        const createdCollection = await apiClient<AudioCollectionResponseDTO>(`/audio/collections`, {
            method: 'POST',
            body: JSON.stringify(requestData),
        });

        revalidateTag(`collections-${userId}`); // Invalidate user's collection list
        // Revalidating individual track caches isn't usually needed when just associating them

        console.log(`Collection created for user ${userId}, collection ${createdCollection.id}`);
        return { success: true, collection: createdCollection };

    } catch (error) {
        console.error(`Error creating collection for user ${userId}:`, error);
         if (error instanceof APIError) {
             if (error.status === 400 && error.message.includes('track IDs do not exist')) {
                 // Handle specific backend error if initial tracks are invalid
                  return { success: false, message: 'One or more initial tracks could not be found.' };
             }
             return { success: false, message: `Failed to create collection: ${error.message}` };
         }
         return { success: false, message: 'An unexpected error occurred while creating the collection.' };
    }
}

// --- Action: Update Collection Metadata ---
interface UpdateCollectionResult { success: boolean; message?: string; }
export async function updateCollectionMetadataAction(collectionId: string, requestData: UpdateCollectionRequestDTO): Promise<UpdateCollectionResult> {
    const userId = await getAuthenticatedUserID(); // Although ownership checked by backend, useful for logging/tags
    if (!userId) { return { success: false, message: "User not authenticated." }; }
    if (!collectionId) { return { success: false, message: "Collection ID is required." }; }
    if (!requestData.title && !requestData.description) { return { success: false, message: "No update data provided."}; } // Or allow empty updates?

     try {
        // Backend returns 204 No Content on success
        await apiClient<void>(`/audio/collections/${collectionId}`, {
            method: 'PUT', // Assuming PUT for metadata update
            body: JSON.stringify(requestData),
        });

        revalidateTag(`collection-${collectionId}`); // Invalidate specific collection detail
        revalidateTag(`collections-${userId}`); // Invalidate user's list as title might change

        console.log(`Collection metadata updated for ${collectionId}`);
        return { success: true };

    } catch (error) {
        console.error(`Error updating collection metadata ${collectionId}:`, error);
         if (error instanceof APIError) {
            if (error.status === 404) { return { success: false, message: "Collection not found." }; }
            if (error.status === 403) { return { success: false, message: "Permission denied." }; }
            return { success: false, message: `Failed to update collection: ${error.message}` };
        }
        return { success: false, message: 'An unexpected error occurred.' };
    }
}

// --- Action: Update Collection Tracks ---
export async function updateCollectionTracksAction(collectionId: string, requestData: UpdateCollectionTracksRequestDTO): Promise<UpdateCollectionResult> {
     const userId = await getAuthenticatedUserID();
     if (!userId) { return { success: false, message: "User not authenticated." }; }
     if (!collectionId) { return { success: false, message: "Collection ID is required." }; }
     // Validation for track IDs format happens in DTO/handler usually

     try {
        // Backend returns 204 No Content
        await apiClient<void>(`/audio/collections/${collectionId}/tracks`, {
            method: 'PUT',
            body: JSON.stringify(requestData),
        });

        revalidateTag(`collection-${collectionId}`); // Invalidate specific collection detail

        console.log(`Collection tracks updated for ${collectionId}`);
        return { success: true };

    } catch (error) {
        console.error(`Error updating collection tracks ${collectionId}:`, error);
        if (error instanceof APIError) {
             if (error.status === 404) { return { success: false, message: "Collection or one/more tracks not found." }; }
             if (error.status === 403) { return { success: false, message: "Permission denied." }; }
             if (error.status === 400) { return { success: false, message: `Invalid input: ${error.message}` }; }
            return { success: false, message: `Failed to update tracks: ${error.message}` };
        }
        return { success: false, message: 'An unexpected error occurred.' };
    }
}


// --- Action: Delete Collection ---
export async function deleteCollectionAction(collectionId: string): Promise<UpdateCollectionResult> {
     const userId = await getAuthenticatedUserID();
     if (!userId) { return { success: false, message: "User not authenticated." }; }
     if (!collectionId) { return { success: false, message: "Collection ID is required." }; }

      try {
        // Backend returns 204 No Content
        await apiClient<void>(`/audio/collections/${collectionId}`, {
            method: 'DELETE',
        });

        revalidateTag(`collections-${userId}`); // Invalidate user's collection list
         // Note: Also need to invalidate the specific collection page if user could navigate back
         revalidatePath(`/collections/${collectionId}`); // Invalidate specific path

        console.log(`Collection deleted for user ${userId}, collection ${collectionId}`);
        return { success: true };

    } catch (error) {
        console.error(`Error deleting collection ${collectionId}:`, error);
         if (error instanceof APIError) {
             if (error.status === 404) { return { success: false, message: "Collection not found." }; }
             if (error.status === 403) { return { success: false, message: "Permission denied." }; }
            return { success: false, message: `Failed to delete collection: ${error.message}` };
        }
        return { success: false, message: 'An unexpected error occurred.' };
    }
}