// apps/user-app/_services/collectionService.ts
import apiClient from '@repo/api-client'; // Use shared client
import type {
    AudioCollectionResponseDTO,
    PaginatedResponseDTO,
    AudioTrackResponseDTO, // Needed if GetCollectionDetails includes tracks
} from '@repo/types'; // Use shared types
import { buildQueryString } from '@/_lib/utils'; // Use app-specific or shared utils

// Define specific param types if needed, mirroring API expectations
export interface ListCollectionsParams {
    limit?: number;
    offset?: number;
    sortBy?: 'createdAt' | 'title' | 'updatedAt'; // Example sort fields
    sortDir?: 'asc' | 'desc';
    // Add other potential filters like 'type' if API supports it
}

/**
 * Fetches the collections belonging to the currently authenticated user.
 * Assumes authentication is handled by the apiClient (implicitly via cookies handled by browser/fetch).
 * @param params - Optional parameters for pagination and sorting.
 * @returns A promise resolving to the paginated list of user's collections.
 */
export async function listMyCollections(params?: ListCollectionsParams): Promise<PaginatedResponseDTO<AudioCollectionResponseDTO>> {
    const queryString = buildQueryString(params);
    // Endpoint assumes backend handles retrieving collections for the authenticated user
    const endpoint = `/users/me/collections${queryString}`;
    console.log(`Fetching user collections from: ${endpoint}`); // Debug log
    try {
        const response = await apiClient<PaginatedResponseDTO<AudioCollectionResponseDTO>>(endpoint);
        console.log(`Received ${response.data?.length ?? 0} collections, total ${response.total}`); // Debug log
        return response;
    } catch (error) {
        console.error("Error fetching user collections:", error);
        throw error; // Re-throw for TanStack Query or Server Component to handle
    }
}

/**
 * Fetches the details of a specific collection, including its associated tracks.
 * Assumes authentication/authorization is handled by the backend endpoint based on the user's session.
 * @param collectionId - The UUID of the collection to fetch.
 * @returns A promise resolving to the detailed collection DTO.
 */
export async function getCollectionDetailsWithTracks(collectionId: string): Promise<AudioCollectionResponseDTO> {
    if (!collectionId) {
        // Throw a specific error type if possible
        throw new Error("Collection ID cannot be empty");
    }
    const endpoint = `/audio/collections/${collectionId}`; // Assumes this endpoint returns tracks
    console.log(`Fetching collection details from: ${endpoint}`); // Debug log
    try {
        // Backend needs to populate the 'tracks' field in the response
        const response = await apiClient<AudioCollectionResponseDTO>(endpoint);
        console.log(`Received collection details for ${collectionId}, tracks: ${response.tracks?.length ?? 0}`); // Debug log
        return response;
    } catch (error) {
        console.error(`Error fetching collection details for ${collectionId}:`, error);
        throw error; // Re-throw
    }
}

/**
 * Fetches only the tracks associated with a specific collection, ordered by position.
 * Useful if you only need the track list after fetching the collection metadata separately.
 * @param collectionId - The UUID of the collection.
 * @returns A promise resolving to an array of track DTOs.
 */
export async function getTracksForCollection(collectionId: string): Promise<AudioTrackResponseDTO[]> {
     if (!collectionId) {
        throw new Error("Collection ID cannot be empty");
    }
    // Assuming a specific endpoint exists, otherwise adapt getCollectionDetailsWithTracks
    const endpoint = `/audio/collections/${collectionId}/tracks`; // Example endpoint
    console.log(`Fetching tracks for collection from: ${endpoint}`); // Debug log
     try {
        // Backend should return just the list of tracks
        const response = await apiClient<AudioTrackResponseDTO[]>(endpoint);
        console.log(`Received ${response?.length ?? 0} tracks for collection ${collectionId}`); // Debug log
        return response ?? []; // Return empty array if response is null/undefined
    } catch (error) {
        console.error(`Error fetching tracks for collection ${collectionId}:`, error);
        throw error; // Re-throw
    }
}