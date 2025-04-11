// apps/admin-panel/_hooks/useAdminUsers.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { listUsers, type AdminListUsersParams } from '@/_services/adminUserService'; // Adjust path
import type { PaginatedResponseDTO, UserResponseDTO } from '@repo/types';

// Query key factory
const adminUsersQueryKeys = {
  all: ['admin', 'users'] as const,
  list: (params: AdminListUsersParams) => [...adminUsersQueryKeys.all, params] as const,
};

export const useAdminUsers = (params: AdminListUsersParams) => {
  const queryKey = adminUsersQueryKeys.list(params);

  return useQuery<PaginatedResponseDTO<UserResponseDTO>, Error>({
    queryKey: queryKey,
    queryFn: () => listUsers(params), // Pass params to service function
    placeholderData: (previousData) => previousData, // Keep previous data while loading new page
    // staleTime: ... // Configure as needed
  });
};