// apps/admin-panel/_services/adminCollectionService.ts
import apiClient, { APIError } from '@repo/api-client'; // Correct path assuming monorepo setup
import type {
    AudioCollectionResponseDTO,
    PaginatedResponseDTO,
    AudioTrackResponseDTO, // Assuming admin detail might include tracks
    CreateCollectionRequestDTO,
    UpdateCollectionRequestDTO,
    UpdateCollectionTracksRequestDTO,
} from '@repo/types'; // Use shared types
import { buildQueryString } from '@repo/utils'; // Use shared util

// Define specific params if admin filtering differs
// Match this with backend query capabilities for admin endpoint
export interface AdminListCollectionsParams {
    q?: string; // Search term (e.g., title, description)
    ownerId?: string; // Filter by specific owner UUID
    type?: 'COURSE' | 'PLAYLIST'; // Filter by type
    limit?: number;
    offset?: number;
    sortBy?: 'title' | 'createdAt' | 'updatedAt' | 'ownerId' | 'type'; // Example sort fields
    sortDir?: 'asc' | 'desc';
}

const ADMIN_COLLECTIONS_ENDPOINT = '/admin/audio/collections'; // Base endpoint for admin collection operations

// --- Fetch Functions ---

/**
 * Fetches a paginated list of ALL audio collections (requires admin privileges).
 */
export async function listAllCollections(params?: AdminListCollectionsParams): Promise<PaginatedResponseDTO<AudioCollectionResponseDTO>> {
    const queryString = buildQueryString(params);
    const endpoint = `${ADMIN_COLLECTIONS_ENDPOINT}${queryString}`;
    console.log(`ADMIN SERVICE: Fetching collections from: ${endpoint}`);
    try {
        const response = await apiClient<PaginatedResponseDTO<AudioCollectionResponseDTO>>(endpoint);
        return response;
    } catch (error) {
        console.error(`ADMIN SERVICE: Error listing collections:`, error);
        throw error; // Re-throw APIError or other errors
    }
}

/**
 * Fetches details for a specific audio collection (requires admin privileges).
 * Assumes the admin endpoint returns the collection DTO.
 */
export async function getAdminCollectionDetails(collectionId: string): Promise<AudioCollectionResponseDTO> {
    if (!collectionId) {
        throw new Error("ADMIN SERVICE: Collection ID cannot be empty");
    }
    const endpoint = `${ADMIN_COLLECTIONS_ENDPOINT}/${collectionId}`;
    console.log(`ADMIN SERVICE: Fetching collection details from: ${endpoint}`);
    try {
        // Assuming this endpoint returns the collection, potentially with tracks populated
        const response = await apiClient<AudioCollectionResponseDTO>(endpoint);
        return response;
    } catch (error) {
        console.error(`ADMIN SERVICE: Error fetching collection details for ${collectionId}:`, error);
        throw error; // Re-throw APIError or other errors
    }
}

// Note: Create/Update/Delete operations are typically handled directly in Server Actions
// using the apiClient. Defining service functions for them is optional but can help centralize API calls.
// Example (optional):
// export async function createAdminCollection(data: CreateCollectionRequestDTO): Promise<AudioCollectionResponseDTO> {
//     const endpoint = ADMIN_COLLECTIONS_ENDPOINT;
//     try {
//         const response = await apiClient<AudioCollectionResponseDTO>(endpoint, { method: 'POST', body: data });
//         return response;
//     } catch (error) {
//         console.error(`ADMIN SERVICE: Error creating collection:`, error);
//         throw error;
//     }
// }