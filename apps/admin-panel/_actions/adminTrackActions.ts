// apps/admin-panel/_actions/adminTrackActions.ts
'use server';
import { verifyAdmin } from './adminUserActions'; // Reuse verifyAdmin or redefine session
import type { AudioTrackResponseDTO, CompleteUploadRequestDTO } from '@repo/types';
import apiClient, { APIError } from '@repo/api-client';
import { revalidateTag, revalidatePath } from 'next/cache';
import type { AdminActionResult } from './adminCollectionActions'; // Reuse result type

// --- Action Result Types ---
interface AdminTrackResult extends AdminActionResult { track?: AudioTrackResponseDTO;}

// Action called after successful upload to create metadata
export async function createTrackMetadataAction(requestData: CompleteUploadRequestDTO): Promise<AdminTrackResult> {
     if (!await verifyAdmin()) { return { success: false, message: "Permission denied." }; }
     if (!requestData.objectKey || !requestData.title || !requestData.languageCode || requestData.durationMs <= 0) {
          return { success: false, message: "Object Key, Title, Language Code, and Duration are required." };
     }

     try {
        // Assumes a dedicated admin endpoint: `/admin/audio/tracks`
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
     const isAdmin = await verifyAdmin();
     if (!isAdmin) { return { success: false, message: "Permission denied." }; }
     if (!trackId) { return { success: false, message: "Track ID is required." }; }

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const languageCode = formData.get('languageCode') as string;
    const level = formData.get('level') as string;
    const isPublicStr = formData.get('isPublic') as string;
    const tagsStr = formData.get('tags') as string;
    const coverImageUrl = formData.get('coverImageUrl') as string;


    if (!title || !languageCode) { return { success: false, message: "Title and Language Code are required."}; }

     const requestData: Partial<CompleteUploadRequestDTO> = {
         title,
         description,
         languageCode,
         level: level || undefined,
         isPublic: isPublicStr === 'on',
         tags: tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(t => t) : [],
         coverImageUrl: coverImageUrl || undefined,
         // Exclude non-editable: objectKey, durationMs
     };


     try {
         // Assumes admin update endpoint PUT /admin/audio/tracks/{trackId}
         await apiClient<AudioTrackResponseDTO>(`/admin/audio/tracks/${trackId}`, {
             method: 'PUT',
             body: JSON.stringify(requestData),
         });

         revalidateTag('admin-tracks');
         revalidateTag(`admin-track-${trackId}`);
         revalidatePath(`/tracks/${trackId}`);

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
     const isAdmin = await verifyAdmin();
     if (!isAdmin) { return { success: false, message: "Permission denied." }; }
     if (!trackId) { return { success: false, message: "Track ID is required." }; }

     try {
         // Assumes admin delete endpoint DELETE /admin/audio/tracks/{trackId}
         await apiClient<void>(`/admin/audio/tracks/${trackId}`, { method: 'DELETE' });

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

// Removed incorrect re-export of user action:
// // export { requestUploadAction } from '../../user-app/_actions/userActivityActions'; // REMOVED

// TODO: Implement requestAdminUploadAction if needed for admin panel single upload
// export async function requestAdminUploadAction(...) { ... }