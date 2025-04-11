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
    CollectionType,
} from '@repo/types';
import { getIronSession } from 'iron-session';
import { SessionData, getUserSessionOptions } from '@repo/auth'; // Use user options

// --- Helper to get authenticated User ID ---
// Returns null if not authenticated
async function getAuthenticatedUserID(): Promise<string | null> {
     try {
        const session = await getIronSession<SessionData>(cookies(), getUserSessionOptions());
        return session.userId ?? null;
     } catch(error) {
        console.error("Error getting session in collection action:", error);
        return null;
     }
}
// --- End Helper ---

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

    // Basic server-side validation
    if (!requestData.title?.trim()) {
         return { success: false, message: "Collection title is required." };
    }
    if (!requestData.type || (requestData.type !== "COURSE" && requestData.type !== "PLAYLIST")) {
        return { success: false, message: "Valid collection type (COURSE or PLAYLIST) is required." };
    }
    // TODO: Validate format of initialTrackIds if provided

    try {
        // Backend endpoint for user collections is /audio/collections (auth determines ownership)
        const createdCollection = await apiClient<AudioCollectionResponseDTO>(`/audio/collections`, {
            method: 'POST',
            body: JSON.stringify(requestData),
            // Auth token is implicitly handled by apiClient cookies/fetch config
        });

        revalidateTag(`collections-${userId}`); // Invalidate user's collection list cache

        console.log(`Collection created for user ${userId}, collection ${createdCollection.id}`);
        return { success: true, collection: createdCollection, message: "Collection created successfully." };

    } catch (error) {
        console.error(`Error creating collection for user ${userId}:`, error);
         if (error instanceof APIError) {
             if (error.status === 400 && error.message?.includes('track IDs do not exist')) {
                  return { success: false, message: 'One or more initial tracks could not be found.' };
             }
              if (error.status === 401) { return { success: false, message: "Authentication required." }; }
             return { success: false, message: `Failed to create collection: ${error.message}` };
         }
         return { success: false, message: 'An unexpected error occurred while creating the collection.' };
    }
}

// --- Action: Update Collection Metadata ---
interface UpdateCollectionResult { success: boolean; message?: string; }
export async function updateCollectionMetadataAction(collectionId: string, requestData: UpdateCollectionRequestDTO): Promise<UpdateCollectionResult> {
    const userId = await getAuthenticatedUserID(); // Needed for tag invalidation
    if (!userId) { return { success: false, message: "User not authenticated." }; }
    if (!collectionId) { return { success: false, message: "Collection ID is required." }; }
    // Allow empty title/description if that's the intent of the update
    if (requestData.title === undefined && requestData.description === undefined) {
         return { success: false, message: "No update data provided (title or description required)."};
    }
    // Validate title length if provided
     if (requestData.title !== undefined && requestData.title !== null && requestData.title.length > 255) {
          return { success: false, message: "Title cannot exceed 255 characters."};
     }


     try {
        // Backend endpoint: PUT /audio/collections/{collectionId}
        // Backend handles ownership check based on authenticated user
        await apiClient<void>(`/audio/collections/${collectionId}`, {
            method: 'PUT',
            body: JSON.stringify(requestData),
        });

        // Invalidate caches
        revalidateTag(`collection-${collectionId}`); // Invalidate specific collection detail page/data
        revalidateTag(`collections-${userId}`); // Invalidate user's collection list (title might have changed)
        revalidatePath(`/collections/${collectionId}`); // Invalidate detail page path
        revalidatePath(`/collections/${collectionId}/edit`); // Invalidate edit page path

        console.log(`Collection metadata updated for ${collectionId}`);
        return { success: true, message: "Collection updated successfully." };

    } catch (error) {
        console.error(`Error updating collection metadata ${collectionId}:`, error);
         if (error instanceof APIError) {
            if (error.status === 404) { return { success: false, message: "Collection not found." }; }
            if (error.status === 403) { return { success: false, message: "Permission denied. You may not own this collection." }; }
             if (error.status === 401) { return { success: false, message: "Authentication required." }; }
             if (error.status === 400) { return { success: false, message: `Invalid input: ${error.message}` }; }
            return { success: false, message: `Failed to update collection: ${error.message}` };
        }
        return { success: false, message: 'An unexpected error occurred.' };
    }
}

// --- Action: Update Collection Tracks ---
export async function updateCollectionTracksAction(collectionId: string, requestData: UpdateCollectionTracksRequestDTO): Promise<UpdateCollectionResult> {
     const userId = await getAuthenticatedUserID(); // Needed for tag invalidation
     if (!userId) { return { success: false, message: "User not authenticated." }; }
     if (!collectionId) { return { success: false, message: "Collection ID is required." }; }
     // TODO: Optionally add UUID validation for track IDs client-side before sending

     try {
         // Backend endpoint: PUT /audio/collections/{collectionId}/tracks
         // Backend handles ownership and track existence checks
         await apiClient<void>(`/audio/collections/${collectionId}/tracks`, {
            method: 'PUT',
            body: JSON.stringify(requestData),
        });

        // Invalidate cache for this specific collection
        revalidateTag(`collection-${collectionId}`);
         revalidatePath(`/collections/${collectionId}`); // Invalidate detail page path

        console.log(`Collection tracks updated for ${collectionId}`);
        return { success: true, message: "Tracks updated successfully." };

    } catch (error) {
        console.error(`Error updating collection tracks ${collectionId}:`, error);
        if (error instanceof APIError) {
             if (error.status === 404) { return { success: false, message: "Collection or one/more specified tracks not found." }; }
             if (error.status === 403) { return { success: false, message: "Permission denied. You may not own this collection." }; }
             if (error.status === 401) { return { success: false, message: "Authentication required." }; }
             if (error.status === 400) { return { success: false, message: `Invalid input: ${error.message}` }; }
            return { success: false, message: `Failed to update tracks: ${error.message}` };
        }
        return { success: false, message: 'An unexpected error occurred.' };
    }
}


// --- Action: Delete Collection ---
export async function deleteCollectionAction(collectionId: string): Promise<UpdateCollectionResult> {
     const userId = await getAuthenticatedUserID(); // Needed for tag invalidation
     if (!userId) { return { success: false, message: "User not authenticated." }; }
     if (!collectionId) { return { success: false, message: "Collection ID is required." }; }

      try {
        // Backend endpoint: DELETE /audio/collections/{collectionId}
        // Backend handles ownership check
        await apiClient<void>(`/audio/collections/${collectionId}`, {
            method: 'DELETE',
        });

        // Invalidate caches
        revalidateTag(`collections-${userId}`); // Invalidate user's collection list
        revalidatePath(`/collections`); // Invalidate the collection list page path
        revalidatePath(`/collections/${collectionId}`); // Invalidate specific detail page path (will now 404)

        console.log(`Collection deleted for user ${userId}, collection ${collectionId}`);
        return { success: true, message: "Collection deleted." };

    } catch (error) {
        console.error(`Error deleting collection ${collectionId}:`, error);
         if (error instanceof APIError) {
             if (error.status === 404) { return { success: false, message: "Collection not found." }; }
             if (error.status === 403) { return { success: false, message: "Permission denied. You may not own this collection." }; }
             if (error.status === 401) { return { success: false, message: "Authentication required." }; }
            return { success: false, message: `Failed to delete collection: ${error.message}` };
        }
        return { success: false, message: 'An unexpected error occurred.' };
    }
}