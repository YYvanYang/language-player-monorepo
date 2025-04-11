// apps/admin-panel/_hooks/useAdminCollections.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { listAllCollections, type AdminListCollectionsParams } from '@/_services/adminCollectionService'; // Adjust path
import type { PaginatedResponseDTO, AudioCollectionResponseDTO } from '@repo/types';

// Query key factory for admin collections
export const adminCollectionsQueryKeys = {
  all: ['admin', 'collections'] as const,
  // Ensure params object is stringified or uses a stable reference for caching if needed,
  // but TanStack Query handles object keys well.
  list: (params: AdminListCollectionsParams) => [...adminCollectionsQueryKeys.all, params] as const,
  detail: (collectionId: string) => [...adminCollectionsQueryKeys.all, 'detail', collectionId] as const,
};

/**
 * Custom hook to fetch a paginated list of audio collections for the admin panel.
 * Handles fetching based on pagination, sorting, and filtering parameters.
 * @param params - Parameters for filtering, sorting, and pagination.
 * @returns TanStack Query result object for the collection list.
 */
export const useAdminCollections = (params: AdminListCollectionsParams) => {
  const queryKey = adminCollectionsQueryKeys.list(params);

  return useQuery<PaginatedResponseDTO<AudioCollectionResponseDTO>, Error>({
    queryKey: queryKey,
    queryFn: () => listAllCollections(params), // Call the ADMIN service function
    placeholderData: (previousData) => previousData, // Keep previous data while loading new page
    staleTime: 5 * 60 * 1000, // Example: 5 minutes
    // Consider adding gcTime if needed
  });
}

// Optional: Hook for fetching single collection details
export const useAdminCollection = (collectionId: string | undefined) => {
    const queryKey = adminCollectionsQueryKeys.detail(collectionId ?? '');

    return useQuery<AudioCollectionResponseDTO, Error>({
        queryKey: queryKey,
        queryFn: () => {
            if (!collectionId) throw new Error("Collection ID is required");
            // Assuming getAdminCollectionDetails exists in the service
            // return getAdminCollectionDetails(collectionId);
            // Placeholder: Implement getAdminCollectionDetails in service
            return Promise.reject(new Error("getAdminCollectionDetails not implemented"));
        },
        enabled: !!collectionId, // Only fetch if ID is valid
        staleTime: 5 * 60 * 1000,
    });
}