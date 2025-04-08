// apps/user-app/_hooks/useBookmarks.ts
'use client';
import { useQuery } from '@tanstack/react-query';
import { listUserBookmarks } from '@/../_services/userService'; // Adjust path
import type { PaginatedResponseDTO, BookmarkResponseDTO } from '@repo/types';
import type { PaginationParams } from '@/../_lib/utils'; // Assume PaginationParams type defined

// Define query key factory for consistency
const bookmarksQueryKeys = {
  all: (userId: string) => ['bookmarks', 'user', userId] as const,
  list: (userId: string, params: PaginationParams & { trackId?: string }) => [...bookmarksQueryKeys.all(userId), params] as const,
  detail: (userId: string, trackId: string) => [...bookmarksQueryKeys.all(userId), 'detail', trackId] as const,
};

// Hook to fetch paginated list of all user bookmarks OR bookmarks for a specific track
export const useBookmarks = (userId: string | undefined, params: PaginationParams & { trackId?: string }) => {
    const queryKey = bookmarksQueryKeys.list(userId ?? 'guest', params); // Use 'guest' or similar if userId undefined initially

    return useQuery<PaginatedResponseDTO<BookmarkResponseDTO>, Error>({
        queryKey: queryKey,
        queryFn: async () => {
             if (!userId) throw new Error("User not authenticated"); // Should not happen if used correctly, but check
             return listUserBookmarks(params); // Call service function
        },
        enabled: !!userId, // Only enable the query if the userId is available
        // Configure staleTime, gcTime etc. via shared QueryClient or here
         staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

// Hook specifically for bookmarks of a single track (might fetch all and filter client-side or use specific API endpoint)
// This example assumes the service function listUserBookmarks can filter by trackId
export const useTrackBookmarks = (userId: string | undefined, trackId: string | undefined) => {
    // For this specific track, we often want all bookmarks, not paginated
    const queryKey = bookmarksQueryKeys.detail(userId ?? 'guest', trackId ?? 'none');

     return useQuery<BookmarkResponseDTO[], Error>({ // Expecting direct array
        queryKey: queryKey,
        queryFn: async () => {
             if (!userId || !trackId) throw new Error("User or Track ID missing");
             // Call service. Assume listUserBookmarks returns paginated, need modification
             // OR create a new service: getUserBookmarksForTrack(trackId)
             // For now, simulating fetching all for the track (needs backend support or client filter)
             const result = await listUserBookmarks({ trackId, limit: 1000, offset: 0 }); // Fetch large limit
             return result.data;
        },
        enabled: !!userId && !!trackId,
        staleTime: 1 * 60 * 1000, // Maybe shorter stale time for track-specific
    });
}