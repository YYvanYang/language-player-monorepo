// apps/admin-panel/_hooks/useAdminUsers.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { listUsers, getUserDetails, type AdminListUsersParams } from '@/_services/adminUserService'; // Adjust path
import type { PaginatedResponseDTO, UserResponseDTO } from '@repo/types';

// Query key factory
export const adminUsersQueryKeys = {
  all: ['admin', 'users'] as const,
  list: (params: AdminListUsersParams) => [...adminUsersQueryKeys.all, params] as const,
  detail: (userId: string) => [...adminUsersQueryKeys.all, 'detail', userId] as const,
};

/**
 * Hook to fetch a paginated list of users for the admin panel.
 */
export const useAdminUsers = (params: AdminListUsersParams) => {
  const queryKey = adminUsersQueryKeys.list(params);

  return useQuery<PaginatedResponseDTO<UserResponseDTO>, Error>({
    queryKey: queryKey,
    queryFn: () => listUsers(params), // Pass params to service function
    placeholderData: (previousData) => previousData, // Keep previous data while loading new page
    staleTime: 5 * 60 * 1000, // Example: 5 minutes
  });
}

/**
 * Hook to fetch details for a single user for the admin panel.
 */
export const useAdminUser = (userId: string | undefined) => {
    const queryKey = adminUsersQueryKeys.detail(userId ?? '');

    return useQuery<UserResponseDTO, Error>({
        queryKey: queryKey,
        queryFn: () => {
             if (!userId) throw new Error("User ID is required");
             return getUserDetails(userId);
         },
        enabled: !!userId, // Only fetch if ID is valid
        staleTime: 10 * 60 * 1000, // Cache details longer
    });
}