// apps/user-app/_services/userService.ts
import apiClient from '@repo/api-client';
import type {
    UserResponseDTO,
    PaginatedResponseDTO,
    BookmarkResponseDTO,
    PlaybackProgressResponseDTO,
    // Import specific query param types
    ListProgressQueryParams,
    ListBookmarkQueryParams,
} from '@repo/types';
import { buildQueryString } from '@repo/utils';

const USER_ME_ENDPOINT = '/users/me'; // Base for current user data

/**
 * Fetches the profile of the currently authenticated user.
 */
export async function getMyProfile(): Promise<UserResponseDTO> {
    const endpoint = `${USER_ME_ENDPOINT}`;
    console.log(`SERVICE: Fetching user profile from: ${endpoint}`);
    try {
        const response = await apiClient<UserResponseDTO>(endpoint);
        return response;
    } catch (error) {
        console.error("SERVICE: Error fetching user profile:", error);
        throw error;
    }
}

/**
 * Fetches the paginated list of playback progress records for the authenticated user.
 */
// MODIFIED: Use specific param type
export async function listUserProgress(params?: ListProgressQueryParams): Promise<PaginatedResponseDTO<PlaybackProgressResponseDTO>> {
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
        throw error;
    }
}


/**
 * Fetches the paginated list of bookmarks for the authenticated user, optionally filtered by track.
 */
// MODIFIED: Use specific param type
export async function listUserBookmarks(params?: ListBookmarkQueryParams): Promise<PaginatedResponseDTO<BookmarkResponseDTO>> {
    const queryString = buildQueryString(params);
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