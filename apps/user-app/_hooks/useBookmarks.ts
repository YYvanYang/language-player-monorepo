// apps/user-app/_hooks/useBookmarks.ts
'use client'; // Hooks are client-side

import { useQuery } from '@tanstack/react-query';
import { listUserBookmarks } from '@/../_services/userService'; // Adjust path alias
import type { PaginatedResponseDTO, BookmarkResponseDTO } from '@repo/types';
import type { PaginationParams } from '@/../_lib/utils'; // Adjust path alias for PaginationParams definition

// Query key factory for bookmark queries
export const bookmarksQueryKeys = {
  all: (userId: string) => ['bookmarks', 'user', userId] as const,
  // Key includes pagination/filter parameters to ensure uniqueness
  list: (userId: string, params: PaginationParams & { trackId?: string }) =>
    [...bookmarksQueryKeys.all(userId), params] as const,
  // Key for fetching *all* bookmarks for a specific track (used by useTrackBookmarks)
  trackDetail: (userId: string, trackId: string) =>
    [...bookmarksQueryKeys.all(userId), 'detail', trackId] as const,
};

// Hook to fetch PAGINATED list of all user bookmarks OR bookmarks for a specific track
// Used by the main Bookmarks page (without trackId) and potentially by Track Detail page if needed.
export const useBookmarks = (
  userId: string | undefined, // User ID is required when enabled
  params: PaginationParams & { trackId?: string } // Includes limit, offset, optional trackId
) => {
  const queryKey = bookmarksQueryKeys.list(userId ?? 'guest', params); // Use placeholder if userId not ready

  return useQuery<PaginatedResponseDTO<BookmarkResponseDTO>, Error>({
    queryKey: queryKey,
    queryFn: async () => {
      if (!userId) {
        // This shouldn't be called if enabled is false, but defensive check
        throw new Error('User not authenticated for fetching bookmarks.');
      }
      // The service function should handle constructing the final URL with query params
      return listUserBookmarks(params); // Pass the combined params object
    },
    enabled: !!userId, // Only run the query if userId is available
    placeholderData: (previousData) => previousData, // Keep showing old data while refetching
    // Consider adding staleTime, gcTime if needed, or rely on QueryClient defaults
    staleTime: 1 * 60 * 1000, // Example: 1 minute stale time
  });
};

// Hook specifically for getting ALL bookmarks for a SINGLE track (non-paginated)
// Useful for the track detail page display.
export const useTrackBookmarks = (
    userId: string | undefined,
    trackId: string | undefined
) => {
    const queryKey = bookmarksQueryKeys.trackDetail(userId ?? 'guest', trackId ?? 'none');

    return useQuery<BookmarkResponseDTO[], Error>({ // Expecting a direct array
       queryKey: queryKey,
       queryFn: async () => {
            if (!userId || !trackId) throw new Error("User or Track ID missing");
            // Call the service function that fetches *all* bookmarks for the track
            // This might require a different service function or backend endpoint
            // than the paginated list one.
            // Assuming `listUserBookmarks` can take a very large limit for this purpose,
            // or ideally a dedicated service function exists:
            // return getUserBookmarksForTrack(trackId);
            // --- Simulation using the paginated endpoint (adjust limit as needed) ---
            const result = await listUserBookmarks({ trackId: trackId, limit: 1000, offset: 0 }); // Fetch a large number
            return result.data;
            // --- End Simulation ---
       },
       enabled: !!userId && !!trackId,
       staleTime: 1 * 60 * 1000, // Example: 1 minute
   });
}