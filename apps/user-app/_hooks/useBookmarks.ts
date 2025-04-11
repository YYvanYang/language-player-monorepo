// apps/user-app/_hooks/useBookmarks.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { listUserBookmarks } from '@/_services/userService';
import type { PaginatedResponseDTO, BookmarkResponseDTO } from '@repo/types';
import type { PaginationParams } from '@/_lib/utils'; // Ensure PaginationParams is defined here or imported

// Query key factory for bookmark queries
export const bookmarksQueryKeys = {
  base: ['bookmarks'] as const, // Root key
  userBase: (userId: string) => [...bookmarksQueryKeys.base, 'user', userId] as const,
  list: (userId: string, params: PaginationParams & { trackId?: string }) =>
    [...bookmarksQueryKeys.userBase(userId), 'list', params] as const,
  // Key for fetching ALL bookmarks for a specific track
  trackDetail: (userId: string, trackId: string) =>
    [...bookmarksQueryKeys.userBase(userId), 'detail', trackId] as const,
};

// Hook to fetch PAGINATED list of user bookmarks (can be filtered by trackId)
export const useBookmarks = (
  userId: string | undefined,
  params: PaginationParams & { trackId?: string }
) => {
  const queryKey = bookmarksQueryKeys.list(userId ?? 'guest', params);

  return useQuery<PaginatedResponseDTO<BookmarkResponseDTO>, Error>({
    queryKey: queryKey,
    queryFn: async () => {
      if (!userId) throw new Error('User not authenticated');
      // Service function handles adding trackId query param if present
      return listUserBookmarks(params);
    },
    enabled: !!userId, // Only run if user is logged in
    placeholderData: (previousData) => previousData,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// Hook to fetch ALL bookmarks for a SINGLE track (non-paginated)
export const useTrackBookmarks = (
    userId: string | undefined,
    trackId: string | undefined
) => {
    const queryKey = bookmarksQueryKeys.trackDetail(userId ?? 'guest', trackId ?? 'none');

    return useQuery<BookmarkResponseDTO[], Error>({ // Expecting array response
       queryKey: queryKey,
       queryFn: async () => {
            if (!userId || !trackId) throw new Error("User or Track ID missing");
            // Fetch bookmarks for the specific track using the service.
            // Assume listUserBookmarks with a large limit works, or use a dedicated endpoint if available.
            // Setting a very high limit to simulate fetching "all".
            const result = await listUserBookmarks({ trackId: trackId, limit: 500, offset: 0 });
            return result.data ?? []; // Return the data array
       },
       enabled: !!userId && !!trackId, // Enable only when both IDs are present
       staleTime: 1 * 60 * 1000, // 1 minute stale time
   });
};