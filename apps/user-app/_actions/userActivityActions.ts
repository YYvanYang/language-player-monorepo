// apps/user-app/_actions/userActivityActions.ts
'use server';

import { cookies } from 'next/headers';
import { revalidateTag, revalidatePath } from 'next/cache';
import apiClient, { APIError } from '@repo/api-client';
import type { RecordProgressRequestDTO, CreateBookmarkRequestDTO, BookmarkResponseDTO } from '@repo/types';
import { getIronSession } from 'iron-session';
import { SessionData, getUserSessionOptions } from '@repo/auth'; // Use user options

// --- Helper to get authenticated User ID ---
async function getAuthenticatedUserID(): Promise<string | null> {
     try {
        const session = await getIronSession<SessionData>(cookies(), getUserSessionOptions());
        return session.userId ?? null;
     } catch(error) {
        console.error("Error getting session in user activity action:", error);
        return null;
     }
}
// --- End Helper ---

// --- Action: Record Progress ---
export async function recordProgressAction(trackId: string, progressMs: number): Promise<{ success: boolean; message?: string }> {
    const userId = await getAuthenticatedUserID();
    if (!userId) {
        // Allow unauthenticated users to call this but do nothing? Or return error?
        // Returning success but doing nothing might be simpler for the UI.
        // console.log("Record progress skipped: User not authenticated.");
        // return { success: true };
        // OR require auth:
        return { success: false, message: "User not authenticated." };
    }

    if (!trackId || progressMs < 0) {
         console.warn(`Invalid progress data: trackId=${trackId}, progressMs=${progressMs}`);
         return { success: false, message: "Invalid track ID or progress value." };
    }

    const requestData: RecordProgressRequestDTO = { trackId, progressMs };

    try {
        // Endpoint: POST /users/me/progress
        // Backend expects 204 No Content on success
        await apiClient<void>(`/users/me/progress`, {
             method: 'POST',
             body: JSON.stringify(requestData),
         });

        // console.log(`Progress recorded for user ${userId}, track ${trackId}: ${progressMs}ms`);
        // Optionally revalidate progress-related data if other components display it
        // revalidateTag(`progress-${userId}`);
        // revalidateTag(`progress-${userId}-${trackId}`);
        return { success: true };

    } catch (error) {
        // Don't log overly verbose errors for progress updates if they happen frequently
        // console.error(`Error recording progress for user ${userId}, track ${trackId}:`, error);
        if (error instanceof APIError) {
             // Handle specific errors like 404 Not Found for the track if needed
             if(error.status === 404) { return { success: false, message: "Track not found." }; }
             if (error.status === 401) { return { success: false, message: "Authentication required." }; }
            return { success: false, message: `Failed to record progress: ${error.message}` };
        }
        return { success: false, message: 'Could not save progress.' };
    }
}

// --- Action: Create Bookmark ---
interface CreateBookmarkResult {
    success: boolean;
    message?: string;
    bookmark?: BookmarkResponseDTO; // Return the created bookmark DTO
}
export async function createBookmarkAction(trackId: string, timestampMs: number, note?: string | null): Promise<CreateBookmarkResult> {
     const userId = await getAuthenticatedUserID();
     if (!userId) { return { success: false, message: "User not authenticated." }; }
     if (!trackId || timestampMs < 0) { return { success: false, message: "Invalid track ID or timestamp value." }; }

     const requestData: CreateBookmarkRequestDTO = { trackId, timestampMs, note: note ?? undefined }; // Ensure null/empty note is handled

     try {
         // Endpoint: POST /users/me/bookmarks
         const createdBookmark = await apiClient<BookmarkResponseDTO>(`/users/me/bookmarks`, {
             method: 'POST',
             body: JSON.stringify(requestData),
         });

         // Invalidate relevant TanStack Query caches or Next.js cache tags
         revalidateTag(`bookmarks-${userId}`); // Invalidate user's general bookmark list
         revalidateTag(`bookmarks-${userId}-${trackId}`); // Invalidate specific track bookmark list
         // Invalidate track detail page if it shows bookmarks
         revalidatePath(`/tracks/${trackId}`);

         console.log(`Bookmark created for user ${userId}, track ${trackId}`);
         return { success: true, bookmark: createdBookmark, message: "Bookmark added." };

     } catch (error) {
        console.error(`Error creating bookmark for user ${userId}, track ${trackId}:`, error);
        if (error instanceof APIError) {
             if(error.status === 404) { return { success: false, message: "Track not found." }; }
              if (error.status === 401) { return { success: false, message: "Authentication required." }; }
             if (error.status === 400) { return { success: false, message: `Invalid input: ${error.message}` }; }
            return { success: false, message: `Failed to create bookmark: ${error.message}` };
        }
        return { success: false, message: 'An unexpected error occurred while creating the bookmark.' };
     }
}

// --- Action: Delete Bookmark ---
interface DeleteBookmarkResult {
     success: boolean;
     message?: string;
}
export async function deleteBookmarkAction(bookmarkId: string): Promise<DeleteBookmarkResult> {
     const userId = await getAuthenticatedUserID(); // Needed for tag invalidation
     if (!userId) { return { success: false, message: "User not authenticated." }; }
     if (!bookmarkId) { return { success: false, message: "Bookmark ID is required." }; }

     try {
         // Endpoint: DELETE /users/me/bookmarks/{bookmarkId}
         // Backend handles ownership check
         await apiClient<void>(`/users/me/bookmarks/${bookmarkId}`, { method: 'DELETE' });

         // Invalidate caches
         // We need the trackId associated with the bookmark to invalidate the specific track's list effectively.
         // Option 1: Pass trackId to this action (might require UI change).
         // Option 2: Invalidate all bookmark lists for the user (less precise).
         revalidateTag(`bookmarks-${userId}`); // Invalidate user's general bookmark list
         // If trackId was passed: revalidateTag(`bookmarks-${userId}-${trackId}`);
         // Invalidate the main bookmarks page path
         revalidatePath(`/bookmarks`);
         // Invalidate track detail page path if it shows bookmarks (need trackId)
         // revalidatePath(`/tracks/${trackId}`);


         console.log(`Bookmark deleted for user ${userId}, bookmark ${bookmarkId}`);
         return { success: true, message: "Bookmark deleted." };

     } catch (error) {
         console.error(`Error deleting bookmark ${bookmarkId} for user ${userId}:`, error);
         if (error instanceof APIError) {
              if(error.status === 404) { return { success: false, message: "Bookmark not found." }; }
              if(error.status === 403) { return { success: false, message: "Permission denied. You may not own this bookmark." }; }
              if (error.status === 401) { return { success: false, message: "Authentication required." }; }
             return { success: false, message: `Failed to delete bookmark: ${error.message}` };
         }
         return { success: false, message: 'An unexpected error occurred while deleting the bookmark.' };
     }
}