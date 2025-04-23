// apps/user-app/_services/collectionService.ts
import apiClient, { APIError } from '@repo/api-client';
import type {
    AudioCollectionResponseDTO,
    PaginatedResponseDTO,
    AudioTrackResponseDTO,
    CreateCollectionRequestDTO,      // Added for Create type hint
    UpdateCollectionRequestDTO,      // Added for Update type hint
    UpdateCollectionTracksRequestDTO // Added for Update type hint
} from '@repo/types';
import { buildQueryString, PaginationParams } from '@repo/utils';

// --- Define Params ---
export interface ListMyCollectionsParams extends PaginationParams {
    sortBy?: 'createdAt' | 'title' | 'updatedAt';
    sortDir?: 'asc' | 'desc';
}

// --- Endpoint Definitions (Using Proxy) ---
const USER_COLLECTIONS_PROXY_ENDPOINT = '/api/proxy/users/me/collections'; // Proxy path
const PUBLIC_COLLECTIONS_PROXY_ENDPOINT = '/api/proxy/audio/collections'; // Proxy path

/**
 * Fetches the collections belonging to the currently authenticated user VIA PROXY.
 * REMOVED token parameter.
 */
export async function listMyCollections(params?: ListMyCollectionsParams): Promise<PaginatedResponseDTO<AudioCollectionResponseDTO>> {
    const queryString = buildQueryString(params);
    const endpoint = `${USER_COLLECTIONS_PROXY_ENDPOINT}${queryString}`;
    console.log(`SERVICE: Fetching user collections via proxy: ${endpoint}`);
    try {
        // Call apiClient WITHOUT the token argument - proxy handles it
        const response = await apiClient<PaginatedResponseDTO<AudioCollectionResponseDTO>>(endpoint);
        console.log(`SERVICE: Received ${response.data?.length ?? 0} collections, total ${response.total}`);
        return response;
    } catch (error) {
        console.error("SERVICE: Error fetching user collections:", error);
        // Re-throw APIError or other errors for TanStack Query/components to handle
        throw error;
    }
}

/**
 * Fetches the details of a specific collection VIA PROXY.
 * REMOVED token parameter.
 */
export async function getCollectionDetailsWithTracks(collectionId: string): Promise<AudioCollectionResponseDTO> {
    if (!collectionId) throw new Error("SERVICE: Collection ID cannot be empty");
    const endpoint = `${PUBLIC_COLLECTIONS_PROXY_ENDPOINT}/${collectionId}`; // Proxy path
    console.log(`SERVICE: Fetching collection details via proxy: ${endpoint}`);
    try {
        // Call apiClient WITHOUT the token argument
        const response = await apiClient<AudioCollectionResponseDTO>(endpoint);
        console.log(`SERVICE: Received collection details for ${collectionId}, tracks: ${response.tracks?.length ?? 0}`);
        return response;
    } catch (error) {
        console.error(`SERVICE: Error fetching collection details for ${collectionId}:`, error);
        throw error;
    }
}

/**
 * Fetches ONLY the ordered list of tracks for a specific collection VIA PROXY.
 * REMOVED token parameter.
 */
export async function getTracksForCollection(collectionId: string): Promise<AudioTrackResponseDTO[]> {
     if (!collectionId) throw new Error("SERVICE: Collection ID cannot be empty");
    const endpoint = `${PUBLIC_COLLECTIONS_PROXY_ENDPOINT}/${collectionId}/tracks`; // Proxy path
    console.log(`SERVICE: Fetching tracks for collection via proxy: ${endpoint}`);
     try {
        // Call apiClient WITHOUT the token argument
        const response = await apiClient<AudioTrackResponseDTO[]>(endpoint);
        console.log(`SERVICE: Received ${response?.length ?? 0} tracks for collection ${collectionId}`);
        return response ?? [];
    } catch (error) {
        console.error(`SERVICE: Error fetching tracks for collection ${collectionId}:`, error);
        throw error;
    }
}

// --- Service functions for Mutations (Called by Server Actions) ---
// These still call the direct backend endpoint because Server Actions
// can directly set the required Authorization header after decrypting the token.
// Proxy is primarily for Server Components fetching data.

const USER_COLLECTIONS_DIRECT_ENDPOINT = '/audio/collections'; // Direct backend path for mutations

export async function createCollection(data: CreateCollectionRequestDTO, token: string): Promise<AudioCollectionResponseDTO> {
    const endpoint = USER_COLLECTIONS_DIRECT_ENDPOINT;
    return apiClient<AudioCollectionResponseDTO>(endpoint, { method: 'POST', body: data }, token);
}

export async function updateCollectionMetadata(collectionId: string, data: UpdateCollectionRequestDTO, token: string): Promise<void> {
    const endpoint = `${USER_COLLECTIONS_DIRECT_ENDPOINT}/${collectionId}`;
    await apiClient<void>(endpoint, { method: 'PUT', body: data }, token);
}

export async function updateCollectionTracks(collectionId: string, data: UpdateCollectionTracksRequestDTO, token: string): Promise<void> {
    const endpoint = `${USER_COLLECTIONS_DIRECT_ENDPOINT}/${collectionId}/tracks`;
    await apiClient<void>(endpoint, { method: 'PUT', body: data }, token);
}

export async function deleteCollection(collectionId: string, token: string): Promise<void> {
    const endpoint = `${USER_COLLECTIONS_DIRECT_ENDPOINT}/${collectionId}`;
    await apiClient<void>(endpoint, { method: 'DELETE' }, token);
}