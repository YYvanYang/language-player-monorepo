// apps/admin-panel/_hooks/useAdminTracks.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { listAdminTracks, type AdminListTracksParams } from '@/../_services/adminTrackService'; // Adjust path to your admin track service
import type { PaginatedResponseDTO, AudioTrackResponseDTO } from '@repo/types';

// Query key factory for admin tracks
export const adminTracksQueryKeys = {
  all: ['admin', 'tracks'] as const, // Base key for all admin track queries
  // Creates a key like ['admin', 'tracks', { limit: 10, offset: 0, sortBy: 'title' }]
  list: (params: AdminListTracksParams) => [...adminTracksQueryKeys.all, params] as const,
  // Example for detail (if needed later):
  // detail: (trackId: string) => [...adminTracksQueryKeys.all, 'detail', trackId] as const,
};

/**
 * Custom hook to fetch a paginated list of audio tracks for the admin panel.
 * Handles fetching based on pagination, sorting, and filtering parameters.
 * @param params - Parameters for filtering, sorting, and pagination.
 * @returns TanStack Query result object for the track list.
 */
export const useAdminTracks = (params: AdminListTracksParams) => {
  const queryKey = adminTracksQueryKeys.list(params);

  return useQuery<PaginatedResponseDTO<AudioTrackResponseDTO>, Error>({
    queryKey: queryKey,
    // The query function calls the admin-specific service function
    queryFn: () => listAdminTracks(params),
    // Keep previous data while fetching the next page or applying filters/sorts
    // This improves perceived performance by avoiding blank screens during refetch.
    placeholderData: (previousData) => previousData,
    // Consider adjusting staleTime based on how often track data changes
    // or rely on cache invalidation via Server Actions.
    staleTime: 5 * 60 * 1000, // Example: 5 minutes
  });
};