// apps/admin-panel/_hooks/useAdminTracks.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { listAllTracks, getAdminTrackDetails, type AdminListTrackQueryParams } from '@/_services/adminTrackService'; // Adjust path
import type { PaginatedResponseDTO, AudioTrackResponseDTO, AudioTrackDetailsResponseDTO } from '@repo/types';

// Query key factory for admin tracks
export const adminTracksQueryKeys = {
  all: ['admin', 'tracks'] as const, // Base key for all admin track queries
  list: (params: AdminListTrackQueryParams) => [...adminTracksQueryKeys.all, params] as const,
  detail: (trackId: string) => [...adminTracksQueryKeys.all, 'detail', trackId] as const,
};

/**
 * Custom hook to fetch a paginated list of audio tracks for the admin panel.
 * @param params - Parameters for filtering, sorting, and pagination.
 * @returns TanStack Query result object for the track list.
 */
export const useAdminTracks = (params: AdminListTrackQueryParams) => {
  const queryKey = adminTracksQueryKeys.list(params);

  return useQuery<PaginatedResponseDTO<AudioTrackResponseDTO>, Error>({
    queryKey: queryKey,
    // The query function calls the admin-specific service function
    queryFn: () => listAllTracks(params),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000, // Example: 5 minutes
  });
}

/**
 * Custom hook to fetch details for a single audio track for the admin panel.
 * @param trackId - The ID of the track to fetch.
 * @returns TanStack Query result object for the track details.
 */
export const useAdminTrack = (trackId: string | undefined) => {
    const queryKey = adminTracksQueryKeys.detail(trackId ?? ''); // Use empty string if undefined for key stability

    return useQuery<AudioTrackDetailsResponseDTO, Error>({
        queryKey: queryKey,
        queryFn: () => {
             if (!trackId) {
                 // This shouldn't be called if enabled is false, but acts as a safeguard
                 throw new Error("Track ID is required to fetch details.");
             }
             return getAdminTrackDetails(trackId); // Use the service function
         },
        enabled: !!trackId, // Only enable the query if trackId is truthy
        staleTime: 10 * 60 * 1000, // Cache details longer? Example: 10 minutes
    });
}