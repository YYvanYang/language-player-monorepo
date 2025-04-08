import apiClient from '@repo/api-client';
import type {
    AudioCollectionResponseDTO,
    AudioCollectionDetailsResponseDTO,
    PaginatedResponseDTO,
} from '@repo/types';
import { buildQueryString } from '@/../_lib/utils'; // Assume a helper in app's lib or shared utils
import type { PaginationParams } from '@/../_lib/utils'; // Adjust alias

export async function listCollections(params?: PaginationParams): Promise<PaginatedResponseDTO<AudioCollectionResponseDTO>> {
    const queryString = buildQueryString(params);
    const response = await apiClient<PaginatedResponseDTO<AudioCollectionResponseDTO>>(`/audio/collections${queryString}`);
    if (!response) {
        // Handle case where apiClient returns null, perhaps throw or return default
        throw new Error("Failed to fetch collections: No response from API.");
    }
    return response;
}

export async function getCollectionDetailsWithTracks(collectionId: string): Promise<AudioCollectionDetailsResponseDTO> {
    if (!collectionId) {
        throw new Error("Collection ID cannot be empty");
    }
    const response = await apiClient<AudioCollectionDetailsResponseDTO>(`/audio/collections/${collectionId}`);
    if (!response) {
        // Handle case where apiClient returns null
        throw new Error(`Failed to fetch collection details for ID ${collectionId}: No response from API.`);
    }
    return response;
} 