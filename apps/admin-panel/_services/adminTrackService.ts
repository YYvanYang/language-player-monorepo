// apps/admin-panel/_services/adminTrackService.ts
import apiClient from '@repo/api-client'; // Correct path
import type {
    AudioTrackResponseDTO,
    AudioTrackDetailsResponseDTO,
    PaginatedResponseDTO,
    CompleteUploadRequestDTO, // Used for create/update DTO structure
    ListTrackQueryParams, // Reuse if admin filters are the same
    RequestUploadRequestDTO,
    RequestUploadResponseDTO
} from '@repo/types'; // Use shared types
import { buildQueryString } from '@repo/utils'; // Use shared util

// Define specific params type if admin filtering differs significantly from user
export type AdminListTrackQueryParams = ListTrackQueryParams; // Alias for now

const ADMIN_TRACKS_ENDPOINT = '/admin/audio/tracks'; // Base endpoint for admin track operations
const ADMIN_UPLOAD_ENDPOINT = '/admin/uploads/audio'; // Base endpoint for admin upload operations

// --- Fetch Functions ---

/**
 * Fetches a paginated list of ALL audio tracks (requires admin privileges).
 */
export async function listAllTracks(params?: AdminListTrackQueryParams): Promise<PaginatedResponseDTO<AudioTrackResponseDTO>> {
    const queryString = buildQueryString(params);
    const endpoint = `${ADMIN_TRACKS_ENDPOINT}${queryString}`;
    console.log(`ADMIN SERVICE: Fetching tracks from: ${endpoint}`);
    try {
        const response = await apiClient<PaginatedResponseDTO<AudioTrackResponseDTO>>(endpoint);
        return response;
    } catch (error) {
        console.error(`ADMIN SERVICE: Error listing tracks:`, error);
        throw error;
    }
}

/**
 * Fetches details for a specific audio track (requires admin privileges).
 */
export async function getAdminTrackDetails(trackId: string): Promise<AudioTrackDetailsResponseDTO> {
    if (!trackId) {
        throw new Error("ADMIN SERVICE: Track ID cannot be empty");
    }
    const endpoint = `${ADMIN_TRACKS_ENDPOINT}/${trackId}`;
    console.log(`ADMIN SERVICE: Fetching track details from: ${endpoint}`);
    try {
        const response = await apiClient<AudioTrackDetailsResponseDTO>(endpoint);
        return response;
    } catch (error) {
        console.error(`ADMIN SERVICE: Error fetching track details for ${trackId}:`, error);
        throw error;
    }
}

/**
 * Requests a presigned URL for uploading an audio file via the admin panel.
 */
export async function requestAdminUploadUrl(filename: string, contentType: string): Promise<RequestUploadResponseDTO> {
     if (!filename || !contentType) {
        throw new Error("ADMIN SERVICE: Filename and content type are required.");
    }
    const endpoint = `${ADMIN_UPLOAD_ENDPOINT}/request`;
     console.log(`ADMIN SERVICE: Requesting upload URL from: ${endpoint}`);
    try {
        const reqData: RequestUploadRequestDTO = { filename, contentType };
        const response = await apiClient<RequestUploadResponseDTO>(endpoint, {
            method: 'POST',
            body: JSON.stringify(reqData),
        });
        return response;
    } catch (error) {
         console.error(`ADMIN SERVICE: Error requesting upload URL for ${filename}:`, error);
        throw error;
    }
}


// Note: Create/Update/Delete track operations are typically handled directly in Server Actions
// using the apiClient, calling the respective ADMIN_TRACKS_ENDPOINT routes (POST, PUT, DELETE).