// apps/user-app/_actions/uploadActions.ts (or add to userActivityActions.ts)
'use server';

import { revalidateTag } from 'next/cache';
import apiClient, { APIError } from '@repo/api-client';
import type {
    RequestUploadRequestDTO,
    RequestUploadResponseDTO,
    CompleteUploadRequestDTO,
    AudioTrackResponseDTO,
    BatchRequestUploadInputRequestDTO,
    BatchRequestUploadInputResponseDTO,
    BatchCompleteUploadInputDTO,
    BatchCompleteUploadResponseDTO,
} from '@repo/types';
// Import helper to get user ID if needed (e.g., from session or context)
// Assuming getAuthenticatedUserID helper exists (from collectionActions example)
// import { getAuthenticatedUserID } from './collectionActions';

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
    results?: BatchRequestUploadInputResponseDTO['results']; // Array of individual results
}
interface BatchCompleteUploadResult {
     success: boolean; // Overall success indicator (e.g., transaction committed)
     message?: string; // Overall error message
     results?: BatchCompleteUploadResponseDTO['results']; // Detailed results per item
}


// --- Single File Actions (Existing but refined) ---

// Action to request upload URL (can potentially reuse user action if no admin distinction needed)
export async function requestUploadAction(filename: string, contentType: string): Promise<RequestUploadResult> {
    // const userId = await getAuthenticatedUserID();
    // if (!userId) return { success: false, message: "User not authenticated." };

     if (!filename || !contentType) {
         return { success: false, message: "Filename and content type are required." };
     }

    try {
        const reqData: RequestUploadRequestDTO = { filename, contentType };
        const response = await apiClient<RequestUploadResponseDTO>('/uploads/audio/request', {
            method: 'POST',
            body: JSON.stringify(reqData),
            // Auth handled by apiClient automatically sending session cookie/token
        });
        return { success: true, uploadUrl: response.uploadUrl, objectKey: response.objectKey };
    } catch (error) {
        console.error(`Error requesting upload URL for ${filename}:`, error);
        if (error instanceof APIError) {
            return { success: false, message: `Failed to request upload URL: ${error.message}` };
        }
        return { success: false, message: 'An unexpected error occurred.' };
    }
}


// Action called after successful upload to create metadata
// Note: Uses CompleteUploadRequestDTO which expects durationMs
export async function createTrackMetadataAction(objectKey: string | undefined, formData: FormData): Promise<CompleteUploadResult> {
    // const userId = await getAuthenticatedUserID();
    // if (!userId) return { success: false, message: "User not authenticated." };

    // Extract data and potentially convert types
     const requestData: Partial<CompleteUploadRequestDTO> = {
         objectKey: objectKey, // Get hidden objectKey if passed separately
         title: formData.get('title') as string,
         description: formData.get('description') as string,
         languageCode: formData.get('languageCode') as string,
         level: formData.get('level') as string || undefined, // Handle empty string
         isPublic: formData.get('isPublic') === 'on',
         tags: (formData.get('tags') as string)?.split(',').map(t => t.trim()).filter(t => t),
         coverImageUrl: formData.get('coverImageUrl') as string || undefined,
         // Duration requires parsing from FormData as number
         durationMs: parseInt(formData.get('durationMs') as string, 10) || 0,
     };

     // Basic Validation (can use zod schema here too)
     if (!requestData.objectKey || !requestData.title || !requestData.languageCode || !requestData.durationMs || requestData.durationMs <= 0) {
         return { success: false, message: "Object Key, Title, Language Code, and a valid Duration are required." };
     }
     if (requestData.coverImageUrl === '') requestData.coverImageUrl = undefined; // Handle empty string for optional URL


     try {
         // Use CompleteUploadRequestDTO as body type
         const createdTrack = await apiClient<AudioTrackResponseDTO>(`/audio/tracks`, {
             method: 'POST',
             body: requestData as CompleteUploadRequestDTO, // Cast after validation
         });

         revalidateTag('tracks'); // Invalidate track list cache for the user/public

         return { success: true, track: createdTrack, message: "Track created successfully." };

     } catch (error) {
         console.error(`Error creating track metadata for key ${requestData.objectKey}:`, error);
         if (error instanceof APIError) {
             if (error.status === 409) return { success: false, message: "Conflict: Object key may already be used for a track." };
             if (error.status === 400) return { success: false, message: `Invalid input: ${error.message}` };
             // Handle other potential errors (401, 403, 500)
             return { success: false, message: `Failed to create track: ${error.message}` };
         }
         return { success: false, message: 'An unexpected error occurred.' };
     }
}


// --- ADDED: Batch File Actions ---

export async function requestBatchUploadAction(files: { filename: string; contentType: string }[]): Promise<BatchRequestUploadResult> {
    // const userId = await getAuthenticatedUserID();
    // if (!userId) return { success: false, message: "User not authenticated." };

    if (!files || files.length === 0) {
        return { success: false, message: "At least one file is required for batch upload request." };
    }

    try {
        const reqData: BatchRequestUploadInputRequestDTO = {
            files: files.map(f => ({ filename: f.filename, contentType: f.contentType })),
        };
        const response = await apiClient<BatchRequestUploadInputResponseDTO>('/uploads/audio/batch/request', {
            method: 'POST',
            body: JSON.stringify(reqData),
        });
        return { success: true, results: response.results };
    } catch (error) {
        console.error(`Error requesting batch upload URLs:`, error);
        if (error instanceof APIError) {
            return { success: false, message: `Failed to request batch upload URLs: ${error.message}` };
        }
        return { success: false, message: 'An unexpected error occurred.' };
    }
}

export async function completeBatchUploadAction(tracksData: BatchCompleteUploadItemDTO[]): Promise<BatchCompleteUploadResult> {
    // const userId = await getAuthenticatedUserID();
    // if (!userId) return { success: false, message: "User not authenticated." };

     if (!tracksData || tracksData.length === 0) {
        return { success: false, message: "At least one track's metadata is required for batch completion." };
    }

    try {
        const reqData: BatchCompleteUploadInputDTO = { tracks: tracksData };
        // API returns 201 Created with detailed results body
        const response = await apiClient<BatchCompleteUploadResponseDTO>('/audio/tracks/batch/complete', {
            method: 'POST',
            body: JSON.stringify(reqData),
        });

         revalidateTag('tracks'); // Invalidate track list cache

        return { success: true, results: response.results }; // Overall success (transaction likely committed)

    } catch (error) {
        console.error(`Error completing batch upload:`, error);
        // If the whole transaction failed, APIError might be 400, 409, 500 etc.
        // The response body in case of error *might* still contain partial results,
        // but apiClient usually throws before we get here if response.ok is false.
        if (error instanceof APIError) {
             // Attempt to extract partial results if backend sends them on error (less common)
             const errorDetails = error.details as { results?: BatchCompleteUploadResponseDTO['results'] };
             if (errorDetails?.results) {
                 return { success: false, message: `Batch completion failed: ${error.message}`, results: errorDetails.results };
             }
             return { success: false, message: `Batch completion failed: ${error.message}` };
        }
        return { success: false, message: 'An unexpected error occurred during batch completion.' };
    }
}