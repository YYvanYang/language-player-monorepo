// apps/admin-panel/_actions/adminTrackActions.ts
'use server';

import { cookies } from 'next/headers'; // Import cookies
import { revalidateTag, revalidatePath } from 'next/cache';
import apiClient, { APIError } from '@repo/api-client';
import type {
    AudioTrackResponseDTO,
    CompleteUploadRequestDTO, // Reused for update? Define UpdateTrackDTO if needed
    RequestUploadRequestDTO,
    RequestUploadResponseDTO
} from '@repo/types';
import { getAdminSessionOptions, SessionData } from '@repo/auth';
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
export interface AdminTrackResult extends AdminActionResult { track?: AudioTrackResponseDTO; }
export interface AdminRequestUploadResult extends AdminActionResult { uploadUrl?: string; objectKey?: string; }


// --- Action: Request Upload URL (Admin) ---
// This might be needed if admins upload directly through the panel
export async function requestAdminUploadAction(filename: string, contentType: string): Promise<AdminRequestUploadResult> {
     const isAdmin = await verifyAdmin();
     if (!isAdmin) { return { success: false, message: "Permission denied." }; }
     if (!filename || !contentType) { return { success: false, message: "Filename and content type are required." }; }

    try {
        const reqData: RequestUploadRequestDTO = { filename, contentType };
        // Assuming a separate admin endpoint or the same one with admin auth checks
        const response = await apiClient<RequestUploadResponseDTO>(`/admin/uploads/audio/request`, { // Use admin endpoint
            method: 'POST',
            body: JSON.stringify(reqData),
        });
        return { success: true, uploadUrl: response.uploadUrl, objectKey: response.objectKey };
    } catch (error) {
        console.error(`Admin error requesting upload URL for ${filename}:`, error);
        if (error instanceof APIError) {
            return { success: false, message: `Failed to request upload URL: ${error.message}` };
        }
        return { success: false, message: 'An unexpected error occurred.' };
    }
}

// --- Action: Create Track Metadata (Admin) ---
// Action called after successful admin upload to create metadata
export async function createTrackMetadataAction(requestData: CompleteUploadRequestDTO): Promise<AdminTrackResult> {
     const isAdmin = await verifyAdmin();
     if (!isAdmin) { return { success: false, message: "Permission denied." }; }
     // Basic validation
     if (!requestData.objectKey || !requestData.title || !requestData.languageCode || requestData.durationMs <= 0) {
          return { success: false, message: "Object Key, Title, Language Code, and Duration are required." };
     }

     try {
        // Assumes a dedicated admin endpoint: `/admin/audio/tracks`
        const createdTrack = await apiClient<AudioTrackResponseDTO>(`/admin/audio/tracks`, {
             method: 'POST',
             body: JSON.stringify(requestData),
        });

         revalidateTag('admin-tracks'); // Invalidate track list cache

         console.log(`Admin created track ${createdTrack.id}`);
         return { success: true, track: createdTrack, message: "Track created successfully." };

     } catch (error) {
         console.error(`Admin error creating track metadata for key ${requestData.objectKey}:`, error);
         if (error instanceof APIError) {
             if (error.status === 409) { return { success: false, message: "Conflict: Object key may already be used for a track." }; }
             if (error.status === 400) { return { success: false, message: `Invalid input: ${error.message}` }; }
             if (error.status === 403) { return { success: false, message: "Permission denied by backend." }; }
            return { success: false, message: `Failed to create track: ${error.message}` };
        }
        return { success: false, message: 'An unexpected error occurred.' };
     }
}

// --- Action: Update Track Metadata (Admin) ---
// Takes FormData as input from the form
export async function updateTrackAction(trackId: string, formData: FormData): Promise<AdminActionResult> {
     const isAdmin = await verifyAdmin();
     if (!isAdmin) { return { success: false, message: "Permission denied." }; }
     if (!trackId) { return { success: false, message: "Track ID is required." }; }

    // Extract and validate data from FormData
    const title = formData.get('title') as string;
    const languageCode = formData.get('languageCode') as string;
    if (!title || !languageCode) { return { success: false, message: "Title and Language Code are required."}; }

    // Construct the DTO for the API call (Partial, only send editable fields)
     const requestData: Partial<CompleteUploadRequestDTO> = {
         title,
         description: formData.get('description') as string,
         languageCode,
         level: (formData.get('level') as string) || undefined,
         isPublic: formData.get('isPublic') === 'on',
         tags: (formData.get('tags') as string)?.split(',').map(t => t.trim()).filter(Boolean) || [],
         coverImageUrl: (formData.get('coverImageUrl') as string) || undefined,
         // Exclude non-editable: objectKey, durationMs (assuming duration isn't editable here)
     };
      // Ensure empty optional strings are treated as undefined/null for backend
     if (requestData.level === "") requestData.level = undefined;
     if (requestData.coverImageUrl === "") requestData.coverImageUrl = undefined;

     try {
         // Assumes admin update endpoint PUT /admin/audio/tracks/{trackId}
         await apiClient<AudioTrackResponseDTO>(`/admin/audio/tracks/${trackId}`, {
             method: 'PUT',
             body: JSON.stringify(requestData),
         });

         revalidateTag('admin-tracks'); // Invalidate list
         revalidateTag(`admin-track-${trackId}`); // Invalidate detail
         revalidatePath(`/tracks/${trackId}/edit`); // Invalidate edit page path
         revalidatePath(`/tracks/${trackId}`); // Invalidate detail view path (if exists)

         console.log(`Admin updated track ${trackId}`);
         return { success: true, message: "Track updated successfully." };

     } catch (error) {
         console.error(`Admin error updating track ${trackId}:`, error);
         if (error instanceof APIError) {
            if (error.status === 404) { return { success: false, message: "Track not found." }; }
            if (error.status === 403) { return { success: false, message: "Permission denied." }; }
            if (error.status === 400) { return { success: false, message: `Invalid input: ${error.message}` }; }
            return { success: false, message: `Failed to update track: ${error.message}` };
         }
         return { success: false, message: 'An unexpected error occurred.' };
     }
}

// --- Action: Delete Track (Admin) ---
 export async function deleteTrackAction(trackId: string): Promise<AdminActionResult> {
     const isAdmin = await verifyAdmin();
     if (!isAdmin) { return { success: false, message: "Permission denied." }; }
     if (!trackId) { return { success: false, message: "Track ID is required." }; }

     try {
         // Assumes admin delete endpoint DELETE /admin/audio/tracks/{trackId}
         // Backend should handle deleting the file from storage (MinIO) as well
         await apiClient<void>(`/admin/audio/tracks/${trackId}`, { method: 'DELETE' });

         revalidateTag('admin-tracks'); // Invalidate list
         revalidatePath(`/tracks/${trackId}`); // Invalidate detail path
         revalidatePath(`/tracks/${trackId}/edit`); // Invalidate edit path

         console.log(`Admin deleted track ${trackId}`);
         return { success: true, message: "Track deleted successfully." };

     } catch (error) {
         console.error(`Admin error deleting track ${trackId}:`, error);
         if (error instanceof APIError) {
            if (error.status === 404) { return { success: false, message: "Track not found." }; }
            if (error.status === 403) { return { success: false, message: "Permission denied by backend." }; }
            // Handle potential 409 conflict if track is part of collection? Backend needs to decide policy.
            return { success: false, message: `Failed to delete track: ${error.message}` };
         }
         return { success: false, message: 'An unexpected error occurred.' };
     }
 }