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
import { SessionData, getUserSessionOptions } from '@repo/auth';
import { getDecryptedAccessToken } from '@/_lib/server-utils'; // Import the helper

// --- Helper to get User ID (Optional, can combine with token fetch) ---
async function getAuthenticatedUserID(): Promise<string | null> {
     try {
        const cookieStore = await cookies();
        const session = await getIronSession<SessionData>(cookieStore, getUserSessionOptions());
        return session.userId ?? null;
     } catch(error) {
        console.error("Error getting session userId in collection action:", error);
        return null;
     }
}
// --- End Helper ---

// --- Action Result Types ---
interface CreateCollectionResult {
    success: boolean;
    message?: string;
    collection?: AudioCollectionResponseDTO;
}
interface UpdateCollectionResult { success: boolean; message?: string; }

// --- Action: Create Collection ---
export async function createCollectionAction(requestData: CreateCollectionRequestDTO): Promise<CreateCollectionResult> {
    // Combine user ID and token fetching
    const accessToken = await getDecryptedAccessToken();
    if (!accessToken) {
        return { success: false, message: "Authentication required." };
    }
    const userId = (await getAuthenticatedUserID())!; // Should exist if token exists

    // Basic server-side validation
    if (!requestData.title?.trim()) {
         console.log("Collection title is required.", requestData.title);
         return { success: false, message: "Collection title is required." };
    }
    if (!requestData.type || (requestData.type !== "COURSE" && requestData.type !== "PLAYLIST")) {
        return { success: false, message: "Valid collection type (COURSE or PLAYLIST) is required." };
    }
    // TODO: Validate format of initialTrackIds if provided

    try {
        // Call apiClient with the DIRECT backend endpoint and the ACCESS TOKEN
        const createdCollection = await apiClient<AudioCollectionResponseDTO>(
            `/audio/collections`, // Direct backend endpoint
            {
                method: 'POST',
                body: JSON.stringify(requestData),
            },
            accessToken // Pass the decrypted token
        );

        revalidateTag(`collections-${userId}`);
        console.log(`Collection created for user ${userId}, collection ${createdCollection.id}`);
        return { success: true, collection: createdCollection, message: "Collection created successfully." };

    } catch (error) {
        console.error(`Error creating collection for user ${userId}:`, error);
         if (error instanceof APIError) {
             // Check for 401 specifically - means the token passed was invalid/expired
             if (error.status === 401) {
                 return { success: false, message: "Authentication failed: Invalid session token." };
             }
             if (error.status === 400 && error.message?.includes('track IDs do not exist')) {
                  return { success: false, message: 'One or more initial tracks could not be found.' };
             }
             return { success: false, message: `Failed to create collection: ${error.message}` };
         }
         return { success: false, message: 'An unexpected error occurred while creating the collection.' };
    }
}

// --- Action: Update Collection Metadata ---
export async function updateCollectionMetadataAction(collectionId: string, requestData: UpdateCollectionRequestDTO): Promise<UpdateCollectionResult> {
    const accessToken = await getDecryptedAccessToken();
    if (!accessToken) { return { success: false, message: "Authentication required." }; }
    const userId = (await getAuthenticatedUserID())!; // For cache invalidation

    if (!collectionId) { return { success: false, message: "Collection ID is required." }; }
    if (requestData.title === undefined && requestData.description === undefined) {
         return { success: false, message: "No update data provided."};
    }
     if (requestData.title !== undefined && requestData.title !== null && requestData.title.length > 255) {
          return { success: false, message: "Title cannot exceed 255 characters."};
     }

     try {
        // Call direct backend endpoint with token
        await apiClient<void>(
            `/audio/collections/${collectionId}`, // Direct endpoint
            {
                method: 'PUT',
                body: JSON.stringify(requestData),
            },
            accessToken // Pass token
        );

        revalidateTag(`collection-${collectionId}`);
        revalidateTag(`collections-${userId}`);
        revalidatePath(`/collections/${collectionId}`);
        revalidatePath(`/collections/${collectionId}/edit`);

        console.log(`Collection metadata updated for ${collectionId}`);
        return { success: true, message: "Collection updated successfully." };

    } catch (error) {
        console.error(`Error updating collection metadata ${collectionId}:`, error);
         if (error instanceof APIError) {
            if (error.status === 401) { return { success: false, message: "Authentication failed: Invalid session token." }; }
            if (error.status === 404) { return { success: false, message: "Collection not found." }; }
            if (error.status === 403) { return { success: false, message: "Permission denied. You may not own this collection." }; }
            if (error.status === 400) { return { success: false, message: `Invalid input: ${error.message}` }; }
            return { success: false, message: `Failed to update collection: ${error.message}` };
        }
        return { success: false, message: 'An unexpected error occurred.' };
    }
}

// --- Action: Update Collection Tracks ---
export async function updateCollectionTracksAction(collectionId: string, requestData: UpdateCollectionTracksRequestDTO): Promise<UpdateCollectionResult> {
     const accessToken = await getDecryptedAccessToken();
     if (!accessToken) { return { success: false, message: "Authentication required." }; }
     const userId = (await getAuthenticatedUserID())!;

     if (!collectionId) { return { success: false, message: "Collection ID is required." }; }

     try {
         // Call direct backend endpoint with token
         await apiClient<void>(
             `/audio/collections/${collectionId}/tracks`, // Direct endpoint
             {
                method: 'PUT',
                body: JSON.stringify(requestData),
             },
             accessToken // Pass token
         );

        revalidateTag(`collection-${collectionId}`);
        revalidatePath(`/collections/${collectionId}`);
        // Optionally invalidate user's list if order matters there
        // revalidateTag(`collections-${userId}`);

        console.log(`Collection tracks updated for ${collectionId}`);
        return { success: true, message: "Tracks updated successfully." };

    } catch (error) {
        console.error(`Error updating collection tracks ${collectionId}:`, error);
        if (error instanceof APIError) {
             if (error.status === 401) { return { success: false, message: "Authentication failed: Invalid session token." }; }
             if (error.status === 404) { return { success: false, message: "Collection or one/more specified tracks not found." }; }
             if (error.status === 403) { return { success: false, message: "Permission denied. You may not own this collection." }; }
             if (error.status === 400) { return { success: false, message: `Invalid input: ${error.message}` }; }
            return { success: false, message: `Failed to update tracks: ${error.message}` };
        }
        return { success: false, message: 'An unexpected error occurred.' };
    }
}

// --- Action: Delete Collection ---
export async function deleteCollectionAction(collectionId: string): Promise<UpdateCollectionResult> {
     const accessToken = await getDecryptedAccessToken();
     if (!accessToken) { return { success: false, message: "Authentication required." }; }
     const userId = (await getAuthenticatedUserID())!;

     if (!collectionId) { return { success: false, message: "Collection ID is required." }; }

      try {
        // Call direct backend endpoint with token
        await apiClient<void>(
            `/audio/collections/${collectionId}`, // Direct endpoint
            { method: 'DELETE' },
            accessToken // Pass token
        );

        revalidateTag(`collections-${userId}`);
        revalidatePath(`/collections`);
        revalidatePath(`/collections/${collectionId}`); // Invalidate deleted path

        console.log(`Collection deleted for user ${userId}, collection ${collectionId}`);
        return { success: true, message: "Collection deleted." };

    } catch (error) {
        console.error(`Error deleting collection ${collectionId}:`, error);
         if (error instanceof APIError) {
             if (error.status === 401) { return { success: false, message: "Authentication failed: Invalid session token." }; }
             if (error.status === 404) { return { success: false, message: "Collection not found." }; }
             if (error.status === 403) { return { success: false, message: "Permission denied. You may not own this collection." }; }
            return { success: false, message: `Failed to delete collection: ${error.message}` };
        }
        return { success: false, message: 'An unexpected error occurred.' };
    }
}