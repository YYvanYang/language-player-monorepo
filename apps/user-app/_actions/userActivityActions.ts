// apps/user-app/_actions/userActivityActions.ts
'use server';

import { cookies } from 'next/headers';
import { revalidateTag } from 'next/cache';
import apiClient, { APIError } from '@repo/api-client';
import type { RecordProgressRequestDTO, CreateBookmarkRequestDTO, BookmarkResponseDTO } from '@repo/types';
import { getIronSession } from 'iron-session';
import type { SessionData } from '@repo/auth'; // Or define locally

// --- Session Options (Duplicate from API route or import from shared if possible) ---
// !! IMPORTANT: Ensure these match the ones used in your session API route !!
const sessionOptions = {
    cookieName: process.env.USER_SESSION_NAME || 'user_app_auth_session',
    password: process.env.USER_SESSION_SECRET!,
     cookieOptions: { secure: process.env.NODE_ENV === 'production', httpOnly: true, sameSite: 'lax', maxAge: undefined }
};
if (!sessionOptions.password) { throw new Error("USER_SESSION_SECRET missing for server action"); }
// --- End Session Options ---


// Helper to get authenticated User ID within Server Action
async function getAuthenticatedUserID(): Promise<string | null> {
     try {
        const session = await getIronSession<SessionData>(cookies(), sessionOptions);
        return session.userId ?? null;
     } catch(error) {
        console.error("Error getting session in action:", error);
        return null;
     }
}

// --- Action: Record Progress ---
// This action might be called frequently, so keep it lightweight.
// It doesn't necessarily need useActionState unless you want specific UI feedback beyond player state.
export async function recordProgressAction(trackId: string, progressMs: number): Promise<{ success: boolean; message?: string }> {
    const userId = await getAuthenticatedUserID();
    if (!userId) {
        return { success: false, message: "User not authenticated." };
    }

    // Basic validation on server side as well
    if (!trackId || progressMs < 0) {
         return { success: false, message: "Invalid track ID or progress value." };
    }

    const requestData: RecordProgressRequestDTO = { trackId, progressMs };

    try {
        // Using apiPost which expects JSON response or throws error. Backend returns 204.
        // Adjust apiClient or use raw fetch if needed for 204 handling without error.
        // OR backend could return 200 OK with simple body like {"success": true}
         await apiClient<void>(`/users/me/progress`, { // Expecting no content on success
             method: 'POST',
             body: JSON.stringify(requestData),
             headers: { 'Content-Type': 'application/json' } // apiClient adds this, but explicit is fine
         });

        console.log(`Progress recorded for user ${userId}, track ${trackId}: ${progressMs}ms`);
        return { success: true };

    } catch (error) {
        console.error(`Error recording progress for user ${userId}, track ${trackId}:`, error);
        if (error instanceof APIError) {
             // Handle specific errors like 404 Not Found for the track
             if(error.status === 404) {
                return { success: false, message: "Track not found." };
             }
            return { success: false, message: `Failed to record progress: ${error.message}` };
        }
        return { success: false, message: 'An unexpected error occurred while recording progress.' };
    }
}

// --- Action: Create Bookmark ---
interface CreateBookmarkResult {
    success: boolean;
    message?: string;
    bookmark?: BookmarkResponseDTO; // Return the created bookmark DTO
}
export async function createBookmarkAction(trackId: string, timestampMs: number, note?: string): Promise<CreateBookmarkResult> {
     const userId = await getAuthenticatedUserID();
     if (!userId) {
         return { success: false, message: "User not authenticated." };
     }
     if (!trackId || timestampMs < 0) {
          return { success: false, message: "Invalid track ID or timestamp value." };
     }

     const requestData: CreateBookmarkRequestDTO = { trackId, timestampMs, note };

     try {
         const createdBookmark = await apiClient<BookmarkResponseDTO>(`/bookmarks`, {
             method: 'POST',
             body: JSON.stringify(requestData),
         });

         // Invalidate TanStack Query cache for bookmarks related to this track and user lists
         revalidateTag(`bookmarks-${userId}`); // Invalidate user's general bookmark list
         revalidateTag(`bookmarks-${userId}-${trackId}`); // Invalidate specific track bookmark list

         console.log(`Bookmark created for user ${userId}, track ${trackId}`);
         return { success: true, bookmark: createdBookmark };

     } catch (error) {
        console.error(`Error creating bookmark for user ${userId}, track ${trackId}:`, error);
        if (error instanceof APIError) {
             if(error.status === 404) {
                 return { success: false, message: "Track not found." };
             }
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
     if (!userId) {
         return { success: false, message: "User not authenticated." };
     }
      if (!bookmarkId) {
          return { success: false, message: "Bookmark ID is required." };
     }

     try {
         // Assuming DELETE returns 204 No Content on success
         await apiClient<void>(`/bookmarks/${bookmarkId}`, { method: 'DELETE' });

         // Invalidate caches
         // We don't know the trackId here easily, so just invalidate the general user list
         revalidateTag(`bookmarks-${userId}`);
         // Could potentially store trackId in bookmark data or pass it to action if needed for finer invalidation

         console.log(`Bookmark deleted for user ${userId}, bookmark ${bookmarkId}`);
         return { success: true };

     } catch (error) {
         console.error(`Error deleting bookmark ${bookmarkId} for user ${userId}:`, error);
         if (error instanceof APIError) {
              if(error.status === 404) {
                 return { success: false, message: "Bookmark not found." };
              }
              if(error.status === 403) {
                 return { success: false, message: "You don't have permission to delete this bookmark." };
              }
             return { success: false, message: `Failed to delete bookmark: ${error.message}` };
         }
         return { success: false, message: 'An unexpected error occurred while deleting the bookmark.' };
     }
}