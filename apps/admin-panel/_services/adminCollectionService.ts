// apps/admin-panel/_services/adminCollectionService.ts
import apiClient from '@repo/api-client';
import type {
    AudioCollectionResponseDTO,
    PaginatedResponseDTO,
    CreateCollectionRequestDTO, // Can admin create collections? Assume yes.
    UpdateCollectionRequestDTO,
    UpdateCollectionTracksRequestDTO,
    AudioTrackResponseDTO, // Needed if admin endpoints return tracks
} from '@repo/types';
import { buildQueryString } from '@repo/utils'; // Use shared util

// Define specific params if admin filtering differs
export interface AdminListCollectionsParams {
    q?: string; // Search by title? Owner email?
    ownerId?: string; // Filter by specific owner
    type?: string; // Filter by type (COURSE/PLAYLIST)
    limit?: number;
    offset?: number;
    sortBy?: 'title' | 'createdAt' | 'ownerId'; // Example sort fields
    sortDir?: 'asc' | 'desc';
}

// --- Fetch Functions ---

/**
 * Fetches a paginated list of all audio collections (requires admin privileges).
 */
export async function listAllCollections(params?: AdminListCollectionsParams): Promise<PaginatedResponseDTO<AudioCollectionResponseDTO>> {
    const queryString = buildQueryString(params);
    // Calls the ADMIN endpoint for listing collections
    const response = await apiClient<PaginatedResponseDTO<AudioCollectionResponseDTO>>(`/admin/audio/collections${queryString}`);
    return response;
}

/**
 * Fetches details for a specific audio collection, potentially including tracks (requires admin privileges).
 */
export async function getAdminCollectionDetails(collectionId: string): Promise<AudioCollectionResponseDTO> {
    if (!collectionId) {
        throw new Error("Collection ID cannot be empty");
    }
    // Calls the ADMIN endpoint for collection details
    // Assume this endpoint returns tracks similar to the user one
    const response = await apiClient<AudioCollectionResponseDTO>(`/admin/audio/collections/${collectionId}`);
    return response;
}

/**
 * Creates a new audio collection (requires admin privileges).
 * Admin might be able to assign ownership. Add ownerId to request DTO if needed.
 */
export async function createAdminCollection(data: CreateCollectionRequestDTO): Promise<AudioCollectionResponseDTO> {
    // Calls the ADMIN endpoint for creating a collection
    const response = await apiClient<AudioCollectionResponseDTO>(`/admin/audio/collections`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
    return response;
}

/**
 * Updates audio collection metadata (requires admin privileges).
 */
export async function updateAdminCollectionMetadata(collectionId: string, data: UpdateCollectionRequestDTO): Promise<void> { // Often returns 204
    if (!collectionId) {
        throw new Error("Collection ID cannot be empty");
    }
    // Calls the ADMIN endpoint for updating collection metadata
    await apiClient<void>(`/admin/audio/collections/${collectionId}`, {
        method: 'PUT', // Or PATCH
        body: JSON.stringify(data),
    });
}

/**
 * Updates the tracks within an audio collection (requires admin privileges).
 */
export async function updateAdminCollectionTracks(collectionId: string, data: UpdateCollectionTracksRequestDTO): Promise<void> { // Often returns 204
    if (!collectionId) {
        throw new Error("Collection ID cannot be empty");
    }
    // Calls the ADMIN endpoint for updating collection tracks
    await apiClient<void>(`/admin/audio/collections/${collectionId}/tracks`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

/**
 * Deletes an audio collection (requires admin privileges).
 */
export async function deleteAdminCollection(collectionId: string): Promise<void> {
    if (!collectionId) {
        throw new Error("Collection ID cannot be empty");
    }
    // Calls the ADMIN endpoint for deleting a collection
    await apiClient<void>(`/admin/audio/collections/${collectionId}`, {
        method: 'DELETE',
    });
}