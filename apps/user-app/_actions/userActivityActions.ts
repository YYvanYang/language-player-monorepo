// apps/user-app/_actions/userActivityActions.ts
'use server';

import { cookies } from 'next/headers'; // Import cookies
import { revalidateTag, revalidatePath } from 'next/cache';
import apiClient, { APIError } from '@repo/api-client';
import type { RecordProgressRequestDTO, CreateBookmarkRequestDTO, BookmarkResponseDTO } from '@repo/types';
import { getIronSession } from 'iron-session';
import { SessionData, getUserSessionOptions } from '@repo/auth'; // Use user options

// --- Helper to get authenticated User ID ---
async function getAuthenticatedUserID(): Promise<string | null> {
     try {
        // --- FIX: Await cookies() before passing to getIronSession ---
        const cookieStore = await cookies();
        const session = await getIronSession<SessionData>(cookieStore, getUserSessionOptions());
        // --- END FIX ---
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
        // Require authentication to record progress
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
        // revalidateTag(`progress-${userId}-${trackId}`); // Revalidate specific track progress
        return { success: true };

    } catch (error) {
        // Don't log overly verbose errors for progress updates if they happen frequently
        // console.error(`Error recording progress for user ${userId}, track ${trackId}:`, error);
        if (error instanceof APIError) {
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

     const requestData: CreateBookmarkRequestDTO = { trackId, timestampMs, note: note ?? undefined };

     try {
         // Endpoint: POST /users/me/bookmarks
         const createdBookmark = await apiClient<BookmarkResponseDTO>(`/users/me/bookmarks`, {
             method: 'POST',
             body: JSON.stringify(requestData),
         });

         // Invalidate relevant TanStack Query caches or Next.js cache tags
         revalidateTag(`bookmarks-${userId}`);
         revalidateTag(`bookmarks-${userId}-${trackId}`);
         revalidatePath(`/tracks/${trackId}`); // Invalidate track detail page
         revalidatePath(`/bookmarks`); // Invalidate main bookmarks page

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
// ADDED optional trackId for more precise cache invalidation
export async function deleteBookmarkAction(bookmarkId: string, trackId?: string): Promise<DeleteBookmarkResult> {
     const userId = await getAuthenticatedUserID();
     if (!userId) { return { success: false, message: "User not authenticated." }; }
     if (!bookmarkId) { return { success: false, message: "Bookmark ID is required." }; }

     try {
         // Endpoint: DELETE /users/me/bookmarks/{bookmarkId}
         await apiClient<void>(`/users/me/bookmarks/${bookmarkId}`, { method: 'DELETE' });

         // Invalidate caches
         revalidateTag(`bookmarks-${userId}`); // Invalidate user's general bookmark list
         revalidatePath(`/bookmarks`); // Invalidate main bookmarks page path
         // Invalidate specific track list/page if trackId is provided
         if (trackId) {
             revalidateTag(`bookmarks-${userId}-${trackId}`);
             revalidatePath(`/tracks/${trackId}`);
         }

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