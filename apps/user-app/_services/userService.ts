// apps/user-app/_services/userService.ts
import apiClient from '@repo/api-client'; // Use shared client
import type {
    UserResponseDTO,
    PaginatedResponseDTO,
    BookmarkResponseDTO,
    PlaybackProgressResponseDTO,
} from '@repo/types'; // Use shared types
import { buildQueryString } from '@/_lib/utils'; // Use app-specific or shared utils
import type { PaginationParams } from '@/_lib/utils'; // Adjust alias

// Define specific param types if needed, mirroring API expectations
export interface ListProgressParams {
    limit?: number;
    offset?: number;
    // Add sorting if API supports it (e.g., sortBy=lastListenedAt&sortDir=desc)
}

export interface ListBookmarksParams {
    trackId?: string; // Optional filter
    limit?: number;
    offset?: number;
    // Add sorting if API supports it (e.g., sortBy=createdAt&sortDir=desc)
}


/**
 * Fetches the profile of the currently authenticated user.
 * @returns A promise resolving to the user profile DTO.
 */
export async function getMyProfile(): Promise<UserResponseDTO> {
    const endpoint = `/users/me`;
    console.log(`Fetching user profile from: ${endpoint}`); // Debug log
    try {
        const response = await apiClient<UserResponseDTO>(endpoint);
        return response;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error; // Re-throw
    }
}

export interface ListProgressServiceParams extends PaginationParams {
    // Add any other filters if needed
}

/**
 * Fetches the paginated list of playback progress records for the authenticated user.
 * @param params - Optional parameters for pagination.
 * @returns A promise resolving to the paginated list of progress DTOs.
 */
export async function listUserProgress(params?: ListProgressServiceParams): Promise<PaginatedResponseDTO<PlaybackProgressResponseDTO>> {
    const queryString = buildQueryString(params);
    const endpoint = `/users/me/progress${queryString}`;
    console.log(`Fetching user progress from: ${endpoint}`); // Debug log
    try {
        const response = await apiClient<PaginatedResponseDTO<PlaybackProgressResponseDTO>>(endpoint);
         console.log(`Received ${response.data?.length ?? 0} progress records, total ${response.total}`); // Debug log
        return response;
    } catch (error) {
        console.error("Error fetching user progress:", error);
        throw error; // Re-throw
    }
}

/**
 * Fetches the specific playback progress for a user on a given track.
 * @param trackId - The UUID of the audio track.
 * @returns A promise resolving to the playback progress DTO, or throws APIError(404) if not found.
 */
export async function getUserTrackProgress(trackId: string): Promise<PlaybackProgressResponseDTO> {
     if (!trackId) {
        throw new Error("Track ID cannot be empty");
    }
    const endpoint = `/users/me/progress/${trackId}`;
    console.log(`Fetching user progress for track from: ${endpoint}`); // Debug log
     try {
        const response = await apiClient<PlaybackProgressResponseDTO>(endpoint);
        return response;
    } catch (error) {
        console.error(`Error fetching progress for track ${trackId}:`, error);
        throw error; // Re-throw (apiClient should handle 404 mapping)
    }
}


/**
 * Fetches the paginated list of bookmarks for the authenticated user, optionally filtered by track.
 * @param params - Optional parameters for filtering and pagination.
 * @returns A promise resolving to the paginated list of bookmark DTOs.
 */
export async function listUserBookmarks(params?: ListBookmarksParams): Promise<PaginatedResponseDTO<BookmarkResponseDTO>> {
    const queryString = buildQueryString(params);
    const endpoint = `/bookmarks${queryString}`; // Endpoint might be directly /bookmarks if backend filters by authenticated user
    console.log(`Fetching user bookmarks from: ${endpoint}`); // Debug log
    try {
        const response = await apiClient<PaginatedResponseDTO<BookmarkResponseDTO>>(endpoint);
         console.log(`Received ${response.data?.length ?? 0} bookmarks, total ${response.total}`); // Debug log
        return response;
    } catch (error) {
        console.error("Error fetching user bookmarks:", error);
        throw error; // Re-throw
    }
}

// NOTE: Service functions for MUTATIONS (like updateProfile, deleteBookmark) are generally NOT needed here.
// Mutations are typically handled directly within Server Actions, which call the apiClient.
// Keep services focused on data FETCHING logic.