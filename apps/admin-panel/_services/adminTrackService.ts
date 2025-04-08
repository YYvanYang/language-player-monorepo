// apps/admin-panel/_services/adminTrackService.ts
import apiClient from '@repo/api-client';
import type {
    AudioTrackResponseDTO,
    AudioTrackDetailsResponseDTO, // May be the same as User's or admin specific
    PaginatedResponseDTO,
    CompleteUploadRequestDTO, // Reused for update? Or define UpdateTrackDTO
    ListTrackQueryParams, // Reuse or define AdminListTrackQueryParams
} from '@repo/types';
import { buildQueryString } from '@repo/utils'; // Use shared util

// Define specific params if admin filtering differs significantly
export type AdminListTrackQueryParams = ListTrackQueryParams; // Alias for now

// --- Fetch Functions ---

/**
 * Fetches a paginated list of all audio tracks (requires admin privileges).
 */
export async function listAllTracks(params?: AdminListTrackQueryParams): Promise<PaginatedResponseDTO<AudioTrackResponseDTO>> {
    const queryString = buildQueryString(params);
    // Calls the ADMIN endpoint for listing tracks
    const response = await apiClient<PaginatedResponseDTO<AudioTrackResponseDTO>>(`/admin/audio/tracks${queryString}`);
    return response;
}

/**
 * Fetches details for a specific audio track (requires admin privileges).
 * Backend might return more info for admins compared to the public endpoint.
 */
export async function getAdminTrackDetails(trackId: string): Promise<AudioTrackDetailsResponseDTO> {
    if (!trackId) {
        throw new Error("Track ID cannot be empty");
    }
    // Calls the ADMIN endpoint for track details
    const response = await apiClient<AudioTrackDetailsResponseDTO>(`/admin/audio/tracks/${trackId}`);
    // Note: Uses AudioTrackDetailsResponseDTO from @repo/types, assuming admin/user details are same structure.
    // If admin gets extra fields, define AdminAudioTrackDetailsResponseDTO in @repo/types.
    return response;
}

/**
 * Creates audio track metadata (requires admin privileges).
 * Typically called after a file upload.
 */
export async function createAdminTrackMetadata(data: CompleteUploadRequestDTO): Promise<AudioTrackResponseDTO> {
     // Calls the ADMIN endpoint for creating track metadata
    const response = await apiClient<AudioTrackResponseDTO>(`/admin/audio/tracks`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
    return response;
}

/**
 * Updates audio track metadata (requires admin privileges).
 * Define a specific UpdateTrackDTO in @repo/types if the structure differs from CompleteUploadRequestDTO.
 */
export async function updateAdminTrackMetadata(trackId: string, data: Partial<CompleteUploadRequestDTO>): Promise<AudioTrackResponseDTO> {
     if (!trackId) {
        throw new Error("Track ID cannot be empty");
    }
     // Calls the ADMIN endpoint for updating track metadata
     const response = await apiClient<AudioTrackResponseDTO>(`/admin/audio/tracks/${trackId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
    return response; // Backend might return the updated track
}

/**
 * Deletes an audio track (requires admin privileges).
 */
export async function deleteAdminTrack(trackId: string): Promise<void> {
    if (!trackId) {
        throw new Error("Track ID cannot be empty");
    }
    // Calls the ADMIN endpoint for deleting a track
    await apiClient<void>(`/admin/audio/tracks/${trackId}`, {
        method: 'DELETE',
    });
    // Returns void as DELETE typically returns 204 No Content
}

/**
 * Requests a presigned URL for uploading an audio file (requires admin privileges).
 * This might be identical to the user-facing service if permissions are handled solely by auth.
 * If the backend endpoint or logic differs, implement it separately here.
 * For now, let's assume it might reuse the user-facing logic or endpoint structure.
 */
 export async function requestAdminUploadUrl(filename: string, contentType: string): Promise<{ uploadUrl: string; objectKey: string }> {
     // Assuming admin uses a potentially different endpoint or same endpoint with admin check
     // If identical to user endpoint, could potentially reuse user service via shared package
     const response = await apiClient<{ uploadUrl: string; objectKey: string }>(`/admin/uploads/audio/request`, { // Example ADMIN endpoint
         method: 'POST',
         body: JSON.stringify({ filename, contentType }),
     });
     return response;
 }