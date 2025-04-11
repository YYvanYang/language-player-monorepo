// apps/user-app/_services/trackService.ts
import apiClient, { APIError } from '@repo/api-client';
import type {
    AudioTrackResponseDTO,
    AudioTrackDetailsResponseDTO,
    PaginatedResponseDTO,
    ListTrackQueryParams, // Use the helper type
} from '@repo/types';
import { buildQueryString } from '@/_lib/utils'; // Assume a helper in app's lib or shared utils

export async function listTracks(params?: ListTrackQueryParams): Promise<PaginatedResponseDTO<AudioTrackResponseDTO>> {
    const queryString = buildQueryString(params); // Helper to build ?key=value&...
    // Ensure PaginatedResponseDTO in api-client matches the generic one in types
    const response = await apiClient<PaginatedResponseDTO<AudioTrackResponseDTO>>(`/audio/tracks${queryString}`);
    return response;
}

export async function getTrackDetails(trackId: string): Promise<AudioTrackDetailsResponseDTO> {
    if (!trackId) {
        throw new Error("Track ID cannot be empty"); // Or return a specific error
    }
    // Use generic apiClient, type assertion happens based on return type
    const response = await apiClient<AudioTrackDetailsResponseDTO>(`/audio/tracks/${trackId}`);
    return response;
}