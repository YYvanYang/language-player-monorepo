// apps/admin-panel/_actions/adminTrackActions.ts
'use server';
import { /* ... imports ... */ } from './adminUserActions'; // Reuse verifyAdmin or redefine session
import type { AudioTrackResponseDTO, CompleteUploadRequestDTO } from '@repo/types';
import apiClient, { APIError } from '@repo/api-client';
import { revalidateTag, revalidatePath } from 'next/cache';

// --- Action Result Types ---
interface AdminTrackResult extends AdminActionResult { track?: AudioTrackResponseDTO;}

// Action called after successful upload to create metadata
export async function createTrackMetadataAction(requestData: CompleteUploadRequestDTO): Promise<AdminTrackResult> {
     if (!await verifyAdmin()) { return { success: false, message: "Permission denied." }; }
     // Validation of DTO fields happens in handler/validator usually, but basic checks here are ok
     if (!requestData.objectKey || !requestData.title || !requestData.languageCode || requestData.durationMs <= 0) {
          return { success: false, message: "Object Key, Title, Language Code, and Duration are required." };
     }

     try {
        // Call the SAME backend endpoint as the user app's complete upload,
        // BUT the backend must verify the CALLER is an admin!
        // Or use a dedicated admin endpoint: `/admin/audio/tracks`
        const createdTrack = await apiClient<AudioTrackResponseDTO>(`/admin/audio/tracks`, { // Use ADMIN endpoint
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

// Action to update track metadata
export async function updateTrackAction(trackId: string, formData: FormData): Promise<AdminActionResult> {
     if (!await verifyAdmin()) { return { success: false, message: "Permission denied." }; }
     if (!trackId) { return { success: false, message: "Track ID is required." }; }

    // Extract data from formData
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const languageCode = formData.get('languageCode') as string;
    const level = formData.get('level') as string; // Cast to AudioLevel later
    const isPublicStr = formData.get('isPublic') as string; // Checkbox value might be 'on' or null
    const tagsStr = formData.get('tags') as string; // Comma-separated?

    // Basic Validation
    if (!title || !languageCode) { return { success: false, message: "Title and Language Code are required."}; }
     // More robust validation is better

     const requestData: Partial<CompleteUploadRequestDTO> = { // Use partial or create specific UpdateDTO
         title,
         description,
         languageCode,
         level: level || undefined, // Send empty string if level is cleared? Or handle in backend
         isPublic: isPublicStr === 'on', // Handle checkbox value
         tags: tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(t => t) : [],
         // Don't send objectKey or duration on metadata update
     };


     try {
         await apiClient<AudioTrackResponseDTO>(`/admin/audio/tracks/${trackId}`, { // Use ADMIN endpoint
             method: 'PUT',
             body: JSON.stringify(requestData),
         });

         revalidateTag('admin-tracks');
         revalidateTag(`admin-track-${trackId}`);
         revalidatePath(`/tracks/${trackId}`); // Invalidate detail page

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

// Action to delete a track
 export async function deleteTrackAction(trackId: string): Promise<AdminActionResult> {
     if (!await verifyAdmin()) { return { success: false, message: "Permission denied." }; }
     if (!trackId) { return { success: false, message: "Track ID is required." }; }

     try {
         await apiClient<void>(`/admin/audio/tracks/${trackId}`, { method: 'DELETE' }); // Use ADMIN endpoint

         revalidateTag('admin-tracks');
         revalidatePath(`/tracks/${trackId}`);

         console.log(`Admin deleted track ${trackId}`);
         return { success: true, message: "Track deleted successfully." };

     } catch (error) {
         console.error(`Admin error deleting track ${trackId}:`, error);
         if (error instanceof APIError) {
            if (error.status === 404) { return { success: false, message: "Track not found." }; }
            if (error.status === 403) { return { success: false, message: "Permission denied." }; }
            return { success: false, message: `Failed to delete track: ${error.message}` };
         }
         return { success: false, message: 'An unexpected error occurred.' };
     }
 }

// Action to request upload URL (can potentially reuse user action if no admin distinction needed)
// Or create admin-specific one if paths/logic differ
export { requestUploadAction } from '../../user-app/_actions/userActivityActions'; // Example reuse IF logic is identical
// OR: Copy/adapt the requestUploadAction here if needed