// apps/user-app/_services/userService.ts
import apiClient from '@repo/api-client';
import type {
    UserResponseDTO,
    PaginatedResponseDTO,
    BookmarkResponseDTO,
    PlaybackProgressResponseDTO,
} from '@repo/types';
// Corrected import path assuming utils is structured correctly
import { buildQueryString, PaginationParams } from '@repo/utils';

// Define specific param types, potentially extending shared PaginationParams
export interface ListProgressParams extends PaginationParams {
    // Add other filters if needed
}

export interface ListBookmarksParams extends PaginationParams {
    trackId?: string; // Optional filter by track UUID
}


const USER_ME_ENDPOINT = '/users/me'; // Base for current user data

/**
 * Fetches the profile of the currently authenticated user.
 */
export async function getMyProfile(): Promise<UserResponseDTO> {
    const endpoint = `${USER_ME_ENDPOINT}`;
    console.log(`SERVICE: Fetching user profile from: ${endpoint}`);
    try {
        // Auth handled by apiClient
        const response = await apiClient<UserResponseDTO>(endpoint);
        return response;
    } catch (error) {
        console.error("SERVICE: Error fetching user profile:", error);
        throw error; // Re-throw
    }
}

/**
 * Fetches the paginated list of playback progress records for the authenticated user.
 */
export async function listUserProgress(params?: ListProgressParams): Promise<PaginatedResponseDTO<PlaybackProgressResponseDTO>> {
    const queryString = buildQueryString(params);
    const endpoint = `${USER_ME_ENDPOINT}/progress${queryString}`;
    console.log(`SERVICE: Fetching user progress from: ${endpoint}`);
    try {
        const response = await apiClient<PaginatedResponseDTO<PlaybackProgressResponseDTO>>(endpoint);
         console.log(`SERVICE: Received ${response.data?.length ?? 0} progress records, total ${response.total}`);
        return response;
    } catch (error) {
        console.error("SERVICE: Error fetching user progress:", error);
        throw error;
    }
}

/**
 * Fetches the specific playback progress for a user on a given track.
 */
export async function getUserTrackProgress(trackId: string): Promise<PlaybackProgressResponseDTO> {
     if (!trackId) {
        throw new Error("SERVICE: Track ID cannot be empty");
    }
    const endpoint = `${USER_ME_ENDPOINT}/progress/${trackId}`;
    console.log(`SERVICE: Fetching user progress for track from: ${endpoint}`);
     try {
        const response = await apiClient<PlaybackProgressResponseDTO>(endpoint);
        return response;
    } catch (error) {
        console.error(`SERVICE: Error fetching progress for track ${trackId}:`, error);
        throw error; // Re-throw (apiClient should handle 404 mapping)
    }
}


/**
 * Fetches the paginated list of bookmarks for the authenticated user, optionally filtered by track.
 */
export async function listUserBookmarks(params?: ListBookmarksParams): Promise<PaginatedResponseDTO<BookmarkResponseDTO>> {
    const queryString = buildQueryString(params);
    // Endpoint for user's bookmarks
    const endpoint = `${USER_ME_ENDPOINT}/bookmarks${queryString}`;
    console.log(`SERVICE: Fetching user bookmarks from: ${endpoint}`);
    try {
        const response = await apiClient<PaginatedResponseDTO<BookmarkResponseDTO>>(endpoint);
         console.log(`SERVICE: Received ${response.data?.length ?? 0} bookmarks, total ${response.total}`);
        return response;
    } catch (error) {
        console.error("SERVICE: Error fetching user bookmarks:", error);
        throw error;
    }
}