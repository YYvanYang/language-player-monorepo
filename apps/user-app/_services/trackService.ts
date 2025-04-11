// apps/user-app/_services/trackService.ts
import apiClient, { APIError } from '@repo/api-client';
import type {
    AudioTrackResponseDTO,
    AudioTrackDetailsResponseDTO,
    PaginatedResponseDTO,
    ListTrackQueryParams, // Use the type from @repo/types
} from '@repo/types';
import { buildQueryString } from '@repo/utils'; // Use shared util

const TRACKS_ENDPOINT = '/audio/tracks'; // Base endpoint

/**
 * Fetches a paginated list of audio tracks based on query parameters.
 * Uses the public track listing endpoint.
 */
export async function listTracks(params?: ListTrackQueryParams): Promise<PaginatedResponseDTO<AudioTrackResponseDTO>> {
    const queryString = buildQueryString(params);
    const endpoint = `${TRACKS_ENDPOINT}${queryString}`;
    console.log(`SERVICE: Fetching tracks from: ${endpoint}`);
    try {
        const response = await apiClient<PaginatedResponseDTO<AudioTrackResponseDTO>>(endpoint);
        return response;
    } catch (error) {
        console.error(`SERVICE: Error listing tracks:`, error);
        throw error;
    }
}

/**
 * Fetches the details for a specific audio track, including playback URL and user-specific data if authenticated.
 * Uses the public track detail endpoint. Backend includes user data based on auth cookie.
 */
export async function getTrackDetails(trackId: string): Promise<AudioTrackDetailsResponseDTO> {
    if (!trackId) {
        throw new Error("SERVICE: Track ID cannot be empty");
    }
    const endpoint = `${TRACKS_ENDPOINT}/${trackId}`;
    console.log(`SERVICE: Fetching track details from: ${endpoint}`);
    try {
        // Auth cookie is sent automatically by apiClient
        const response = await apiClient<AudioTrackDetailsResponseDTO>(endpoint);
        return response;
    } catch (error) {
        console.error(`SERVICE: Error fetching track details for ${trackId}:`, error);
        // Let apiClient's error handling propagate (it should throw APIError for 404 etc.)
        throw error;
    }
}

// Removed incorrect references to TrackData and TrackProgressPatchPayload types
// as they are not defined in the provided context or @repo/types.
// Mutations like updating progress are handled via Server Actions.