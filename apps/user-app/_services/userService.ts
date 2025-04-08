import apiClient, { APIError } from '@repo/api-client';
import type {
    BookmarkResponseDTO,
    UserProgressResponseDTO,
    UpdateUserProgressRequestDTO,
    PaginatedResponseDTO,
    ListBookmarkQueryParams,
} from '@repo/types';
import { buildQueryString } from '@/../_lib/utils'; // Assume a helper

// --- Bookmarks ---

export async function listBookmarks(params?: ListBookmarkQueryParams): Promise<PaginatedResponseDTO<BookmarkResponseDTO>> {
    const queryString = buildQueryString(params);
    const response = await apiClient<PaginatedResponseDTO<BookmarkResponseDTO>>(`/user/bookmarks${queryString}`);
     if (!response) {
        throw new Error("Failed to fetch bookmarks: No response from API.");
    }
    return response;
}

// Add Bookmark - Example POST request
export async function addBookmark(trackId: string): Promise<BookmarkResponseDTO> {
     if (!trackId) {
        throw new Error("Track ID cannot be empty for bookmarking");
    }
    const response = await apiClient<BookmarkResponseDTO>(`/user/bookmarks`, {
        method: 'POST',
        body: JSON.stringify({ trackId }), // Assuming API expects { trackId }
    });
    if (!response) {
        throw new Error(`Failed to add bookmark for track ID ${trackId}: No response from API.`);
    }
    return response;
}

// Remove Bookmark - Example DELETE request
export async function removeBookmark(bookmarkId: string): Promise<void> {
     if (!bookmarkId) {
        throw new Error("Bookmark ID cannot be empty for deletion");
    }
    // Assuming DELETE returns 204 No Content on success, apiClient handles this
    await apiClient<null>(`/user/bookmarks/${bookmarkId}`, { method: 'DELETE' });
}

// --- Progress ---

export async function getUserProgress(trackId: string): Promise<UserProgressResponseDTO | null> {
     if (!trackId) {
        throw new Error("Track ID cannot be empty for fetching progress");
    }
    // API might return 404 if no progress exists, apiClient might throw or return null
    try {
         const response = await apiClient<UserProgressResponseDTO>(`/user/progress/${trackId}`);
         return response;
    } catch (error) {
        // If APIError with 404, assume no progress, return null
        // Re-throw other errors
        if (error instanceof APIError && error.status === 404) { // Check using APIError
            return null;
        }
        throw error;
    }
}

export async function updateUserProgress(trackId: string, progressData: UpdateUserProgressRequestDTO): Promise<UserProgressResponseDTO> {
     if (!trackId) {
        throw new Error("Track ID cannot be empty for updating progress");
    }
     const response = await apiClient<UserProgressResponseDTO>(`/user/progress/${trackId}`, {
        method: 'PUT', // Or POST depending on API design
        body: JSON.stringify(progressData),
    });
    if (!response) {
        throw new Error(`Failed to update progress for track ID ${trackId}: No response from API.`);
    }
    return response;
} 