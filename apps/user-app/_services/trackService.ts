// apps/user-app/_services/trackService.ts
import apiClient, { APIError } from '@repo/api-client';
import logger from '@repo/logger';
import type {
    AudioTrackResponseDTO,
    AudioTrackDetailsResponseDTO,
    PaginatedResponseDTO,
    ListTrackQueryParams, // Use the type from @repo/types
} from '@repo/types';
import { buildQueryString } from '@repo/utils'; // Use shared util

// 创建tracks服务专用日志记录器
const tracksLogger = logger.child({ module: 'tracks-service' });

// 修改：使用代理路径
const TRACKS_ENDPOINT = '/api/proxy/audio/tracks'; // BFF proxy endpoint for protected routes
// const TRACKS_ENDPOINT = '/audio/tracks'; // 旧的直接路径

/**
 * Fetches a paginated list of audio tracks based on query parameters.
 * Uses the public track listing endpoint.
 */
export async function listTracks(params?: ListTrackQueryParams): Promise<PaginatedResponseDTO<AudioTrackResponseDTO>> {
    const queryString = buildQueryString(params);
    const endpoint = `${TRACKS_ENDPOINT}${queryString}`;
    tracksLogger.info(`Fetching tracks via BFF proxy: ${endpoint}`);
    try {
        tracksLogger.debug(`Making authenticated request to: ${endpoint}`);
        const response = await apiClient<PaginatedResponseDTO<AudioTrackResponseDTO>>(endpoint);
        tracksLogger.info(`Successfully retrieved tracks, count: ${response.data.length}, total: ${response.total}`);
        return response;
    } catch (error) {
        if (error instanceof APIError) {
            tracksLogger.error(
                { status: error.status, code: error.code, message: error.message }, 
                `API Error listing tracks`
            );
            if (error.status === 401) {
                tracksLogger.error(`Authentication failed when fetching tracks. Session might be invalid.`);
            }
        } else {
            tracksLogger.error({ error }, `Unexpected error listing tracks`);
        }
        throw error;
    }
}

/**
 * Fetches the details for a specific audio track, including playback URL and user-specific data if authenticated.
 * Uses the public track detail endpoint. Backend includes user data based on auth cookie.
 */
export async function getTrackDetails(trackId: string): Promise<AudioTrackDetailsResponseDTO> {
    if (!trackId) {
        throw new Error("Track ID cannot be empty");
    }
    const endpoint = `${TRACKS_ENDPOINT}/${trackId}`;
    tracksLogger.info(`Fetching track details via BFF proxy: ${endpoint}`);
    try {
        // Auth handled by BFF proxy
        const response = await apiClient<AudioTrackDetailsResponseDTO>(endpoint);
        tracksLogger.info(`Successfully retrieved track details for ${trackId}`);
        return response;
    } catch (error) {
        if (error instanceof APIError) {
            tracksLogger.error(
                { trackId, status: error.status, code: error.code, message: error.message }, 
                `API Error fetching track details`
            );
            if (error.status === 401) {
                tracksLogger.error(`Authentication failed when fetching track details. Session might be invalid.`);
            }
        } else {
            tracksLogger.error({ trackId, error }, `Unexpected error fetching track details`);
        }
        // Let apiClient's error handling propagate (it should throw APIError for 404 etc.)
        throw error;
    }
}

// Removed incorrect references to TrackData and TrackProgressPatchPayload types
// as they are not defined in the provided context or @repo/types.
// Mutations like updating progress are handled via Server Actions.