// apps/user-app/_actions/uploadActions.ts
'use server';

import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers'; // Needed for auth check
import apiClient, { APIError } from '@repo/api-client';
import type {
    RequestUploadRequestDTO,
    RequestUploadResponseDTO,
    CompleteUploadRequestDTO, // Changed from CompleteUploadInputDTO based on backend
    AudioTrackResponseDTO,
    BatchRequestUploadInputRequestDTO,
    BatchRequestUploadInputResponseDTO,
    BatchCompleteUploadInputDTO, // Changed based on backend
    BatchCompleteUploadResponseDTO,
    BatchCompleteUploadItemDTO // Used in BatchCompleteUploadInputDTO
} from '@repo/types';
import { getIronSession } from 'iron-session';
import { SessionData, getUserSessionOptions } from '@repo/auth';

// --- Helper to get authenticated User ID ---
async function getAuthenticatedUserID(): Promise<string | null> {
     try {
        // --- FIX: Await cookies() before passing to getIronSession ---
        const cookieStore = await cookies();
        const session = await getIronSession<SessionData>(cookieStore, getUserSessionOptions());
        // --- END FIX ---
        return session.userId ?? null;
     } catch(error) {
        console.error("Error getting session in upload action:", error);
        return null;
     }
}
// --- End Helper ---

// --- Action Result Types ---
interface RequestUploadResult {
    success: boolean;
    message?: string;
    uploadUrl?: string;
    objectKey?: string;
}
interface CompleteUploadResult {
    success: boolean;
    message?: string;
    track?: AudioTrackResponseDTO;
}
interface BatchRequestUploadResult {
    success: boolean;
    message?: string;
    results?: BatchRequestUploadInputResponseDTO['results'];
}
interface BatchCompleteUploadResult {
     success: boolean;
     message?: string;
     results?: BatchCompleteUploadResponseDTO['results'];
}

// --- Single File Actions ---

export async function requestUploadAction(filename: string, contentType: string): Promise<RequestUploadResult> {
    const userId = await getAuthenticatedUserID();
    if (!userId) return { success: false, message: "User not authenticated." };

     if (!filename || !contentType) {
         return { success: false, message: "Filename and content type are required." };
     }

    try {
        const reqData: RequestUploadRequestDTO = { filename, contentType };
        // User endpoint for requesting upload
        const response = await apiClient<RequestUploadResponseDTO>('/uploads/audio/request', {
            method: 'POST',
            body: JSON.stringify(reqData),
        });
        console.log(`Upload URL requested for user ${userId}, file ${filename}`);
        return { success: true, uploadUrl: response.uploadUrl, objectKey: response.objectKey };
    } catch (error) {
        console.error(`Error requesting upload URL for ${filename}:`, error);
        if (error instanceof APIError) {
            if (error.status === 401) return { success: false, message: "Authentication required." };
            return { success: false, message: `Failed to request upload URL: ${error.message}` };
        }
        return { success: false, message: 'An unexpected error occurred.' };
    }
}


// Action called after successful upload to create metadata
// Takes JSON data matching CompleteUploadRequestDTO from @repo/types
export async function createTrackMetadataAction(
    // objectKey is now part of the requestData DTO
    requestData: CompleteUploadRequestDTO
): Promise<CompleteUploadResult> {
    const userId = await getAuthenticatedUserID();
    if (!userId) return { success: false, message: "User not authenticated." };

     // Basic Validation from DTO fields
     if (!requestData.objectKey || !requestData.title?.trim() || !requestData.languageCode?.trim() || !requestData.durationMs || requestData.durationMs <= 0) {
         return { success: false, message: "Object Key, Title, Language Code, and a valid Duration (ms) are required." };
     }
     // Ensure optional fields are handled correctly (e.g., empty strings become undefined/null if needed by backend)
     if (requestData.description === '') requestData.description = undefined;
     if (requestData.level === '') requestData.level = undefined;
     if (requestData.coverImageUrl === '') requestData.coverImageUrl = undefined;
     requestData.isPublic = requestData.isPublic ?? false; // Default to false if null/undefined
     requestData.tags = requestData.tags?.filter(Boolean) ?? []; // Ensure array and remove empty tags

     try {
         // User endpoint for completing upload and creating track
         const createdTrack = await apiClient<AudioTrackResponseDTO>(`/audio/tracks`, {
             method: 'POST',
             body: JSON.stringify(requestData), // Send the validated DTO
         });

         revalidateTag('tracks'); // Invalidate public track list cache
         revalidateTag(`tracks-${userId}`); // Invalidate user-specific track list cache if applicable

         console.log(`Track metadata created for user ${userId}, track ${createdTrack.id}`);
         return { success: true, track: createdTrack, message: "Track created successfully." };

     } catch (error) {
         console.error(`Error creating track metadata for key ${requestData.objectKey}:`, error);
         if (error instanceof APIError) {
             if (error.status === 409) return { success: false, message: "Conflict: This file may have already been processed or the identifier is duplicated." };
             if (error.status === 400) return { success: false, message: `Invalid input: ${error.message}` };
             if (error.status === 403) return { success: false, message: `Permission denied: ${error.message}` }; // e.g., object key ownership mismatch
             if (error.status === 401) return { success: false, message: "Authentication required." };
             return { success: false, message: `Failed to create track: ${error.message}` };
         }
         return { success: false, message: 'An unexpected error occurred.' };
     }
}


// --- Batch File Actions ---

export async function requestBatchUploadAction(files: { filename: string; contentType: string }[]): Promise<BatchRequestUploadResult> {
    const userId = await getAuthenticatedUserID();
    if (!userId) return { success: false, message: "User not authenticated." };

    if (!files || files.length === 0) {
        return { success: false, message: "At least one file is required for batch upload request." };
    }

    try {
        const reqData: BatchRequestUploadInputRequestDTO = {
            files: files.map(f => ({ filename: f.filename, contentType: f.contentType })),
        };
        // User endpoint for requesting batch upload URLs
        const response = await apiClient<BatchRequestUploadInputResponseDTO>('/uploads/audio/batch/request', {
            method: 'POST',
            body: JSON.stringify(reqData),
        });
        console.log(`Batch upload URLs requested for user ${userId}, count: ${files.length}`);
        return { success: true, results: response.results };
    } catch (error) {
        console.error(`Error requesting batch upload URLs for user ${userId}:`, error);
        if (error instanceof APIError) {
             if (error.status === 401) return { success: false, message: "Authentication required." };
            return { success: false, message: `Failed to request batch upload URLs: ${error.message}` };
        }
        return { success: false, message: 'An unexpected error occurred.' };
    }
}

export async function completeBatchUploadAction(
    // Matches the input DTO expected by the backend
    tracksData: BatchCompleteUploadItemDTO[]
): Promise<BatchCompleteUploadResult> {
    const userId = await getAuthenticatedUserID();
    if (!userId) return { success: false, message: "User not authenticated." };

     if (!tracksData || tracksData.length === 0) {
        return { success: false, message: "At least one track's metadata is required for batch completion." };
    }

     // Basic validation of items (can be more thorough)
     for (const item of tracksData) {
         if (!item.objectKey || !item.title?.trim() || !item.languageCode?.trim() || !item.durationMs || item.durationMs <= 0) {
             return { success: false, message: `Invalid data for track with key ${item.objectKey || '(unknown)'}: Missing required fields.` };
         }
          // Ensure optional fields are handled correctly
         item.description = item.description === '' ? undefined : item.description;
         item.level = item.level === '' ? undefined : item.level;
         item.coverImageUrl = item.coverImageUrl === '' ? undefined : item.coverImageUrl;
         item.isPublic = item.isPublic ?? false;
         item.tags = item.tags?.filter(Boolean) ?? [];
     }

    try {
        const reqData: BatchCompleteUploadInputDTO = { tracks: tracksData };
        // User endpoint for completing batch upload
        const response = await apiClient<BatchCompleteUploadResponseDTO>('/audio/tracks/batch/complete', {
            method: 'POST',
            body: JSON.stringify(reqData),
        });

         revalidateTag('tracks'); // Invalidate public track list cache
         revalidateTag(`tracks-${userId}`); // Invalidate user-specific track list cache if applicable

        console.log(`Batch upload completed for user ${userId}, items processed: ${response.results?.length ?? 0}`);
        return { success: true, results: response.results }; // Assume overall success if API call succeeds (201)

    } catch (error) {
        console.error(`Error completing batch upload for user ${userId}:`, error);
        if (error instanceof APIError) {
             const errorDetails = error.details as { results?: BatchCompleteUploadResponseDTO['results'] };
             // If backend returns partial results even on error, include them
             if (errorDetails?.results) {
                 return { success: false, message: `Batch completion failed: ${error.message}`, results: errorDetails.results };
             }
             if (error.status === 401) return { success: false, message: "Authentication required." };
             if (error.status === 403) return { success: false, message: `Permission denied: ${error.message}` };
             if (error.status === 400) return { success: false, message: `Invalid input: ${error.message}` };
             if (error.status === 409) return { success: false, message: `Conflict: ${error.message}` };
             return { success: false, message: `Batch completion failed: ${error.message}` };
        }
        return { success: false, message: 'An unexpected error occurred during batch completion.' };
    }
}