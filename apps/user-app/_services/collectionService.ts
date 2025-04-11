// apps/user-app/_services/collectionService.ts
import apiClient from '@repo/api-client';
import type {
    AudioCollectionResponseDTO,
    PaginatedResponseDTO,
    AudioTrackResponseDTO,
} from '@repo/types';
// Corrected import path assuming utils is structured correctly
import { buildQueryString, PaginationParams } from '@repo/utils'; // Use shared util and type

// Define specific param types for listing user collections
export interface ListMyCollectionsParams extends PaginationParams { // Extend shared PaginationParams
    sortBy?: 'createdAt' | 'title' | 'updatedAt'; // Fields available for sorting user collections
    sortDir?: 'asc' | 'desc';
    // Add other filters if API supports (e.g., 'type')
    // type?: CollectionType;
}

const USER_COLLECTIONS_ENDPOINT = '/users/me/collections'; // Endpoint for the logged-in user's collections
const PUBLIC_COLLECTIONS_ENDPOINT = '/audio/collections'; // Base endpoint for public collection details

/**
 * Fetches the collections belonging to the currently authenticated user.
 */
export async function listMyCollections(params?: ListMyCollectionsParams): Promise<PaginatedResponseDTO<AudioCollectionResponseDTO>> {
    const queryString = buildQueryString(params);
    const endpoint = `${USER_COLLECTIONS_ENDPOINT}${queryString}`;
    console.log(`SERVICE: Fetching user collections from: ${endpoint}`);
    try {
        // Auth is handled by apiClient sending cookies
        const response = await apiClient<PaginatedResponseDTO<AudioCollectionResponseDTO>>(endpoint);
        console.log(`SERVICE: Received ${response.data?.length ?? 0} collections, total ${response.total}`);
        return response;
    } catch (error) {
        console.error("SERVICE: Error fetching user collections:", error);
        throw error; // Re-throw for query hook/component to handle
    }
}

/**
 * Fetches the details of a specific collection, including its associated tracks.
 * Uses the public endpoint, backend handles auth/ownership for accessing details.
 */
export async function getCollectionDetailsWithTracks(collectionId: string): Promise<AudioCollectionResponseDTO> {
    if (!collectionId) {
        throw new Error("SERVICE: Collection ID cannot be empty");
    }
    // Use the public endpoint; backend checks if user can view it
    const endpoint = `${PUBLIC_COLLECTIONS_ENDPOINT}/${collectionId}`;
    console.log(`SERVICE: Fetching collection details from: ${endpoint}`);
    try {
        // Backend should populate 'tracks' based on its logic (e.g., ordered IDs -> fetch tracks)
        const response = await apiClient<AudioCollectionResponseDTO>(endpoint);
        console.log(`SERVICE: Received collection details for ${collectionId}, tracks: ${response.tracks?.length ?? 0}`);
        return response;
    } catch (error) {
        console.error(`SERVICE: Error fetching collection details for ${collectionId}:`, error);
        throw error; // Re-throw
    }
}

/**
 * Fetches ONLY the ordered list of tracks for a specific collection.
 * Useful if the main detail endpoint doesn't include tracks or for updates.
 */
export async function getTracksForCollection(collectionId: string): Promise<AudioTrackResponseDTO[]> {
     if (!collectionId) {
        throw new Error("SERVICE: Collection ID cannot be empty");
    }
    // Assuming endpoint like GET /audio/collections/{collectionId}/tracks exists
    // This endpoint might be protected similarly to the main detail endpoint
    const endpoint = `${PUBLIC_COLLECTIONS_ENDPOINT}/${collectionId}/tracks`;
    console.log(`SERVICE: Fetching tracks for collection from: ${endpoint}`);
     try {
        // Backend returns just the list of tracks in order
        const response = await apiClient<AudioTrackResponseDTO[]>(endpoint);
        console.log(`SERVICE: Received ${response?.length ?? 0} tracks for collection ${collectionId}`);
        return response ?? []; // Return empty array if response is null/undefined
    } catch (error) {
        console.error(`SERVICE: Error fetching tracks for collection ${collectionId}:`, error);
        throw error; // Re-throw
    }
}