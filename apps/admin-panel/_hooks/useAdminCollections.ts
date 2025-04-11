// apps/admin-panel/_hooks/useAdminCollections.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { listAdminCollections, type AdminListCollectionsParams } from '@/_services/adminCollectionService'; // Adjust path
import type { PaginatedResponseDTO, AudioCollectionResponseDTO } from '@repo/types';

// Query key factory for admin collections
export const adminCollectionsQueryKeys = {
  all: ['admin', 'collections'] as const,
  list: (params: AdminListCollectionsParams) => [...adminCollectionsQueryKeys.all, params] as const,
  // detail: (collectionId: string) => [...adminCollectionsQueryKeys.all, 'detail', collectionId] as const,
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
    queryFn: () => listAdminCollections(params), // Call the service function
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000, // Example: 5 minutes
  });
};